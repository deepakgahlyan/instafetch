import { createHash } from "node:crypto";
import { getMediaObjectUrl, putMediaObject, r2Configured } from "@/lib/storage/r2";

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

function safeExtension(item: ResolverItem): string {
  const ext = item.media_meta_data?.ext || (item.type === "video" ? "mp4" : "jpg");
  return ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "bin";
}

async function mirrorToR2(media: MediaItem[], sourceUrl: string): Promise<MediaItem[]> {
  if (!r2Configured) return media;

  const postHash = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 24);

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
      const extension = item.filename?.split(".").pop() || (item.type === "video" ? "mp4" : "jpg");
      const key = `instagram/${postHash}/${String(index + 1).padStart(2, "0")}-${createHash("sha256").update(source).digest("hex").slice(0, 16)}.${extension}`;

      await putMediaObject({
        key,
        body,
        contentType,
        contentLength: body.byteLength,
      });

      const filename = item.filename || `instafetch-${index + 1}.${safeExtension({ type: item.type, media_meta_data: { ext: extension } })}`;
      const signedUrl = await getMediaObjectUrl(key, filename, contentType);

      return {
        ...item,
        url: signedUrl,
        download_url: signedUrl,
        filesize_bytes: body.byteLength,
      };
    })
  );

  const successful = mirrored
    .filter((result): result is PromiseFulfilledResult<MediaItem> => result.status === "fulfilled")
    .map((result) => result.value);

  if (!successful.length) {
    throw new Error("Media was found but could not be prepared for download.");
  }

  return successful;
}

async function fetchInstagramMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  const endpoint =
    "https://api.apify.com/v2/acts/crawlerbros~instagram-downloader-api/run-sync-get-dataset-items";

  let lastError = "Instagram extraction failed.";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postUrls: [url] }),
        cache: "no-store",
        signal: AbortSignal.timeout(45000),
      });

      const text = await response.text();
      let data: unknown;

      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!response.ok || !Array.isArray(data)) {
        lastError = `Instagram extraction failed (${response.status}).`;
        console.error("STORAGE RESOLVER ERROR:", response.status, text.slice(0, 500));

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 700));
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
        console.warn(`Instagram storage resolver retry ${attempt + 1}:`, lastError);
        await new Promise((resolve) => setTimeout(resolve, 700));
        continue;
      }
    }
  }

  throw new Error(lastError);
}

export async function extractInstagramMedia(url: string): Promise<MediaItem[]> {
  const normalized = normalizeInstagramUrl(url);

  if (!isInstagramUrl(normalized)) {
    throw new Error("Only public Instagram URLs are supported.");
  }

  return fetchInstagramMedia(normalized);
}
