import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Contact InstaFetch",
  description:
    "Contact InstaFetch for questions, feedback, broken links, service issues, or other questions about the website.",
  alternates: { canonical: `${siteUrl}/contact` },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <Link href="/" className="text-sm font-semibold text-violet-400 hover:text-violet-300">
          ← Back to InstaFetch
        </Link>

        <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">Contact InstaFetch</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-400">
          We welcome questions and feedback about the InstaFetch website, downloader, documentation, and supported public URLs.
        </p>

        <div className="mt-10 space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
            <h2 className="text-xl font-bold">Service feedback</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              If a supported public URL is not working, include the type of content and the general problem you encountered. Do not send Instagram passwords, authentication codes, or other sensitive credentials.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
            <h2 className="text-xl font-bold">Content and rights concerns</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              For questions about content rights or a specific removal concern, provide enough information for the InstaFetch team to understand the request. Public availability does not by itself establish permission to reuse content.
            </p>
          </section>

          <section className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-7">
            <h2 className="text-xl font-bold">Email</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Email: <a className="font-semibold text-violet-400 hover:text-violet-300" href="mailto:support@instafetch.app">support@instafetch.app</a>
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Please do not include passwords, private account credentials, or other sensitive information in your message.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
