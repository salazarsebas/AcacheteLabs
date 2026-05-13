import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://acachete.xyz";
const SITE_NAME = "Acachete Labs";
const DESCRIPTION =
  "Acachete Labs is a research-grade software laboratory building protocol utilities, real-world asset infrastructure, and AI systems on Stellar and beyond.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Acachete Labs | Software Laboratory",
    template: "%s | Acachete Labs",
  },
  description: DESCRIPTION,
  icons: {
    icon: "/AcacheteLabs.png",
    apple: "/AcacheteLabs.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  keywords: [
    "Acachete Labs",
    "Acachete",
    "software laboratory",
    "Stellar",
    "Stellar blockchain",
    "protocol utilities",
    "real-world asset infrastructure",
    "RWA infrastructure",
    "AI systems",
    "Soroban",
    "DeFi",
    "PromptOS",
    "Akkuea",
    "Sebastián Salazar",
  ],
  authors: [{ name: "Sebastián Salazar", url: "https://github.com/salazarsebas" }],
  creator: "Sebastián Salazar",
  openGraph: {
    title: "Acachete Labs | Software Laboratory",
    siteName: SITE_NAME,
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: "/AcacheteLabs.png",
        width: 512,
        height: 512,
        alt: "Acachete Labs",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acachete Labs | Software Laboratory",
    description: DESCRIPTION,
    images: ["/AcacheteLabs.png"],
    creator: "@salazarsebas",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Acachete Labs",
      alternateName: "Acachete",
      url: SITE_URL,
      logo: `${SITE_URL}/AcacheteLabs.png`,
      description:
        "A research-grade software laboratory building protocol utilities, real-world asset infrastructure, and AI systems on Stellar and beyond.",
      foundingDate: "2024",
      knowsAbout: [
        "Stellar blockchain",
        "Protocol utilities",
        "Real-world asset tokenization",
        "Artificial intelligence",
        "DeFi infrastructure",
        "Soroban smart contracts",
      ],
      sameAs: [
        "https://github.com/salazarsebas",
        "https://github.com/akkuea",
      ],
      member: {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: "Sebastián Salazar",
        url: "https://github.com/salazarsebas",
        jobTitle: "Founder",
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Acachete Labs",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Acachete Labs | Software Laboratory",
      description:
        "Research-grade software laboratory. Protocol utilities, real-world asset infrastructure, and AI systems.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "Faucet | Stellar Testnet Funding",
      applicationCategory: "DeveloperApplication",
      url: "https://faucet-stellar.acachete.xyz/",
      description:
        "Deterministic testnet funding utility for Stellar developers.",
      author: { "@id": `${SITE_URL}/#organization` },
      operatingSystem: "Web",
    },
    {
      "@type": "SoftwareApplication",
      name: "Stellar Explorer",
      applicationCategory: "DeveloperApplication",
      url: "https://stellar-explorer.acachete.xyz/en",
      description: "Block-level inspection tool for Stellar network analysis.",
      author: { "@id": `${SITE_URL}/#organization` },
      operatingSystem: "Web",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-surface font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
