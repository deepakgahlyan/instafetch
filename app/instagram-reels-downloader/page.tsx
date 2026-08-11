import type { Metadata } from "next";
import Link from "next/link";
import HeroInput from "@/components/hero/HeroInput";

const siteUrl = "https://www.instafetch.app";
const pageUrl = `${siteUrl}/instagram-reels-downloader`;

export const metadata: Metadata = {
  title: "Instagram Reels Downloader",
  description:
    "Download supported public Instagram Reels online with InstaFetch. Paste a Reel URL and check for available downloadable media without an Instagram login.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Instagram Reels Downloader | InstaFetch",
    description:
      "Download supported public Instagram Reels online with InstaFetch. No Instagram login required.",
    url: pageUrl,
    siteName: "InstaFetch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels Downloader | InstaFetch",
    description:
      "Download supported public Instagram Reels online with InstaFetch.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "InstaFetch Instagram Reels Downloader",
  url: pageUrl,
  description:
    "Online downloader for supported public Instagram Reels.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  provider: {
    "@type": "Organization",
    name: "InstaFetch",
    url: siteUrl,
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I download Instagram Reels with InstaFetch?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "InstaFetch works with supported public Instagram Reel URLs. Private, unavailable, or unsupported content may not be downloadable.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to log in to Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No Instagram login is required to use InstaFetch for supported public Instagram Reels.",
      },
    },
    {
      "@type": "Question",
      name: "How do I download an Instagram Reel?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Copy the URL of a supported public Instagram Reel, paste it into InstaFetch, and submit the URL. If downloadable media is available, follow the download option provided.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my Instagram Reel not downloading?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "The Reel may be private, unavailable, unsupported, or the URL may be invalid. Try copying the public Reel URL again.",
      },
    },
  ],
};

export default function InstagramReelsDownloaderPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold">
            Insta<span className="text-violet-500">Fetch</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Back Home
          </Link>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
          Instagram Reels Downloader
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Instagram Reels Downloader
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Download supported public Instagram Reels online with InstaFetch.
          Copy an Instagram Reel URL, paste it below, and check whether
          downloadable media is available.
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <HeroInput />
        </div>

        <p className="mt-5 text-sm text-zinc-500">
          No Instagram login required. Works directly in your browser.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-bold">Simple Reel downloads</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Copy a supported public Instagram Reel URL and paste it into
              InstaFetch.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-bold">Use any browser</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              InstaFetch works through your browser on supported phones,
              tablets, and computers.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-bold">Public content</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              The service is designed for supported public Instagram Reels.
              Private or unavailable content may not work.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          How to Download Instagram Reels
        </h2>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-xl font-semibold">
              1. Find the Instagram Reel
            </h3>
            <p className="mt-3 leading-7 text-zinc-400">
              Open Instagram and find the public Reel you want to download.
              Use the sharing options to copy its URL.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              2. Paste the Reel URL
            </h3>
            <p className="mt-3 leading-7 text-zinc-400">
              Return to InstaFetch and paste the copied Instagram Reel link
              into the downloader above.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              3. Check the available media
            </h3>
            <p className="mt-3 leading-7 text-zinc-400">
              Submit the URL and review the result. If the Reel is supported
              and downloadable media is available, use the provided download
              option.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          Instagram Reels Downloader Without Login
        </h2>

        <p className="mt-5 leading-8 text-zinc-400">
          InstaFetch does not require you to enter your Instagram password or
          sign in to use the downloader for supported public Reels. Everything
          happens through your web browser, making the process straightforward
          on desktop and mobile devices.
        </p>

        <p className="mt-5 leading-8 text-zinc-400">
          Not every Instagram Reel will be available. Private posts, deleted
          content, invalid links, and unsupported media may not produce a
          downloadable result.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold">
              Can I download Instagram Reels with InstaFetch?
            </h3>
            <p className="mt-2 leading-7 text-zinc-400">
              InstaFetch works with supported public Instagram Reel URLs.
              Private, unavailable, or unsupported content may not work.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Do I need to log in to Instagram?
            </h3>
            <p className="mt-2 leading-7 text-zinc-400">
              No. InstaFetch does not require an Instagram login for supported
              public Reels.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Why is my Instagram Reel not downloading?
            </h3>
            <p className="mt-2 leading-7 text-zinc-400">
              The Reel may be private, unavailable, unsupported, or the URL
              may not be valid. Try copying the public Reel URL again.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Can I use InstaFetch on my phone?
            </h3>
            <p className="mt-2 leading-7 text-zinc-400">
              Yes. InstaFetch is browser-based and can be used on supported
              phones, tablets, and computers.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <h2 className="text-2xl font-bold">
            More Instagram Download Resources
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/instagram-video-downloader"
              className="text-violet-400 hover:text-violet-300"
            >
              Instagram Video Downloader
            </Link>

            <Link
              href="/blog/how-to-download-instagram-reels"
              className="text-violet-400 hover:text-violet-300"
            >
              How to Download Instagram Reels
            </Link>

            <Link
              href="/blog/instagram-download-tips"
              className="text-violet-400 hover:text-violet-300"
            >
              Instagram Download Tips
            </Link>

            <Link
              href="/blog/how-instafetch-works"
              className="text-violet-400 hover:text-violet-300"
            >
              How InstaFetch Works
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Back to InstaFetch
        </Link>
      </footer>
    </main>
  );
}