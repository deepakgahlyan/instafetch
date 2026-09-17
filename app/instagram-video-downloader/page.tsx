import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import HeroInput from "@/components/hero/HeroInput";
import HighValueResource from "@/components/content/HighValueResource";

const siteUrl = "https://www.instafetch.app";
const faqs = [
  ["What is an Instagram video downloader?", "It is a web tool that checks a supported Instagram URL for downloadable video media. InstaFetch focuses on public videos that can be accessed and processed."],
  ["Does the downloader keep the original quality?", "The result depends on the media rendition exposed by the public source. InstaFetch cannot recreate details that are not present in the available source file."],
  ["Can I use the downloader on a phone?", "Yes. InstaFetch is browser-based and can be used from supported mobile and desktop browsers without a dedicated downloader application."],
  ["Why is my video available on Instagram but not downloadable?", "A page can remain visible while the current delivery path does not expose a media file that the resolver can process. Post changes and platform delivery changes can also affect availability."],
  ["Can I repost a downloaded video?", "Downloading access does not automatically grant reuse rights. Check copyright, privacy, publicity rights, music rights, and any permission needed for the intended use."],
];
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": `${siteUrl}/instagram-video-downloader#webpage`, url: `${siteUrl}/instagram-video-downloader`, name: "Instagram Video Downloader — Videos", description: "A browser-based guide and downloader for supported public Instagram videos.", isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#application` } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Instagram Video Downloader", item: `${siteUrl}/instagram-video-downloader` }] },
  { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
] };

export const metadata: Metadata = {
  title: "Instagram Video Downloader — Download Instagram Videos",
  description: "Use InstaFetch to check supported public Instagram videos, understand video quality and browser behavior, and download available media.",
  alternates: { canonical: `${siteUrl}/instagram-video-downloader` },
};

export default function InstagramVideoDownloaderPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-20 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">InstaFetch video tool</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">Instagram Video Downloader</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">Use a supported public Instagram video URL to check what video media is available. The guide below explains why video quality varies, how portrait footage behaves on desktop screens, why audio matters, and how to keep saved files organized for later use.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/#download" className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 text-sm font-semibold">Start a video check</Link><Link href="/blog" className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold hover:border-violet-500">Video guides</Link></div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-sm text-zinc-500">Paste a public Instagram video URL</p><h2 className="mt-2 text-xl font-bold">Check available video media</h2><div className="mt-6"><HeroInput /></div></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-10"><div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Resolution</h2><p className="mt-3 text-sm leading-7 text-zinc-400">A larger frame can preserve more detail, but the original upload, compression, and bitrate also influence perceived quality.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Audio</h2><p className="mt-3 text-sm leading-7 text-zinc-400">For tutorials, interviews, and music-driven clips, sound quality is part of the usefulness of the finished file.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Aspect ratio</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Vertical video can look narrow on desktop because the source was designed for a tall mobile screen.</p></article>
      </div></section>
      <HighValueResource kind="video" />
      <section className="mx-auto max-w-5xl px-6 py-16"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Video workflow notes</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Keep one clean master before you edit</h2><p className="mt-5 leading-8 text-zinc-300">If a clip matters to a project, save one untouched copy first. Create crops, resized versions, subtitles, or color adjustments from that master rather than repeatedly processing the same download. This keeps later versions easier to compare and reduces unnecessary quality loss.</p><p className="mt-5 leading-8 text-zinc-300">It is also helpful to record the source URL and the date you collected the clip. A filename tells you what a file is called; the source note tells you where it came from and gives you a way to check the surrounding context later.</p><p className="mt-5 leading-8 text-zinc-300">For large collections, storage planning matters. Ten small reference clips may occupy less space than one high-resolution project file, so choose quality according to the job instead of downloading the largest possible file by default.</p></div></section>
      <section className="mx-auto max-w-4xl px-6 py-12"><div className="text-center"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">FAQ</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Instagram Video Downloader FAQ</h2></div><div className="mt-8 space-y-4">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"><summary className="cursor-pointer list-none font-semibold"><div className="flex items-center justify-between gap-6"><span>{question}</span><span className="text-xl text-violet-400 transition-transform group-open:rotate-45">+</span></div></summary><p className="mt-4 leading-7 text-zinc-400">{answer}</p></details>)}</div></section>
      <Footer />
    </main>
  </>;
}
