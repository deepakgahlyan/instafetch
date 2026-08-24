import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "About InstaFetch",
  description:
    "Learn what InstaFetch is, how the service works, what public Instagram content it supports, and the principles behind the browser-based downloader.",
  alternates: { canonical: `${siteUrl}/about` },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <Link href="/" className="text-sm font-semibold text-violet-400 hover:text-violet-300">
          ← Back to InstaFetch
        </Link>

        <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          About InstaFetch
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
          A simple browser-based Instagram downloader
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-400">
          InstaFetch is a web-based utility for working with supported public Instagram URLs. The goal is straightforward: give users a clear place to paste a public Instagram link, check whether supported media is available, and download the available file without installing a dedicated application or entering an Instagram password.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-2xl font-bold">What InstaFetch does</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              InstaFetch focuses on three common public-media use cases: Instagram videos, Instagram Reels, and Instagram photos. Each tool page explains its particular use case and links back to related resources so visitors can choose the right workflow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">How the service is designed</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              The service is designed around a simple URL-based workflow. A visitor provides a supported public Instagram URL, InstaFetch processes the request through its download service, and the browser receives available media information when the request can be handled. Availability can change when a post is private, deleted, restricted, unsupported, or no longer accessible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">What InstaFetch does not do</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              InstaFetch does not ask visitors for Instagram passwords or claim to provide access to private accounts. A public URL also does not grant permission to reuse someone else's work. Users remain responsible for respecting copyright, privacy, creator rights, and applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Independent service</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              InstaFetch is an independent website and is not affiliated with, sponsored by, or endorsed by Instagram or Meta. Instagram is a trademark of its respective owner.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
            <h2 className="text-2xl font-bold">Explore InstaFetch</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link href="/instagram-downloader" className="rounded-2xl border border-zinc-800 p-5 hover:border-violet-500/50">
                <span className="font-semibold">Instagram Downloader</span>
                <span className="mt-2 block text-sm text-zinc-400">General public Instagram URL downloader.</span>
              </Link>
              <Link href="/blog" className="rounded-2xl border border-zinc-800 p-5 hover:border-violet-500/50">
                <span className="font-semibold">Guides &amp; Tips</span>
                <span className="mt-2 block text-sm text-zinc-400">Practical information about supported downloads.</span>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
