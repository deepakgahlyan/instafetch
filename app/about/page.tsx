import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "About InstaFetch — Mission, Standards & Responsible Use",
  description:
    "Learn what InstaFetch is, how the service is designed, how its resource guides are created, and the standards used to make the site clear and useful.",
  alternates: { canonical: `${siteUrl}/about` },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: "About InstaFetch",
      description: "Information about the InstaFetch downloader and resource center.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-20 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">About InstaFetch</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">A downloader built around clarity</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">InstaFetch is an independent browser-based utility for supported public Instagram media. The service is intentionally simple at the point of use: provide a public URL, check what media is available, and choose the result you want to save. Around that workflow is a growing resource center that explains media quality, common availability problems, device behavior, and responsible reuse.</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">The purpose of this page is to make the project easier to understand. A useful site should explain who it is for, what it supports, what it cannot promise, and how its information is maintained.</p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"><img src="/illustrations/instafetch-workflow.svg" alt="Custom illustration representing the InstaFetch workflow" width="1200" height="720" className="w-full" /><figcaption className="border-t border-zinc-800 px-5 py-4 text-sm leading-6 text-zinc-500">A custom diagram used by InstaFetch to explain the public URL workflow.</figcaption></figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12"><div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Scope</p><h2 className="mt-3 text-xl font-semibold">Public media focus</h2><p className="mt-3 text-sm leading-7 text-zinc-400">The service is designed around supported public Instagram posts, Reels, videos, photos, and multi-item media where a public result is available.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Security</p><h2 className="mt-3 text-xl font-semibold">No password workflow</h2><p className="mt-3 text-sm leading-7 text-zinc-400">InstaFetch does not ask users to type an Instagram password into the downloader. Public URLs are the center of the workflow.</p></article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Independence</p><h2 className="mt-3 text-xl font-semibold">Separate from Instagram</h2><p className="mt-3 text-sm leading-7 text-zinc-400">InstaFetch is an independent website and is not affiliated with, sponsored by, or endorsed by Instagram or Meta.</p></article>
      </div></section>

      <section className="mx-auto max-w-5xl px-6 py-16"><div className="space-y-12 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12">
        <article><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">01 · What we are building</p><h2 className="mt-3 text-3xl font-bold">A useful utility, not a page full of promises</h2><p className="mt-5 leading-8 text-zinc-300">The download action is only one part of the experience. Visitors also need clear answers about supported links, file quality, carousel behavior, browser compatibility, and the reasons a page may not produce a result. InstaFetch is being developed around that complete experience so users can make sense of the result instead of repeatedly trying a tool without context.</p><p className="mt-5 leading-8 text-zinc-300">That also means avoiding claims that cannot be supported. Instagram's public delivery systems can change, a post can become unavailable, and a particular URL may stop exposing a compatible rendition. The site explains those boundaries directly so expectations remain realistic.</p></article>
        <article><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">02 · Resource standards</p><h2 className="mt-3 text-3xl font-bold">Original explanations and practical examples</h2><p className="mt-5 leading-8 text-zinc-300">The InstaFetch guides are intended to answer specific questions in original language: how aspect ratio affects a Reel on desktop, why a larger video file is not always a better source, how carousel posts differ from single-media posts, and what information is useful to keep with a saved file.</p><p className="mt-5 leading-8 text-zinc-300">We aim to make each resource useful on its own. A visitor should be able to read an article without needing to run a download first. That editorial approach matters because the site should offer value even when a particular URL cannot be resolved.</p></article>
        <article><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">03 · Responsible use</p><h2 className="mt-3 text-3xl font-bold">Access and ownership are different</h2><p className="mt-5 leading-8 text-zinc-300">A public page can be accessible without granting a blanket right to copy or republish its material. Depending on the content and intended use, copyright, privacy, publicity rights, licensing terms, music rights, and other rules may matter.</p><p className="mt-5 leading-8 text-zinc-300">For that reason, the site does not present downloading as permission to redistribute another person's work. The practical recommendation is simple: keep the source URL, know why you saved the file, and check the rights that apply before publishing or commercializing it.</p></article>
        <article><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">04 · What the site does not do</p><h2 className="mt-3 text-3xl font-bold">Clear boundaries are part of trust</h2><p className="mt-5 leading-8 text-zinc-300">InstaFetch does not ask visitors for Instagram passwords and does not describe itself as a way to access private accounts. It is not an archive of every Instagram post, and it cannot guarantee that every public URL will remain downloadable.</p><p className="mt-5 leading-8 text-zinc-300">The service also does not claim ownership of downloaded media. The role of InstaFetch is to provide a browser-based utility and original educational resources around that utility.</p></article>
      </div></section>

      <section className="mx-auto max-w-6xl px-6 py-12"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"><img src="/illustrations/responsible-downloads.svg" alt="Custom illustration about public access, rights, and privacy" width="1200" height="650" className="w-full" loading="lazy" /></figure><div><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Responsible use</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Use the information around the tool, too</h2><p className="mt-5 leading-8 text-zinc-300">The resource center is here so users can understand the difference between a successful technical result and a responsible use of that result. That includes keeping source information, respecting privacy, and checking whether an intended reuse is allowed.</p><p className="mt-4 leading-8 text-zinc-400">For more detail, visit the guides or the privacy and terms pages linked below.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/blog" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">Browse guides</Link><Link href="/privacy" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold">Privacy</Link><Link href="/terms" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold">Terms</Link><Link href="/contact" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold">Contact</Link></div></div></div></div></section>
      <Footer />
    </main>
  );
}
