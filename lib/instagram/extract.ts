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

interface ResolverItem {
  filename?: string;
  post_url?: string;
  type?: string;
  username?: string;
  download_status?: string;
  download_url?: string;
  media_meta_data?: {
    width?: number;
    height?: number;
    filesize_bytes?: number;
    ext?: string;
  };
}

const FAST_RESOLVER_TIMEOUT_MS = 8_000;
const APIFY_TIMEOUT_SECONDS = 15;
const APIFY_TIMEOUT_MS = APIFY_TIMEOUT_SECONDS * 1_000;

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

function isFastPath(url: string): boolean {
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

function isCandidateMediaUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return false;

    const host = parsed.hostname.toLowerCase();
    if (host === "instagram.com" || host === "www.instagram.com") return false;

    const pathname = parsed.pathname.toLowerCase();
    const hasMediaExtension = /\.(mp4|m4v|mov|webm|jpg|jpeg|png|webp|gif)(?:$|[?#])/.test(
      pathname
    );
    const looksLikeMediaHost =
      host.includes("cdninstagram.com") ||
      host.endsWith("fbcdn.net") ||
      host.endsWith("fbsbx.com");

    return hasMediaExtension || looksLikeMediaHost;
  } catch {
    return false;
  }
}

function inferMediaType(url: string, hint?: string): "video" | "image" {
  const normalizedHint = (hint || "").toLowerCase();
  if (normalizedHint.includes("video") || normalizedHint.includes("mp4")) {
    return "video";
  }

  return /\.(mp4|m4v|mov|webm)(?:$|[?#])/i.test(url) ? "video" : "image";
}

function collectFastMedia(payload: unknown, sourceUrl: string): MediaItem[] {
  const output: MediaItem[] = [];
  const seen = new Set<string>();

  function visit(node: unknown, hint = "", depth = 0): void {
    if (depth > 7 || node == null) return;

    if (typeof node === "string") {
      if (isCandidateMediaUrl(node) && !seen.has(node)) {
        seen.add(node);
        output.push({
          url: node,
          download_url: node,
          type: inferMediaType(node, hint),
          source_url: sourceUrl,
        });
      }
      return;
    }

    if (Array.isArray(node)) {
      for (const entry of node) visit(entry, hint, depth + 1);
      return;
    }

    if (typeof node !== "object") return;

    const record = node as Record<string, unknown>;
    const typeHint =
      typeof record.type === "string"
        ? record.type
        : typeof record.media_type === "string"
          ? record.media_type
          : hint;

    for (const [key, value] of Object.entries(record)) {
      const nextHint = key.toLowerCase().includes("url") ? key : typeHint;
      visit(value, nextHint, depth + 1);
    }
  }

  visit(payload);
  return output;
}

async function fetchFastResolver(url: string): Promise<MediaItem[]> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error("Fast resolver timed out.")),
      FAST_RESOLVER_TIMEOUT_MS
    );
  });

  const payload = await Promise.race([instagram(url), timeout]);
  const media = collectFastMedia(payload, url);

  if (!media.length) {
    throw new Error("Fast resolver returned no downloadable media.");
  }

  return media;
}

async function fetchApifyMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

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
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!response.ok || !Array.isArray(data)) {
      console.error(
        "INSTAGRAM APIFY RESOLVER ERROR:",
        response.status,
        text.slice(0, 500)
      );
      throw new Error(`Instagram extraction failed (${response.status}).`);
    }

    const results = data as ResolverItem[];
    const media = results
      .filter(
        (item) =>
          item.download_status === "finished" &&
          typeof item.download_url === "string" &&
          item.download_url.length > 0
      )
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

async function uncachedExtractInstagramMedia(
  url: string
): Promise<MediaItem[]> {
  if (isFastPath(url)) {
    try {
      return await fetchFastResolver(url);
    } catch (error) {
      console.warn(
        "Fast Instagram resolver failed; using Apify fallback:",
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
    ["instagram-media-v4", normalized],
    {
      revalidate: 120,
    }
  );

  return cachedExtractor();
}
