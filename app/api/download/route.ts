import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { resolveInstagramDirect, type MediaItem } from "@/lib/instagram/direct";
import { checkRateLimit } from "@/lib/rate-limit";

const FIRST_PARTY_TIMEOUT_MS = 16_000;
const DIRECT_FALLBACK_TIMEOUT_MS = 10_000;

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

function firstPartyEndpoints(): string[] {
  const endpoints: string[] = [];
  const configured = process.env.INSTAGRAM_API_URL?.trim();
  if (configured) endpoints.push(configured.replace(/\/+$/, ""));

  // Local development should work without requiring a .env.local entry.
  if (process.env.NODE_ENV !== "production" && !endpoints.includes("http://127.0.0.1:8787")) {
    endpoints.push("http://127.0.0.1:8787");
  }

  return endpoints;
}

async function resolveWithFirstPartyApi(url: string): Promise<MediaItem[] | null> {
  const endpoints = firstPartyEndpoints();
  if (!endpoints.length) return null;

  for (const base of endpoints) {
    const endpoint = new URL(`${base}/v1/resolve`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FIRST_PARTY_TIMEOUT_MS);

    try {
      const headers: HeadersInit = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const apiKey = process.env.INSTAGRAM_API_KEY?.trim();
      if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

      const response = await fetch(endpoint.toString(), {
        method: "POST",
        headers,
        body: JSON.stringify({ url }),
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
    } catch (error) {
      console.warn("First-party Instagram endpoint failed", {
        endpoint: base,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}

async function resolveDirectFallback(url: string): Promise<MediaItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DIRECT_FALLBACK_TIMEOUT_MS);

  try {
    return await Promise.race([
      resolveInstagramDirect(url),
      new Promise<MediaItem[]>((_, reject) => {
        controller.signal.addEventListener("abort", () => {
          reject(new Error("Direct Instagram fallback timed out."));
        });
      }),
    ]);
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
      },
    );
  }

  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Please enter an Instagram URL." },
        { status: 400, headers: { "X-Request-Id": requestId } },
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl.trim());
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL." },
        { status: 400, headers: { "X-Request-Id": requestId } },
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      parsedUrl.protocol !== "https:" ||
      (hostname !== "instagram.com" && hostname !== "www.instagram.com")
    ) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL." },
        { status: 400, headers: { "X-Request-Id": requestId } },
      );
    }

    if (!isSupportedPath(parsedUrl)) {
      return NextResponse.json(
        {
          error:
            "Paste a public Instagram post, Reel, or video URL. Profile and private-account URLs are not supported.",
        },
        { status: 400, headers: { "X-Request-Id": requestId } },
      );
    }

    const startedAt = Date.now();
    let media: MediaItem[] | null = null;
    let source = "direct-fallback";

    media = await resolveWithFirstPartyApi(parsedUrl.toString());
    if (media) source = "first-party-api";

    if (!media) {
      try {
        media = await resolveDirectFallback(parsedUrl.toString());
      } catch (error) {
        console.error("INSTAGRAM DIRECT FALLBACK ERROR", {
          requestId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const durationMs = Date.now() - startedAt;

    if (!media?.length) {
      return NextResponse.json(
        {
          error:
            "Instagram could not expose this public media right now. The extractor received no usable media URL.",
          requestId,
        },
        { status: 502, headers: { "X-Request-Id": requestId } },
      );
    }

    console.info("INSTAGRAM RESULT", {
      requestId,
      source,
      mediaCount: media.length,
      hasCaption: media.some((item) => Boolean(item.caption)),
      durationMs,
    });

    return NextResponse.json(
      {
        success: true,
        media,
        meta: {
          requestId,
          mediaCount: media.length,
          durationMs,
          source,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      },
    );
  } catch (error) {
    console.error("INSTAGRAM EXTRACTION ERROR", {
      requestId,
      error,
    });

    return NextResponse.json(
      {
        error: "We could not prepare that Instagram media. Check that the post is public and try again.",
        requestId,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      },
    );
  }
}
