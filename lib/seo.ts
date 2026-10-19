import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export type SeoImage = { url: string; width?: number; height?: number; alt?: string };

export type SeoInput = {
  /** Page title. The root layout template appends " | Ultimate Tyres Australia". */
  title: string;
  /** Use the title exactly as given, without the site-name template. */
  absoluteTitle?: boolean;
  /** 150–160 characters works best in search results. */
  description: string;
  keywords?: readonly string[];
  /** Path of the page, e.g. "/about". Used for the canonical URL and og:url. */
  path: string;
  image?: SeoImage;
  type?: "website" | "article";
  publishedTime?: string;
  section?: string;
  noIndex?: boolean;
};

/** Keywords that apply site-wide; page keywords are listed first. */
const baseKeywords = ["Ultimate Tyres", "commercial tyres Australia", "truck tyres", "fleet tyre services"];

/**
 * Builds the full metadata for a page: <title>, meta description, meta keywords,
 * canonical link, Open Graph (og:title, og:description, og:url, og:image…) and
 * Twitter card tags. Next.js renders all of these on the server into <head>.
 *
 * Page-level openGraph replaces the layout's openGraph completely, so this helper
 * always sets every field (including og:image) to avoid pages losing their image.
 */
export function buildMetadata(input: SeoInput): Metadata {
  const image = input.image ?? siteConfig.defaultOgImage;
  const images = [
    {
      url: image.url,
      width: image.width ?? 1200,
      height: image.height ?? 630,
      alt: image.alt ?? input.title
    }
  ];
  const keywords = Array.from(new Set([...(input.keywords ?? []), ...baseKeywords]));
  const ogTitle = input.absoluteTitle ? input.title : `${input.title} | ${siteConfig.name}`;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    keywords,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type ?? "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: input.path,
      title: ogTitle,
      description: input.description,
      images,
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, section: input.section }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      images: images.map((i) => i.url)
    },
    robots: input.noIndex ? { index: false, follow: false } : undefined
  };
}

/** Serialises JSON-LD safely so content can never break out of the <script> tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.defaultOgImage.url),
    telephone: siteConfig.phone,
    slogan: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postcode,
      addressCountry: siteConfig.address.country
    },
    areaServed: { "@type": "Country", name: "Australia" }
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
