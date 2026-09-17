import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { resolveInstagramDirect, MediaItem } from "../../lib/instagram/direct";

const PORT = Number(process.env.PORT || 8787);
const CACHE_TTL_MS = 120_000;
const MAX_CACHE_ENTRIES = 2_000;
const REQUEST_TIMEOUT_MS = 8_000;

type CacheEntry = { expiresAt: number; media: MediaItem[] };

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<MediaItem[]>>();

function normalizeKey(raw: string): string {
  const url = new URL(raw.trim());
  url.protocol = "https:";
  url.hostname = "www.instagram.com";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function isSupportedUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (host !== "instagram.com" && host !== "www.instagram.com")) return false;
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    return /^\/(p|reel|reels|tv)\/[^/]+$/.test(path) || /^\/share\/reel\/[^/]+$/.test(path);
  } catch {
    return false;
  }
}

function evictExpired(): void {
  const now = Date.now();
  for (const [key, value] of cache) {
    if (value.expiresAt <= now) cache.delete(key);
  }
  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value as string | undefined;
    if (!oldest) break;
    cache.delete(oldest);
  }
}

function getCached(key: string): MediaItem[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  cache.delete(key);
  cache.set(key, entry);
  return entry.media;
}

function putCached(key: string, media: MediaItem[]): void {
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, media });
  evictExpired();
}

async function resolveWithDedupe(key: string): Promise<MediaItem[]> {
  const cached = getCached(key);
  if (cached) return cached;

  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = resolveInstagramDirect(key)
    .then((media) => {
      putCached(key, media);
      return media;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

function writeJson(res: import("node:http").ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Powered-By", "InstaFetch Instagram API");
  res.end(body);
}

function authorized(req: import("node:http").IncomingMessage): boolean {
  const configured = process.env.INSTAGRAM_API_KEY?.trim();
  if (!configured) return true;
  const header = req.headers.authorization || "";
  return header === `Bearer ${configured}`;
}

const server = createServer(async (req, res) => {
  const requestId = randomUUID();
  const method = req.method || "GET";
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("X-Request-Id", requestId);

  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (requestUrl.pathname === "/healthz") {
    writeJson(res, 200, { ok: true, service: "instafetch-instagram-api", cacheEntries: cache.size });
    return;
  }

  if (requestUrl.pathname !== "/v1/resolve") {
    writeJson(res, 404, { success: false, error: "Not found", requestId });
    return;
  }

  if (!authorized(req)) {
    writeJson(res, 401, { success: false, error: "Unauthorized", requestId });
    return;
  }

  let inputUrl = requestUrl.searchParams.get("url") || "";

  if (method === "POST") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as { url?: unknown };
      if (typeof body.url === "string") inputUrl = body.url;
    } catch {
      // GET-style query parameter remains available.
    }
  }

  if (!inputUrl || !isSupportedUrl(inputUrl)) {
    writeJson(res, 400, {
      success: false,
      error: "A public Instagram post or Reel URL is required.",
      requestId,
    });
    return;
  }

  let key: string;
  try {
    key = normalizeKey(inputUrl);
  } catch {
    writeJson(res, 400, { success: false, error: "Invalid Instagram URL.", requestId });
    return;
  }

  const startedAt = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const media = await Promise.race([
      resolveWithDedupe(key),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Resolver timeout.")), REQUEST_TIMEOUT_MS);
      }),
    ]).finally(() => clearTimeout(timer));

    writeJson(res, 200, {
      success: true,
      media,
      meta: {
        requestId,
        cached: getCached(key) !== null,
        durationMs: Date.now() - startedAt,
      },
    });
  } catch (error) {
    writeJson(res, 502, {
      success: false,
      error: error instanceof Error ? error.message : "Instagram extraction failed.",
      requestId,
    });
  }
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`InstaFetch Instagram API listening on :${PORT}`);
});
