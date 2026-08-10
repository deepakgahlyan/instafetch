import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div>
          <Link
            href="/"
            className="text-xl font-bold text-white"
          >
            Insta<span className="text-violet-500">Fetch</span>
          </Link>

          <p className="mt-2 text-sm text-zinc-500">
            Fast and simple public Instagram downloads.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
          <Link
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How It Works
          </Link>

          <Link
            href="#faq"
            className="transition hover:text-white"
          >
            FAQ
          </Link>

          <Link
            href="/blog"
            className="transition hover:text-white"
          >
            Blog
          </Link>

          <Link
            href="/privacy"
            className="transition hover:text-white"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition hover:text-white"
          >
            Terms
          </Link>
        </nav>
      </div>

      <div className="border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-zinc-600">
          © {new Date().getFullYear()} InstaFetch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}