export interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
  source_url?: string;
}

interface ResolverItem {
  url?: string;
  type?: string;
  quality?: string;
  thumb?: string;
  caption?: string;
}

interface ResolverResponse {
  status?: string;
  platform?: string;
  result?: ResolverItem[];
}

async function fetchInstagramMedia(url: string): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  const endpoint = new URL(
    "https://elis--instagram-downloader-api.apify.actor/api/v1/download"
  );
  endpoint.searchParams.set("url", url);

  let lastError = "Instagram extraction failed.";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(endpoint.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(25000),
      });

      const text = await response.text();
      let data: ResolverResponse | null = null;

      try {
        data = JSON.parse(text) as ResolverResponse;
      } catch {
        data = null;
      }

      if (!response.ok || !data) {
        lastError = `Instagram extraction failed (${response.status}).`;
        console.error("RESOLVER ERROR:", response.status, text.slice(0, 500));

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        throw new Error(lastError);
      }

      const results = Array.isArray(data.result) ? data.result : [];

      const media: MediaItem[] = results
        .filter((item) => item.url)
        .map((item) => ({
          url: item.url,
          download_url: item.url,
          thumbnail: item.thumb,
          type: item.type === "video" ? "video" : "image",
          caption: item.caption || "",
          source_url: url,
        }));

      if (!media.length) {
        throw new Error("No downloadable media was found.");
      }

      return media;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "No downloadable media was found."
      ) {
        throw error;
      }

      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < 2) {
        console.warn(`Instagram extraction retry ${attempt + 1}:`, lastError);
        await new Promise((resolve) => setTimeout(resolve, 500));
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
  // Never cache resolver/CDN URLs. They are temporary signed URLs.
  return fetchInstagramMedia(normalizeInstagramUrl(url));
}
