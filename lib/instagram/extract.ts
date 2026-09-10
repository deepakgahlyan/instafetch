export interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
  source_url?: string;
}

interface ApifyItem {
  media_type?: "photo" | "video" | string;
  media_index?: number;
  download_url?: string;
  thumbnail_url?: string;
  caption?: string;
  source_url?: string;
}

async function fetchInstagramMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  let lastError = "Instagram extraction failed.";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
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
            discoveryMethod: "urls",
            urls: [url],
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(45000),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        console.error(
          `APIFY ERROR (attempt ${attempt}):`,
          response.status,
          responseText
        );
        lastError = `Instagram extraction failed (${response.status}).`;

        if (attempt < 2 && (response.status === 408 || response.status === 429 || response.status >= 500)) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        throw new Error(lastError);
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
          url: item.download_url,
          download_url: item.download_url,
          thumbnail: item.thumbnail_url,
          type:
            item.media_type === "video"
              ? "video"
              : "image",
          caption: item.caption || "",
          source_url: item.source_url || url,
        }));

      if (!media.length) {
        throw new Error("No downloadable media was found.");
      }

      return media;
    } catch (error) {
      if (error instanceof Error && error.message === "No downloadable media was found.") {
        throw error;
      }

      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < 2) {
        console.warn(`Instagram extraction retry ${attempt + 1}:`, lastError);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
    }
  }

  throw new Error(lastError);
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

  // Do not cache signed Instagram CDN URLs. They can expire or change within
  // minutes, which caused downloads to fail after a successful extraction.
  return fetchInstagramMedia(normalizedUrl);
}
