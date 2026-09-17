import { unstable_cache } from "next/cache";

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

interface BtchItem {
  status?: boolean;
  creator?: string;
  thumbnail?: string;
  url?: unknown;
}

interface ApifyItem {
  filename?: string;
  type?: string;
  download_status?: string;
  download_url?: string;
  media_meta_data?: {
    width?: number;
    height?: number;
    filesize_bytes?: number;
  };
}

const BTCH_TIMEOUT_MS = 7_000;
const PAGE_TIMEOUT_MS = 4_500;
const APIFY_TIMEOUT_SECONDS = 12;
const APIFY_TIMEOUT_MS = APIFY_TIMEOUT_SECONDS * 1_000;
const MAX_MEDIA_ITEMS = 20;

function normalizeInstagramUrl(url: string): string {
  const parsed = new URL(url.trim());
  parsed.protocol = "https:";
  parsed.hostname = "www.instagram.com";
  parsed.hash = "";
  return parsed.toString();
}

function isInstagramUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      parsed.protocol === "https:" &&
      (host === "instagram.com" || host === "www.instagram.com")
    );
  } catch {
    return false;
  }
}

function isSupportedPath(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase().replace(/\/+$/, "");
    return (
      /^\/(p|reel|reels|tv)\/[^/]+$/.test(pathname) ||
      /^\/share\/reel\/[^/]+$/.test(pathname)
    );
  } catch {
    return false;
  }
}

function isReelSource(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase().replace(/\/+$/, "");
    return (
      /^\/(reel|reels|tv)\/[^/]+$/.test(pathname) ||
      /^\/share\/reel\/[^/]+$/.test(pathname)
    );
  } catch {
    return false;
  }
}

function decodeEmbeddedUrl(value: string): string {
  return value
    .replace(/\\u0026/gi, "&")
    .replace(/\\u003D/gi, "=")
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/gi, "&")
    .replace(/\\"/g, '"')
    .trim();
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isVideoUrl(value: string): boolean {
  try {
    return /\.(mp4|m4v|mov|webm)(?:$|[?#])/i.test(new URL(value).pathname);
  } catch {
    return false;
  }
}

function addMedia(
  output: MediaItem[],
  seen: Set<string>,
  value: unknown,
  sourceUrl: string,
  typeHint?: unknown,
  thumbnail?: string
): void {
  if (output.length >= MAX_MEDIA_ITEMS || typeof value !== "string") return;

  const url = decodeEmbeddedUrl(value);
  if (!isHttpsUrl(url) || seen.has(url)) return;

  const hint = typeof typeHint === "string" ? typeHint.toLowerCase() : "";
  const type =
    hint.includes("video") || hint.includes("mp4") || isVideoUrl(url)
      ? "video"
      : "image";

  seen.add(url);
  output.push({
    url,
    download_url: url,
    type,
    source_url: sourceUrl,
    thumbnail,
  });
}

/**
 * Current backend-first resolver.
 * The current btch-downloader project documents this backend and its
 * /api/downloader/igdl endpoint for Instagram Reels/posts, returning direct
 * media URLs.
 */
async function fetchBtchInstagramMedia(url: string): Promise<MediaItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BTCH_TIMEOUT_MS);

  try {
    const endpoint = new URL(
      "https://backend1.tioo.eu.org/api/downloader/igdl"
    );
    endpoint.searchParams.set("url", url);

    const response = await fetch(endpoint.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: "https://backend1.tioo.eu.org/",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Backend extractor returned ${response.status}.`);
    }

    const payload = (await response.json()) as unknown;
    const rawItems: unknown[] = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object"
        ? [payload]
        : [];

    const output: MediaItem[] = [];
    const seen = new Set<string>();
    const reel = isReelSource(url);

    for (const raw of rawItems) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw as BtchItem;
      if (item.status === false) continue;

      const thumbnail =
        typeof item.thumbnail === "string"
          ? decodeEmbeddedUrl(item.thumbnail)
          : undefined;

      const values = Array.isArray(item.url)
        ? item.url
        : [item.url];

      for (const value of values) {
        // The backend's Reel result is already typed by the endpoint. Do not
        // require a .mp4 suffix because signed CDN URLs commonly omit it.
        addMedia(output, seen, value, url, reel ? "video" : undefined, thumbnail);
      }
    }

    if (!output.length) {
      throw new Error(
        reel
          ? "Backend extractor returned no Reel video."
          : "Backend extractor returned no downloadable media."
      );
    }

    return output.slice(0, MAX_MEDIA_ITEMS);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Backend Instagram extraction timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse Instagram's current page-embedded Polaris media object.
 * This avoids deprecated GraphQL doc_ids and works with public pages when the
 * media object is included in the initial HTML response.
 */
function extractEmbeddedMedia(html: string, sourceUrl: string): MediaItem[] {
  const marker = "xdt_api__v1__media__shortcode__web_info";
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return [];

  const valueStart = html.indexOf("{", markerIndex);
  if (valueStart < 0) return [];

  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = valueStart; i < html.length; i += 1) {
    const char = html[i];

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

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end <= valueStart) return [];

  const candidate = html.slice(valueStart, end);
  const variants = [
    candidate,
    candidate.replace(/\\"/g, '"').replace(/\\\//g, "/"),
  ];

  let parsed: unknown = null;
  for (const variant of variants) {
    try {
      parsed = JSON.parse(variant);
      break;
    } catch {
      // Try the next encoding form.
    }
  }

  if (!parsed || typeof parsed !== "object") return [];

  const record = parsed as {
    items?: unknown;
  };
  const items = Array.isArray(record.items) ? record.items : [];
  const first = items[0];
  if (!first || typeof first !== "object") return [];

  const output: MediaItem[] = [];
  const seen = new Set<string>();

  const readMedia = (item: unknown): void => {
    if (!item || typeof item !== "object") return;
    const media = item as {
      video_versions?: unknown;
      image_versions2?: { candidates?: unknown };
      thumbnail?: unknown;
    };

    const thumbnail =
      typeof media.thumbnail === "string"
        ? decodeEmbeddedUrl(media.thumbnail)
        : undefined;

    const videoVersions = Array.isArray(media.video_versions)
      ? media.video_versions
      : [];

    const bestVideo = videoVersions.find(
      (entry): entry is { url: string } =>
        Boolean(
          entry &&
            typeof entry === "object" &&
            typeof (entry as { url?: unknown }).url === "string"
        )
    );

    if (bestVideo) {
      addMedia(output, seen, bestVideo.url, sourceUrl, "video", thumbnail);
      return;
    }

    const candidates =
      media.image_versions2 && Array.isArray(media.image_versions2.candidates)
        ? media.image_versions2.candidates
        : [];

    const bestImage = candidates.find(
      (entry): entry is { url: string } =>
        Boolean(
          entry &&
            typeof entry === "object" &&
            typeof (entry as { url?: unknown }).url === "string"
        )
    );

    if (bestImage) {
      addMedia(output, seen, bestImage.url, sourceUrl, "image", thumbnail);
    }
  };

  const carousel = (first as { carousel_media?: unknown }).carousel_media;
  if (Array.isArray(carousel) && carousel.length) {
    for (const item of carousel.slice(0, MAX_MEDIA_ITEMS)) readMedia(item);
  } else {
    readMedia(first);
  }

  return output.slice(0, MAX_MEDIA_ITEMS);
}

async function fetchInstagramPage(url: string): Promise<MediaItem[]> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.instagram.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(PAGE_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`Instagram page returned ${response.status}.`);

  const html = await response.text();
  const embedded = extractEmbeddedMedia(html, url);

  if (embedded.length) {
    if (isReelSource(url)) {
      const videos = embedded.filter((item) => item.type === "video");
      if (videos.length) return videos;
    } else {
      return embedded;
    }
  }

  throw new Error("Instagram page did not expose downloadable media.");
}

async function fetchApifyMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not configured.");

  const endpoint =
    "https://api.apify.com/v2/acts/crawlerbros~instagram-downloader-api/run-sync-get-dataset-items";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APIFY_TIMEOUT_MS);

  try {
    const endpointUrl = new URL(endpoint);
    endpointUrl.searchParams.set("token", token);
    endpointUrl.searchParams.set("timeout", String(APIFY_TIMEOUT_SECONDS));

    const response = await fetch(endpointUrl.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postUrls: [url] }),
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!response.ok || !Array.isArray(data)) {
      throw new Error(`Instagram extraction failed (${response.status}).`);
    }

    const media = (data as ApifyItem[])
      .filter(
        (item) =>
          item.download_status === "finished" &&
          typeof item.download_url === "string" &&
          item.download_url.length > 0
      )
      .slice(0, MAX_MEDIA_ITEMS)
      .map((item) => ({
        url: item.download_url,
        download_url: item.download_url,
        type: item.type === "video" ? "video" : "image",
        source_url: url,
        filename: item.filename,
        width: item.media_meta_data?.width,
        height: item.media_meta_data?.height,
        filesize_bytes: item.media_meta_data?.filesize_bytes,
      }));

    if (isReelSource(url)) {
      const videos = media.filter((item) => item.type === "video");
      if (!videos.length) throw new Error("No Reel video was found.");
      return videos;
    }

    if (!media.length) throw new Error("No downloadable public media was found.");
    return media;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Instagram extraction timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function uncachedExtractInstagramMedia(url: string): Promise<MediaItem[]> {
  if (!isSupportedPath(url)) return fetchApifyMedia(url);

  try {
    return await fetchBtchInstagramMedia(url);
  } catch (error) {
    console.warn(
      "Current backend extractor failed:",
      error instanceof Error ? error.message : error
    );
  }

  try {
    return await fetchInstagramPage(url);
  } catch (error) {
    console.warn(
      "Embedded Instagram media extraction failed:",
      error instanceof Error ? error.message : error
    );
  }

  return fetchApifyMedia(url);
}

export async function extractInstagramMedia(url: string): Promise<MediaItem[]> {
  const normalized = normalizeInstagramUrl(url);

  if (!isInstagramUrl(normalized)) {
    throw new Error("Only public Instagram URLs are supported.");
  }

  const cachedExtractor = unstable_cache(
    () => uncachedExtractInstagramMedia(normalized),
    ["instagram-media-v13", normalized],
    { revalidate: 120 }
  );

  return cachedExtractor();
}
