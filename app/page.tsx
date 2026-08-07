import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}