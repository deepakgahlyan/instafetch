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

async function fetchInstagramMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  // Storage-backed actor: Instagram CDN URLs are temporary, so the actor
  // downloads the actual bytes into Apify KV storage and returns stable
  // storage URLs. This removes the signed-CDN-expiry race from downloads.
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

      return media;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("No downloadable public media")
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
