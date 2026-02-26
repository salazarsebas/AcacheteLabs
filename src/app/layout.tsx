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

export const metadata: Metadata = {
  metadataBase: new URL("https://acachete.xyz"),
  title: "Acachete Labs",
  description:
    "A research-grade software laboratory. Protocol utilities, real-world asset infrastructure, and AI systems.",
  icons: {
    icon: "/AcacheteLabs.png",
    apple: "/AcacheteLabs.png",
  },
  alternates: {
    canonical: "https://acachete.xyz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    "Acachete Labs",
    "software laboratory",
    "Stellar",
    "blockchain",
    "protocol utilities",
    "RWA infrastructure",
    "AI systems",
  ],
  openGraph: {
    title: "Acachete Labs",
    siteName: "Acachete Labs",
    description:
      "Acachete Labs — a research-grade software laboratory building protocol utilities, real-world asset infrastructure, and AI systems on Stellar and beyond.",
    type: "website",
    images: ["/AcacheteLabs.png"],
  },
  twitter: {
    card: "summary",
    title: "Acachete Labs",
    description:
      "Acachete Labs — a research-grade software laboratory building protocol utilities, real-world asset infrastructure, and AI systems on Stellar and beyond.",
    images: ["/AcacheteLabs.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-surface font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://acachete.xyz/#organization",
                  name: "Acachete Labs",
                  url: "https://acachete.xyz",
                  logo: "https://acachete.xyz/AcacheteLabs.png",
                  description:
                    "A research-grade software laboratory. Protocol utilities, real-world asset infrastructure, and AI systems.",
                  sameAs: ["https://github.com/salazarsebas"],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://acachete.xyz/#website",
                  name: "Acachete Labs",
                  url: "https://acachete.xyz",
                  publisher: {
                    "@id": "https://acachete.xyz/#organization",
                  },
                },
              ],
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
