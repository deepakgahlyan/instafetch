import type { Metadata } from "next";
import Link from "next/link";

import HeroInput from "@/components/hero/HeroInput";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Instagram Reels Downloader — Download Instagram Reels",
  description:
    "InstaFetch is a free online Instagram Reels downloader for supported public Instagram Reels. Paste a Reel URL to check available media and download it directly from your browser.",
  alternates: {
    canonical: `${siteUrl}/instagram-reels-downloader`,
  },
  openGraph: {
    title: "Instagram Reels Downloader | InstaFetch",
    description:
      "Download supported public Instagram Reels directly from your browser with InstaFetch.",
    url: `${siteUrl}/instagram-reels-downloader`,
    siteName: "InstaFetch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels Downloader | InstaFetch",
    description:
      "Download supported public Instagram Reels directly from your browser with InstaFetch.",
  },
};

const faqs = [
  {
    question: "What is an Instagram Reels downloader?",
    answer:
      "An Instagram Reels downloader is an online tool that can retrieve downloadable media from supported Instagram Reel URLs. InstaFetch is a browser-based downloader for supported public Instagram Reels.",
  },
  {
    question: "How do I download an Instagram Reel with InstaFetch?",
    answer:
      "Copy the URL of a supported public Instagram Reel, paste it into InstaFetch, and start the download process. If the Reel is accessible and supported, InstaFetch displays the available media.",
  },
  {
    question: "Do I need an Instagram account to download a Reel?",
    answer:
      "InstaFetch does not require you to provide an Instagram username or password to use the downloader.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. InstaFetch works directly in a modern web browser, so you do not need to install a dedicated Instagram downloader application.",
  },
  {
    question: "Can I download every Instagram Reel?",
    answer:
      "No downloader can guarantee access to every Instagram URL. InstaFetch works with supported public Reels that can be accessed. Private, restricted, unavailable, or unsupported content may not be downloadable.",
  },
  {
    question: "Is InstaFetch free?",
    answer:
      "Yes. InstaFetch is free to use for supported public Instagram media.",
  },
  {
    question: "Does the Instagram Reels downloader work on mobile?",
    answer:
      "Yes. InstaFetch is browser-based and can be used from supported modern mobile and desktop browsers.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/instagram-reels-downloader#webpage`,
      url: `${siteUrl}/instagram-reels-downloader`,
      name: "Instagram Reels Downloader — Download Instagram Reels",
      description:
        "Free online Instagram Reels downloader for supported public Instagram Reels.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#application`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/instagram-reels-downloader#breadcrumb`,
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
          name: "Instagram Reels Downloader",
          item: `${siteUrl}/instagram-reels-downloader`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/instagram-reels-downloader#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function InstagramReelsDownloaderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-zinc-950 text-white">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              InstaFetch
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              Instagram Reels Downloader
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              InstaFetch is a free online Instagram Reels downloader for
              supported public Instagram Reels. Paste an Instagram Reel URL
              below to check available media and download it directly from
              your browser.
            </p>
          </div>

          {/* Real downloader */}
          <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-8">
              <div className="text-center">
                <p className="text-sm text-zinc-500">
                  Ready to download?
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Download an Instagram Reel
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  Paste a supported public Instagram Reel URL below to check
                  available media.
                </p>
              </div>

              <div className="mt-8">
                <HeroInput />
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                <span>✓ Free to use</span>
                <span>✓ No Instagram password</span>
                <span>✓ Browser-based</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick answer */}
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-8">
            <h2 className="text-2xl font-bold">
              How can I download an Instagram Reel?
            </h2>

            <p className="mt-4 leading-8 text-zinc-300">
              Copy the URL of a supported public Instagram Reel, paste it into
              InstaFetch, check the available media, and select the download
              option. InstaFetch works directly in your browser and does not
              require an Instagram login.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Download an Instagram Reel in four steps
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              InstaFetch uses a simple URL-based workflow for supported public
              Instagram Reels.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Copy the Reel URL",
                text: "Open the supported public Instagram Reel and copy its URL.",
              },
              {
                number: "02",
                title: "Paste into InstaFetch",
                text: "Paste the Instagram Reel URL into the InstaFetch downloader.",
              },
              {
                number: "03",
                title: "Check the media",
                text: "InstaFetch checks the URL and shows available media when supported.",
              },
              {
                number: "04",
                title: "Download",
                text: "Select the available download option to save the supported Reel.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"
              >
                <span className="text-sm font-bold text-violet-400">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Why InstaFetch */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Why InstaFetch
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              A simple way to download supported Instagram Reels
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              InstaFetch provides a browser-based workflow for users who want
              to work with supported public Instagram Reels.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <h3 className="text-xl font-semibold">
                No Instagram login
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                InstaFetch does not require your Instagram username or
                password.
              </p>
            </article>

            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <h3 className="text-xl font-semibold">
                Browser-based
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Use InstaFetch from a supported desktop, tablet, or mobile
                browser without installing dedicated software.
              </p>
            </article>

            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <h3 className="text-xl font-semibold">
                Simple URL workflow
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Copy the Reel URL, paste it into InstaFetch, check available
                media, and download.
              </p>
            </article>
          </div>
        </section>

        {/* Related pages */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              InstaFetch Tools
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              More Instagram download tools
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              Explore InstaFetch tools for other supported Instagram media.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link
              href="/instagram-downloader"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <h3 className="font-semibold">
                Instagram Downloader
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Videos, Reels, and photos.
              </p>
            </Link>

            <Link
              href="/instagram-video-downloader"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/50"
            >
              <h3 className="font-semibold">
                Instagram Video Downloader
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
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

              <p className="mt-2 text-sm text-zinc-400">
                Download supported public Instagram photos.
              </p>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Instagram Reels Downloader FAQ
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              Common questions about downloading supported Instagram Reels
              with InstaFetch.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <summary className="cursor-pointer list-none font-semibold text-white">
                  <div className="flex items-center justify-between gap-6">
                    <span>{faq.question}</span>

                    <span className="text-xl text-violet-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-4 leading-7 text-zinc-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-6 pb-24 pt-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Download a supported Instagram Reel
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">
            Paste a supported public Instagram Reel URL into InstaFetch and
            check the available media.
          </p>

          <Link
            href="/#download"
            className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >
            Open InstaFetch
          </Link>
        </section>
      </main>
    </>
  );
}