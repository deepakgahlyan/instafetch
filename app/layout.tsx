import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "InstaFetch — Fast Instagram Video & Reel Downloader",
    template: "%s | InstaFetch",
  },
  description:
    "Download public Instagram videos, reels and photos quickly with InstaFetch. No Instagram login required.",
  keywords: [
    "Instagram downloader",
    "Instagram video downloader",
    "Instagram reels downloader",
    "Instagram photo downloader",
    "InstaFetch",
  ],
  openGraph: {
    title: "InstaFetch — Instagram Downloader",
    description:
      "Fast and simple downloads for public Instagram videos, reels and photos.",
    type: "website",
    siteName: "InstaFetch",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaFetch — Instagram Downloader",
    description:
      "Fast and simple downloads for public Instagram videos, reels and photos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950">
        {children}
      </body>
    </html>
  );
}