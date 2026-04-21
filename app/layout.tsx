import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://victoriancasinowhitefish.com";

export const metadata: Metadata = {
  // ── Core ─────────────────────────────────────────────────────────────────
  title: "Victorian Casino | Whitefish, Montana Gaming & Entertainment",
  description:
    "Whitefish, Montana's local gaming lounge — 20 licensed slot, keno & video poker machines, full bar, and food. Open 7 days a week on Hwy 93 S. Minutes from Glacier National Park.",
  metadataBase: new URL(SITE_URL),

  // ── Crawl ────────────────────────────────────────────────────────────────
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },

  // ── Keywords (supplementary — Google weights on-page copy more) ──────────
  keywords: [
    "casino Whitefish Montana",
    "Whitefish casino",
    "Montana casino",
    "gaming Whitefish MT",
    "slots Whitefish Montana",
    "keno Whitefish",
    "video poker Montana",
    "entertainment Whitefish Montana",
    "Flathead Valley casino",
    "Glacier National Park area casino",
    "things to do Whitefish Montana",
    "Montana gaming lounge",
    "Victorian Casino",
  ],

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Victorian Casino",
    title: "Victorian Casino | Whitefish, Montana Gaming & Entertainment",
    description:
      "Whitefish, Montana's local gaming lounge — 20 licensed slot, keno & video poker machines, full bar, and food. Open 7 days a week on Hwy 93 S.",
    locale: "en_US",
    images: [
      {
        url: "/media/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Victorian Casino gaming floor in Whitefish, Montana",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Victorian Casino | Whitefish, Montana Gaming & Entertainment",
    description:
      "Whitefish, Montana's local gaming lounge — 20 licensed slot, keno & video poker machines, full bar, and food. Open 7 days on Hwy 93 S.",
    images: ["/media/hero-poster.jpg"],
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico", // swap for apple-touch-icon.png when available
  },
};

// ── JSON-LD Structured Data ────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Casino",
      "@id": `${SITE_URL}/#casino`,
      name: "Victorian Casino",
      description:
        "A Montana-licensed gaming lounge in Whitefish featuring 20 slot, keno, and video poker machines, a full bar, and food service.",
      url: SITE_URL,
      telephone: "+14068626692",
      email: "info@victoriancasinowhitefish.com",
      priceRange: "$",
      image: `${SITE_URL}/media/hero-poster.jpg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "6550 Hwy 93 S Suite 104",
        addressLocality: "Whitefish",
        addressRegion: "MT",
        postalCode: "59937",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        // ⚠ Approximate — verify against Google Maps and update
        latitude: 48.4077,
        longitude: -114.347,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "08:00",
          closes: "01:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Friday", "Saturday"],
          opens: "08:00",
          closes: "02:00",
        },
      ],
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "ATM", value: true },
        { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
        { "@type": "LocationFeatureSpecification", name: "Food Service", value: true },
        { "@type": "LocationFeatureSpecification", name: "Players Club", value: true },
      ],
      currenciesAccepted: "USD",
      paymentAccepted: "Cash, Credit Card",
      sameAs: [],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Victorian Casino",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+14068626692",
        contactType: "customer service",
        areaServed: "US-MT",
        availableLanguage: "English",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
