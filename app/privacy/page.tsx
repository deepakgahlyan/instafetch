import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how InstaFetch handles URLs, cookies, analytics, advertising, third-party services, and privacy when you use the website.",
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300">← Back to InstaFetch</Link>
        <h1 className="mt-10 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-zinc-500">Last updated: August 24, 2026</p>

        <div className="mt-12 space-y-10 leading-8 text-zinc-300">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Overview</h2>
            <p>
              This Privacy Policy explains how information may be handled when you use InstaFetch. InstaFetch is a browser-based service for supported public Instagram URLs. You can use the downloader without providing an Instagram username or password.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">URLs submitted to the service</h2>
            <p>
              When you submit a URL, the URL is used to process your download request and determine whether supported media is available. Do not submit passwords, authentication tokens, private account credentials, or other sensitive information through the downloader.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Information we may receive</h2>
            <p>
              Like most websites, InstaFetch and the services used to operate it may receive technical information associated with a web request, such as an IP address, browser information, device information, request time, and basic diagnostic information. The exact information retained depends on the hosting, analytics, security, and download infrastructure used by the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Cookies and analytics</h2>
            <p>
              InstaFetch may use cookies or similar technologies for essential functionality, analytics, security, or advertising. Third-party providers may set or read cookies according to their own policies. You can manage cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Advertising</h2>
            <p>
              If advertising is displayed on InstaFetch, advertising providers may use cookies or similar technologies to serve, measure, and personalize advertising subject to their policies and applicable choices available to users. Google AdSense may be used on the site when enabled.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Third-party services</h2>
            <p>
              InstaFetch may depend on hosting, analytics, security, advertising, and media-processing providers. Those providers may process information as necessary to provide their services and maintain their own privacy policies. InstaFetch does not control the privacy practices of independent third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Instagram credentials and private accounts</h2>
            <p>
              InstaFetch does not ask you to provide an Instagram password and is not designed to provide access to private Instagram accounts. Only use supported public URLs and do not attempt to bypass access controls.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Data security and retention</h2>
            <p>
              Reasonable technical measures may be used to protect the service. No internet service can guarantee absolute security. Information may be retained for as long as reasonably necessary for service operation, security, troubleshooting, legal obligations, or the purposes described in this policy, subject to the capabilities and policies of the providers involved.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Your choices</h2>
            <p>
              You can control browser cookies, permissions, and certain advertising choices through your browser and the controls provided by relevant third-party services. If you have a privacy question or request, contact InstaFetch using the contact information on the Contact page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Changes to this policy</h2>
            <p>
              This policy may be updated when the service, technologies, legal requirements, or third-party providers change. The updated version will be posted on this page with a revised date.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-sm text-zinc-500">
          Questions? Visit <Link href="/contact" className="text-violet-400 hover:text-violet-300">Contact InstaFetch</Link>.
        </div>
      </article>
    </main>
  );
}
