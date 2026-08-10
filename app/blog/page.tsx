import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Downloader Guides & Tips",
  description:
    "Learn how to download public Instagram Reels, videos and photos, understand how InstaFetch works, and get better results from Instagram downloads.",
  alternates: {
    canonical: "https://www.instafetch.app/blog",
  },
  openGraph: {
    title: "Instagram Downloader Guides & Tips | InstaFetch",
    description:
      "Practical guides for downloading public Instagram Reels, videos and photos with InstaFetch.",
    url: "https://www.instafetch.app/blog",
    type: "website",
    siteName: "InstaFetch",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const posts = [
  {
    slug: "how-to-download-instagram-reels",
    title: "How to Download Instagram Reels",
    description:
      "Learn how to download supported public Instagram Reels from your phone, tablet or computer using a simple browser workflow.",
    category: "Instagram Reels",
    readTime: "5 min read",
  },
  {
    slug: "how-instafetch-works",
    title: "How InstaFetch Works",
    description:
      "Understand how InstaFetch processes a public Instagram URL and prepares supported videos, Reels and photos for download.",
    category: "How It Works",
    readTime: "4 min read",
  },
  {
    slug: "instagram-download-tips",
    title: "Instagram Download Tips",
    description:
      "Get better results when downloading public Instagram content and learn why some Instagram links may not work.",
    category: "Tips",
    readTime: "5 min read",
  },
];

const blogStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Instagram Downloader Guides & Tips",
  description:
    "Practical guides about downloading public Instagram Reels, videos and photos.",
  url: "https://www.instafetch.app/blog",
  isPartOf: {
    "@type": "WebSite",
    name: "InstaFetch",
    url: "https://www.instafetch.app",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `https://www.instafetch.app/blog/${post.slug}`,
    })),
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold">
            Insta<span className="text-violet-500">Fetch</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Back Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
            InstaFetch Blog
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Instagram Downloader Guides & Tips
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Practical guides for downloading supported public Instagram
            Reels, videos and photos, understanding how InstaFetch works, and
            getting better results from your downloads.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40"
            >
              <div className="mb-6 flex h-32 items-end rounded-2xl bg-gradient-to-br from-violet-600/30 to-pink-600/20 p-5">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
                  {post.category}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                {post.title}
              </h2>

              <p className="mt-4 flex-1 leading-7 text-zinc-400">
                {post.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {post.readTime}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-violet-400 transition hover:text-violet-300"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <h2 className="text-2xl font-bold">
            Ready to download a public Instagram post?
          </h2>

          <p className="mt-3 text-zinc-400">
            Paste a supported Instagram URL into InstaFetch and see whether
            downloadable media is available.
          </p>

          <Link
            href="/#download"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Open InstaFetch Downloader
          </Link>
        </div>
      </section>
    </main>
  );
}