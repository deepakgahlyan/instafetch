import { unstable_cache } from "next/cache";

export interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
}

interface ApifyItem {
  media_type?: "photo" | "video" | string;
  media_index?: number;
  download_url?: string;
  thumbnail_url?: string;
  caption?: string;
}

async function fetchInstagramMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  const response = await fetch(
    "https://api.apify.com/v2/acts/maximedupre~instagram-downloader-api/run-sync-get-dataset-items",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        urls: [url],
        commentsPreviewLimit: 0,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    const responseText = await response.text();
    console.error("APIFY ERROR:", response.status, responseText);
    throw new Error(`Instagram extraction failed (${response.status}).`);
  }

  const results: ApifyItem[] = await response.json();

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No downloadable media was found.");
  }

  const media: MediaItem[] = results
    .filter((item) => item.download_url)
    .sort(
      (a, b) =>
        (a.media_index ?? 0) - (b.media_index ?? 0)
    )
    .map((item) => ({
      // Keep the CDN URL so the browser can preview/stream media directly.
      url: item.download_url,
      download_url: item.download_url,
      thumbnail: item.thumbnail_url,
      type:
        item.media_type === "video"
          ? "video"
          : "image",
      caption: item.caption || "",
    }));

  if (!media.length) {
    throw new Error("No downloadable media was found.");
  }

  return media;
}

function normalizeInstagramUrl(url: string): string {
  const parsed = new URL(url.trim());
  parsed.protocol = "https:";
  parsed.hostname = "www.instagram.com";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

export async function extractInstagramMedia(
  url: string
): Promise<MediaItem[]> {
  const normalizedUrl = normalizeInstagramUrl(url);

  // Repeated requests for the same public URL reuse resolved media metadata
  // for five minutes instead of starting another Apify run.
  const cachedFetch = unstable_cache(
    () => fetchInstagramMedia(normalizedUrl),
    ["instagram-media", normalizedUrl],
    {
      revalidate: 300,
      tags: ["instagram-media"],
    }
  );

  return cachedFetch();
}
