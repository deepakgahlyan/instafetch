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
    // Ignore invalid extension lookup.
  }

  return "bin";
}

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  const allowedHosts = [
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

async function fetchMedia(mediaUrl: string, sourceUrl?: string): Promise<Response> {
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    Accept: "*/*",
    Referer: "https://www.instagram.com/",
  };

  let response = await fetch(mediaUrl, {
    method: "GET",
    headers,
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });

  // Instagram CDN URLs are signed and may expire. If the first fetch fails,
  // resolve the original Instagram URL again and retry with a fresh CDN URL.
  if (!response.ok && sourceUrl) {
    console.warn("Stale Instagram CDN URL; resolving a fresh media URL.");
    const freshMedia = await extractInstagramMedia(sourceUrl);

    if (freshMedia.length) {
      const freshUrl = freshMedia[0]?.download_url || freshMedia[0]?.url;
      if (freshUrl && freshUrl !== mediaUrl) {
        response = await fetch(freshUrl, {
          method: "GET",
          headers,
          redirect: "follow",
          cache: "no-store",
          signal: AbortSignal.timeout(60000),
        });
      }
    }
  }

  return response;
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    let mediaUrl = requestUrl.searchParams.get("url");
    const sourceUrl = requestUrl.searchParams.get("source");
    const requestedIndex = Number.parseInt(
      requestUrl.searchParams.get("index") || "0",
      10
    );

    // Preferred path: re-run extraction from the original Instagram URL so
    // the download always uses a fresh signed CDN URL.
    if (sourceUrl) {
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
        (sourceHost !== "instagram.com" &&
          sourceHost !== "www.instagram.com")
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

    if (parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { error: "Invalid download source." },
        { status: 400 }
      );
    }

    if (!isAllowedHost(parsedUrl.hostname)) {
      console.error("Rejected media host:", parsedUrl.hostname);
      return NextResponse.json(
        { error: "Invalid download source." },
        { status: 400 }
      );
    }

    console.log("Downloading media from:", parsedUrl.hostname);

    const response = await fetchMedia(mediaUrl, sourceUrl || undefined);

    if (!response.ok) {
      console.error(
        "Media fetch failed:",
        response.status,
        response.statusText
      );

      return NextResponse.json(
        { error: "Unable to fetch media. Please try the download again." },
        { status: 502 }
      );
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const extension = getExtension(contentType, mediaUrl);
    const filename = `instafetch-media.${extension}`;

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    const contentLength = response.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    headers.set("Cache-Control", "no-store");

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("MEDIA DOWNLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to download media. Please try again." },
      { status: 500 }
    );
  }
}
