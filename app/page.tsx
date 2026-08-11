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
        <FAQ />
        <Footer />
      </main>
    </>
  );
}