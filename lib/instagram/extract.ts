import { unstable_cache } from "next/cache";
import { resolveInstagramDirect, MediaItem } from "./direct";

const REMOTE_TIMEOUT_MS = 7500;
const MAX_MEDIA_ITEMS = 20;

function normalizeInstagramUrl(url: string): string {
  const parsed = new URL(url.trim());
  parsed.protocol = "https:";
  parsed.hostname = "www.instagram.com";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

function isInstagramUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return parsed.protocol === "https:" && (host === "instagram.com" || host === "www.instagram.com");
  } catch {
    return false;
  }
}

function apiEndpoint(): string | null {
  const raw = process.env.INSTAGRAM_API_URL?.trim();
  if (!raw) return null;
  return raw.endsWith("/v1/resolve") ? raw : `${raw.replace(/\/+$/, "")}/v1/resolve`;
}

async function fetchFirstPartyApi(url: string): Promise<MediaItem[]> {
  const endpoint = apiEndpoint();
  if (!endpoint) throw new Error("INSTAGRAM_API_URL is not configured.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (process.env.INSTAGRAM_API_KEY) {
      headers.Authorization = `Bearer ${process.env.INSTAGRAM_API_KEY}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ url }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`First-party API returned ${response.status}.`);
    const payload = (await response.json()) as { success?: boolean; media?: MediaItem[] };
    const media = Array.isArray(payload.media) ? payload.media : [];
    if (!payload.success || !media.length) throw new Error("First-party API returned no media.");
    return media.slice(0, MAX_MEDIA_ITEMS);
  } finally {
    clearTimeout(timer);
  }
}

async function uncachedExtractInstagramMedia(url: string): Promise<MediaItem[]> {
  try {
    return await fetchFirstPartyApi(url);
  } catch (error) {
    console.warn("First-party Instagram API failed; trying direct extraction:", error);
  }

  return resolveInstagramDirect(url);
}

export async function extractInstagramMedia(url: string): Promise<MediaItem[]> {
  const normalized = normalizeInstagramUrl(url);
  if (!isInstagramUrl(normalized)) throw new Error("Only public Instagram URLs are supported.");

  const cachedExtractor = unstable_cache(
    () => uncachedExtractInstagramMedia(normalized),
    ["instagram-media-v15", normalized],
    { revalidate: 120 }
  );

  return cachedExtractor();
}
