import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Instagram Downloader Guides & Tips",
  description: "Practical guides about supported public Instagram videos, Reels, photos, troubleshooting, browser downloads, and responsible use with InstaFetch.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: { title: "Instagram Downloader Guides & Tips | InstaFetch", description: "Practical Instagram downloader guides and troubleshooting resources.", url: `${siteUrl}/blog`, siteName: "InstaFetch", type: "website" },
};

const articles = [
  { title: "How InstaFetch Works", description: "Learn how InstaFetch processes supported public Instagram URLs and prepares available media.", href: "/blog/how-instafetch-works", category: "InstaFetch Guide" },
  { title: "How to Download Instagram Reels", description: "A practical browser-based guide for supported public Instagram Reels.", href: "/blog/how-to-download-instagram-reels", category: "Instagram Reels" },
  { title: "Instagram Download Tips", description: "Practical checks for public URLs, unavailable posts, browser issues, and download troubleshooting.", href: "/blog/instagram-download-tips", category: "Tips" },
  { title: "How to Download Supported Instagram Videos on iPhone", description: "A step-by-step iPhone workflow and guidance on finding Safari downloads.", href: "/blog/instagram-downloader-on-iphone", category: "iPhone Guide" },
  { title: "Why an Instagram Download May Not Work", description: "Understand common URL, privacy, content-type, browser, and availability problems.", href: "/blog/why-instagram-download-fails", category: "Troubleshooting" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", "@id": `${siteUrl}/blog#webpage`, url: `${siteUrl}/blog`, name: "Instagram Downloader Guides & Tips", description: "Practical guides about supported public Instagram downloads.", isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${siteUrl}/#application` } },
    { "@type": "BreadcrumbList", "@id": `${siteUrl}/blog#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "InstaFetch", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` }] },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="min-h-screen bg-zinc-950 text-white">
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-24 text-center">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">InstaFetch</Link>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">Instagram Downloader Guides &amp; Tips</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">Practical information about supported public Instagram videos, Reels, photos, browser workflows, troubleshooting, and responsible use.</p>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-16">
          <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-8 md:p-10">
            <h2 className="text-2xl font-bold">About the InstaFetch resource center</h2>
            <p className="mt-4 leading-8 text-zinc-300">The InstaFetch blog is intended to answer the questions people encounter before, during, and after using a browser-based Instagram downloader. Articles explain the workflow, limitations, device-specific considerations, and common reasons a public URL may not produce a downloadable result.</p>
            <p className="mt-4 leading-8 text-zinc-400">We focus on practical information rather than creating pages that simply repeat the name of a downloader with a different keyword.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Guides</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">InstaFetch guides</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.href} className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">{article.category}</span>
                <h3 className="mt-4 text-xl font-semibold">{article.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">{article.description}</p>
                <Link href={article.href} className="mt-6 text-sm font-semibold text-violet-400 hover:text-violet-300">Read guide →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">Instagram downloader resources</h2>
            <p className="mt-4 leading-8 text-zinc-400">Use the dedicated tool pages for the content type you need, then return to the guides if you need troubleshooting or device-specific information.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Link href="/instagram-video-downloader" className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 hover:border-violet-500/50"><h3 className="font-semibold">Instagram Video Downloader</h3><p className="mt-2 text-sm text-zinc-400">Supported public Instagram videos.</p><span className="mt-4 inline-block text-sm font-semibold text-violet-400">Open tool →</span></Link>
              <Link href="/instagram-reels-downloader" className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 hover:border-violet-500/50"><h3 className="font-semibold">Instagram Reels Downloader</h3><p className="mt-2 text-sm text-zinc-400">Supported public Instagram Reels.</p><span className="mt-4 inline-block text-sm font-semibold text-violet-400">Open tool →</span></Link>
              <Link href="/instagram-photo-downloader" className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 hover:border-violet-500/50"><h3 className="font-semibold">Instagram Photo Downloader</h3><p className="mt-2 text-sm text-zinc-400">Supported public Instagram photos.</p><span className="mt-4 inline-block text-sm font-semibold text-violet-400">Open tool →</span></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 pt-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to use InstaFetch?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">Start with a supported public Instagram URL.</p>
          <Link href="/#download" className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 font-semibold">Open InstaFetch</Link>
        </section>
      </main>
    </>
  );
}
