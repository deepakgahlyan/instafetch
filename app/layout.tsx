import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-2536087122989226"
        />
      </head>

      <body className="min-h-screen bg-zinc-950">
        {children}
      </body>
    </html>
  );
}