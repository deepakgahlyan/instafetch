import { NextResponse } from "next/server";
import { extractInstagramMedia } from "@/lib/instagram/extract";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please enter an Instagram URL." },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL." },
        { status: 400 }
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    if (
      hostname !== "instagram.com" &&
      hostname !== "www.instagram.com"
    ) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL." },
        { status: 400 }
      );
    }

    console.log("Instagram extraction started:", url);

    const media = await extractInstagramMedia(url);

    console.log(
      `Instagram extraction returned ${media.length} media item(s).`
    );

    if (!media.length) {
      return NextResponse.json(
        { error: "No downloadable media was found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error(
      "INSTAGRAM EXTRACTION ERROR:",
      error
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    return NextResponse.json(
      {
        error: errorMessage.includes(
          "APIFY_API_TOKEN"
        )
          ? "Instagram downloader is not configured."
          : "Instagram extraction failed.",
      },
      { status: 500 }
    );
  }
}