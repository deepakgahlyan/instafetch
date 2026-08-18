import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = "https://www.instafetch.app";
const url = `${siteUrl}/blog/how-to-download-instagram-reels`;

export const metadata: Metadata = {
  title: "How to Download Instagram Reels — Complete Guide",
  description:
    "Learn how to download supported public Instagram Reels with InstaFetch. Follow four simple steps from copying a Reel URL to downloading available media.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "How to Download Instagram Reels | InstaFetch",
    description:
      "A step-by-step guide to downloading supported public Instagram Reels with the InstaFetch browser-based downloader.",
    url,
    type: "article",
    siteName: "InstaFetch",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${url}#article`,
  headline: "How to Download Instagram Reels",
  description:
    "Learn how to download supported public Instagram Reels using InstaFetch.",
  datePublished: "2026-08-10",
  dateModified: "2026-08-14",
  author: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "InstaFetch",
    url: siteUrl,
  },
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "InstaFetch",
    url: siteUrl,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
  },
  about: {
    "@type": "WebApplication",
    "@id": `${siteUrl}/#application`,
    name: "InstaFetch",
    url: siteUrl,
  },
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${url}#breadcrumb`,
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
      name: "Instagram Downloader Guides",
      item: `${siteUrl}/blog`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "How to Download Instagram Reels",
      item: url,
    },
  ],
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Download an Instagram Reel with InstaFetch",
  description:
    "Four steps for downloading supported public Instagram Reels using InstaFetch.",
  totalTime: "PT2M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Copy the Instagram Reel URL",
      text: "Open the supported public Instagram Reel and copy its URL.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Open InstaFetch",
      text: "Open the InstaFetch Instagram Reels downloader in a web browser.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Paste the Reel URL",
      text: "Paste the copied Instagram Reel URL into the InstaFetch downloader and submit it.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download available media",
      text: "If the Reel is supported and accessible, select the available download option.",
    },
  ],
};

export default function HowToDownloadInstagramReelsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData),
        }}
      />

      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Insta<span className="text-violet-500">Fetch</span>
          </Link>

          <Link
            href="/blog"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Instagram Downloader Guides
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-16">
        {/* Article header */}
        <header>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Instagram Reels · 5 min read
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            How to Download Instagram Reels
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-400">
            You can download a supported public Instagram Reel by copying its
            URL, pasting it into InstaFetch, checking the available media, and
            selecting the download option. InstaFetch works in a browser and
            does not require an Instagram login.
          </p>
        </header>

        {/* Quick answer */}
        <section className="mt-10 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-7 md:p-9">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
            Quick answer
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            How do I download an Instagram Reel?
          </h2>

          <p className="mt-4 leading-8 text-zinc-300">
            Copy the link to a supported public Instagram Reel, open the
            InstaFetch downloader, paste the URL, and submit it. If the Reel is
            accessible and supported, InstaFetch displays the available media
            for download.
          </p>
        </section>

        {/* Steps */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Download an Instagram Reel in four steps
          </h2>

          <p className="mt-4 leading-8 text-zinc-400">
            The process is designed to work directly in a modern web browser
            on supported desktop and mobile devices.
          </p>

          <div className="mt-8 space-y-5">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <span className="text-sm font-bold text-violet-400">
                STEP 1
              </span>

              <h3 className="mt-3 text-xl font-semibold">
                Copy the Instagram Reel URL
              </h3>

              <p className="mt-3 leading-8 text-zinc-400">
                Open Instagram and find the public Reel you want to download.
                Use Instagram's sharing controls to copy the link to the Reel.
              </p>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <span className="text-sm font-bold text-violet-400">
                STEP 2
              </span>

              <h3 className="mt-3 text-xl font-semibold">
                Open the InstaFetch Reels downloader
              </h3>

              <p className="mt-3 leading-8 text-zinc-400">
                Open the{" "}
                <Link
                  href="/instagram-reels-downloader"
                  className="font-semibold text-violet-400 hover:text-violet-300"
                >
                  InstaFetch Instagram Reels Downloader
                </Link>{" "}
                in your browser. No separate application is required.
              </p>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <span className="text-sm font-bold text-violet-400">
                STEP 3
              </span>

              <h3 className="mt-3 text-xl font-semibold">
                Paste the Reel URL
              </h3>

              <p className="mt-3 leading-8 text-zinc-400">
                Paste the copied Instagram Reel URL into the InstaFetch input
                field and submit it. InstaFetch sends the URL to its download
                service and checks whether supported media is available.
              </p>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <span className="text-sm font-bold text-violet-400">
                STEP 4
              </span>

              <h3 className="mt-3 text-xl font-semibold">
                Download the available media
              </h3>

              <p className="mt-3 leading-8 text-zinc-400">
                If supported media is found, the result is displayed so you
                can select the available download option.
              </p>
            </section>
          </div>
        </section>

        {/* Mobile */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Can I download Instagram Reels on a phone?
          </h2>

          <p className="mt-5 leading-8 text-zinc-300">
            Yes. InstaFetch is browser-based, so the downloader can be used
            from a supported mobile browser as well as on a desktop or tablet.
            The workflow remains the same: copy the Reel URL, paste it into
            InstaFetch, check the result, and download available media.
          </p>
        </section>

        {/* No login */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Do I need an Instagram account?
          </h2>

          <p className="mt-5 leading-8 text-zinc-300">
            InstaFetch does not require you to enter your Instagram username,
            password, or login credentials. The downloader is designed for
            supported public Instagram content.
          </p>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <p className="text-sm leading-7 text-zinc-400">
              Never provide your Instagram password to a third-party downloader
              or website.
            </p>
          </div>
        </section>

        {/* Why it may fail */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Why might an Instagram Reel not download?
          </h2>

          <p className="mt-5 leading-8 text-zinc-300">
            Not every Instagram URL can be downloaded. A Reel may be private,
            restricted, deleted, unavailable, unsupported, or otherwise
            inaccessible to the downloader.
          </p>

          <div className="mt-7 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <h3 className="font-semibold">
              If your Reel does not work
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
              <li>• Make sure the URL was copied correctly.</li>
              <li>• Check that the Reel is publicly accessible.</li>
              <li>• Try copying the original Reel URL again.</li>
              <li>• Confirm that the content is still available on Instagram.</li>
              <li>• Try again later if the service or content is temporarily unavailable.</li>
            </ul>
          </div>
        </section>

        {/* Supported content */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            What Instagram Reels does InstaFetch support?
          </h2>

          <p className="mt-5 leading-8 text-zinc-300">
            InstaFetch is designed for supported public Instagram Reels. A
            public URL is not a guarantee that media will always be available,
            because content can change, disappear, become restricted, or use a
            format that is not currently supported.
          </p>
        </section>

        {/* Related tools */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Other InstaFetch Instagram download tools
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Link
              href="/instagram-downloader"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <h3 className="font-semibold">
                Instagram Downloader
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Main InstaFetch downloader for supported Instagram media.
              </p>
            </Link>

            <Link
              href="/instagram-video-downloader"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <h3 className="font-semibold">
                Instagram Video Downloader
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Download supported public Instagram videos.
              </p>
            </Link>

            <Link
              href="/instagram-photo-downloader"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <h3 className="font-semibold">
                Instagram Photo Downloader
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Download supported public Instagram photos.
              </p>
            </Link>
          </div>
        </section>

        {/* Responsible use */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Download Instagram Reels responsibly
          </h2>

          <p className="mt-5 leading-8 text-zinc-300">
            Public availability does not automatically mean that content is
            free to reuse. If you plan to repost, edit, publish, distribute,
            or use downloaded media commercially, make sure you have the
            necessary rights or permission.
          </p>

          <p className="mt-5 leading-8 text-zinc-300">
            Respect copyright, creator rights, privacy, and applicable laws
            when using downloaded Instagram content.
          </p>
        </section>

        {/* Related guides */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            More InstaFetch guides
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <Link
              href="/blog/how-instafetch-works"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <p className="text-sm text-violet-400">
                InstaFetch Guide
              </p>

              <h3 className="mt-2 font-semibold">
                How InstaFetch Works
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Understand how InstaFetch processes supported public Instagram
                URLs.
              </p>
            </Link>

            <Link
              href="/blog/instagram-download-tips"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <p className="text-sm text-violet-400">
                Tips
              </p>

              <h3 className="mt-2 font-semibold">
                Instagram Download Tips
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Practical tips for supported Instagram downloads and common
                problems.
              </p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-center md:p-10">
          <h2 className="text-2xl font-bold md:text-3xl">
            Download a supported Instagram Reel
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">
            Paste a supported public Instagram Reel URL into InstaFetch and
            check the available media.
          </p>

          <Link
            href="/instagram-reels-downloader"
            className="mt-7 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3 font-semibold transition hover:scale-105"
          >
            Open Reels Downloader
          </Link>
        </section>

        {/* Back */}
        <div className="mt-10 border-t border-zinc-800 pt-8">
          <Link
            href="/blog"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Instagram downloader guides
          </Link>
        </div>
      </article>
    </main>
  );
}