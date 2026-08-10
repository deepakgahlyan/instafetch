import Link from "next/link";

const posts = [
  {
    title: "How to Download Instagram Reels",
    description:
      "A simple guide to downloading supported public Instagram reels with InstaFetch.",
  },
  {
    title: "How InstaFetch Works",
    description:
      "Learn how the InstaFetch downloader turns a public Instagram URL into downloadable content.",
  },
  {
    title: "Instagram Download Tips",
    description:
      "Helpful tips for getting the best results when downloading public Instagram content.",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
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

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
            InstaFetch Blog
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            Tips, Guides & Updates
          </h1>

          <p className="mt-5 text-lg text-zinc-400">
            Learn more about downloading public Instagram content and using
            InstaFetch.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/40"
            >
              <div className="mb-6 h-32 rounded-2xl bg-gradient-to-br from-violet-600/30 to-pink-600/20" />

              <h2 className="text-2xl font-bold">
                {post.title}
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                {post.description}
              </p>

              <button
                type="button"
                className="mt-6 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
              >
                Read More →
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}