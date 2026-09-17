import { unstable_cache } from "next/cache";
import { instagram } from "@jerrycoder/instagram-api";

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

interface IgramMedia {
  src?: unknown;
  type?: unknown;
  thumbnail?: unknown;
  thumb?: unknown;
}

interface IgramResponse {
  data?: {
    medias?: unknown;
    thumbnail?: unknown;
    thumb?: unknown;
    title?: unknown;
  };
  status?: unknown;
  message?: unknown;
}

interface ResolverPayload {
  status?: string;
  data?: unknown;
  message?: string;
}

interface ResolverData {
  url?: unknown;
  download_url?: unknown;
  video_url?: unknown;
  videoUrl?: unknown;
  video?: unknown;
  media_url?: unknown;
  mediaUrl?: unknown;
  src?: unknown;
  thumbnail?: unknown;
  thumbnail_url?: unknown;
  type?: unknown;
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

const IGRAM_TIMEOUT_MS = 5_000;
const FAST_RESOLVER_TIMEOUT_MS = 5_000;
const DIRECT_PAGE_TIMEOUT_MS = 4_000;
const APIFY_TIMEOUT_SECONDS = 12;
const APIFY_TIMEOUT_MS = APIFY_TIMEOUT_SECONDS * 1_000;
const MAX_MEDIA_ITEMS = 20;

function normalizeInstagramUrl(url: string): string {
  const parsed = new URL(url.trim());
  parsed.protocol = "https:";
  parsed.hostname = "www.instagram.com";
  parsed.search = "";
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
 * Primary extractor copied from a proven open-source downloader pattern:
 * POST the Instagram URL to IGram and consume its explicit data.medias[].src/type.
 * We never scrape arbitrary URLs from the HTML response.
 */
async function fetchIgramMedia(url: string): Promise<MediaItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IGRAM_TIMEOUT_MS);

  try {
    const response = await fetch("https://igram.world/api/ig/dl", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: "https://igram.world/",
        Origin: "https://igram.world",
      },
      body: new URLSearchParams({ url }).toString(),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`IGram returned ${response.status}.`);
    }

    const payload = (await response.json()) as IgramResponse;
    const medias = payload?.data?.medias;

    if (!Array.isArray(medias)) {
      throw new Error("IGram returned no media list.");
    }

    const thumbnail =
      typeof payload?.data?.thumbnail === "string"
        ? decodeEmbeddedUrl(payload.data.thumbnail)
        : typeof payload?.data?.thumb === "string"
          ? decodeEmbeddedUrl(payload.data.thumb)
          : undefined;

    const reel = isReelSource(url);
    const output: MediaItem[] = [];
    const seen = new Set<string>();

    for (const raw of medias) {
      if (!raw || typeof raw !== "object") continue;
      const media = raw as IgramMedia;
      const type = typeof media.type === "string" ? media.type.toLowerCase() : "";
      const src = typeof media.src === "string" ? media.src : null;

      if (!src) continue;

      const looksVideo = type.includes("video") || isVideoUrl(src);
      if (reel && !looksVideo) continue;

      addMedia(output, seen, src, url, type || undefined, thumbnail);
    }

    if (!output.length) {
      throw new Error(
        reel
          ? "IGram returned no Reel video."
          : "IGram returned no downloadable media."
      );
    }

    return output;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("IGram extraction timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractProviderMedia(payload: unknown, sourceUrl: string): MediaItem[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as ResolverPayload;
  if (root.status && root.status !== "success") return [];

  const data =
    root.data && typeof root.data === "object"
      ? (root.data as ResolverData)
      : null;

  if (!data) return [];

  const thumbnail =
    typeof data.thumbnail === "string"
      ? decodeEmbeddedUrl(data.thumbnail)
      : typeof data.thumbnail_url === "string"
        ? decodeEmbeddedUrl(data.thumbnail_url)
        : undefined;

  const output: MediaItem[] = [];
  const seen = new Set<string>();
  const fields: Array<[unknown, string]> = [
    [data.video_url, "video"],
    [data.videoUrl, "video"],
    [data.video, "video"],
    [data.download_url, "download"],
    [data.media_url, "media"],
    [data.mediaUrl, "media"],
    [data.url, typeof data.type === "string" ? data.type : "media"],
    [data.src, "media"],
  ];

  for (const [value, hint] of fields) {
    addMedia(output, seen, value, sourceUrl, hint, thumbnail);
    if (isReelSource(sourceUrl) && output.length) break;
  }

  return output.slice(0, MAX_MEDIA_ITEMS);
}

async function fetchFastResolver(url: string): Promise<MediaItem[]> {
  const payload = await Promise.race([
    instagram(url),
    new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("Fast resolver timed out.")),
        FAST_RESOLVER_TIMEOUT_MS
      );
    }),
  ]);

  const media = extractProviderMedia(payload, url);
  if (!media.length) throw new Error("Fast resolver returned no usable media.");

  const reel = isReelSource(url);
  if (reel) {
    const videos = media.filter((item) => item.type === "video");
    if (!videos.length) throw new Error("Fast resolver returned no Reel video.");
    return videos.slice(0, MAX_MEDIA_ITEMS);
  }

  return media;
}

function extractMetaUrl(html: string, property: string): string | null {
  const escaped = property.replace(/[-:]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+property=[\"']${escaped}[\"'][^>]+content=[\"']([^\"']+)[\"']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']${escaped}[\"']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEmbeddedUrl(match[1]);
  }

  return null;
}

async function fetchInstagramPage(url: string): Promise<MediaItem[]> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.instagram.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(DIRECT_PAGE_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`Instagram page returned ${response.status}.`);

  const html = await response.text();
  const video =
    extractMetaUrl(html, "og:video:secure_url") || extractMetaUrl(html, "og:video");
  const image = extractMetaUrl(html, "og:image");

  if (isReelSource(url)) {
    if (!video || !isHttpsUrl(video)) {
      throw new Error("Instagram page did not expose a Reel video.");
    }

    return [
      {
        url: video,
        download_url: video,
        type: "video",
        source_url: url,
        thumbnail: image || undefined,
      },
    ];
  }

  if (video && isHttpsUrl(video)) {
    return [
      {
        url: video,
        download_url: video,
        type: "video",
        source_url: url,
        thumbnail: image || undefined,
      },
    ];
  }

  if (image && isHttpsUrl(image)) {
    return [
      {
        url: image,
        download_url: image,
        type: "image",
        source_url: url,
      },
    ];
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
    return await fetchIgramMedia(url);
  } catch (error) {
    console.warn(
      "IGram failed; trying lightweight resolver:",
      error instanceof Error ? error.message : error
    );
  }

  try {
    return await fetchFastResolver(url);
  } catch (error) {
    console.warn(
      "Lightweight Instagram resolver failed; trying direct page:",
      error instanceof Error ? error.message : error
    );
  }

  try {
    return await fetchInstagramPage(url);
  } catch (error) {
    console.warn(
      "Instagram direct page failed; using Apify fallback:",
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
    ["instagram-media-v12", normalized],
    { revalidate: 120 }
  );

  return cachedExtractor();
}
