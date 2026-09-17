import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import HeroInput from "@/components/hero/HeroInput";
import HighValueResource from "@/components/content/HighValueResource";

const siteUrl = "https://www.instafetch.app";
const faqs = [
  ["What is an Instagram Reels downloader?", "It is a browser-based tool that checks a supported public Reel URL for downloadable video media."],
  ["Why do Reels look narrow on a computer?", "Most Reels are designed for a tall mobile canvas. The original portrait aspect ratio can therefore look narrow on a wide desktop screen."],
  ["Can a Reel stop being downloadable?", "Yes. A Reel can become private, be deleted or restricted, or stop exposing a media rendition that the current resolver can process."],
  ["Does InstaFetch need my Instagram password?", "No. The workflow is based on a supported public URL and does not ask you for Instagram credentials."],
  ["Can I repost a downloaded Reel?", "Downloading a file does not by itself grant permission to republish it. Review copyright, privacy, music, and creator-rights considerations before reuse."],
];
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": `${siteUrl}/instagram-reels-downloader#webpage`, url: `${siteUrl}/instagram-reels-downloader`, name: "Instagram Reels Downloader", description: "A browser-based guide and downloader for supported public Instagram Reels.", isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#application` } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Instagram Reels Downloader", item: `${siteUrl}/instagram-reels-downloader` }] },
  { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
] };

export const metadata: Metadata = {
  title: "Instagram Reels Downloader — Download Instagram Reels",
  description: "Use InstaFetch to check supported public Instagram Reels and learn about portrait video, audio, availability, and responsible reuse.",
  alternates: { canonical: `${siteUrl}/instagram-reels-downloader` },
};

export default function InstagramReelsDownloaderPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-20 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">InstaFetch Reels tool</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">Instagram Reels Downloader</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">Check supported public Instagram Reels from your browser. This page combines the downloader with practical information about vertical video, source URLs, audio, file organization, and the difference between downloading access and permission to reuse a creator's work.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/#download" className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 text-sm font-semibold">Check a Reel</Link><Link href="/blog/how-to-download-instagram-reels" className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold hover:border-violet-500">Read the Reel guide</Link></div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-sm text-zinc-500">Paste a public Instagram Reel URL</p><h2 className="mt-2 text-xl font-bold">Check available Reel media</h2><div className="mt-6"><HeroInput /></div></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-10"><div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Portrait format</h2><p className="mt-3 text-sm leading-7 text-zinc-400">A vertical Reel can appear narrow on desktop because its source composition is designed for a tall screen.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Source context</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Keep the original Reel URL with important saved clips so the creator and surrounding context remain easy to find.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Audio matters</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Speech, music, and on-screen text can be central to a Reel, so check the complete file before using it elsewhere.</p></article>
      </div></section>
      <HighValueResource kind="reels" />
      <section className="mx-auto max-w-5xl px-6 py-16"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Reel workflow</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Save the original clip before making platform-specific edits</h2><p className="mt-5 leading-8 text-zinc-300">A Reel may eventually need a crop for a presentation, a square preview, or a longer-form edit. Keep one original copy first. Cropping, resizing, and repeated exports can remove information from the image and make future changes harder.</p><p className="mt-5 leading-8 text-zinc-300">For research or creative reference, write down the creator and source URL at the same time you save the clip. A saved video without context quickly becomes difficult to identify when a project contains many similar files.</p><p className="mt-5 leading-8 text-zinc-300">When the Reel contains licensed music, another person's face, brand material, or original artwork, review the rights attached to those elements before publishing the downloaded file anywhere else.</p></div></section>
      <section className="mx-auto max-w-4xl px-6 py-12"><div className="text-center"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">FAQ</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Instagram Reels Downloader FAQ</h2></div><div className="mt-8 space-y-4">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"><summary className="cursor-pointer list-none font-semibold"><div className="flex items-center justify-between gap-6"><span>{question}</span><span className="text-xl text-violet-400 transition-transform group-open:rotate-45">+</span></div></summary><p className="mt-4 leading-7 text-zinc-400">{answer}</p></details>)}</div></section>
      <Footer />
    </main>
  </>;
}
