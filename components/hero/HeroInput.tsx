"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/Input";
import DownloadResult from "@/components/downloader/DownloadResult";

interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
  caption?: string;
  filename?: string;
  width?: number;
  height?: number;
  filesize_bytes?: number;
}

const stages = [
  "Connecting to Instagram",
  "Resolving available media",
  "Preparing your download",
];

const REQUEST_TIMEOUT_MS = 25_000;

export default function HeroInput() {
  const [url, setUrl] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;

    setStageIndex(0);
    const firstTimer = window.setTimeout(() => setStageIndex(1), 2500);
    const secondTimer = window.setTimeout(() => setStageIndex(2), 8000);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
    };
  }, [loading]);

  async function handleDownload() {
    setMessage("");
    setMedia([]);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error("Please enter an Instagram URL.");
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
        cache: "no-store",
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error || "Something went wrong. Please try again.";
        setMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const results: MediaItem[] = Array.isArray(data?.media) ? data.media : [];
      setMedia(results);

      if (!results.length) {
        const errorMessage = "No downloadable media was found.";
        setMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const durationMs = data?.meta?.durationMs;
      const durationText =
        typeof durationMs === "number" && durationMs >= 1000
          ? ` · Ready in ${(durationMs / 1000).toFixed(1)}s`
          : "";

      setMessage(
        results.length > 1
          ? `${results.length} media items ready${durationText}.`
          : `Your media is ready to download${durationText}.`
      );

      toast.success(
        results.length > 1
          ? `${results.length} media items found.`
          : "Your media is ready to download."
      );
    } catch (error) {
      const errorMessage =
        error instanceof DOMException && error.name === "AbortError"
          ? "Instagram is taking too long to respond. Please try again with a public post or Reel."
          : "Unable to connect. Please try again.";

      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  function handleClear() {
    setUrl("");
    setMedia([]);
    setMessage("");
  }

  return (
    <>
      <Toaster theme="dark" position="top-center" richColors />

      <div id="download" className="mt-10 w-full max-w-4xl scroll-mt-24">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 backdrop-blur-xl md:flex-row">
          <Input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) handleDownload();
            }}
            placeholder="Paste Instagram URL here..."
            disabled={loading}
            aria-label="Instagram URL"
            className="h-16 flex-1 border-0 bg-transparent text-lg text-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-500"
          />

          <button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className="flex h-16 min-w-40 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-10 text-lg font-semibold text-white transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Preparing…
              </>
            ) : (
              "Download"
            )}
          </button>
        </div>

        {loading && (
          <div className="mx-auto mt-4 max-w-2xl" aria-live="polite">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
              {stages[stageIndex]}
              <span className="text-zinc-600">…</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-1/3 animate-[progress_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
            </div>
            <p className="mt-2 text-center text-xs text-zinc-500">
              Usually ready in a few seconds.
            </p>
          </div>
        )}

        {message && !loading && (
          <p className="mt-4 text-center text-sm text-zinc-400">{message}</p>
        )}

        {media.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Clear result
            </button>
          </div>
        )}

        <DownloadResult media={media} />
      </div>
    </>
  );
}
