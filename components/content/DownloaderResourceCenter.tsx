import Link from "next/link";

const workflows = [
  {
    title: "Reels and short videos",
    text: "Use the Reel or video URL when you have a single short-form video. InstaFetch identifies the available video media and gives you a browser download without requiring an Instagram password.",
    href: "/instagram-reels-downloader",
  },
  {
    title: "Photo posts",
    text: "For a public photo post, InstaFetch checks the supplied post URL and returns the image media that can be processed. A post can still fail when access has changed or the content is no longer available.",
    href: "/instagram-photo-downloader",
  },
  {
    title: "Carousel posts",
    text: "Carousel URLs can contain multiple images or videos. When multiple files are returned, InstaFetch shows each item separately and provides a Download All option for supported results.",
    href: "/instagram-downloader",
  },
];

const troubleshooting = [
  {
    title: "The request stays on Preparing for a long time",
    text: "Public media is not always delivered the same way. The first request may need to resolve the current media source before a stable download can be prepared. Keep the original post URL, avoid repeatedly clicking the button, and try again when the post is publicly accessible.",
  },
  {
    title: "The result says no media was found",
    text: "The URL may point to a private or removed post, an unsupported Instagram page, or content that is currently inaccessible to the downloader. Confirm the link opens normally in your browser and is a direct post, Reel, or video URL.",
  },
  {
    title: "The downloaded file will not open",
    text: "A download should be validated as media before the browser receives it. If a file does not open, do not rename it randomly or keep retrying the same broken link. Submit the original Instagram URL again so a fresh media source can be checked.",
  },
];

export default function DownloaderResourceCenter() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="resource-center-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          InstaFetch resource center
        </p>
        <h2 id="resource-center-title" className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Understand the download before you click it
        </h2>
        <p className="mt-5 text-base leading-8 text-zinc-400">
          A useful downloader should explain what it can process, why a public link can still fail, and what happens between the Instagram URL and the file saved on your device. This guide is written for those practical questions instead of repeating the same keyword across nearly identical pages.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {workflows.map((workflow) => (
          <article key={workflow.title} className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
            <h3 className="text-xl font-semibold text-white">{workflow.title}</h3>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{workflow.text}</p>
            <Link href={workflow.href} className="mt-5 inline-flex text-sm font-semibold text-violet-400 hover:text-violet-300">
              Open the related tool →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
          <h3 className="text-2xl font-bold text-white">What actually happens after you paste a URL?</h3>
          <div className="mt-6 space-y-5 text-sm leading-8 text-zinc-300">
            <p>
              InstaFetch starts with a validation step. The submitted address must use HTTPS and point to an Instagram content URL that the service is designed to process. Rejecting unsupported links early matters because it prevents unnecessary network requests and gives the user a useful answer instead of a generic server error.
            </p>
            <p>
              The service then resolves the public media associated with that post. A modern downloader cannot safely assume that the visible Instagram page URL is the same thing as the final media file. The application therefore treats the Instagram address as the source of the request and separately resolves the media that can actually be delivered.
            </p>
            <p>
              Once media is available, InstaFetch keeps the result separate from the original page navigation. The download button requests the already-resolved media instead of starting a second Instagram lookup. This makes repeated clicks more predictable and helps avoid the common failure where a temporary source URL changes between the preview and download step.
            </p>
            <p>
              For multi-item results, each file is represented independently so an image and a video can be handled according to its own type. The interface also exposes dimensions and file information when that metadata is available.
            </p>
          </div>
        </article>

        <aside className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
          <h3 className="text-2xl font-bold text-white">Why a public post can still fail</h3>
          <div className="mt-6 space-y-5 text-sm leading-8 text-zinc-400">
            <p>
              Public visibility is a practical requirement, not a guarantee. A creator can change an account or post after a link was copied, a post can be removed, or a delivery method can change. A downloader also has to support the specific content format returned for the URL.
            </p>
            <p>
              This is why InstaFetch does not promise that every Instagram URL will always be downloadable. The honest result is either a usable media file or a clear explanation that the current URL cannot be processed.
            </p>
            <p>
              The same principle applies to privacy. A third-party downloader should never need your Instagram password just to process a public URL. Do not submit account credentials to InstaFetch or to any other downloader.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-14 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold text-white">Troubleshooting guide</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            The fastest way to solve a failed download is usually to diagnose the source URL first rather than repeatedly submitting the same request.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {troubleshooting.map((item) => (
            <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="text-2xl font-bold text-white">Quality, formats, and expectations</h3>
          <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <p>
              The file format comes from the media source that can be processed. Video results are normally delivered as a browser-playable video file, while image results are delivered in an image format supported by the source. The service does not invent a higher-quality copy that Instagram did not make available.
            </p>
            <p>
              For that reason, the safest quality promise is transparent metadata rather than advertising a universal "original" or "4K" mode. When dimensions or file size are known, InstaFetch shows them with the result so you can understand what you are downloading.
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="text-2xl font-bold text-white">Responsible use</h3>
          <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <p>
              A technical ability to download a public file is different from permission to republish it. Creator rights, copyright, privacy, publicity rights, and local laws can apply to downloaded material.
            </p>
            <p>
              InstaFetch is an independent utility. Instagram and Meta are not affiliated with or endorsing this service, and the InstaFetch workflow is intended for supported public content only.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/about" className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-white hover:border-violet-500">About</Link>
            <Link href="/privacy" className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-white hover:border-violet-500">Privacy</Link>
            <Link href="/terms" className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-white hover:border-violet-500">Terms</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
