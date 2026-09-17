import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import HeroInput from "@/components/hero/HeroInput";
import HighValueResource from "@/components/content/HighValueResource";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Instagram Downloader — Videos, Reels & Photos",
  description:
    "Use InstaFetch to check supported public Instagram videos, Reels, photos, and carousel media in a browser-based workflow. Learn about quality, availability, and responsible use.",
  alternates: { canonical: `${siteUrl}/instagram-downloader` },
  openGraph: {
    title: "Instagram Downloader | InstaFetch",
    description:
      "A browser-based Instagram downloader with practical guides for supported public videos, Reels, photos, and carousels.",
    url: `${siteUrl}/instagram-downloader`,
    siteName: "InstaFetch",
    type: "website",
  },
};

const faqs = [
  ["What does InstaFetch support?", "InstaFetch is designed for supported public Instagram posts, including videos, Reels, photos, and multi-item carousel posts."],
  ["Do I need an Instagram password?", "No. InstaFetch is designed around a public URL workflow and does not ask you to enter an Instagram username or password."],
  ["Can one Instagram URL return multiple files?", "Yes. A public carousel can contain several media items, so a single URL may produce a multi-item result rather than one file."],
  ["Why can a public URL fail?", "A post may have been deleted, made private, restricted, changed, or delivered in a format that the current resolver cannot process."],
  ["Does downloading a public file give me permission to repost it?", "No. Access to a file and the right to reuse it are different questions. Check copyright, privacy, creator rights, and any permission needed for your intended use."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/instagram-downloader#webpage`,
      url: `${siteUrl}/instagram-downloader`,
      name: "Instagram Downloader — Videos, Reels & Photos",
      description: "Browser-based Instagram downloader for supported public media.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#application` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Instagram Downloader", item: `${siteUrl}/instagram-downloader` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function InstagramDownloaderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <section className="mx-auto max-w-6xl px-6 pb-14 pt-20 md:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">InstaFetch</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">Instagram Downloader</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
                Use InstaFetch as a starting point for supported public Instagram videos, Reels, photos, and carousel posts. The page is built around a simple workflow, but the service also explains what happens to the URL, how media quality works, why some links are unavailable, and what to consider before reusing a saved file.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#download" className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Start a download</Link>
                <Link href="/blog" className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-violet-500">Read the guides</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
                <span>Public URLs</span><span>Browser-based</span><span>No password required</span>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-zinc-500">Try a supported public Instagram URL</p>
                <div className="mt-2 text-xl font-bold">Check available media</div>
                <div className="mt-6"><HeroInput /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">01</p><h2 className="mt-3 text-xl font-semibold">Choose the right source</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Use the original public post, Reel, or carousel URL. That keeps the request tied to the page you actually want to save.</p></article>
            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">02</p><h2 className="mt-3 text-xl font-semibold">Review before saving</h2><p className="mt-3 text-sm leading-7 text-zinc-400">A result can contain one file or several. Checking the returned media helps prevent accidental downloads of the wrong item.</p></article>
            <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">03</p><h2 className="mt-3 text-xl font-semibold">Keep the context</h2><p className="mt-3 text-sm leading-7 text-zinc-400">For important files, keep the source URL and any notes about your intended use alongside the saved media.</p></article>
          </div>
        </section>

        <HighValueResource kind="general" />

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">A better way to use the tool</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Treat the downloader and the information around it as one experience</h2>
            <p className="mt-5 leading-8 text-zinc-300">A polished utility should not make users guess what a button will do. InstaFetch separates the steps so the user can identify the source, submit it, inspect the returned media, and then decide what to save. That approach is useful whether the task takes ten seconds or is part of a larger research or creative workflow.</p>
            <p className="mt-5 leading-8 text-zinc-300">For repeat use, simple habits make the process more organized. Keep a folder for saved assets, note the source URL for files that matter, and avoid retaining unnecessary copies. For shared work, add context such as why the file was collected and whether a permission or license applies.</p>
            <p className="mt-5 leading-8 text-zinc-300">These details matter because a downloader is not just a retrieval mechanism. It sits between a public web page and a user's next action, so the surrounding product should make both the capabilities and the limits easy to understand.</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">FAQ</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Instagram Downloader FAQ</h2></div>
          <div className="mt-8 space-y-4">
            {faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"><summary className="cursor-pointer list-none font-semibold"><div className="flex items-center justify-between gap-6"><span>{question}</span><span className="text-xl text-violet-400 transition-transform group-open:rotate-45">+</span></div></summary><p className="mt-4 leading-7 text-zinc-400">{answer}</p></details>)}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
