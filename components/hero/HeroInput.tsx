"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import DownloadResult from "@/components/downloader/DownloadResult";

interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
}

export default function HeroInput() {
  const [url, setUrl] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setMessage("");
    setMedia([]);

    if (!url.trim()) {
      toast.error("Please enter an Instagram URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
        toast.error(data.error || "Download failed.");
        return;
      }

      const results = data.media || [];

      setMedia(results);

      if (!results.length) {
        setMessage("No downloadable media was found.");
        toast.error("No downloadable media was found.");
        return;
      }

      toast.success("Your media is ready to download.");
    } catch {
      setMessage("Unable to connect. Please try again.");
      toast.error("Unable to connect. Please try again.");
    } finally {
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
      <Toaster
        theme="dark"
        position="top-center"
        richColors
      />

      <div
        id="download"
        className="mt-10 w-full max-w-4xl scroll-mt-24"
      >
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 backdrop-blur-xl md:flex-row">
          <Input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste Instagram URL here..."
            disabled={loading}
            className="h-16 flex-1 border-0 bg-transparent text-lg text-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-500"
          />

          <button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className="flex h-16 min-w-40 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-10 text-lg font-semibold text-white transition duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Fetching...
              </>
            ) : (
              "Download"
            )}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-zinc-400">
            {message}
          </p>
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