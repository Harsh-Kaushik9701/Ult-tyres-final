import type { MetadataRoute } from "next";
import { services, brands, articles } from "@/lib/content";
import { getPublicProducts } from "@/lib/products";
import { toIsoDate } from "@/lib/page-seo";
import { absoluteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latestArticle = articles.map((a) => toIsoDate(a.date)).filter(Boolean).sort().pop();
  const staticPages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/news", priority: 0.8, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/products/trucks", priority: 0.8, changeFrequency: "weekly" },
    { path: "/products/buses", priority: 0.8, changeFrequency: "weekly" },
    { path: "/network", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
    { path: "/dealers/apply", priority: 0.6, changeFrequency: "monthly" }
  ];
  const products = await getPublicProducts();

  return [
    ...staticPages.map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: p.path === "/news" || p.path === "/" ? latestArticle : undefined,
      changeFrequency: p.changeFrequency,
      priority: p.priority
    })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...brands.map((b) => ({ url: absoluteUrl(`/brands/${b.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/news/${a.slug}`), lastModified: toIsoDate(a.date), priority: 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.id}`), priority: 0.5 }))
  ];
}
