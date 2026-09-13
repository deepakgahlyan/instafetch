import { NextResponse } from "next/server";
import { extractInstagramMedia } from "@/lib/instagram/extract";

function getExtension(contentType: string, url: string): string {
  const type = contentType.toLowerCase();

  if (type.includes("video/mp4")) return "mp4";
  if (type.includes("video/webm")) return "webm";
  if (type.includes("video/quicktime")) return "mov";
  if (type.includes("image/jpeg")) return "jpg";
  if (type.includes("image/jpg")) return "jpg";
  if (type.includes("image/png")) return "png";
  if (type.includes("image/webp")) return "webp";
  if (type.includes("image/gif")) return "gif";

  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (match?.[1]) return match[1].toLowerCase();
  } catch {
    // Ignore extension lookup failures.
  }

  return "bin";
}

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  const allowedHosts = [
    "api.apify.com",
    "r2.cloudflarestorage.com",
    "cdninstagram.com",
    "instagram.com",
    "fbcdn.net",
    "fbsbx.com",
    "snapcdn.app",
  ];

  return allowedHosts.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
}

async function fetchMedia(mediaUrl: string): Promise<Response> {
  return fetch(mediaUrl, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
      Accept: "*/*",
      Referer: "https://www.instagram.com/",
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(90000),
  });
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    let mediaUrl = requestUrl.searchParams.get("url");
    const sourceUrl = requestUrl.searchParams.get("source");
    const requestedIndex = Math.max(
      0,
      Number.parseInt(requestUrl.searchParams.get("index") || "0", 10) || 0
    );

    // Normal downloads use the storage URL returned during the initial fetch.
    // We deliberately do NOT scrape Instagram again on every click.
    if (!mediaUrl && sourceUrl) {
      let parsedSource: URL;
      try {
        parsedSource = new URL(sourceUrl);
      } catch {
        return NextResponse.json(
          { error: "Invalid Instagram source URL." },
          { status: 400 }
        );
      }

      const sourceHost = parsedSource.hostname.toLowerCase();
      if (
        parsedSource.protocol !== "https:" ||
        (sourceHost !== "instagram.com" && sourceHost !== "www.instagram.com")
      ) {
        return NextResponse.json(
          { error: "Invalid Instagram source URL." },
          { status: 400 }
        );
      }

      const freshMedia = await extractInstagramMedia(sourceUrl);
      const selected = freshMedia[requestedIndex] || freshMedia[0];
      mediaUrl = selected?.download_url || selected?.url || null;
    }

    if (!mediaUrl) {
      return NextResponse.json(
        { error: "Missing download URL." },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(mediaUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid download URL." },
        { status: 400 }
      );
    }

    if (parsedUrl.protocol !== "https:" || !isAllowedHost(parsedUrl.hostname)) {
      console.error("Rejected media host:", parsedUrl.hostname);
      return NextResponse.json(
        { error: "Invalid download source." },
        { status: 400 }
      );
    }

    const response = await fetchMedia(mediaUrl);

    if (!response.ok) {
      console.error(
        "Media fetch failed:",
        response.status,
        response.statusText,
        parsedUrl.hostname
      );

      if (sourceUrl && parsedUrl.hostname !== "api.apify.com" && !parsedUrl.hostname.endsWith("r2.cloudflarestorage.com")) {
        const freshMedia = await extractInstagramMedia(sourceUrl);
        const selected = freshMedia[requestedIndex] || freshMedia[0];
        const freshUrl = selected?.download_url || selected?.url;

        if (freshUrl && freshUrl !== mediaUrl) {
          const retryResponse = await fetchMedia(freshUrl);
          if (retryResponse.ok) {
            return buildDownloadResponse(retryResponse, freshUrl, requestedIndex);
          }
        }
      }

      return NextResponse.json(
        { error: "Unable to fetch media. Please try the download again." },
        { status: 502 }
      );
    }

    return buildDownloadResponse(response, mediaUrl, requestedIndex);
  } catch (error) {
    console.error("MEDIA DOWNLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to download media. Please try again." },
      { status: 500 }
    );
  }
}

function buildDownloadResponse(
  response: Response,
  mediaUrl: string,
  index: number
): NextResponse {
  const contentType =
    response.headers.get("content-type") || "application/octet-stream";
  const extension = getExtension(contentType, mediaUrl);
  const filename = `instafetch-media-${index + 1}.${extension}`;

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );
  headers.set("Cache-Control", "no-store, private");
  headers.set("X-Content-Type-Options", "nosniff");

  const contentLength = response.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(response.body, {
    status: 200,
    headers,
  });
}
