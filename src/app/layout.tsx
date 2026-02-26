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
  title: "Acachete Labs",
  description:
    "A research-grade software laboratory. Protocol utilities, real-world asset infrastructure, and AI systems.",
  openGraph: {
    title: "Acachete Labs",
    description:
      "A research-grade software laboratory. Protocol utilities, real-world asset infrastructure, and AI systems.",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
