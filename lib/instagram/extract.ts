export interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
}

interface ApifyItem {
  status?: string;
  input_url?: string;
  canonical_url?: string;
  source_url?: string;
  shortcode?: string;
  media_type?: "photo" | "video" | string;
  media_index?: number;
  carousel_count?: number | null;
  download_url?: string;
  thumbnail_url?: string;
  username?: string;
  caption?: string;
  width?: number;
  height?: number;
  file_extension?: string;
}

export async function extractInstagramMedia(
  url: string
): Promise<MediaItem[]> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured.");
  }

  console.log("Calling Apify Instagram Downloader...");

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
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("APIFY ERROR:", responseText);

    throw new Error(
      `Instagram extraction failed (${response.status}).`
    );
  }

  let results: ApifyItem[];

  try {
    results = JSON.parse(responseText);
  } catch {
    console.error("INVALID APIFY RESPONSE:", responseText);
    throw new Error("Invalid response from Instagram extractor.");
  }

  console.log("APIFY RESULTS:", results);

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No downloadable media was found.");
  }

  const media: MediaItem[] = results
    .filter((item) => item.download_url)
    .sort(
      (a, b) =>
        (a.media_index ?? 0) -
        (b.media_index ?? 0)
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
    }));

  if (!media.length) {
    throw new Error("No downloadable media was found.");
  }

  return media;
}