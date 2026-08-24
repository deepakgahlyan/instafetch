import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the InstaFetch Terms of Service for use of the website and supported public Instagram download tools.",
  alternates: { canonical: `${siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300">← Back to InstaFetch</Link>
        <h1 className="mt-10 text-4xl font-bold md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-zinc-500">Last updated: August 24, 2026</p>

        <div className="mt-12 space-y-10 leading-8 text-zinc-300">
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Using InstaFetch</h2><p>InstaFetch provides browser-based tools for processing supported public Instagram URLs. By using the website, you agree to use it lawfully and in accordance with these terms.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Public and supported content</h2><p>The service is designed for supported publicly accessible content. A URL being publicly visible does not guarantee that it can be processed, and it does not give you ownership or permission to reuse the underlying content.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Copyright and creator rights</h2><p>You are responsible for determining whether you have the necessary rights or permission to download, reproduce, edit, publish, distribute, or commercially use content. Respect copyright, privacy, publicity rights, and other applicable rights.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Prohibited use</h2><p>You may not use InstaFetch to bypass access controls, obtain private-account content, abuse the service, interfere with its operation, violate applicable law, or infringe third-party rights.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">No account credentials</h2><p>InstaFetch does not require an Instagram password. Do not submit passwords, authentication codes, session tokens, or other credentials through the website.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Availability</h2><p>Instagram can change how public pages and media are delivered. Content may also be deleted, restricted, or made unavailable. InstaFetch does not guarantee that every URL will work or that the service will always be available.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Third-party services</h2><p>InstaFetch may depend on third-party hosting, processing, analytics, security, or advertising services. Those services can have separate terms and policies.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Independent service</h2><p>InstaFetch is independent and is not affiliated with, sponsored by, or endorsed by Instagram or Meta. Instagram is a trademark of its respective owner.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Changes to the service and terms</h2><p>We may change, suspend, or discontinue parts of InstaFetch and may update these terms when necessary. The current version will be posted on this page.</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold text-white">Contact</h2><p>Questions about these terms can be sent through the <Link href="/contact" className="text-violet-400 hover:text-violet-300">InstaFetch contact page</Link>.</p></section>
        </div>
      </article>
    </main>
  );
}
