export interface MediaItem {
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

const PAGE_TIMEOUT_MS = 5_000;
const MAX_MEDIA_ITEMS = 20;
const MEDIA_MARKERS = [
  "xdt_api__v1__clips__home__connection_v2",
  "xdt_api__v1__media__shortcode__web_info",
  "xdt_api__v1__clips__user__connection_v2",
];

function normalizeInstagramUrl(url: string): string {
  const parsed = new URL(url.trim());
  parsed.protocol = "https:";
  parsed.hostname = "www.instagram.com";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

function getShortcode(url: string): string {
  const pathname = new URL(url).pathname.replace(/\/+$/, "");
  const match = pathname.match(/^\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)$/i);
  if (!match) {
    const shareMatch = pathname.match(/^\/share\/reel\/([A-Za-z0-9_-]+)$/i);
    if (shareMatch) return shareMatch[1];
    throw new Error("Only Instagram post and Reel URLs are supported.");
  }
  return match[1];
}

function isReelSource(url: string): boolean {
  const pathname = new URL(url).pathname.replace(/\/+$/, "").toLowerCase();
  return /^\/(reel|reels|tv)\//.test(pathname) || /^\/share\/reel\//.test(pathname);
}

function decodeEmbedded(value: string): string {
  return value
    .replace(/\\u0026/gi, "&")
    .replace(/\\u003D/gi, "=")
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/gi, "&")
    .trim();
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function findBalancedJson(text: string, start: number): string | null {
  const opener = text[start];
  const closer = opener === "{" ? "}" : opener === "[" ? "]" : null;
  if (!closer) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === opener) depth += 1;
    if (char === closer) {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }

  return null;
}

function parseValueAfterMarker(text: string, markerIndex: number): unknown | null {
  const colon = text.indexOf(":", markerIndex + markerIndex + 0);
  if (colon < 0) return null;

  const valueStart = (() => {
    for (let i = colon + 1; i < Math.min(text.length, colon + 200); i += 1) {
      const char = text[i];
      if (char === "{" || char === "[") return i;
      if (!/\s/.test(char)) return -1;
    }
    return -1;
  })();

  if (valueStart < 0) return null;

  const candidate = findBalancedJson(text, valueStart);
  if (!candidate) return null;

  try {
    return JSON.parse(candidate);
  } catch {
    try {
      return JSON.parse(candidate.replace(/\\\"/g, '"').replace(/\\\\/g, "\\"));
    } catch {
      return null;
    }
  }
}

function pickBestVideo(entries: unknown[]): { url: string; width?: number; height?: number } | null {
  const valid = entries
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({
      url: typeof entry.url === "string" ? decodeEmbedded(entry.url) : "",
      width: typeof entry.width === "number" ? entry.width : undefined,
      height: typeof entry.height === "number" ? entry.height : undefined,
      bandwidth: typeof entry.bandwidth === "number" ? entry.bandwidth : 0,
    }))
    .filter((entry) => isHttpsUrl(entry.url));

  if (!valid.length) return null;

  valid.sort((a, b) => {
    const areaA = (a.width ?? 0) * (a.height ?? 0);
    const areaB = (b.width ?? 0) * (b.height ?? 0);
    if (areaA !== areaB) return areaB - areaA;
    return (b.bandwidth ?? 0) - (a.bandwidth ?? 0);
  });

  return valid[0];
}

function pickBestImage(candidates: unknown[]): { url: string; width?: number; height?: number } | null {
  const valid = candidates
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({
      url: typeof entry.url === "string" ? decodeEmbedded(entry.url) : "",
      width: typeof entry.width === "number" ? entry.width : undefined,
      height: typeof entry.height === "number" ? entry.height : undefined,
    }))
    .filter((entry) => isHttpsUrl(entry.url));

  if (!valid.length) return null;
  valid.sort(
    (a, b) =>
      (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0)
  );
  return valid[0];
}

function dashVideoUrl(manifest: unknown): string | null {
  if (typeof manifest !== "string" || !manifest) return null;
  const decoded = decodeEmbedded(manifest);
  const matches = decoded.match(/<BaseURL[^>]*>([\s\S]*?)<\/BaseURL>/gi);
  if (!matches?.length) return null;
  for (const match of matches) {
    const inner = match.replace(/^<BaseURL[^>]*>/i, "").replace(/<\/BaseURL>$/i, "");
    if (isHttpsUrl(inner)) return inner;
  }
  return null;
}

function mediaItemFromObject(item: Record<string, unknown>, sourceUrl: string): MediaItem[] {
  const output: MediaItem[] = [];
  const seen = new Set<string>();
  const thumbnailCandidates =
    item.image_versions2 && typeof item.image_versions2 === "object"
      ? (item.image_versions2 as Record<string, unknown>).candidates
      : undefined;

  const bestImage = Array.isArray(thumbnailCandidates)
    ? pickBestImage(thumbnailCandidates)
    : null;

  const thumbnail = bestImage?.url;
  const videoVersions = Array.isArray(item.video_versions) ? item.video_versions : [];
  const bestVideo = pickBestVideo(videoVersions);
  const dash = dashVideoUrl(item.video_dash_manifest);

  if (bestVideo) {
    output.push({
      url: bestVideo.url,
      download_url: bestVideo.url,
      type: "video",
      source_url: sourceUrl,
      thumbnail,
      width: bestVideo.width,
      height: bestVideo.height,
      caption:
        item.caption && typeof item.caption === "object"
          ? typeof (item.caption as Record<string, unknown>).text === "string"
            ? (item.caption as Record<string, unknown>).text
            : undefined
          : undefined,
    });
  } else if (dash) {
    output.push({
      url: dash,
      download_url: dash,
      type: "video",
      source_url: sourceUrl,
      thumbnail,
    });
  } else if (bestImage) {
    output.push({
      url: bestImage.url,
      download_url: bestImage.url,
      type: "image",
      source_url: sourceUrl,
      width: bestImage.width,
      height: bestImage.height,
    });
  }

  return output.filter((item) => {
    const key = item.url || "";
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectMediaObjects(root: unknown, shortcode: string): Record<string, unknown>[] {
  const exact: Record<string, unknown>[] = [];
  const generic: Record<string, unknown>[] = [];
  const seen = new Set<object>();

  function walk(value: unknown, depth: number): void {
    if (depth > 10 || value === null || typeof value !== "object") return;
    if (seen.has(value as object)) return;
    seen.add(value as object);

    if (Array.isArray(value)) {
      for (const child of value) walk(child, depth + 1);
      return;
    }

    const object = value as Record<string, unknown>;
    const code = typeof object.code === "string" ? object.code : "";
    const short = typeof object.shortcode === "string" ? object.shortcode : "";
    const hasMediaFields =
      Array.isArray(object.video_versions) ||
      (object.image_versions2 && typeof object.image_versions2 === "object") ||
      Array.isArray(object.carousel_media);

    if (hasMediaFields) {
      if (code === shortcode || short === shortcode) exact.push(object);
      else generic.push(object);
    }

    for (const child of Object.values(object)) walk(child, depth + 1);
  }

  walk(root, 0);
  return [...exact, ...generic];
}

function extractFromPayload(payload: unknown, shortcode: string, sourceUrl: string): MediaItem[] {
  const objects = collectMediaObjects(payload, shortcode);
  const output: MediaItem[] = [];
  const seen = new Set<string>();
  const reel = isReelSource(sourceUrl);

  for (const object of objects) {
    const carousel = Array.isArray(object.carousel_media) ? object.carousel_media : null;

    if (carousel?.length) {
      for (const child of carousel.slice(0, MAX_MEDIA_ITEMS)) {
        if (!child || typeof child !== "object") continue;
        const childItems = mediaItemFromObject(child as Record<string, unknown>, sourceUrl);
        for (const item of childItems) {
          if (item.url && !seen.has(item.url)) {
            seen.add(item.url);
            output.push(item);
          }
        }
      }
    } else {
      for (const item of mediaItemFromObject(object, sourceUrl)) {
        if (item.url && !seen.has(item.url)) {
          seen.add(item.url);
          output.push(item);
        }
      }
    }

    if (reel && output.some((item) => item.type === "video")) {
      return output.filter((item) => item.type === "video").slice(0, MAX_MEDIA_ITEMS);
    }

    if (output.length >= MAX_MEDIA_ITEMS) break;
  }

  return reel
    ? output.filter((item) => item.type === "video").slice(0, MAX_MEDIA_ITEMS)
    : output.slice(0, MAX_MEDIA_ITEMS);
}

function extractLooseMedia(html: string, shortcode: string, sourceUrl: string): MediaItem[] {
  const escapedCode = shortcode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const positions = [
    html.indexOf(`\"code\":\"${shortcode}\"`),
    html.indexOf(`\"shortcode\":\"${shortcode}\"`),
  ].filter((index) => index >= 0);

  for (const position of positions) {
    const videoMarker = html.indexOf('"video_versions":', position);
    if (videoMarker >= 0 && videoMarker - position < 20_000) {
      const arrayStart = html.indexOf("[", videoMarker);
      if (arrayStart >= 0) {
        const rawArray = findBalancedJson(html, arrayStart);
        if (rawArray) {
          try {
            const versions = JSON.parse(rawArray) as unknown[];
            const best = pickBestVideo(versions);
            if (best) {
              return [
                {
                  url: best.url,
                  download_url: best.url,
                  type: "video",
                  source_url: sourceUrl,
                  width: best.width,
                  height: best.height,
                },
              ];
            }
          } catch {
            // Continue to other structured fields.
          }
        }
      }
    }

    const imageMarker = html.indexOf('"image_versions2":', position);
    if (imageMarker >= 0 && imageMarker - position < 20_000) {
      const objectStart = html.indexOf("{", imageMarker);
      if (objectStart >= 0) {
        const rawObject = findBalancedJson(html, objectStart);
        if (rawObject) {
          try {
            const imageObject = JSON.parse(rawObject) as Record<string, unknown>;
            const candidates = Array.isArray(imageObject.candidates) ? imageObject.candidates : [];
            const best = pickBestImage(candidates);
            if (best) {
              return [
                {
                  url: best.url,
                  download_url: best.url,
                  type: "image",
                  source_url: sourceUrl,
                  width: best.width,
                  height: best.height,
                },
              ];
            }
          } catch {
            // Continue.
          }
        }
      }
    }
  }

  void escapedCode;
  return [];
}

function parseInstagramHtml(html: string, sourceUrl: string, shortcode: string): MediaItem[] {
  for (const marker of MEDIA_MARKERS) {
    let offset = 0;
    while (true) {
      const markerIndex = html.indexOf(marker, offset);
      if (markerIndex < 0) break;
      const payload = parseValueAfterMarker(html, markerIndex);
      if (payload) {
        const media = extractFromPayload(payload, shortcode, sourceUrl);
        if (media.length) return media;
      }
      offset = markerIndex + marker.length;
    }
  }

  return extractLooseMedia(html, shortcode, sourceUrl);
}

async function fetchInstagramVariant(url: string): Promise<MediaItem[]> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Referer: "https://www.instagram.com/",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
      "X-IG-App-ID": "936619743392459",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(PAGE_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`Instagram returned ${response.status}.`);

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    try {
      const json = JSON.parse(text);
      const shortcode = getShortcode(url);
      const media = extractFromPayload(json, shortcode, url);
      if (media.length) return media;
    } catch {
      // Continue with HTML parsing.
    }
  }

  const shortcode = getShortcode(url);
  const media = parseInstagramHtml(text, url, shortcode);
  if (!media.length) throw new Error("Instagram page contained no downloadable media.");
  return media;
}

export async function resolveInstagramDirect(inputUrl: string): Promise<MediaItem[]> {
  const sourceUrl = normalizeInstagramUrl(inputUrl);
  const shortcode = getShortcode(sourceUrl);

  const base = sourceUrl.endsWith("/") ? sourceUrl : `${sourceUrl}/`;
  const variants = [
    base,
    `${base}?__a=1&__d=dis`,
  ];

  const attempts = variants.map((variant) =>
    fetchInstagramVariant(variant).then((media) => {
      if (isReelSource(sourceUrl)) {
        const videos = media.filter((item) => item.type === "video");
        if (!videos.length) throw new Error("No Reel video found in Instagram response.");
        return videos.slice(0, MAX_MEDIA_ITEMS);
      }
      return media.slice(0, MAX_MEDIA_ITEMS);
    })
  );

  try {
    return await Promise.any(attempts);
  } catch {
    throw new Error(
      `Instagram media extraction failed for shortcode ${shortcode}. The page may require login, be private, unavailable, or temporarily rate-limited.`
    );
  }
}
