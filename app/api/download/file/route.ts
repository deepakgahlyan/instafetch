import { NextResponse } from "next/server";

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

    const parsedUrl = new URL(mediaUrl);

    if (parsedUrl.hostname !== "dl.snapcdn.app") {
      return NextResponse.json(
        { error: "Invalid download source." },
        { status: 400 }
      );
    }

    const response = await fetch(mediaUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch media." },
        { status: 502 }
      );
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    const contentLength =
      response.headers.get("content-length");

    const headers = new Headers();

    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      'attachment; filename="instafetch-media.mp4"'
    );

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("MEDIA DOWNLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to download media." },
      { status: 500 }
    );
  }
}