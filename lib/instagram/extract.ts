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
    ext?: string;
  };
}

const FAST_RESOLVER_TIMEOUT_MS = 6_000;
const DIRECT_PAGE_TIMEOUT_MS = 4_500;
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

function isKnownMediaHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "snapcdn.app" ||
    host.endsWith(".snapcdn.app") ||
    host.endsWith("cdninstagram.com") ||
    host.endsWith("fbcdn.net") ||
    host.endsWith("fbsbx.com") ||
    host === "jerrycoder.oggyapi.workers.dev"
  );
}

function isMediaExtension(url: string): boolean {
  try {
    return /\.(mp4|m4v|mov|webm|jpg|jpeg|png|webp|gif)(?:$|[?#])/i.test(
      new URL(url).pathname
    );
  } catch {
    return false;
  }
}

function isCandidateMediaUrl(value: string, trustProviderUrl = false): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return false;

    const host = parsed.hostname.toLowerCase();
    if (host === "instagram.com" || host === "www.instagram.com") return false;

    if (trustProviderUrl) return true;

    return isKnownMediaHost(host) || isMediaExtension(value);
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

function inferMediaType(
  url: string,
  hint: unknown,
  sourceUrl: string
): "video" | "image" {
  if (isReelSource(sourceUrl)) return "video";

  const normalizedHint = typeof hint === "string" ? hint.toLowerCase() : "";
  if (
    normalizedHint.includes("video") ||
    normalizedHint.includes("mp4") ||
    normalizedHint.includes("playback")
  ) {
    return "video";
  }

  return isMediaExtension(url) ? "video" : "image";
}

function addMedia(
  output: MediaItem[],
  seen: Set<string>,
  value: unknown,
  sourceUrl: string,
  hint: unknown,
  trustProviderUrl = false,
  thumbnail?: string
): void {
  if (output.length >= MAX_MEDIA_ITEMS || typeof value !== "string") return;

  const url = decodeEmbeddedUrl(value);
  if (!isCandidateMediaUrl(url, trustProviderUrl) || seen.has(url)) return;

  seen.add(url);
  output.push({
    url,
    download_url: url,
    type: inferMediaType(url, hint, sourceUrl),
    source_url: sourceUrl,
    thumbnail,
  });
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
      ? data.thumbnail
      : typeof data.thumbnail_url === "string"
        ? data.thumbnail_url
        : undefined;

  const values: Array<[unknown, unknown, boolean]> = [
    [data.video_url, "video", true],
    [data.videoUrl, "video", true],
    [data.video, "video", true],
    [data.download_url, "download_url", true],
    [data.media_url, "media_url", true],
    [data.mediaUrl, "mediaUrl", true],
    [data.url, data.type, true],
    [data.src, "src", true],
  ];

  const output: MediaItem[] = [];
  const seen = new Set<string>();

  for (const [value, hint, trustProviderUrl] of values) {
    addMedia(
      output,
      seen,
      value,
      sourceUrl,
      hint,
      trustProviderUrl,
      thumbnail
    );

    if (isReelSource(sourceUrl) && output.length > 0) break;
  }

  return output.slice(0, MAX_MEDIA_ITEMS);
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

  if (!response.ok) {
    throw new Error(`Instagram page returned ${response.status}.`);
  }

  const html = await response.text();
  const media: MediaItem[] = [];
  const ogVideo =
    extractMetaUrl(html, "og:video:secure_url") ||
    extractMetaUrl(html, "og:video");
  const ogImage = extractMetaUrl(html, "og:image");

  if (ogVideo && isCandidateMediaUrl(ogVideo)) {
    media.push({
      url: ogVideo,
      download_url: ogVideo,
      type: "video",
      source_url: url,
      thumbnail: ogImage || undefined,
    });
  }

  if (!media.length && ogImage && isCandidateMediaUrl(ogImage)) {
    media.push({
      url: ogImage,
      download_url: ogImage,
      type: "image",
      source_url: url,
    });
  }

  if (!media.length) {
    throw new Error("Instagram page did not expose downloadable media.");
  }

  return media;
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
  if (!media.length) {
    throw new Error("Fast resolver returned no usable media URL.");
  }

  return media;
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
      // Keep null when the provider does not return JSON.
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

    if (!media.length) {
      throw new Error(
        "No downloadable public media was found. The post may be private, deleted, unavailable, or unsupported."
      );
    }

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
  if (isSupportedPath(url)) {
    try {
      const fastMedia = await fetchFastResolver(url);
      if (isReelSource(url)) {
        const videos = fastMedia.filter((item) => item.type === "video");
        if (!videos.length) throw new Error("Fast provider returned no Reel video.");
        return videos;
      }
      return fastMedia;
    } catch (error) {
      console.warn(
        "Fast Instagram provider failed; trying direct page:",
        error instanceof Error ? error.message : error
      );
    }

    try {
      const pageMedia = await fetchInstagramPage(url);
      if (isReelSource(url)) {
        const videos = pageMedia.filter((item) => item.type === "video");
        if (!videos.length) throw new Error("Instagram page returned no Reel video.");
        return videos;
      }
      return pageMedia;
    } catch (error) {
      console.warn(
        "Instagram direct page failed; using Apify fallback:",
        error instanceof Error ? error.message : error
      );
    }
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
    ["instagram-media-v11", normalized],
    { revalidate: 120 }
  );

  return cachedExtractor();
}
