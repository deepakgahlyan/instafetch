import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { instagram } from "@jerrycoder/instagram-api";
import {
  getMediaObjectUrl,
  putMediaObject,
  r2Configured,
} from "@/lib/storage/r2";

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

function isSingleMediaPath(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return pathname.startsWith("/reel/") || pathname.startsWith("/tv/");
  } catch {
    return false;
  }
}

function safeExtension(item: ResolverItem | MediaItem): string {
  const mediaType = item.type === "video" ? "mp4" : "jpg";
  const ext =
    "media_meta_data" in item
      ? item.media_meta_data?.ext || mediaType
      : item.filename?.split(".").pop() || mediaType;
  return ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "bin";
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
    if (depth > 6 || node == null) return;

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
    setTimeout(() => reject(new Error("Fast resolver timed out.")), 12000);
  });

  const payload = await Promise.race([instagram(url), timeout]);
  const media = collectFastMedia(payload, url);

  if (!media.length) {
    throw new Error("Fast resolver returned no downloadable media.");
  }

  return media;
}

async function mirrorToR2(
  media: MediaItem[],
  sourceUrl: string
): Promise<MediaItem[]> {
  if (!r2Configured) return media;

  const postHash = createHash("sha256")
    .update(sourceUrl)
    .digest("hex")
    .slice(0, 24);

  const mirrored = await Promise.allSettled(
    media.map(async (item, index) => {
      const source = item.download_url || item.url;
      if (!source) return item;

      const response = await fetch(source, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "User-Agent": "Mozilla/5.0 (compatible; InstaFetch/1.0)",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(90000),
      });

      if (!response.ok) {
        throw new Error(`Media storage fetch failed (${response.status}).`);
      }

      const body = await response.arrayBuffer();
      const contentType =
        response.headers.get("content-type") ||
        (item.type === "video" ? "video/mp4" : "image/jpeg");
      const extension = safeExtension(item);
      const key = `instagram/${postHash}/${String(index + 1).padStart(
        2,
        "0"
      )}-${createHash("sha256")
        .update(source)
        .digest("hex")
        .slice(0, 16)}.${extension}`;

      await putMediaObject({
        key,
        body,
        contentType,
        contentLength: body.byteLength,
      });

      const filename =
        item.filename || `instafetch-${index + 1}.${extension}`;
      const signedUrl = await getMediaObjectUrl(
        key,
        filename,
        contentType
      );

      return {
        ...item,
        url: signedUrl,
        download_url: signedUrl,
        filesize_bytes: body.byteLength,
      };
    })
  );

  const successful = mirrored
    .filter(
      (result): result is PromiseFulfilledResult<MediaItem> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);

  if (!successful.length) {
    throw new Error("Media was found but could not be prepared for download.");
  }

  return successful;
}

async function fetchApifyMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  const endpoint =
    "https://api.apify.com/v2/acts/crawlerbros~instagram-downloader-api/run-sync-get-dataset-items";

  let lastError = "Instagram extraction failed.";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(
        `${endpoint}?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postUrls: [url] }),
          cache: "no-store",
          signal: AbortSignal.timeout(30000),
        }
      );

      const text = await response.text();
      let data: unknown;

      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!response.ok || !Array.isArray(data)) {
        lastError = `Instagram extraction failed (${response.status}).`;
        console.error(
          "STORAGE RESOLVER ERROR:",
          response.status,
          text.slice(0, 500)
        );

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        throw new Error(lastError);
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

      return mirrorToR2(media, url);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.startsWith("No downloadable public media") ||
          error.message.startsWith("Media was found but could not be prepared"))
      ) {
        throw error;
      }

      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < 2) {
        console.warn(
          `Instagram storage resolver retry ${attempt + 1}:`,
          lastError
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw new Error(lastError);
}

async function uncachedExtractInstagramMedia(
  url: string
): Promise<MediaItem[]> {
  const preferFast = isSingleMediaPath(url);

  if (preferFast) {
    try {
      const fastMedia = await fetchFastResolver(url);
      return mirrorToR2(fastMedia, url);
    } catch (error) {
      console.warn("Fast Instagram resolver failed; using Apify fallback:", error);
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
    ["instagram-media-v2", normalized],
    {
      revalidate: 120,
    }
  );

  return cachedExtractor();
}
