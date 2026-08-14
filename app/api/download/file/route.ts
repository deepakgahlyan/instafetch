import { NextResponse } from "next/server";

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

    if (match?.[1]) {
      return match[1].toLowerCase();
    }
  } catch {
    // Ignore invalid extension lookup
  }

  return "bin";
}

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  const allowedHosts = [
    "dl.snapcdn.app",
    "cdninstagram.com",
    "instagram.com",
    "fbcdn.net",
    "fbsbx.com",
  ];

  return allowedHosts.some(
    (allowed) =>
      host === allowed || host.endsWith(`.${allowed}`)
  );
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const mediaUrl = requestUrl.searchParams.get("url");

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
      console.error(
        "Rejected media host:",
        parsedUrl.hostname
      );

      return NextResponse.json(
        { error: "Invalid download source." },
        { status: 400 }
      );
    }

    console.log("Downloading media from:", mediaUrl);

    const response = await fetch(mediaUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
        Accept: "*/*",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Media fetch failed:",
        response.status,
        response.statusText
      );

      return NextResponse.json(
        {
          error: "Unable to fetch media.",
          status: response.status,
        },
        { status: 502 }
      );
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    const extension = getExtension(
      contentType,
      mediaUrl
    );

    const filename = `instafetch-media.${extension}`;

    const headers = new Headers();

    headers.set("Content-Type", contentType);

    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    const contentLength =
      response.headers.get("content-length");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    headers.set("Cache-Control", "no-store");

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(
      "MEDIA DOWNLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to download media.",
      },
      { status: 500 }
    );
  }
}