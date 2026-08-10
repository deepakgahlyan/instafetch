import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Features from "@/components/features/Features";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQ from "@/components/faq/FAQ";
import Footer from "@/components/footer/Footer";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "InstaFetch",
  url: "https://instafetch.com",
  description:
    "Fast and simple downloader for public Instagram videos, reels and photos.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
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