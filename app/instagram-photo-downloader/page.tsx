import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import HeroInput from "@/components/hero/HeroInput";
import HighValueResource from "@/components/content/HighValueResource";

const siteUrl = "https://www.instafetch.app";
const faqs = [
  ["What is an Instagram photo downloader?", "It is a web tool that checks a supported Instagram URL for downloadable image media. InstaFetch focuses on public photos and carousel images that can be accessed and processed."],
  ["Does InstaFetch always return the original photo?", "No. The result depends on the image rendition exposed by the public source. A social-platform copy is not a guaranteed replacement for the creator's original camera file."],
  ["Can InstaFetch handle photo carousels?", "Yes, when the public page exposes the carousel items, one URL can return multiple images so you can review the set before saving."],
  ["Do I need to log in to Instagram?", "No. InstaFetch is designed around a supported public URL and does not ask for your Instagram password."],
  ["Can I republish a downloaded photo?", "Not automatically. Check copyright, privacy, publicity rights, licensing, and any permission required for your intended use before publishing the image elsewhere."],
];
const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": `${siteUrl}/instagram-photo-downloader#webpage`, url: `${siteUrl}/instagram-photo-downloader`, name: "Instagram Photo Downloader", description: "A browser-based guide and downloader for supported public Instagram photos and carousels.", isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#application` } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Instagram Photo Downloader", item: `${siteUrl}/instagram-photo-downloader` }] },
  { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
] };

export const metadata: Metadata = {
  title: "Instagram Photo Downloader — Download Instagram Photos",
  description: "Use InstaFetch to check supported public Instagram photos and carousels, learn about image quality and availability, and save available media.",
  alternates: { canonical: `${siteUrl}/instagram-photo-downloader` },
};

export default function InstagramPhotoDownloaderPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-20 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">InstaFetch photo tool</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">Instagram Photo Downloader</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">Check supported public Instagram photos and carousel posts from your browser. This page explains practical image quality, how carousel structure affects downloads, why the original source matters, and how to keep saved images organized without confusing download access with reuse rights.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/#download" className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 text-sm font-semibold">Check a photo</Link><Link href="/blog" className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold hover:border-violet-500">Photo guides</Link></div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-sm text-zinc-500">Paste a public Instagram photo URL</p><h2 className="mt-2 text-xl font-bold">Check available image media</h2><div className="mt-6"><HeroInput /></div></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-10"><div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Image dimensions</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Larger dimensions can help with cropping, but size alone does not recreate detail that was lost during the original upload.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Carousel structure</h2><p className="mt-3 text-sm leading-7 text-zinc-400">A single post can contain several photos or a mix of images and videos, so review the full result before assuming there is only one file.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><h2 className="text-xl font-semibold">Source context</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Keep the original URL with important images so you can later identify the creator, context, and intended use.</p></article>
      </div></section>
      <HighValueResource kind="photo" />
      <section className="mx-auto max-w-5xl px-6 py-16"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Image workflow</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Keep one clean copy, then make working versions</h2><p className="mt-5 leading-8 text-zinc-300">When a photo matters, keep a clean copy before you crop or resize it. Create smaller versions for presentations, thumbnails, or device screens from that clean copy instead of repeatedly compressing the same file.</p><p className="mt-5 leading-8 text-zinc-300">For carousel posts, preserve the original order when that sequence carries meaning. A collection may tell a story, show a process, or present several views of the same subject. Saving the images with simple sequence numbers can make the set easier to understand later.</p><p className="mt-5 leading-8 text-zinc-300">If an image is going into a professional project, keep the source URL and notes about permission with the file. That small record is useful when someone later asks who created the image, where it came from, or whether it can be used commercially.</p></div></section>
      <section className="mx-auto max-w-4xl px-6 py-12"><div className="text-center"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">FAQ</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Instagram Photo Downloader FAQ</h2></div><div className="mt-8 space-y-4">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"><summary className="cursor-pointer list-none font-semibold"><div className="flex items-center justify-between gap-6"><span>{question}</span><span className="text-xl text-violet-400 transition-transform group-open:rotate-45">+</span></div></summary><p className="mt-4 leading-7 text-zinc-400">{answer}</p></details>)}</div></section>
      <Footer />
    </main>
  </>;
}
