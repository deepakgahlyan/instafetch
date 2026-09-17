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

MAX_MEDIA_ITEMS = 50
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
        return bool(re.fullmatch(r"/(p|reel|reels|tv)/[^/]+", path) or re.fullmatch(r"/share/reel/[^/]+", path))
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
    return value.replace("\\u0026", "&").replace("\\u003D", "=").replace("\\u002F", "/").replace("\\/", "/").replace("&amp;", "&").strip()

def is_https_url(value: Any) -> bool:
    if not isinstance(value, str) or not value:
        return False
    try:
        return urlsplit(value).scheme == "https"
    except Exception:
        return False

def find_balanced_json(text: str, start: int) -> str | None:
    if start < 0 or start >= len(text):
        return None
    opener = text[start]
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
        elif char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return text[start:index + 1]
    return None

def parse_marker_payloads(html: str, marker: str) -> list[Any]:
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
        for index in range(colon + 1, min(len(html), colon + 300)):
            char = html[index]
            if char in "[{":
                value_start = index
                break
            if not char.isspace() and char not in '"':
                break
        if value_start >= 0:
            raw = find_balanced_json(html, value_start)
            if raw:
                for candidate in (raw, raw.replace('\\"', '"').replace('\\\\', '\\')):
                    try:
                        results.append(json.loads(candidate))
                        break
                    except json.JSONDecodeError:
                        pass
        offset = marker_index + len(marker)
    return results

def pick_best_video(entries: Any) -> dict[str, Any] | None:
    if not isinstance(entries, list):
        return None
    valid = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("url"), str):
            continue
        url = decode_url(entry["url"])
        if not is_https_url(url):
            continue
        valid.append({"url": url, "width": entry.get("width") if isinstance(entry.get("width"), int) else None, "height": entry.get("height") if isinstance(entry.get("height"), int) else None, "bandwidth": entry.get("bandwidth") if isinstance(entry.get("bandwidth"), (int, float)) else 0})
    if not valid:
        return None
    valid.sort(key=lambda x: ((x.get("width") or 0) * (x.get("height") or 0), x.get("bandwidth") or 0), reverse=True)
    return valid[0]

def pick_best_image(entries: Any) -> dict[str, Any] | None:
    if not isinstance(entries, list):
        return None
    valid = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("url"), str):
            continue
        url = decode_url(entry["url"])
        if not is_https_url(url):
            continue
        valid.append({"url": url, "width": entry.get("width") if isinstance(entry.get("width"), int) else None, "height": entry.get("height") if isinstance(entry.get("height"), int) else None})
    if not valid:
        return None
    valid.sort(key=lambda x: (x.get("width") or 0) * (x.get("height") or 0), reverse=True)
    return valid[0]

def caption_from_object(item: dict[str, Any]) -> str | None:
    raw = item.get("caption")
    if isinstance(raw, str) and raw.strip():
        return raw.strip()
    if isinstance(raw, dict) and isinstance(raw.get("text"), str) and raw["text"].strip():
        return raw["text"].strip()
    edge = item.get("edge_media_to_caption")
    if isinstance(edge, dict) and isinstance(edge.get("edges"), list):
        for entry in edge["edges"]:
            if isinstance(entry, dict) and isinstance(entry.get("node"), dict):
                text = entry["node"].get("text")
                if isinstance(text, str) and text.strip():
                    return text.strip()
    return None

def dimensions(item: dict[str, Any]) -> tuple[Any, Any]:
    dims = item.get("dimensions")
    if isinstance(dims, dict):
        return dims.get("width"), dims.get("height")
    return item.get("original_width"), item.get("original_height")

def media_from_object(item: dict[str, Any], source_url: str, inherited_caption: str | None = None) -> list[dict[str, Any]]:
    caption = caption_from_object(item) or inherited_caption
    images = item.get("image_versions2")
    candidates = images.get("candidates") if isinstance(images, dict) else None
    best_image = pick_best_image(candidates)
    best_video = pick_best_video(item.get("video_versions"))
    width, height = dimensions(item)

    if best_video:
        return [{"url": best_video["url"], "download_url": best_video["url"], "type": "video", "source_url": source_url, "thumbnail": best_image["url"] if best_image else None, "width": best_video.get("width"), "height": best_video.get("height"), "caption": caption}]

    video_url = item.get("video_url")
    if isinstance(video_url, str):
        video_url = decode_url(video_url)
        if is_https_url(video_url):
            thumb = item.get("display_url") or item.get("thumbnail_src")
            thumb = decode_url(thumb) if isinstance(thumb, str) else None
            return [{"url": video_url, "download_url": video_url, "type": "video", "source_url": source_url, "thumbnail": thumb if is_https_url(thumb) else None, "width": width, "height": height, "caption": caption}]

    display_url = item.get("display_url") or item.get("thumbnail_src")
    if isinstance(display_url, str):
        display_url = decode_url(display_url)
        if is_https_url(display_url):
            return [{"url": display_url, "download_url": display_url, "type": "image", "source_url": source_url, "width": width, "height": height, "caption": caption}]

    if best_image:
        return [{"url": best_image["url"], "download_url": best_image["url"], "type": "image", "source_url": source_url, "width": best_image.get("width"), "height": best_image.get("height"), "caption": caption}]
    return []

def child_media_objects(obj: dict[str, Any]) -> list[dict[str, Any]]:
    carousel = obj.get("carousel_media")
    if isinstance(carousel, list) and carousel:
        return [x for x in carousel[:MAX_MEDIA_ITEMS] if isinstance(x, dict)]
    sidecar = obj.get("edge_sidecar_to_children")
    if isinstance(sidecar, dict):
        edges = sidecar.get("edges")
        if isinstance(edges, list):
            nodes = [e.get("node") for e in edges[:MAX_MEDIA_ITEMS] if isinstance(e, dict) and isinstance(e.get("node"), dict)]
            if nodes:
                return nodes
        nodes = sidecar.get("nodes")
        if isinstance(nodes, list):
            return [n for n in nodes[:MAX_MEDIA_ITEMS] if isinstance(n, dict)]
    children = obj.get("children")
    if isinstance(children, list):
        return [x for x in children[:MAX_MEDIA_ITEMS] if isinstance(x, dict)]
    return [obj]

def collect_media_objects(root: Any, shortcode: str) -> list[dict[str, Any]]:
    exact: list[dict[str, Any]] = []
    generic: list[dict[str, Any]] = []
    seen: set[int] = set()
    def walk(value: Any, depth: int = 0) -> None:
        if depth > 14 or not isinstance(value, (dict, list)):
            return
        ident = id(value)
        if ident in seen:
            return
        seen.add(ident)
        if isinstance(value, list):
            for child in value:
                walk(child, depth + 1)
            return
        code = value.get("code") if isinstance(value.get("code"), str) else ""
        short = value.get("shortcode") if isinstance(value.get("shortcode"), str) else ""
        has_media = isinstance(value.get("video_versions"), list) or isinstance(value.get("image_versions2"), dict) or isinstance(value.get("carousel_media"), list) or isinstance(value.get("edge_sidecar_to_children"), dict) or isinstance(value.get("video_url"), str) or isinstance(value.get("display_url"), str)
        if has_media:
            (exact if code == shortcode or short == shortcode else generic).append(value)
        for child in value.values():
            walk(child, depth + 1)
    walk(root)
    return exact + generic

def extract_media_from_payload(payload: Any, shortcode: str, source_url: str) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    urls: set[str] = set()
    reel = is_reel_url(source_url)
    for obj in collect_media_objects(payload, shortcode):
        parent_caption = caption_from_object(obj)
        for child in child_media_objects(obj):
            for media in media_from_object(child, source_url, parent_caption):
                url = media.get("url")
                if not isinstance(url, str) or not url or url in urls:
                    continue
                if reel and media.get("type") != "video":
                    continue
                urls.add(url)
                result.append(media)
                if len(result) >= MAX_MEDIA_ITEMS:
                    return result
    return [x for x in result if not reel or x.get("type") == "video"][:MAX_MEDIA_ITEMS]

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
    description = meta("og:description") or meta("description")
    if is_reel_url(source_url):
        if is_https_url(video):
            return [{"url": video, "download_url": video, "type": "video", "source_url": source_url, "thumbnail": image, "caption": description}]
        return []
    if is_https_url(video):
        return [{"url": video, "download_url": video, "type": "video", "source_url": source_url, "thumbnail": image, "caption": description}]
    if is_https_url(image):
        return [{"url": image, "download_url": image, "type": "image", "source_url": source_url, "caption": description}]
    return []

def parse_instagram_response(text: str, source_url: str) -> list[dict[str, Any]]:
    shortcode = shortcode_from_url(source_url)
    try:
        payload = json.loads(text)
        media = extract_media_from_payload(payload, shortcode, source_url)
        if media:
            return media
    except json.JSONDecodeError:
        pass
    for marker in MEDIA_MARKERS:
        for payload in parse_marker_payloads(text, marker):
            media = extract_media_from_payload(payload, shortcode, source_url)
            if media:
                return media
    og = parse_open_graph(text, source_url)
    if og:
        return og
    return []

async def fetch_variant(url: str) -> list[dict[str, Any]]:
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
    response = await session.get(url, headers=headers, allow_redirects=True, timeout=REQUEST_TIMEOUT_SECONDS, http_version="v2")
    if response.status_code != 200:
        raise RuntimeError(f"Instagram returned HTTP {response.status_code}")
    return parse_instagram_response(response.text, url)

async def fetch_instagram(url: str) -> list[dict[str, Any]]:
    base = url if url.endswith("/") else f"{url}/"
    json_url = f"{base}?__a=1&__d=dis"
    results = await asyncio.gather(fetch_variant(base), fetch_variant(json_url), return_exceptions=True)
    successful = [x for x in results if isinstance(x, list) and x]
    if successful:
        # Never let a fast one-item cover response beat a slower full carousel response.
        best = max(successful, key=lambda items: len(items))
        if is_reel_url(url):
            videos = [item for item in best if item.get("type") == "video"]
            if videos:
                return videos[:MAX_MEDIA_ITEMS]
        return best[:MAX_MEDIA_ITEMS]
    errors = [x for x in results if isinstance(x, Exception)]
    raise RuntimeError(str(errors[0]) if errors else "Instagram did not expose downloadable public media")

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
    for old in [k for k, v in cache.items() if v.expires_at <= now]:
        cache.pop(old, None)
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

app = FastAPI(title="InstaFetch Instagram API", version="3.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in os.getenv("CORS_ORIGIN", "*").split(",") if x.strip()], allow_credentials=False, allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Authorization", "Content-Type"])

def check_api_key(authorization: str | None) -> None:
    configured = os.getenv("INSTAGRAM_API_KEY", "").strip()
    if configured and authorization != f"Bearer {configured}":
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/healthz")
async def healthz() -> dict[str, Any]:
    return {"ok": True, "service": "instafetch-instagram-api", "cache_entries": len(cache)}

@app.get("/v1/resolve")
async def resolve_get(url: str = Query(..., min_length=20), authorization: str | None = Header(default=None)) -> dict[str, Any]:
    check_api_key(authorization)
    return await resolve(url)

@app.post("/v1/resolve")
async def resolve_post(body: ResolveRequest, authorization: str | None = Header(default=None)) -> dict[str, Any]:
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
    return {"success": True, "media": media, "meta": {"cached": was_cached, "duration_ms": round((time.perf_counter() - started) * 1000)}}
