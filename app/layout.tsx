import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://www.instafetch.app";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "InstaFetch",
      url: siteUrl,
      description:
        "InstaFetch is an online Instagram downloader for supported public Instagram videos, Reels, and photos.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "InstaFetch",
      description:
        "Free online Instagram downloader for supported public Instagram videos, Reels, and photos.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: "InstaFetch",
      url: siteUrl,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web Browser",
      description:
        "InstaFetch is a browser-based Instagram downloader for supported public Instagram videos, Reels, and photos.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "InstaFetch — Fast Instagram Video & Reel Downloader",
    template: "%s | InstaFetch",
  },

  description:
    "InstaFetch is a free online Instagram downloader for supported public Instagram videos, Reels, and photos. No Instagram login required.",

  applicationName: "InstaFetch",

  keywords: [
    "InstaFetch",
    "Instagram downloader",
    "Instagram video downloader",
    "Instagram Reel downloader",
    "Instagram photo downloader",
  ],

  authors: [
    {
      name: "InstaFetch",
      url: siteUrl,
    },
  ],

  creator: "InstaFetch",
  publisher: "InstaFetch",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "InstaFetch",
    title: "InstaFetch — Fast Instagram Video & Reel Downloader",
    description:
      "Free online Instagram downloader for supported public Instagram videos, Reels, and photos.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "InstaFetch — Fast Instagram Video & Reel Downloader",
    description:
      "Free online Instagram downloader for supported public Instagram videos, Reels, and photos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense — DO NOT REMOVE */}
        <meta
          name="google-adsense-account"
          content="ca-pub-2536087122989226"
        />

        {/* InstaFetch entity structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="min-h-screen bg-zinc-950">
        {children}
      </body>
    </html>
  );
}