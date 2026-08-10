import Link from "next/link";
import type { Metadata } from "next";

const url = "https://www.instafetch.app/blog/how-instafetch-works";

export const metadata: Metadata = {
  title: "How InstaFetch Works",
  description:
    "Learn how InstaFetch processes a public Instagram URL and prepares supported videos, Reels and photos for download.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "How InstaFetch Works | Instagram Downloader",
    description:
      "Understand how InstaFetch processes public Instagram URLs and prepares supported media for download.",
    url,
    type: "article",
    siteName: "InstaFetch",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How InstaFetch Works",
  description:
    "Learn how InstaFetch processes public Instagram URLs and prepares supported media for download.",
  datePublished: "2026-08-10",
  dateModified: "2026-08-10",
  author: {
    "@type": "Organization",
    name: "InstaFetch",
    url: "https://www.instafetch.app",
  },
  publisher: {
    "@type": "Organization",
    name: "InstaFetch",
    url: "https://www.instafetch.app",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.instafetch.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://www.instafetch.app/blog",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "How InstaFetch Works",
      item: url,
    },
  ],
};

export default function HowInstaFetchWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold">
            Insta<span className="text-violet-500">Fetch</span>
          </Link>

          <Link
            href="/blog"
            className="text-sm text-zinc-400 hover:text-white"
          >
            Back to Blog
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-violet-400">
          How It Works · 4 min read
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          How InstaFetch Works
        </h1>

        <p className="mt-6 text-xl leading-8 text-zinc-400">
          InstaFetch is a browser-based Instagram downloader designed to make
          supported public Instagram media easier to download.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <span className="text-2xl font-bold text-violet-400">1</span>
            <h2 className="mt-3 font-semibold">Paste a URL</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Provide a supported public Instagram link.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <span className="text-2xl font-bold text-violet-400">2</span>
            <h2 className="mt-3 font-semibold">Process the request</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              InstaFetch checks the URL for supported downloadable media.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <span className="text-2xl font-bold text-violet-400">3</span>
            <h2 className="mt-3 font-semibold">Download</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Available media is presented for download.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold">
            What happens when you paste an Instagram URL?
          </h2>

          <p className="mt-4 leading-8 text-zinc-300">
            When you submit a URL, InstaFetch sends the request to its
            server-side download endpoint. The service checks the supplied
            Instagram URL and attempts to identify media that the downloader
            supports.
          </p>

          <p className="mt-4 leading-8 text-zinc-300">
            If supported media is available, the application returns the
            available media information to the browser. You can then choose
            the result you want to download.
          </p>

          <h2 className="mt-10 text-2xl font-bold">
            Why does InstaFetch focus on public content?
          </h2>

          <p className="mt-4 leading-8 text-zinc-300">
            The service is designed around publicly accessible Instagram
            content. It does not ask you to provide Instagram credentials or
            attempt to give access to private accounts.
          </p>

          <h2 className="mt-10 text-2xl font-bold">
            What can affect a download?
          </h2>

          <p className="mt-4 leading-8 text-zinc-300">
            Instagram URLs can stop working, content can be deleted or
            restricted, and Instagram can change how its public pages are
            delivered. Because of that, a valid-looking URL is not a guarantee
            that downloadable media will always be available.
          </p>

          <h2 className="mt-10 text-2xl font-bold">
            Is InstaFetch an Instagram service?
          </h2>

          <p className="mt-4 leading-8 text-zinc-300">
            No. InstaFetch is an independent website and is not affiliated with
            or endorsed by Instagram or Meta.
          </p>

          <h2 className="mt-10 text-2xl font-bold">
            Use downloaded content responsibly
          </h2>

          <p className="mt-4 leading-8 text-zinc-300">
            Downloading publicly accessible content and having permission to
            reuse that content are different things. Respect copyright,
            creator rights, privacy, and applicable laws when using downloaded
            media.
          </p>
        </div>

        <div className="mt-14 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">
          <h2 className="text-2xl font-bold">
            Try the InstaFetch downloader
          </h2>

          <p className="mt-3 text-zinc-400">
            Start with a supported public Instagram URL.
          </p>

          <Link
            href="/#download"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 font-semibold"
          >
            Open Downloader
          </Link>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-8">
          <Link
            href="/blog"
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← Back to Instagram downloader guides
          </Link>
        </div>
      </article>
    </main>
  );
}