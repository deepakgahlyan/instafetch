import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Instagram Downloader Guides & Practical Resources",
  description: "Original InstaFetch guides covering Instagram videos, Reels, photos, carousels, browser downloads, quality, troubleshooting, and responsible use.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: { title: "Instagram Downloader Guides & Practical Resources | InstaFetch", description: "Original practical resources about supported public Instagram media and browser-based downloads.", url: `${siteUrl}/blog`, siteName: "InstaFetch", type: "website" },
};

const articles = [
  { title: "How InstaFetch Works", description: "A plain-language explanation of the public URL workflow, available media checks, limitations, and responsible use.", href: "/blog/how-instafetch-works", category: "InstaFetch Guide", time: "4 min read" },
  { title: "How to Download Instagram Reels", description: "A practical guide to copying the original Reel URL, understanding portrait video, and checking the saved file.", href: "/blog/how-to-download-instagram-reels", category: "Instagram Reels", time: "5 min read" },
  { title: "Instagram Download Tips", description: "Useful checks for public URLs, source links, browser behavior, file organization, and common troubleshooting steps.", href: "/blog/instagram-download-tips", category: "Practical Tips", time: "5 min read" },
  { title: "How to Download Supported Instagram Videos on iPhone", description: "A device-focused guide covering browser downloads, the Files app, storage, and basic troubleshooting on iPhone.", href: "/blog/instagram-downloader-on-iphone", category: "iPhone Guide", time: "6 min read" },
  { title: "Why an Instagram Download May Not Work", description: "Understand the difference between a visible Instagram page and media that is actually exposed to a public resolver.", href: "/blog/why-instagram-download-fails", category: "Troubleshooting", time: "5 min read" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", "@id": `${siteUrl}/blog#webpage`, url: `${siteUrl}/blog`, name: "Instagram Downloader Guides & Practical Resources", description: "Original guides about supported public Instagram downloads.", isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#application` } },
    { "@type": "BreadcrumbList", "@id": `${siteUrl}/blog#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Guides", item: `${siteUrl}/blog` }] },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen bg-zinc-950 text-white">
        <header className="border-b border-zinc-800/80 bg-zinc-950/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-xl font-bold"><span className="text-white">Insta</span><span className="text-violet-500">Fetch</span></Link>
            <Link href="/" className="text-sm text-zinc-400 hover:text-white">Back to downloader</Link>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:pt-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_.75fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">InstaFetch resource center</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">Instagram downloader guides that answer the questions around the tool</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">The most useful downloader is not the one with the most buttons. It is the one that helps users understand the source they are working with, the file they receive, and the limitations that can affect a public URL. These guides are written to cover those practical questions.</p>
            </div>
            <figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"><img src="/illustrations/instagram-quality-guide.svg" alt="Custom illustration explaining factors that affect Instagram media quality" width="1200" height="680" className="w-full" /><figcaption className="border-t border-zinc-800 px-5 py-4 text-sm leading-6 text-zinc-500">Custom visual guide: source, media version, and delivery conditions all influence what a user can save.</figcaption></figure>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-10"><div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-8 md:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Editorial approach</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Useful information even when a download is not possible</h2><p className="mt-5 leading-8 text-zinc-300">Some URLs work immediately. Others do not, and a high-quality site should still help the person understand why. Our resources explain public versus private access, carousel structure, video quality, browser behavior, file organization, and responsible reuse so the page remains useful beyond a single download attempt.</p><p className="mt-4 leading-8 text-zinc-400">The content is written specifically for InstaFetch rather than generated from lists of interchangeable keywords. Each topic is organized around practical questions a visitor can act on.</p></div></section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Guides</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Browse the resource library</h2></div><Link href="/instagram-downloader" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold hover:border-violet-500">Open the downloader</Link></div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => <article key={article.href} className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 transition hover:-translate-y-1 hover:border-zinc-700"><span className="text-xs font-semibold uppercase tracking-wider text-violet-400">{article.category}</span><h3 className="mt-4 text-xl font-semibold">{article.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">{article.description}</p><div className="mt-6 flex items-center justify-between text-xs text-zinc-500"><span>{article.time}</span><Link href={article.href} className="font-semibold text-violet-400 hover:text-violet-300">Read guide →</Link></div></article>)}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16"><div className="grid gap-6 md:grid-cols-3"><article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Videos</p><h2 className="mt-3 text-2xl font-bold">Quality, sound, and file size</h2><p className="mt-4 text-sm leading-7 text-zinc-400">Learn why resolution is only one part of quality and how to keep a clean master file for editing or archiving.</p><Link href="/instagram-video-downloader" className="mt-5 inline-block text-sm font-semibold text-violet-400">Video downloader →</Link></article><article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Reels</p><h2 className="mt-3 text-2xl font-bold">Portrait video and context</h2><p className="mt-4 text-sm leading-7 text-zinc-400">Understand vertical composition, audio, source URLs, and what to check before a Reel becomes part of another project.</p><Link href="/instagram-reels-downloader" className="mt-5 inline-block text-sm font-semibold text-violet-400">Reels downloader →</Link></article><article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Photos</p><h2 className="mt-3 text-2xl font-bold">Dimensions and carousels</h2><p className="mt-4 text-sm leading-7 text-zinc-400">See how image candidates, compression, carousel order, and source context affect useful photo downloads.</p><Link href="/instagram-photo-downloader" className="mt-5 inline-block text-sm font-semibold text-violet-400">Photo downloader →</Link></article></div></section>

        <section className="mx-auto max-w-5xl px-6 py-16"><div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Need help?</p><h2 className="mt-3 text-3xl font-bold">A clear next step</h2><p className="mt-5 max-w-3xl leading-8 text-zinc-300">Start with the guide that matches your media type. When you are ready, return to the downloader and submit the original public Instagram URL. If the result is unavailable, the troubleshooting guide can help you separate a source problem from a browser problem.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">Open InstaFetch</Link><Link href="/contact" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold">Contact</Link><Link href="/about" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold">About</Link></div></div></section>
      </main>
    </>
  );
}
