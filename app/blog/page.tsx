import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Instagram Downloader Guides & Tips",
  description:
    "Learn how to download supported public Instagram videos, Reels, and photos with InstaFetch. Explore Instagram downloader guides, tutorials, and tips.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Instagram Downloader Guides & Tips | InstaFetch",
    description:
      "Guides and tutorials about downloading supported public Instagram videos, Reels, and photos with InstaFetch.",
    url: `${siteUrl}/blog`,
    siteName: "InstaFetch",
    type: "website",
  },
};

const articles = [
  {
    title: "How InstaFetch Works",
    description:
      "Learn how InstaFetch processes supported public Instagram URLs and how to use the downloader from your browser.",
    href: "/blog/how-instafetch-works",
    category: "InstaFetch Guide",
  },
  {
    title: "How to Download Instagram Reels",
    description:
      "A practical guide to downloading supported public Instagram Reels using a browser-based workflow.",
    href: "/blog/how-to-download-instagram-reels",
    category: "Instagram Reels",
  },
  {
    title: "Instagram Download Tips",
    description:
      "Helpful tips for working with supported Instagram video, Reel, and photo URLs and troubleshooting download issues.",
    href: "/blog/instagram-download-tips",
    category: "Tips",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/blog#webpage`,
      url: `${siteUrl}/blog`,
      name: "Instagram Downloader Guides & Tips",
      description:
        "Guides and tutorials about downloading supported public Instagram videos, Reels, and photos with InstaFetch.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#application`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/blog#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "InstaFetch",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteUrl}/blog`,
        },
      ],
    },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-24">
          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400"
            >
              InstaFetch
            </Link>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
              Instagram Downloader Guides &amp; Tips
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Learn how InstaFetch works and find practical guides for working
              with supported public Instagram videos, Reels, and photos.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-8 md:p-10">
            <h2 className="text-2xl font-bold">
              About the InstaFetch blog
            </h2>

            <p className="mt-4 leading-8 text-zinc-300">
              InstaFetch is a browser-based Instagram downloader for supported
              public Instagram videos, Reels, and photos. This blog provides
              guides that explain how the service works, how to use it, and
              what to do when an Instagram URL cannot be processed.
            </p>

            <p className="mt-4 leading-8 text-zinc-400">
              Our guides focus on straightforward answers and practical steps
              rather than unnecessary technical information.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Guides
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Latest InstaFetch guides
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.href}
                className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  {article.category}
                </span>

                <h3 className="mt-4 text-xl font-semibold">
                  {article.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">
                  {article.description}
                </p>

                <Link
                  href={article.href}
                  className="mt-6 text-sm font-semibold text-violet-400 hover:text-violet-300"
                >
                  Read guide →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Topic hub */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">
              Instagram downloader resources
            </h2>

            <p className="mt-4 leading-8 text-zinc-400">
              Looking for a specific InstaFetch downloader? Use the dedicated
              pages below for supported Instagram videos, Reels, and photos.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Link
                href="/instagram-video-downloader"
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-violet-500/50"
              >
                <h3 className="font-semibold">
                  Instagram Video Downloader
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  Download supported public Instagram videos.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
                  Open tool →
                </span>
              </Link>

              <Link
                href="/instagram-reels-downloader"
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-violet-500/50"
              >
                <h3 className="font-semibold">
                  Instagram Reels Downloader
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  Download supported public Instagram Reels.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
                  Open tool →
                </span>
              </Link>

              <Link
                href="/instagram-photo-downloader"
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-violet-500/50"
              >
                <h3 className="font-semibold">
                  Instagram Photo Downloader
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  Download supported public Instagram photos.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
                  Open tool →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 pb-24 pt-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to use InstaFetch?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">
            Use the InstaFetch Instagram downloader to check supported public
            videos, Reels, and photos.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >
            Open InstaFetch
          </Link>
        </section>
      </main>
    </>
  );
}