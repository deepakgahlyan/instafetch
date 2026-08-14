import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Instagram Downloader — Download Videos, Reels & Photos",
  description:
    "InstaFetch is a free online Instagram downloader for supported public Instagram videos, Reels, and photos. Paste an Instagram URL to check available media and download it from your browser.",
  alternates: {
    canonical: `${siteUrl}/instagram-downloader`,
  },
  openGraph: {
    title: "Instagram Downloader | InstaFetch",
    description:
      "Download supported public Instagram videos, Reels, and photos with InstaFetch.",
    url: `${siteUrl}/instagram-downloader`,
    siteName: "InstaFetch",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is an Instagram downloader?",
    answer:
      "An Instagram downloader is an online tool that can retrieve downloadable media from supported Instagram URLs. InstaFetch is a browser-based Instagram downloader for supported public videos, Reels, and photos.",
  },
  {
    question: "How do I download an Instagram video?",
    answer:
      "Copy the URL of a supported public Instagram video, paste it into InstaFetch, and start the download process. If the content is accessible and supported, InstaFetch will display the available media.",
  },
  {
    question: "Can InstaFetch download Instagram Reels?",
    answer:
      "Yes. InstaFetch supports downloading supported public Instagram Reels. Copy the Reel URL and paste it into the InstaFetch downloader to check the available media.",
  },
  {
    question: "Can I download Instagram photos?",
    answer:
      "Yes. InstaFetch supports supported public Instagram photos when downloadable media is available from the supplied URL.",
  },
  {
    question: "Do I need an Instagram account?",
    answer:
      "InstaFetch does not require you to provide an Instagram username or password to use the downloader.",
  },
  {
    question: "Do I need to install an application?",
    answer:
      "No. InstaFetch is a browser-based Instagram downloader that can be used from a modern desktop or mobile web browser.",
  },
  {
    question: "Why might an Instagram URL not work?",
    answer:
      "A URL may not work if the content is private, unavailable, unsupported, restricted, or otherwise inaccessible. InstaFetch can only provide downloadable media when supported content can be accessed.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/instagram-downloader#webpage`,
      url: `${siteUrl}/instagram-downloader`,
      name: "Instagram Downloader — Download Videos, Reels & Photos",
      description:
        "InstaFetch is a free online Instagram downloader for supported public Instagram videos, Reels, and photos.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#application`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/instagram-downloader#breadcrumb`,
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
          name: "Instagram Downloader",
          item: `${siteUrl}/instagram-downloader`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/instagram-downloader#faq`,
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

export default function InstagramDownloaderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-zinc-950 text-white">
        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              InstaFetch Instagram Downloader
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              Instagram Downloader
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              InstaFetch is a free online Instagram downloader for supported
              public Instagram videos, Reels, and photos. Paste an Instagram
              URL to check available media and download it directly from your
              browser.
            </p>

            <Link
              href="/#download"
              className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-4 font-semibold text-white transition hover:scale-105"
            >
              Open InstaFetch Downloader
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <h2 className="text-xl font-semibold">
                Instagram Video Downloader
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Use InstaFetch to check supported public Instagram video URLs
                and download available video media.
              </p>
              <Link
                href="/instagram-video-downloader"
                className="mt-5 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
              >
                Instagram Video Downloader →
              </Link>
            </article>

            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <h2 className="text-xl font-semibold">
                Instagram Reels Downloader
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Copy a supported public Instagram Reel URL and use InstaFetch
                to check whether downloadable Reel media is available.
              </p>
              <Link
                href="/instagram-reels-downloader"
                className="mt-5 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
              >
                Instagram Reels Downloader →
              </Link>
            </article>

            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
              <h2 className="text-xl font-semibold">
                Instagram Photo Downloader
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Check supported public Instagram photo URLs and download
                available image media through your browser.
              </p>
              <Link
                href="/instagram-photo-downloader"
                className="mt-5 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
              >
                Instagram Photo Downloader →
              </Link>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-bold">
            How to download Instagram content with InstaFetch
          </h2>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">
                1. Copy the Instagram URL
              </h3>
              <p className="mt-2 leading-7 text-zinc-400">
                Open the supported public Instagram video, Reel, or photo you
                want to download and copy its URL.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                2. Paste the URL into InstaFetch
              </h3>
              <p className="mt-2 leading-7 text-zinc-400">
                Paste the Instagram URL into the InstaFetch downloader and
                start the download process.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                3. Check available media
              </h3>
              <p className="mt-2 leading-7 text-zinc-400">
                InstaFetch checks the supplied URL and displays available
                downloadable media when supported content can be accessed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                4. Download the media
              </h3>
              <p className="mt-2 leading-7 text-zinc-400">
                Select the available download option to save the supported
                media to your device.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-bold">
            Why use InstaFetch?
          </h2>

          <div className="mt-8 space-y-5 text-zinc-400">
            <p>
              InstaFetch provides a simple browser-based way to work with
              supported public Instagram media without requiring dedicated
              downloader software.
            </p>

            <p>
              The service supports public Instagram videos, Reels, and photos
              when the supplied URL can be accessed and processed.
            </p>

            <p>
              InstaFetch does not require users to enter their Instagram
              password, making the workflow straightforward: copy the URL,
              paste it into InstaFetch, check the available media, and
              download.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-bold">
            Instagram Downloader FAQ
          </h2>

          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <summary className="cursor-pointer font-semibold text-white">
                  {faq.question}
                </summary>

                <p className="mt-4 leading-7 text-zinc-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 pt-12 text-center">
          <h2 className="text-3xl font-bold">
            Try InstaFetch
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">
            Use InstaFetch to check supported public Instagram videos, Reels,
            and photos directly from your browser.
          </p>

          <Link
            href="/#download"
            className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-4 font-semibold text-white transition hover:scale-105"
          >
            Start Downloading
          </Link>
        </section>
      </main>
    </>
  );
}