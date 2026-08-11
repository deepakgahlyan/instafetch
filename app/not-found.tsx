import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <div className="max-w-lg">
        <p className="text-sm font-semibold text-violet-400">404</p>

        <h1 className="mt-4 text-4xl font-bold">
          Page not found
        </h1>

        <p className="mt-4 text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Return to InstaFetch to download supported public Instagram
          videos, Reels and photos.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
        >
          Back to InstaFetch
        </Link>
      </div>
    </main>
  );
}