import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { extractInstagramMedia } from "@/lib/instagram/extract";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.headers.get("x-real-ip") || "unknown";
}

function isSupportedPath(url: URL): boolean {
  const pathname = url.pathname.replace(/\/+$/, "").toLowerCase();
  return (
    /^\/(p|reel|tv|reels)\/[^/]+$/.test(pathname) ||
    /^\/share\/reel\/[^/]+$/.test(pathname)
  );
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const rate = checkRateLimit(`extract:${getClientIp(request)}`);

  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment and try again.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
          "X-Request-Id": requestId,
        },
      }
    );
  }

  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Please enter an Instagram URL." },
        { status: 400, headers: { "X-Request-Id": requestId } }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(rawUrl.trim());
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL." },
        { status: 400, headers: { "X-Request-Id": requestId } }
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    if (
      parsedUrl.protocol !== "https:" ||
      (hostname !== "instagram.com" && hostname !== "www.instagram.com")
    ) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL." },
        { status: 400, headers: { "X-Request-Id": requestId } }
      );
    }

    if (!isSupportedPath(parsedUrl)) {
      return NextResponse.json(
        {
          error:
            "Paste a public Instagram post, Reel, or video URL. Profile and private-account URLs are not supported.",
        },
        { status: 400, headers: { "X-Request-Id": requestId } }
      );
    }

    const startedAt = Date.now();
    console.info("Instagram extraction started", {
      requestId,
      path: parsedUrl.pathname,
    });

    const media = await extractInstagramMedia(parsedUrl.toString());

    const durationMs = Date.now() - startedAt;
    console.info("Instagram extraction completed", {
      requestId,
      mediaCount: media.length,
      durationMs,
    });

    if (!media.length) {
      return NextResponse.json(
        { error: "No downloadable public media was found." },
        { status: 404, headers: { "X-Request-Id": requestId } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        media,
        meta: {
          requestId,
          mediaCount: media.length,
          durationMs,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      }
    );
  } catch (error) {
    console.error("INSTAGRAM EXTRACTION ERROR", {
      requestId,
      error,
    });

    const errorMessage = error instanceof Error ? error.message : String(error);
    const isConfigurationError =
      errorMessage.includes("APIFY_API_TOKEN") ||
      errorMessage.includes("R2 object storage is not configured");

    return NextResponse.json(
      {
        error: isConfigurationError
          ? "The downloader is temporarily unavailable because its server configuration is incomplete."
          : "We could not prepare that Instagram media. Check that the post is public and try again.",
        requestId,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      }
    );
  }
}
