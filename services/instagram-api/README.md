# InstaFetch Instagram API

A small, self-hosted API used by the InstaFetch web app for resolving public Instagram posts and Reels.

## Endpoints

- `GET /healthz`
- `GET /v1/resolve?url=https://www.instagram.com/reel/.../`
- `POST /v1/resolve` with `{ "url": "https://www.instagram.com/reel/.../" }`

The resolver reads Instagram's page-embedded media data and prefers progressive `video_versions[].url` for Reels. Results are cached in memory for 120 seconds and simultaneous requests for the same URL share one in-flight extraction.

## Environment

- `PORT` - default `8787`
- `INSTAGRAM_API_KEY` - optional Bearer token used by InstaFetch
- `CORS_ORIGIN` - optional allowed origin, default `*`

## Docker

From the repository root:

```bash
docker build -f services/instagram-api/Dockerfile -t instafetch-instagram-api .
docker run --rm -p 8787:8787 instafetch-instagram-api
```

Then set the Vercel environment variable:

```text
INSTAGRAM_API_URL=https://your-api-host.example
INSTAGRAM_API_KEY=your-secret
```

The Next.js app will use the first-party service automatically. If `INSTAGRAM_API_URL` is not set, it uses the same direct extractor inside the web app.

## Production notes

Run multiple API instances behind a load balancer when traffic grows. For shared caching across instances, put the cache in Redis/Valkey rather than relying only on process memory.
