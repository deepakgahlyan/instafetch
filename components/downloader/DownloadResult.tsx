"use client";

import JSZip from "jszip";
import { useState } from "react";

interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
  source_url?: string;
  filename?: string;
  width?: number;
  height?: number;
  filesize_bytes?: number;
}

interface DownloadResultProps {
  media: MediaItem[];
}

function buildDownloadEndpoint(
  mediaUrl: string,
  index: number,
  sourceUrl?: string
): string {
  const params = new URLSearchParams({
    url: mediaUrl,
    index: String(index),
  });

  if (sourceUrl) params.set("source", sourceUrl);

  return `/api/download/file?${params.toString()}`;
}

export default function DownloadResult({ media }: DownloadResultProps) {
  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState("");

  if (!media.length) return null;

  const caption = media.find((item) => item.caption)?.caption;

  async function downloadAll() {
    if (media.length === 1) return;
    setZipping(true);
    setZipError("");

    try {
      if (media.length > 20) {
        throw new Error(
          "This carousel is too large for a browser ZIP. Download the items individually."
        );
      }

      const zip = new JSZip();

      for (let index = 0; index < media.length; index++) {
        const item = media[index];
        const mediaUrl = item.download_url || item.url;
        if (!mediaUrl) continue;

        const response = await fetch(
          buildDownloadEndpoint(mediaUrl, index, item.source_url),
          { cache: "no-store" }
        );

        const contentType = response.headers.get("content-type") || "";
        if (!response.ok || contentType.includes("application/json")) {
          throw new Error(`Unable to prepare media ${index + 1}.`);
        }

        const blob = await response.blob();
        if (!blob.size) throw new Error(`Media ${index + 1} was empty.`);

        const disposition = response.headers.get("content-disposition") || "";
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const filename =
          match?.[1] ||
          item.filename ||
          `instafetch-${index + 1}.${item.type === "video" ? "mp4" : "jpg"}`;

        zip.file(filename, blob);
      }

      const archive = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const objectUrl = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "instafetch-media.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch (error) {
      setZipError(
        error instanceof Error ? error.message : "Unable to create ZIP."
      );
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-violet-400">Your media is ready</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">
            {media.length > 1
              ? `${media.length} Media Items Found`
              : "Download Ready"}
          </h3>

          {caption && (
            <p className="mx-auto mt-4 max-w-3xl whitespace-pre-wrap text-left text-sm leading-6 text-zinc-400">
              {caption}
            </p>
          )}

          {media.length > 1 && (
            <button
              type="button"
              onClick={downloadAll}
              disabled={zipping}
              className="mt-5 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60"
            >
              {zipping ? "Creating ZIP…" : `Download All (${media.length})`}
            </button>
          )}

          {zipError && (
            <p className="mt-3 text-sm text-red-400">{zipError}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {media.map((item, index) => (
            <MediaCard
              key={`${item.download_url || item.url || "media"}-${index}`}
              item={item}
              index={index}
              total={media.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaCard({
  item,
  index,
  total,
}: {
  item: MediaItem;
  index: number;
  total: number;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const mediaUrl = item.download_url || item.url;
  if (!mediaUrl) return null;

  const isVideo = item.type === "video";

  async function handleDownload() {
    setDownloading(true);
    setError("");

    try {
      const endpoint = buildDownloadEndpoint(
        mediaUrl,
        index,
        item.source_url
      );

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok || contentType.includes("application/json")) {
        let message = "Download failed. Please try again.";

        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {
          // Keep fallback message.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error("The downloaded file was empty. Please try again.");
      }

      const disposition = response.headers.get("content-disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);
      const filename =
        match?.[1] ||
        item.filename ||
        `instafetch-media-${index + 1}.${isVideo ? "mp4" : "jpg"}`;

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Download failed. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <div className="aspect-video overflow-hidden bg-zinc-900">
        {isVideo ? (
          <video
            src={mediaUrl}
            poster={item.thumbnail || undefined}
            controls
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={item.thumbnail || mediaUrl}
            alt={`Instagram media ${index + 1}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="font-medium text-white">
            {isVideo ? "Instagram Video" : "Instagram Image"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {total > 1 ? `Media ${index + 1} of ${total}` : "Media 1"}
            {item.width && item.height
              ? ` · ${item.width}×${item.height}`
              : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-wait disabled:opacity-70"
        >
          {downloading ? "Preparing…" : "Download"}
        </button>
      </div>

      {error && (
        <p className="px-4 pb-4 text-center text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
