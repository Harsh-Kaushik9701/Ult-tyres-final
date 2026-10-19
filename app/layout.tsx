import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import "./globals.css";
import { Header, Footer, WhatsApp } from "@/components/site";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: "Ultimate Tyres | Your fleet. Our drive.", template: "%s | Ultimate Tyres Australia" },
  description:
    "Commercial tyres, fleet services and dealer support for Australian businesses. Keep your fleet moving with Ultimate Tyres.",
  keywords: [
    "commercial tyres Australia",
    "truck tyres",
    "fleet services",
    "Ralson tyres",
    "Blacklion tyres",
    "Triangle tyres",
    "tyre dealer"
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "Ultimate Tyres | Your fleet. Our drive.",
    description: "Commercial tyres and practical fleet support for Australian businesses.",
    images: [siteConfig.defaultOgImage]
  },
  twitter: { card: "summary_large_image", images: [siteConfig.defaultOgImage.url] },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  themeColor: "#141717",
  width: "device-width",
  initialScale: 1
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Render every page on the server for each request. This is also what lets
  // proxy.ts attach a fresh CSP nonce to the scripts Next.js emits.
  await connection();

  return (
    <html lang="en-AU">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsApp />
      </body>
    </html>
  );
}
