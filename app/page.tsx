import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Features from "@/components/features/Features";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQ from "@/components/faq/FAQ";
import Footer from "@/components/footer/Footer";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "InstaFetch — Fast Instagram Video & Reel Downloader",
  description:
    "InstaFetch is a free browser-based Instagram downloader for supported public videos, Reels, and photos. No Instagram login required.",
  alternates: { canonical: siteUrl },
};

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
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "InstaFetch",
      url: siteUrl,
      description:
        "InstaFetch provides browser-based tools for supported public Instagram videos, Reels, and photos.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "InstaFetch",
      url: siteUrl,
      description:
        "Free online Instagram downloader for supported public videos, Reels, and photos.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "InstaFetch — Fast Instagram Video & Reel Downloader",
      description:
        "Download supported public Instagram videos, Reels, and photos with InstaFetch.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#application` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">InstaFetch Instagram Downloader</p>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Instagram Downloader for Videos, Reels &amp; Photos</h2>
            <p className="mt-5 leading-8 text-zinc-300">
              InstaFetch is a free online Instagram downloader for supported public Instagram videos, Reels, and photos. It gives you a simple browser-based workflow: copy a public Instagram URL, paste it into the downloader, check the available media, and download a supported result. No Instagram password is required.
            </p>
            <p className="mt-4 leading-8 text-zinc-400">
              The service is intentionally focused on publicly accessible content. A URL can still fail when a post is private, deleted, restricted, unavailable, unsupported, or delivered in a way the downloader cannot process. A successful download also does not automatically give permission to republish or commercially reuse the creator's work.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Link href="/instagram-video-downloader" className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/50">
                <h3 className="font-semibold text-white">Instagram Video Downloader</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">A dedicated workflow for supported public Instagram video URLs.</p>
                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">Learn more →</span>
              </Link>
              <Link href="/instagram-reels-downloader" className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/50">
                <h3 className="font-semibold text-white">Instagram Reels Downloader</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">A dedicated workflow for supported public Instagram Reels.</p>
                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">Learn more →</span>
              </Link>
              <Link href="/instagram-photo-downloader" className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/50">
                <h3 className="font-semibold text-white">Instagram Photo Downloader</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">A dedicated workflow for supported public Instagram photos.</p>
                <span className="mt-4 inline-block text-sm font-semibold text-violet-400">Learn more →</span>
              </Link>
            </div>

            <h2 className="mt-14 text-2xl font-bold text-white">How to use InstaFetch</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-4">
              {[
                ["01", "Find a public post", "Open the supported Instagram video, Reel, or photo you want to work with."],
                ["02", "Copy its URL", "Use Instagram's share controls to copy the post or Reel link."],
                ["03", "Paste the URL", "Return to InstaFetch and submit the link in the downloader."],
                ["04", "Check the result", "If supported media is available, choose the available download option."],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                  <span className="text-sm font-bold text-violet-400">{number}</span>
                  <h3 className="mt-3 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-14 text-2xl font-bold text-white">Why a download may not work</h2>
            <p className="mt-4 leading-8 text-zinc-400">
              Instagram content can change after a URL is copied. Private accounts, removed posts, regional or account restrictions, unsupported content types, expired or malformed links, and changes to Instagram's public delivery systems can all prevent a result. If a URL fails, confirm that the post is publicly viewable, copy the original link again, and try the request once more from a current browser.
            </p>

            <h2 className="mt-14 text-2xl font-bold text-white">Privacy and responsible use</h2>
            <p className="mt-4 leading-8 text-zinc-400">
              InstaFetch does not ask for an Instagram password. Avoid submitting credentials or private account information. Before downloading or reusing another person's work, consider copyright, privacy, publicity rights, and any permission required for your intended use. InstaFetch is an independent service and is not affiliated with or endorsed by Instagram or Meta.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/about" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:border-violet-500">About InstaFetch</Link>
              <Link href="/blog" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:border-violet-500">Read the guides</Link>
              <Link href="/contact" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:border-violet-500">Contact us</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-12" aria-label="InstaFetch featured listings">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="https://smollaunch.com" target="_blank" rel="noopener noreferrer">
              <img src="https://smollaunch.com/badges/featured.svg" alt="InstaFetch — Featured on Smol Launch" loading="lazy" width="250" height="60" />
            </a>
            <a href="https://www.launchory.app/startups/instafetch?ref=badge" target="_blank" rel="noopener noreferrer">
              <img src="https://www.launchory.app/api/badge/instafetch?theme=dark" alt="Featured on Launchory" loading="lazy" width="240" height="54" />
            </a>
            <a href="https://saascity.io" target="_blank" rel="noopener noreferrer">
              <img src="https://saascity.io/badges/featured-dark.svg" alt="InstaFetch — Featured on SaaSCity" loading="lazy" width="150" height="54" />
            </a>
            <a href="https://thesaasdir.com/product/instafetch?ref=badge" target="_blank" rel="noopener noreferrer">
              <img src="https://thesaasdir.com/badge/instafetch.svg" alt="Featured on TheSaaSDir" loading="lazy" width="182" height="46" />
            </a>
          </div>
        </section>

        <FAQ />
        <Footer />
      </main>
    </>
  );
}
