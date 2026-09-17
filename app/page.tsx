import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Features from "@/components/features/Features";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import DownloaderResourceCenter from "@/components/content/DownloaderResourceCenter";
import HighValueResource from "@/components/content/HighValueResource";
import FAQ from "@/components/faq/FAQ";
import Footer from "@/components/footer/Footer";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "InstaFetch — Fast Instagram Video, Reel & Photo Downloader",
  description:
    "InstaFetch is a browser-based downloader for supported public Instagram videos, Reels, photos, and carousels, with practical guides about media quality, availability, and responsible use.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "InstaFetch — Instagram Downloader",
    description: "A fast browser-based way to check supported public Instagram media, plus practical guides for using saved files responsibly.",
    url: siteUrl,
    siteName: "InstaFetch",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "@id": `${siteUrl}/#application`, name: "InstaFetch", url: siteUrl, description: "Browser-based downloader for supported public Instagram videos, Reels, photos, and carousels.", applicationCategory: "MultimediaApplication", operatingSystem: "Web Browser", browserRequirements: "Requires JavaScript", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": `${siteUrl}/#organization` } },
    { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "InstaFetch", url: siteUrl, description: "An independent browser-based media utility and resource center." },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "InstaFetch", url: siteUrl, description: "Instagram downloader and practical public-media guides.", publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en-US" },
    { "@type": "WebPage", "@id": `${siteUrl}/#webpage`, name: "InstaFetch — Instagram Downloader", url: siteUrl, isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#application` } },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <DownloaderResourceCenter />

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_.72fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Beyond the download button</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">A resource center built around real user questions</h2>
                <p className="mt-5 text-base leading-8 text-zinc-300">People rarely need only a file. They also want to know whether the link is public, why a carousel produced several items, why a video looks different on a desktop screen, which version is practical to save, and what rights may apply after the download.</p>
                <p className="mt-4 text-base leading-8 text-zinc-400">That is why InstaFetch pairs the downloader with explanatory resources. The goal is to help visitors make a clear decision about the media they are working with instead of sending every question to another search result.</p>
                <div className="mt-7 flex flex-wrap gap-3"><Link href="/instagram-downloader" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">Explore the downloader</Link><Link href="/blog" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:border-violet-500">Browse guides</Link></div>
              </div>
              <figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"><img src="/illustrations/instafetch-workflow.svg" alt="Custom InstaFetch illustration showing a public Instagram download workflow" width="1200" height="720" className="w-full" loading="lazy" /><figcaption className="border-t border-zinc-800 px-5 py-4 text-sm leading-6 text-zinc-500">Custom illustration created for InstaFetch to explain the URL-to-media workflow.</figcaption></figure>
            </div>
          </div>
        </section>

        <HighValueResource kind="home" />

        <section className="mx-auto max-w-6xl px-6 py-16" aria-labelledby="tools-title">
          <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Choose a workflow</p><h2 id="tools-title" className="mt-3 text-3xl font-bold md:text-4xl">Dedicated tools for different media types</h2><p className="mt-4 leading-8 text-zinc-400">Start with the page that matches the content you are working with. Each guide explains the practical details that are most relevant to that format.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link href="/instagram-video-downloader" className="group rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 transition hover:-translate-y-1 hover:border-violet-500/50"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Video</p><h3 className="mt-3 text-xl font-semibold">Instagram Video Downloader</h3><p className="mt-3 text-sm leading-7 text-zinc-400">Learn about resolution, bitrate, audio, portrait footage, file size, and sensible archiving for supported public videos.</p><span className="mt-5 inline-block text-sm font-semibold text-violet-400 group-hover:text-violet-300">Open video guide →</span></Link>
            <Link href="/instagram-reels-downloader" className="group rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 transition hover:-translate-y-1 hover:border-violet-500/50"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Reels</p><h3 className="mt-3 text-xl font-semibold">Instagram Reels Downloader</h3><p className="mt-3 text-sm leading-7 text-zinc-400">Understand portrait composition, audio, public availability, source context, and what to check before reusing a Reel.</p><span className="mt-5 inline-block text-sm font-semibold text-violet-400 group-hover:text-violet-300">Open Reel guide →</span></Link>
            <Link href="/instagram-photo-downloader" className="group rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 transition hover:-translate-y-1 hover:border-violet-500/50"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Photos</p><h3 className="mt-3 text-xl font-semibold">Instagram Photo Downloader</h3><p className="mt-3 text-sm leading-7 text-zinc-400">Learn how image dimensions, compression, carousels, file organization, and source context affect a photo download.</p><span className="mt-5 inline-block text-sm font-semibold text-violet-400 group-hover:text-violet-300">Open photo guide →</span></Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-8 md:p-12">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Practical guide</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">What to check before saving Instagram media</h2>
              <p className="mt-5 text-base leading-8 text-zinc-300">A useful download workflow starts before the file reaches your device. First check the source URL and make sure it points to the public post you intended to view. For videos, look at the visible orientation, expected quality, and whether the audio is important to your use case. For photos and carousels, confirm that the returned set contains the images you expected rather than assuming a single preview represents the entire post.</p>
              <p className="mt-5 text-base leading-8 text-zinc-300">It is also worth separating technical access from permission. A public page can expose media to a browser while the creator still retains copyright or other rights in the work. Saving a file for personal reference is different from reposting it, building a commercial library from it, or presenting it as your own. The safest workflow is to keep the original source context and obtain permission when your planned use requires it.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"><h3 className="font-semibold">Check the source</h3><p className="mt-2 text-sm leading-7 text-zinc-400">Use the original public post or Reel URL and make sure the page is still accessible.</p></article>
                <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"><h3 className="font-semibold">Review the result</h3><p className="mt-2 text-sm leading-7 text-zinc-400">For carousels, verify all returned items; for video, consider orientation and available quality.</p></article>
                <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"><h3 className="font-semibold">Keep context</h3><p className="mt-2 text-sm leading-7 text-zinc-400">Preserve the source information and check copyright or permission before public reuse.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Transparency</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">What InstaFetch can realistically do</h2><p className="mt-5 leading-8 text-zinc-300">InstaFetch is intended for supported public Instagram media. A page can still fail to resolve when a post is private, deleted, restricted, unsupported, or no longer exposing a compatible public rendition. Platform delivery systems can also change, so a successful result today is not a promise that the same URL will remain downloadable forever.</p><p className="mt-5 leading-8 text-zinc-300">The site does not ask users to submit Instagram passwords. It is also not affiliated with Instagram or Meta. These boundaries are part of the product: users should know what the tool does, what it does not do, and what responsibility remains with them after a file is saved.</p></div></section>

        <FAQ />
        <Footer />
      </main>
    </>
  );
}
