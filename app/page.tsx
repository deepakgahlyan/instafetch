import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Features from "@/components/features/Features";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQ from "@/components/faq/FAQ";
import Footer from "@/components/footer/Footer";

const siteUrl = "https://www.instafetch.app";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#application`,
      name: "InstaFetch",
      url: siteUrl,
      description:
        "InstaFetch is a free online Instagram downloader for supported public Instagram videos, Reels, and photos.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "InstaFetch",
      url: siteUrl,
      description:
        "InstaFetch provides browser-based tools for downloading supported public Instagram videos, Reels, and photos.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "InstaFetch",
      url: siteUrl,
      description:
        "Free online Instagram downloader for supported public Instagram videos, Reels, and photos.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "InstaFetch — Fast Instagram Video & Reel Downloader",
      description:
        "Download supported public Instagram videos, Reels, and photos with InstaFetch.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#application`,
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-zinc-950">
        <Navbar />

        <Hero />

        <Features />

        <HowItWorks />

        {/* Main entity and topical content */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              InstaFetch Instagram Downloader
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
              Instagram Downloader for Videos, Reels &amp; Photos
            </h2>

            <p className="mt-5 leading-8 text-zinc-400">
              InstaFetch is a free online Instagram downloader for supported
              public Instagram videos, Reels, and photos. It lets you check
              supported Instagram URLs and download available media directly
              from your web browser. No Instagram password is required.
            </p>

            <p className="mt-4 leading-8 text-zinc-400">
              To use InstaFetch, copy the URL of a supported public Instagram
              video, Reel, or photo and paste it into the downloader above.
              InstaFetch checks the URL and displays available downloadable
              media when supported content can be accessed.
            </p>

            {/* Core downloader pages */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Link
                href="/instagram-video-downloader"
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/50"
              >
                <h3 className="font-semibold text-white">
                  Instagram Video Downloader
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Download supported public Instagram videos through your
                  browser.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
                  Learn more →
                </span>
              </Link>

              <Link
                href="/instagram-reels-downloader"
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/50"
              >
                <h3 className="font-semibold text-white">
                  Instagram Reels Downloader
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Download supported public Instagram Reels directly from your
                  browser.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
                  Learn more →
                </span>
              </Link>

              <Link
                href="/instagram-photo-downloader"
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/50"
              >
                <h3 className="font-semibold text-white">
                  Instagram Photo Downloader
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Download supported public Instagram photos through your
                  browser.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
                  Learn more →
                </span>
              </Link>
            </div>

            <h2 className="mt-12 text-2xl font-bold text-white">
              How to Download Instagram Content
            </h2>

            <p className="mt-4 leading-8 text-zinc-400">
              Start by copying the URL of the supported public Instagram
              content you want to download. Paste the link into the InstaFetch
              downloader and submit it. If downloadable media is available,
              InstaFetch will display the available download option.
            </p>

            <p className="mt-4 leading-8 text-zinc-400">
              InstaFetch works directly in a modern web browser on supported
              desktop and mobile devices. You do not need to install a
              dedicated downloader application or provide your Instagram
              password.
            </p>

            <h2 className="mt-12 text-2xl font-bold text-white">
              Supported Instagram Content
            </h2>

            <p className="mt-4 leading-8 text-zinc-400">
              InstaFetch is designed for supported public Instagram videos,
              Reels, and photos. Availability depends on whether the supplied
              URL can be accessed and whether the content is supported.
            </p>

            <p className="mt-4 leading-8 text-zinc-400">
              Private, restricted, unavailable, or unsupported Instagram
              content may not be downloadable. InstaFetch does not grant users
              permission to reuse content owned by other people or
              organizations.
            </p>

            <h2 className="mt-12 text-2xl font-bold text-white">
              Why Use InstaFetch?
            </h2>

            <p className="mt-4 leading-8 text-zinc-400">
              InstaFetch provides a straightforward browser-based way to check
              supported public Instagram media. The workflow is simple: copy
              the URL, paste it into InstaFetch, check the available media, and
              download the supported content.
            </p>

            <p className="mt-4 leading-8 text-zinc-400">
              The service is designed to work across modern desktop, tablet,
              and mobile browsers without requiring an Instagram login.
            </p>
          </div>
        </section>

        {/* Featured badges */}
        <section className="mx-auto max-w-4xl px-6 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://smollaunch.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://smollaunch.com/badges/featured.svg"
                alt="InstaFetch — Featured on Smol Launch"
                loading="lazy"
                width="250"
                height="60"
              />
            </a>

            <a
              href="https://saascity.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://saascity.io/badges/featured-dark.svg"
                alt="InstaFetch — Featured on SaaSCity"
                loading="lazy"
                width="150"
                height="54"
              />
            </a>
          </div>
        </section>

        <FAQ />

        <Footer />
      </main>
    </>
  );
}