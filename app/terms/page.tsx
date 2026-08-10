import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Link
          href="/"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to InstaFetch
        </Link>

        <h1 className="mt-10 text-5xl font-bold">
          Terms of Service
        </h1>

        <p className="mt-4 text-zinc-500">
          Last updated: August 10, 2026
        </p>

        <div className="mt-12 space-y-10 text-zinc-400 leading-8">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Use of InstaFetch
            </h2>
            <p>
              InstaFetch provides tools for processing publicly accessible
              Instagram URLs. You are responsible for using the service
              lawfully and respecting the rights of content owners.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Content Responsibility
            </h2>
            <p>
              You should only download or use content when you have the
              appropriate rights or permission to do so.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Prohibited Use
            </h2>
            <p>
              You may not use InstaFetch for unlawful activity, abuse,
              unauthorized access, or activities that violate applicable
              laws or third-party rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Availability
            </h2>
            <p>
              We may modify, suspend, or discontinue parts of the service at
              any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Contact
            </h2>
            <p>
              If you have questions about these Terms, please contact the
              InstaFetch team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}