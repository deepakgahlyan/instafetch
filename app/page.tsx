import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Features from "@/components/features/Features";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQ from "@/components/faq/FAQ";
import Footer from "@/components/footer/Footer";

const siteUrl = "https://www.instafetch.app";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "InstaFetch",
  url: siteUrl,
  description:
    "Fast and simple downloader for public Instagram videos, Reels and photos.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "InstaFetch",
    url: siteUrl,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-zinc-950">
        <Navbar />

        <Hero />

        <Features />

        <HowItWorks />

        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Download Instagram Videos &amp; Reels Online
            </h2>

            <p className="mt-5 leading-7 text-zinc-400">
              InstaFetch is an online Instagram downloader for supported public
              Instagram videos, Reels and photos. Copy a public Instagram URL,
              paste it into InstaFetch, and check whether downloadable media is
              available. You do not need to enter your Instagram password or
              log into Instagram to use the downloader.
            </p>

            <p className="mt-4 leading-7 text-zinc-400">
              InstaFetch works directly in your browser, making it easy to use
              on phones, tablets and computers. The simple workflow lets you
              paste an Instagram link and quickly check whether the content can
              be downloaded. If a link does not work, the post may be private,
              unavailable, unsupported, or otherwise inaccessible.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-white">
              How to Download Instagram Content
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              To download supported public Instagram content, copy the URL of
              the Instagram video, Reel or photo you want to save. Paste the
              link into the InstaFetch downloader above and submit it. If
              downloadable media is available, follow the download option
              provided by the service. InstaFetch is designed to keep the
              process simple without requiring an Instagram account login.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-white">
              Why Use InstaFetch?
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              InstaFetch provides a fast, browser-based way to work with
              supported public Instagram media. There is no need to install a
              separate downloader application just to check a public URL. The
              service is designed for straightforward use across desktop and
              mobile devices, while its guides and FAQs explain common
              Instagram download questions and troubleshooting steps.
            </p>
          </div>
        </section>

        <FAQ />

        <Footer />
      </main>
    </>
  );
}