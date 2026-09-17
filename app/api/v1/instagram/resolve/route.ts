import { resolveInstagramDirect, MediaItem } from "@/lib/instagram/direct";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

function requestId(): string {
  return crypto.randomUUID();
}

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function isSupportedInstagramUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (host !== "instagram.com" && host !== "www.instagram.com")) {
      return false;
    }
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    return /^\/(p|reel|reels|tv)\/[^/]+$/.test(path) || /^\/share\/reel\/[^/]+$/.test(path);
  } catch {
    return false;
  }
}

function normalizeInstagramUrl(raw: string): string {
  const url = new URL(raw.trim());
  url.protocol = "https:";
  url.hostname = "www.instagram.com";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function json(
  body: unknown,
  status: number,
  requestIdValue: string,
  cacheControl = "no-store"
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "X-Request-Id": requestIdValue,
    },
  });
}

async function resolve(request: Request, inputUrl: string): Promise<Response> {
  const id = requestId();
  const rate = checkRateLimit(`edge:${getClientIp(request)}`);

  if (!rate.allowed) {
    return json(
      { success: false, error: "Too many requests. Please wait a moment and try again.", retryAfterSeconds: rate.retryAfterSeconds, requestId: id },
      429,
      id
    );
  }

  if (!inputUrl || !isSupportedInstagramUrl(inputUrl)) {
    return json(
      { success: false, error: "A public Instagram post or Reel URL is required.", requestId: id },
      400,
      id
    );
  }

  const normalized = normalizeInstagramUrl(inputUrl);
  const startedAt = Date.now();

  try {
    const media: MediaItem[] = await resolveInstagramDirect(normalized);
    return json(
      {
        success: true,
        media,
        meta: {
          requestId: id,
          durationMs: Date.now() - startedAt,
          mediaCount: media.length,
        },
      },
      200,
      id,
      request.method === "GET"
        ? "public, s-maxage=120, stale-while-revalidate=300"
        : "no-store"
    );
  } catch (error) {
    console.error("FIRST_PARTY_INSTAGRAM_API_ERROR", {
      requestId: id,
      error: error instanceof Error ? error.message : String(error),
    });

    return json(
      {
        success: false,
        error: "We could not prepare that Instagram media. Check that the post is public and try again.",
        requestId: id,
      },
      502,
      id
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url).searchParams.get("url") || "";
  return resolve(request, url);
}

export async function POST(request: Request): Promise<Response> {
  let inputUrl = "";
  try {
    const body = (await request.json()) as { url?: unknown };
    if (typeof body.url === "string") inputUrl = body.url;
  } catch {
    // Let validation produce the correct response.
  }
  return resolve(request, inputUrl);
}
