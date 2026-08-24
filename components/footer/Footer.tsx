import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row">
        <div>
          <Link href="/" className="text-xl font-bold text-white">
            Insta<span className="text-violet-500">Fetch</span>
          </Link>
          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Fast, browser-based tools for supported public Instagram videos, Reels, and photos.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-400">
          <Link href="#features" className="transition hover:text-white">Features</Link>
          <Link href="#how-it-works" className="transition hover:text-white">How It Works</Link>
          <Link href="#faq" className="transition hover:text-white">FAQ</Link>
          <Link href="/instagram-downloader" className="transition hover:text-white">Instagram Downloader</Link>
          <Link href="/blog" className="transition hover:text-white">Guides</Link>
          <Link href="/about" className="transition hover:text-white">About</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
          <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
        </nav>
      </div>

      <div className="border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm leading-6 text-zinc-600">
          © {new Date().getFullYear()} InstaFetch. All rights reserved. InstaFetch is an independent service and is not affiliated with or endorsed by Instagram or Meta.
        </div>
      </div>
    </footer>
  );
}
