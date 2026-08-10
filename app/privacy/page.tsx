import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the InstaFetch Privacy Policy and learn how information is handled when using the service.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <p className="mt-4 text-zinc-500">
          Last updated: August 10, 2026
        </p>

        <div className="mt-12 space-y-10 leading-8 text-zinc-400">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Information We Collect
            </h2>
            <p>
              InstaFetch is designed to work without requiring users to
              provide Instagram login credentials. Submitted public
              Instagram URLs are processed to provide download
              functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              How We Use Information
            </h2>
            <p>
              Submitted URLs are used to process download requests and
              provide the requested functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Instagram Credentials
            </h2>
            <p>
              InstaFetch does not ask users for Instagram passwords or
              login credentials.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Third-Party Services
            </h2>
            <p>
              InstaFetch may rely on third-party services to process
              publicly accessible media URLs. Those services may have
              their own policies.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}