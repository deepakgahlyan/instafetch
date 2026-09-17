from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

SERVICE_DIR = Path(__file__).resolve().parents[1] / "services" / "instagram-api-python"
if str(SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(SERVICE_DIR))

from app import check_api_key, lifespan, resolve  # type: ignore  # noqa: E402
from fastapi import FastAPI, Header, Query
from pydantic import BaseModel, HttpUrl


class ResolveRequest(BaseModel):
    url: HttpUrl


app = FastAPI(title="InstaFetch Instagram API", version="5.0.0", lifespan=lifespan)


@app.get("/api/instagram/healthz")
@app.get("/healthz")
async def healthz() -> dict[str, Any]:
    return {"ok": True, "service": "instafetch-instagram-api"}


@app.get("/api/instagram/v1/resolve")
@app.get("/v1/resolve")
async def resolve_get(
    url: str = Query(..., min_length=20),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    check_api_key(authorization)
    return await resolve(url)


@app.post("/api/instagram/v1/resolve")
@app.post("/v1/resolve")
async def resolve_post(
    body: ResolveRequest,
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    check_api_key(authorization)
    return await resolve(str(body.url))
