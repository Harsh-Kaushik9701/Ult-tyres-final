/**
 * Central site configuration. Values come from environment variables with
 * safe defaults so the site renders on localhost with no network access.
 */

function normaliseSiteUrl(raw: string | undefined): string {
  const fallback = "https://ultimatetyres.com.au";
  if (!raw) return fallback;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;
    return url.origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "Ultimate Tyres",
  legalName: "Ultimate Tyres Australia Pty Ltd",
  tagline: "Your fleet. Our drive.",
  url: normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_AU",
  phone: process.env.NEXT_PUBLIC_PHONE || "1300 110 002",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || "61482094850").replace(/\D/g, ""),
  address: {
    street: "5 Permarig Place",
    locality: "Rocklea",
    region: "QLD",
    postcode: "4106",
    country: "AU"
  },
  defaultOgImage: {
    url: "/images/og-ultimate-tyres.jpg",
    width: 1200,
    height: 630,
    alt: "Ultimate Tyres – commercial tyres and fleet support across Australia"
  },
  logo: "/images/utlogo.png"
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export function telHref(phone: string = siteConfig.phone): string {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}

export function whatsappHref(text?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
