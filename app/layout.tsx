import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://www.instafetch.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

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
    "download Instagram videos",
    "download Instagram reels",
    "InstaFetch",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "InstaFetch — Instagram Video & Reel Downloader",
    description:
      "Fast and simple downloads for public Instagram videos, reels and photos.",
    url: siteUrl,
    siteName: "InstaFetch",
    type: "website",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2536087122989226"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

        {children}
      </body>
    </html>
  );
}