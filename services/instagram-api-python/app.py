from __future__ import annotations

import asyncio
import json
import os
import re
import time
from collections import OrderedDict
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlsplit, urlunsplit

from curl_cffi.requests import AsyncSession
from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

MAX_MEDIA_ITEMS = 20
CACHE_TTL_SECONDS = 120
CACHE_MAX_ENTRIES = 5000
REQUEST_TIMEOUT_SECONDS = 8.0

MEDIA_MARKERS = (
    "xdt_api__v1__clips__home__connection_v2",
    "xdt_api__v1__clips__user__connection_v2",
    "xdt_api__v1__media__shortcode__web_info",
)


@dataclass
class CacheEntry:
    expires_at: float
    media: list[dict[str, Any]]


cache: OrderedDict[str, CacheEntry] = OrderedDict()
in_flight: dict[str, asyncio.Task[list[dict[str, Any]]]] = {}
session: AsyncSession | None = None


class ResolveRequest(BaseModel):
    url: HttpUrl


def normalize_instagram_url(raw: str) -> str:
    parsed = urlsplit(str(raw).strip())
    return urlunsplit(("https", "www.instagram.com", parsed.path.rstrip("/"), "", ""))


def is_supported_url(raw: str) -> bool:
    try:
        parsed = urlsplit(raw)
        if parsed.scheme != "https" or parsed.hostname not in {"instagram.com", "www.instagram.com"}:
            return False
        path = parsed.path.rstrip("/").lower()
        return bool(
            re.fullmatch(r"/(p|reel|reels|tv)/[^/]+", path)
            or re.fullmatch(r"/share/reel/[^/]+", path)
        )
    except Exception:
        return False


def is_reel_url(raw: str) -> bool:
    path = urlsplit(raw).path.rstrip("/").lower()
    return bool(re.fullmatch(r"/(reel|reels|tv)/[^/]+", path) or re.fullmatch(r"/share/reel/[^/]+", path))


def shortcode_from_url(raw: str) -> str:
    path = urlsplit(raw).path.rstrip("/")
    match = re.fullmatch(r"/(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)", path, re.IGNORECASE)
    if match:
        return match.group(1)
    match = re.fullmatch(r"/share/reel/([A-Za-z0-9_-]+)", path, re.IGNORECASE)
    if match:
        return match.group(1)
    raise ValueError("Unsupported Instagram URL")


def decode_url(value: str) -> str:
    return (
        value.replace("\\u0026", "&")
        .replace("\\u003D", "=")
        .replace("\\u002F", "/")
        .replace("\\/", "/")
        .replace("&amp;", "&")
        .strip()
    )


def is_https_url(value: Any) -> bool:
    if not isinstance(value, str) or not value:
        return False
    try:
        return urlsplit(value).scheme == "https"
    except Exception:
        return False


def find_balanced_json(text: str, start: int) -> str | None:
    opener = text[start] if 0 <= start < len(text) else ""
    closer = {"{": "}", "[": "]"}.get(opener)
    if not closer:
        return None

    depth = 0
    in_string = False
    escaped = False

    for index in range(start, len(text)):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
            continue

        if char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return text[start : index + 1]

    return None


def parse_marker_payload(html: str, marker: str) -> list[Any]:
    results: list[Any] = []
    offset = 0
    while True:
        marker_index = html.find(marker, offset)
        if marker_index < 0:
            break
        colon = html.find(":", marker_index + len(marker))
        if colon < 0:
            break

        value_start = -1
        for index in range(colon + 1, min(len(html), colon + 220)):
            if html[index] in "[{":
                value_start = index
                break
            if not html[index].isspace():
                break

        if value_start >= 0:
            raw = find_balanced_json(html, value_start)
            if raw:
                for candidate in (raw, raw.replace('\\"', '"').replace('\\\\', '\\')):
                    try:
                        results.append(json.loads(candidate))
                        break
                    except json.JSONDecodeError:
                        continue

        offset = marker_index + len(marker)
    return results


def pick_best_video(entries: Any) -> dict[str, Any] | None:
    if not isinstance(entries, list):
        return None
    valid: list[dict[str, Any]] = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("url"), str):
            continue
        url = decode_url(entry["url"])
        if not is_https_url(url):
            continue
        valid.append(
            {
                "url": url,
                "width": entry.get("width") if isinstance(entry.get("width"), int) else None,
                "height": entry.get("height") if isinstance(entry.get("height"), int) else None,
                "bandwidth": entry.get("bandwidth") if isinstance(entry.get("bandwidth"), (int, float)) else 0,
            }
        )
    if not valid:
        return None
    valid.sort(
        key=lambda item: (
            (item.get("width") or 0) * (item.get("height") or 0),
            item.get("bandwidth") or 0,
        ),
        reverse=True,
    )
    return valid[0]


def pick_best_image(entries: Any) -> dict[str, Any] | None:
    if not isinstance(entries, list):
        return None
    valid: list[dict[str, Any]] = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("url"), str):
            continue
        url = decode_url(entry["url"])
        if not is_https_url(url):
            continue
        valid.append(
            {
                "url": url,
                "width": entry.get("width") if isinstance(entry.get("width"), int) else None,
                "height": entry.get("height") if isinstance(entry.get("height"), int) else None,
            }
        )
    if not valid:
        return None
    valid.sort(key=lambda item: (item.get("width") or 0) * (item.get("height") or 0), reverse=True)
    return valid[0]


def media_from_object(item: dict[str, Any], source_url: str) -> list[dict[str, Any]]:
    images = item.get("image_versions2")
    candidates = images.get("candidates") if isinstance(images, dict) else None
    best_image = pick_best_image(candidates)

    best_video = pick_best_video(item.get("video_versions"))
    if best_video:
        caption = None
        raw_caption = item.get("caption")
        if isinstance(raw_caption, dict) and isinstance(raw_caption.get("text"), str):
            caption = raw_caption["text"]
        return [
            {
                "url": best_video["url"],
                "download_url": best_video["url"],
                "type": "video",
                "source_url": source_url,
                "thumbnail": best_image["url"] if best_image else None,
                "width": best_video.get("width"),
                "height": best_video.get("height"),
                "caption": caption,
            }
        ]

    if best_image:
        return [
            {
                "url": best_image["url"],
                "download_url": best_image["url"],
                "type": "image",
                "source_url": source_url,
                "width": best_image.get("width"),
                "height": best_image.get("height"),
            }
        ]

    return []


def extract_media_from_payload(payload: Any, shortcode: str, source_url: str) -> list[dict[str, Any]]:
    if not isinstance(payload, (dict, list)):
        return []

    objects: list[dict[str, Any]] = []
    exact: list[dict[str, Any]] = []
    seen: set[int] = set()

    def walk(value: Any, depth: int = 0) -> None:
        if depth > 10 or not isinstance(value, (dict, list)):
            return
        object_id = id(value)
        if object_id in seen:
            return
        seen.add(object_id)

        if isinstance(value, list):
            for child in value:
                walk(child, depth + 1)
            return

        code = value.get("code") if isinstance(value.get("code"), str) else ""
        short = value.get("shortcode") if isinstance(value.get("shortcode"), str) else ""
        has_media = isinstance(value.get("video_versions"), list) or isinstance(value.get("image_versions2"), dict) or isinstance(value.get("carousel_media"), list)
        if has_media:
            if code == shortcode or short == shortcode:
                exact.append(value)
            else:
                objects.append(value)
        for child in value.values():
            walk(child, depth + 1)

    walk(payload)
    ordered = exact + objects
    result: list[dict[str, Any]] = []
    urls: set[str] = set()
    reel = is_reel_url(source_url)

    for obj in ordered:
        carousel = obj.get("carousel_media")
        if isinstance(carousel, list) and carousel:
            children = carousel[:MAX_MEDIA_ITEMS]
        else:
            children = [obj]

        for child in children:
            if not isinstance(child, dict):
                continue
            for item in media_from_object(child, source_url):
                if not item.get("url") or item["url"] in urls:
                    continue
                if reel and item.get("type") != "video":
                    continue
                urls.add(item["url"])
                result.append(item)
                if len(result) >= MAX_MEDIA_ITEMS:
                    return result

        if reel and result:
            return [item for item in result if item.get("type") == "video"]

    return result


def parse_open_graph(html: str, source_url: str) -> list[dict[str, Any]]:
    def meta(name: str) -> str | None:
        patterns = (
            rf'<meta[^>]+property=["\']{re.escape(name)}["\'][^>]+content=["\']([^"\']+)["\']',
            rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']{re.escape(name)}["\']',
            rf'<meta[^>]+name=["\']{re.escape(name)}["\'][^>]+content=["\']([^"\']+)["\']',
        )
        for pattern in patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                return decode_url(match.group(1))
        return None

    video = meta("og:video:secure_url") or meta("og:video") or meta("og:video:url")
    image = meta("og:image") or meta("og:image:url")

    if is_reel_url(source_url):
        if not is_https_url(video):
            return []
        return [{"url": video, "download_url": video, "type": "video", "source_url": source_url, "thumbnail": image}]

    if is_https_url(video):
        return [{"url": video, "download_url": video, "type": "video", "source_url": source_url, "thumbnail": image}]
    if is_https_url(image):
        return [{"url": image, "download_url": image, "type": "image", "source_url": source_url}]
    return []


def parse_instagram_response(text: str, source_url: str) -> list[dict[str, Any]]:
    shortcode = shortcode_from_url(source_url)

    og = parse_open_graph(text, source_url)
    if og:
        return og

    try:
        payload = json.loads(text)
        media = extract_media_from_payload(payload, shortcode, source_url)
        if media:
            return media
    except json.JSONDecodeError:
        pass

    for marker in MEDIA_MARKERS:
        for payload in parse_marker_payload(text, marker):
            media = extract_media_from_payload(payload, shortcode, source_url)
            if media:
                return media

    # Final structured fallback: locate the shortcode and nearby explicit video_versions.
    positions = [
        text.find(f'"code":"{shortcode}"'),
        text.find(f'"shortcode":"{shortcode}"'),
    ]
    for position in positions:
        if position < 0:
            continue
        video_marker = text.find('"video_versions":', position)
        if 0 <= video_marker - position <= 30_000:
            array_start = text.find("[", video_marker)
            raw = find_balanced_json(text, array_start) if array_start >= 0 else None
            if raw:
                try:
                    best = pick_best_video(json.loads(raw))
                except json.JSONDecodeError:
                    best = None
                if best:
                    return [{"url": best["url"], "download_url": best["url"], "type": "video", "source_url": source_url, "width": best.get("width"), "height": best.get("height")}]

    return []


async def fetch_instagram(url: str) -> list[dict[str, Any]]:
    global session
    if session is None:
        session = AsyncSession(impersonate="chrome", max_clients=20, timeout=REQUEST_TIMEOUT_SECONDS)

    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Referer": "https://www.instagram.com/",
        "X-IG-App-ID": "936619743392459",
    }

    response = await session.get(
        url,
        headers=headers,
        allow_redirects=True,
        timeout=REQUEST_TIMEOUT_SECONDS,
        http_version="v2",
    )
    if response.status_code != 200:
        raise RuntimeError(f"Instagram returned HTTP {response.status_code}")

    media = parse_instagram_response(response.text, url)
    if media:
        return media[:MAX_MEDIA_ITEMS]

    # The private JSON representation is a useful second direct request. No third-party
    # downloader service is involved.
    parsed = urlsplit(url)
    json_url = urlunsplit((parsed.scheme, parsed.netloc, parsed.path, "__a=1&__d=dis", ""))
    response = await session.get(
        json_url,
        headers={**headers, "Accept": "application/json,text/plain,*/*"},
        allow_redirects=True,
        timeout=REQUEST_TIMEOUT_SECONDS,
        http_version="v2",
    )
    if response.status_code == 200:
        media = parse_instagram_response(response.text, url)
        if media:
            return media[:MAX_MEDIA_ITEMS]

    raise RuntimeError("Instagram did not expose downloadable public media")


def cached_get(key: str) -> list[dict[str, Any]] | None:
    item = cache.get(key)
    if not item:
        return None
    if item.expires_at <= time.monotonic():
        cache.pop(key, None)
        return None
    cache.move_to_end(key)
    return item.media


def cached_put(key: str, media: list[dict[str, Any]]) -> None:
    cache[key] = CacheEntry(time.monotonic() + CACHE_TTL_SECONDS, media)
    cache.move_to_end(key)
    now = time.monotonic()
    expired = [key for key, value in cache.items() if value.expires_at <= now]
    for old_key in expired:
        cache.pop(old_key, None)
    while len(cache) > CACHE_MAX_ENTRIES:
        cache.popitem(last=False)


async def resolve_with_dedupe(key: str) -> list[dict[str, Any]]:
    cached = cached_get(key)
    if cached is not None:
        return cached

    existing = in_flight.get(key)
    if existing:
        return await existing

    task = asyncio.create_task(fetch_instagram(key))
    in_flight[key] = task
    try:
        media = await task
        cached_put(key, media)
        return media
    finally:
        in_flight.pop(key, None)


@asynccontextmanager
async def lifespan(_: FastAPI):
    global session
    session = AsyncSession(impersonate="chrome", max_clients=20, timeout=REQUEST_TIMEOUT_SECONDS)
    yield
    if session is not None:
        session.close()
        session = None


app = FastAPI(title="InstaFetch Instagram API", version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGIN", "*").split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


def check_api_key(authorization: str | None) -> None:
    configured = os.getenv("INSTAGRAM_API_KEY", "").strip()
    if not configured:
        return
    if authorization != f"Bearer {configured}":
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/healthz")
async def healthz() -> dict[str, Any]:
    return {"ok": True, "service": "instafetch-instagram-api", "cache_entries": len(cache)}


@app.get("/v1/resolve")
async def resolve_get(
    url: str = Query(..., min_length=20),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    check_api_key(authorization)
    return await resolve(url)


@app.post("/v1/resolve")
async def resolve_post(
    body: ResolveRequest,
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    check_api_key(authorization)
    return await resolve(str(body.url))


async def resolve(raw_url: str) -> dict[str, Any]:
    if not is_supported_url(raw_url):
        raise HTTPException(status_code=400, detail="A public Instagram post, Reel, or video URL is required.")

    key = normalize_instagram_url(raw_url)
    started = time.perf_counter()
    was_cached = cached_get(key) is not None

    try:
        media = await asyncio.wait_for(resolve_with_dedupe(key), timeout=REQUEST_TIMEOUT_SECONDS + 1)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Instagram extraction timed out.") from None
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {
        "success": True,
        "media": media,
        "meta": {
            "cached": was_cached,
            "duration_ms": round((time.perf_counter() - started) * 1000),
        },
    }
