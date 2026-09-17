import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { extractInstagramMedia, type MediaItem } from "@/lib/instagram/extract";
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

async function resolveWithFirstPartyApi(url: string): Promise<MediaItem[] | null> {
  const configured = process.env.INSTAGRAM_API_URL?.trim();
  if (!configured) return null;

  const base = configured.replace(/\/+$/, "");
  const endpoint = new URL(`${base}/v1/resolve`);
  endpoint.searchParams.set("url", url);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18_000);

  try {
    const headers: HeadersInit = { Accept: "application/json" };
    const apiKey = process.env.INSTAGRAM_API_KEY?.trim();
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`First-party API returned ${response.status}.`);
    }

    const data = (await response.json()) as {
      success?: boolean;
      media?: MediaItem[];
    };

    if (!data.success || !Array.isArray(data.media) || data.media.length === 0) {
      throw new Error("First-party API returned no media.");
    }

    return data.media;
  } finally {
    clearTimeout(timer);
  }
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
    let media: MediaItem[] | null = null;

    try {
      media = await resolveWithFirstPartyApi(parsedUrl.toString());
      if (media) {
        console.info("First-party Instagram API completed", {
          requestId,
          mediaCount: media.length,
          durationMs: Date.now() - startedAt,
        });
      }
    } catch (error) {
      console.warn("First-party Instagram API failed; using local fallback", {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (!media) {
      media = await extractInstagramMedia(parsedUrl.toString());
    }

    const durationMs = Date.now() - startedAt;

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
          source:
            process.env.INSTAGRAM_API_URL
              ? "first-party-api-or-fallback"
              : "local-extractor",
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
    const isConfigurationError = errorMessage.includes("APIFY_API_TOKEN");

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
