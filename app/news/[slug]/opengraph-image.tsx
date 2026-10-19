import { articles } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Ultimate Tyres fleet insight";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return renderOgImage({
    eyebrow: article ? `Fleet Insights · ${article.category}` : "Fleet Insights",
    title: article?.title ?? "Fleet know-how for the road ahead",
    footer: article ? `${article.date} · ${article.readTime ?? "4 min read"}` : undefined
  });
}
