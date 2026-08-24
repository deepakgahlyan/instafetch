import type { Metadata } from "next";
import Link from "next/link";

const url = "https://www.instafetch.app/blog/instagram-downloader-on-iphone";

export const metadata: Metadata = {
  title: "How to Download Supported Instagram Videos on iPhone",
  description:
    "Learn a practical browser-based workflow for saving supported public Instagram videos and Reels on iPhone, including where Safari downloads are stored.",
  alternates: { canonical: url },
};

export default function InstagramDownloaderOnIPhonePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blog" className="text-sm text-violet-400 hover:text-violet-300">← Back to Instagram downloader guides</Link>
        <p className="mt-12 text-sm font-medium text-violet-400">iPhone Guide · 6 min read</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">How to Download Supported Instagram Videos on iPhone</h1>
        <p className="mt-6 text-xl leading-8 text-zinc-400">
          iPhone users can use a browser-based workflow when they need to save supported public Instagram media. InstaFetch does not require a separate downloader app or an Instagram password.
        </p>

        <div className="mt-12 space-y-10 leading-8 text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-white">1. Copy the public Instagram URL</h2>
            <p className="mt-4">Open Instagram, locate the public video or Reel, and use the share controls to copy its link. Use the original post or Reel URL whenever possible. Private posts and content that Instagram no longer makes publicly accessible may not work.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">2. Open InstaFetch in Safari</h2>
            <p className="mt-4">Open the <Link href="/#download" className="text-violet-400 hover:text-violet-300">InstaFetch downloader</Link> in Safari or another current iPhone browser. Paste the copied URL into the downloader and submit it.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">3. Check the available result</h2>
            <p className="mt-4">InstaFetch checks whether the submitted URL points to media it can support. If a downloadable result is returned, use the provided download control. If no result is available, confirm that the post is public and that the copied link is complete.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">4. Find the downloaded file</h2>
            <p className="mt-4">On current versions of iOS, Safari downloads are normally available through the Files app, often under the Downloads folder. The exact location can depend on your Safari download setting and iOS version. If you choose a different download destination, check the location selected in Safari's settings.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">If the download does not work</h2>
            <p className="mt-4">A failed request does not necessarily mean there is a problem with your iPhone. The post may have become private, been deleted, been restricted, or use a content format that is not currently supported. Copy the original URL again and try once rather than repeatedly submitting the same request.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white">Use downloaded content responsibly</h2>
            <p className="mt-4">Being able to access a public post does not automatically grant permission to repost it. Before publishing, editing, or commercially using someone else's video, consider copyright, privacy, publicity rights, and any permission required for your intended use.</p>
          </section>
        </div>

        <div className="mt-14 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">
          <h2 className="text-2xl font-bold">Need the downloader?</h2>
          <p className="mt-3 text-zinc-400">Open InstaFetch and submit a supported public Instagram URL.</p>
          <Link href="/#download" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 font-semibold">Open Downloader</Link>
        </div>
      </article>
    </main>
  );
}
