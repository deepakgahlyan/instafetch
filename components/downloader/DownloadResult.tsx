interface MediaItem {
  url?: string;
  download_url?: string;
  thumbnail?: string;
  type?: string;
}

interface DownloadResultProps {
  media: MediaItem[];
}

export default function DownloadResult({
  media,
}: DownloadResultProps) {
  if (!media.length) {
    return null;
  }

  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-violet-400">
            Your media is ready
          </p>

          <h3 className="mt-1 text-2xl font-semibold text-white">
            Download Ready
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {media.map((item, index) => {
            const mediaUrl =
              item.download_url || item.url;

            if (!mediaUrl) {
              return null;
            }

            const downloadUrl = `/api/download/file?url=${encodeURIComponent(
              mediaUrl
            )}`;

            return (
              <div
                key={`${mediaUrl}-${index}`}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
              >
                <div className="aspect-video overflow-hidden bg-zinc-900">
                  {item.type === "video" ? (
                    <video
                      src={mediaUrl}
                      poster={item.thumbnail}
                      controls
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={`Instagram media ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      Preview unavailable
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-white">
                      {item.type === "video"
                        ? "Instagram Video"
                        : "Instagram Image"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Media {index + 1}
                    </p>
                  </div>

                  <a
                    href={downloadUrl}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105"
                  >
                    Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}