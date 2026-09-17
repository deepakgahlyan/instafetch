export interface ResilientMediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
  source_url?: string;
  filename?: string;
  width?: number;
  height?: number;
  filesize_bytes?: number;
}

const MAX_MEDIA_ITEMS = 50;
const REQUEST_TIMEOUT_MS = 8_000;
const CRAWLER_UA = "Googlebot/2.1 (+http://www.google.com/bot.html)";
const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";
const IG_APP_ID = "936619743392459";
const DOC_IDS = ["25531498899829322", "27128499623469141"];
const MEDIA_MARKERS = [
  "xig_polaris_media",
  "xdt_shortcode_media",
  "xdt_api__v1__clips__home__connection_v2",
  "xdt_api__v1__media__shortcode__web_info",
  "xdt_api__v1__clips__user__connection_v2",
];

function normalizeUrl(input: string): string {
  const url = new URL(input.trim());
  url.protocol = "https:";
  url.hostname = "www.instagram.com";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function shortcodeOf(input: string): string {
  const path = new URL(input).pathname.replace(/\/+$/, "");
  const match = path.match(/^\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)$/i);
  if (match) return match[1];
  const share = path.match(/^\/share\/reel\/([A-Za-z0-9_-]+)$/i);
  if (share) return share[1];
  throw new Error("Unsupported Instagram URL.");
}

function isReel(input: string): boolean {
  const path = new URL(input).pathname.replace(/\/+$/, "").toLowerCase();
  return /^\/(reel|reels|tv)\//.test(path) || /^\/share\/reel\//.test(path);
}

function decode(value: string): string {
  return value
    .replace(/\\u0026/gi, "&")
    .replace(/\\u003D/gi, "=")
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/gi, "&")
    .trim();
}

function isHttps(value: unknown): value is string {
  if (typeof value !== "string" || !value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function balancedJson(text: string, start: number): string | null {
  const opener = text[start];
  const closer = opener === "{" ? "}" : opener === "[" ? "]" : "";
  if (!closer) return null;

  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === opener) depth += 1;
    else if (char === closer) {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function markerPayloads(text: string, marker: string): unknown[] {
  const payloads: unknown[] = [];
  let offset = 0;
  while (true) {
    const markerIndex = text.indexOf(`"${marker}"`, offset);
    if (markerIndex < 0) break;
    const colon = text.indexOf(":", markerIndex + marker.length + 2);
    if (colon < 0) break;

    let start = -1;
    for (let i = colon + 1; i < Math.min(text.length, colon + 500); i += 1) {
      if (text[i] === "{" || text[i] === "[") {
        start = i;
        break;
      }
      if (!/\s/.test(text[i])) break;
    }

    if (start >= 0) {
      const raw = balancedJson(text, start);
      if (raw) {
        for (const candidate of [raw, raw.replace(/\\"/g, '"').replace(/\\\\/g, "\\")]) {
          try {
            payloads.push(JSON.parse(candidate));
            break;
          } catch {
            // Try the next representation.
          }
        }
      }
    }
    offset = markerIndex + marker.length + 2;
  }
  return payloads;
}

function captionOf(item: Record<string, unknown>): string | undefined {
  const raw = item.caption;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object") {
    const text = (raw as Record<string, unknown>).text;
    if (typeof text === "string" && text.trim()) return text.trim();
  }
  if (typeof item.caption_text === "string" && item.caption_text.trim()) return item.caption_text.trim();
  if (typeof item.title === "string" && item.title.trim()) return item.title.trim();
  const edge = item.edge_media_to_caption;
  if (edge && typeof edge === "object") {
    const edges = (edge as Record<string, unknown>).edges;
    if (Array.isArray(edges)) {
      for (const entry of edges) {
        if (!entry || typeof entry !== "object") continue;
        const node = (entry as Record<string, unknown>).node;
        if (!node || typeof node !== "object") continue;
        const text = (node as Record<string, unknown>).text;
        if (typeof text === "string" && text.trim()) return text.trim();
      }
    }
  }
  return undefined;
}

function dimensions(item: Record<string, unknown>): [number | undefined, number | undefined] {
  const dims = item.dimensions;
  if (dims && typeof dims === "object") {
    const d = dims as Record<string, unknown>;
    return [typeof d.width === "number" ? d.width : undefined, typeof d.height === "number" ? d.height : undefined];
  }
  return [
    typeof item.original_width === "number" ? item.original_width : undefined,
    typeof item.original_height === "number" ? item.original_height : undefined,
  ];
}

function bestVideo(entries: unknown): { url: string; width?: number; height?: number } | null {
  if (!Array.isArray(entries)) return null;
  const valid = entries
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({
      url: typeof entry.url === "string" ? decode(entry.url) : "",
      width: typeof entry.width === "number" ? entry.width : undefined,
      height: typeof entry.height === "number" ? entry.height : undefined,
      bandwidth: typeof entry.bandwidth === "number" ? entry.bandwidth : 0,
    }))
    .filter((entry) => isHttps(entry.url));
  if (!valid.length) return null;
  valid.sort((a, b) => {
    const areaA = (a.width ?? 0) * (a.height ?? 0);
    const areaB = (b.width ?? 0) * (b.height ?? 0);
    return areaB - areaA || b.bandwidth - a.bandwidth;
  });
  return valid[0];
}

function bestImage(entries: unknown): { url: string; width?: number; height?: number } | null {
  if (!Array.isArray(entries)) return null;
  const valid = entries
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({
      url: typeof entry.url === "string" ? decode(entry.url) : "",
      width: typeof entry.width === "number" ? entry.width : undefined,
      height: typeof entry.height === "number" ? entry.height : undefined,
    }))
    .filter((entry) => isHttps(entry.url));
  if (!valid.length) return null;
  valid.sort((a, b) => (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0));
  return valid[0];
}

function mediaFromObject(item: Record<string, unknown>, sourceUrl: string, inheritedCaption?: string): ResilientMediaItem[] {
  const caption = captionOf(item) || inheritedCaption;
  const versions = item.image_versions2 && typeof item.image_versions2 === "object"
    ? (item.image_versions2 as Record<string, unknown>).candidates
    : undefined;
  const image = bestImage(versions);
  const video = bestVideo(item.video_versions);
  const [width, height] = dimensions(item);

  if (video) {
    return [{
      url: video.url,
      download_url: video.url,
      type: "video",
      source_url: sourceUrl,
      thumbnail: image?.url,
      width: video.width,
      height: video.height,
      caption,
    }];
  }

  if (typeof item.video_url === "string") {
    const url = decode(item.video_url);
    if (isHttps(url)) {
      return [{
        url,
        download_url: url,
        type: "video",
        source_url: sourceUrl,
        thumbnail: typeof item.display_url === "string" ? decode(item.display_url) : image?.url,
        width,
        height,
        caption,
      }];
    }
  }

  const display = item.display_url || item.display_uri || item.thumbnail_src;
  if (typeof display === "string") {
    const url = decode(display);
    if (isHttps(url)) {
      return [{ url, download_url: url, type: "image", source_url: sourceUrl, width, height, caption }];
    }
  }

  if (image) {
    return [{
      url: image.url,
      download_url: image.url,
      type: "image",
      source_url: sourceUrl,
      width: image.width,
      height: image.height,
      caption,
    }];
  }
  return [];
}

function childrenOf(item: Record<string, unknown>): Record<string, unknown>[] {
  const carousel = item.carousel_media;
  if (Array.isArray(carousel) && carousel.length) {
    return carousel.filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object")).slice(0, MAX_MEDIA_ITEMS);
  }

  const sidecar = item.edge_sidecar_to_children;
  if (sidecar && typeof sidecar === "object") {
    const edges = (sidecar as Record<string, unknown>).edges;
    if (Array.isArray(edges)) {
      const nodes = edges
        .map((edge) => edge && typeof edge === "object" ? (edge as Record<string, unknown>).node : null)
        .filter((node): node is Record<string, unknown> => Boolean(node && typeof node === "object"))
        .slice(0, MAX_MEDIA_ITEMS);
      if (nodes.length) return nodes;
    }
    const nodes = (sidecar as Record<string, unknown>).nodes;
    if (Array.isArray(nodes)) {
      return nodes.filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object")).slice(0, MAX_MEDIA_ITEMS);
    }
  }
  return [item];
}

function extractPayload(payload: unknown, sourceUrl: string, shortcode: string): ResilientMediaItem[] {
  const objects: Record<string, unknown>[] = [];
  const seenObjects = new Set<object>();

  function walk(value: unknown, depth: number): void {
    if (depth > 18 || value === null || typeof value !== "object") return;
    if (seenObjects.has(value as object)) return;
    seenObjects.add(value as object);

    if (Array.isArray(value)) {
      for (const child of value) walk(child, depth + 1);
      return;
    }

    const object = value as Record<string, unknown>;
    const code = typeof object.code === "string" ? object.code : "";
    const short = typeof object.shortcode === "string" ? object.shortcode : "";
    const hasMedia = Boolean(
      Array.isArray(object.video_versions) ||
      (object.image_versions2 && typeof object.image_versions2 === "object") ||
      Array.isArray(object.carousel_media) ||
      (object.edge_sidecar_to_children && typeof object.edge_sidecar_to_children === "object") ||
      typeof object.video_url === "string" ||
      typeof object.display_url === "string" ||
      typeof object.display_uri === "string"
    );
    if (hasMedia) {
      if (code === shortcode || short === shortcode || objects.length === 0) objects.unshift(object);
      else objects.push(object);
    }
    for (const child of Object.values(object)) walk(child, depth + 1);
  }

  walk(payload, 0);

  const output: ResilientMediaItem[] = [];
  const seenUrls = new Set<string>();
  const reel = isReel(sourceUrl);
  for (const object of objects) {
    const inherited = captionOf(object);
    for (const child of childrenOf(object)) {
      for (const item of mediaFromObject(child, sourceUrl, inherited)) {
        if (!item.url || seenUrls.has(item.url)) continue;
        if (reel && item.type !== "video") continue;
        seenUrls.add(item.url);
        output.push(item);
        if (output.length >= MAX_MEDIA_ITEMS) return output;
      }
    }
  }
  return output;
}

function openGraph(text: string, sourceUrl: string): ResilientMediaItem[] {
  const get = (name: string) => {
    const escaped = name.replace(/[-:]/g, "\\$&");
    const patterns = [
      new RegExp(`<meta[^>]+property=[\\"']${escaped}[\\"'][^>]+content=[\\"']([^\\"']+)[\\"']`, "i"),
      new RegExp(`<meta[^>]+content=[\\"']([^\\"']+)[\\"'][^>]+property=[\\"']${escaped}[\\"']`, "i"),
      new RegExp(`<meta[^>]+name=[\\"']${escaped}[\\"'][^>]+content=[\\"']([^\\"']+)[\\"']`, "i"),
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) return decode(match[1]);
    }
    return undefined;
  };

  const video = get("og:video:secure_url") || get("og:video") || get("og:video:url");
  const image = get("og:image") || get("og:image:url");
  const caption = get("og:description") || get("description");
  if (isReel(sourceUrl)) {
    return video && isHttps(video) ? [{ url: video, download_url: video, type: "video", source_url: sourceUrl, thumbnail: image, caption }] : [];
  }
  if (video && isHttps(video)) return [{ url: video, download_url: video, type: "video", source_url: sourceUrl, thumbnail: image, caption }];
  if (image && isHttps(image)) return [{ url: image, download_url: image, type: "image", source_url: sourceUrl, caption }];
  return [];
}

async function fetchText(url: string, headers: Record<string, string>): Promise<string> {
  const response = await fetch(url, {
    headers,
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Instagram HTTP ${response.status}`);
  return response.text();
}

async function crawlerStrategy(sourceUrl: string, shortcode: string): Promise<ResilientMediaItem[]> {
  const html = await fetchText(`https://www.instagram.com/p/${shortcode}/`, {
    "User-Agent": CRAWLER_UA,
    "Accept-Language": "en-US,en;q=0.9",
  });

  for (const marker of ["xig_polaris_media", ...MEDIA_MARKERS]) {
    for (const payload of markerPayloads(html, marker)) {
      const media = extractPayload(payload, sourceUrl, shortcode);
      if (media.length) return media;
      if (payload && typeof payload === "object") {
        const root = payload as Record<string, unknown>;
        const node = root.if_not_gated_logged_out;
        if (node && typeof node === "object") {
          const mediaFromNode = extractPayload(node, sourceUrl, shortcode);
          if (mediaFromNode.length) return mediaFromNode;
        }
      }
    }
  }
  const og = openGraph(html, sourceUrl);
  if (og.length) return og;
  throw new Error("Crawler page contained no media");
}

async function embedStrategy(sourceUrl: string): Promise<ResilientMediaItem[]> {
  const path = new URL(sourceUrl).pathname.replace(/\/+$/, "");
  const html = await fetchText(`https://www.instagram.com${path}/embed/captioned/`, {
    "User-Agent": CHROME_UA,
    "Accept-Language": "en-US,en;q=0.9",
    "X-IG-App-ID": IG_APP_ID,
  });
  const shortcode = shortcodeOf(sourceUrl);
  for (const marker of ["gql_data", "xig_polaris_media", ...MEDIA_MARKERS]) {
    for (const payload of markerPayloads(html, marker)) {
      const media = extractPayload(payload, sourceUrl, shortcode);
      if (media.length) return media;
    }
  }
  const og = openGraph(html, sourceUrl);
  if (og.length) return og;
  throw new Error("Embed page contained no media");
}

async function graphqlStrategy(sourceUrl: string, shortcode: string): Promise<ResilientMediaItem[]> {
  let last: unknown = null;
  for (const docId of DOC_IDS) {
    try {
      const body = new URLSearchParams({
        av: "0",
        __d: "www",
        __user: "0",
        __a: "1",
        __comet_req: "7",
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
        variables: JSON.stringify({
          shortcode,
          fetch_comment_count: 40,
          parent_comment_count: 24,
          child_comment_count: 3,
          fetch_like_count: 10,
          fetch_tagged_user_count: null,
          fetch_preview_comment_count: 2,
          has_threaded_comments: true,
          hoisted_comment_id: null,
          hoisted_reply_id: null,
        }),
        server_timestamps: "true",
        doc_id: docId,
      });

      const text = await fetchText("https://www.instagram.com/graphql/query/", {
        "User-Agent": CHROME_UA,
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-IG-App-ID": IG_APP_ID,
        "X-ASBD-ID": "129477",
        "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
        Origin: "https://www.instagram.com",
        Referer: sourceUrl,
      });
      last = text;
      if (text) {
        try {
          const payload = JSON.parse(text) as unknown;
          const media = extractPayload(payload, sourceUrl, shortcode);
          if (media.length) return media;
        } catch {
          // Continue with marker parsing.
        }
        for (const marker of MEDIA_MARKERS) {
          for (const payload of markerPayloads(text, marker)) {
            const media = extractPayload(payload, sourceUrl, shortcode);
            if (media.length) return media;
          }
        }
      }
    } catch (error) {
      last = error;
    }
  }
  throw last instanceof Error ? last : new Error("GraphQL extraction failed");
}

export async function resolveInstagramResilient(inputUrl: string): Promise<ResilientMediaItem[]> {
  const sourceUrl = normalizeUrl(inputUrl);
  const shortcode = shortcodeOf(sourceUrl);
  const reel = isReel(sourceUrl);

  let crawler: Promise<ResilientMediaItem[]>;
  try {
    crawler = crawlerStrategy(sourceUrl, shortcode);
  } catch (error) {
    crawler = Promise.reject(error);
  }

  // Crawler + embed are the low-request-cost paths. They are run together because
  // their Instagram responses vary by egress and both can expose a different media set.
  const primary = await Promise.allSettled([crawler, embedStrategy(sourceUrl)]);
  const primaryResults = primary
    .filter((result): result is PromiseFulfilledResult<ResilientMediaItem[]> => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((items) => items.length)
    .map((items) => items.slice(0, MAX_MEDIA_ITEMS));

  if (primaryResults.length) {
    const best = primaryResults.reduce((a, b) => (b.length > a.length ? b : a));
    if (reel) {
      const videos = best.filter((item) => item.type === "video");
      if (videos.length) return videos;
    } else if (best.length > 1) {
      return best;
    } else {
      // A one-item result may only be the OG cover. Give GraphQL one chance to upgrade it.
      try {
        const gql = await graphqlStrategy(sourceUrl, shortcode);
        if (gql.length > best.length) return gql.slice(0, MAX_MEDIA_ITEMS);
      } catch {
        // Keep the valid primary result.
      }
      return best;
    }
  }

  try {
    const gql = await graphqlStrategy(sourceUrl, shortcode);
    const videos = reel ? gql.filter((item) => item.type === "video") : gql;
    if (videos.length) return videos.slice(0, MAX_MEDIA_ITEMS);
  } catch {
    // Fall through to the useful final error below.
  }

  throw new Error("Instagram did not expose usable public media to the resolver.");
}
