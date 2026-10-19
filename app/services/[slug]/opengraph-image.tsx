import { services } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Ultimate Tyres fleet service";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  return renderOgImage({
    eyebrow: service ? `Fleet services · ${service.category}` : "Fleet services",
    title: service?.title ?? "Commercial fleet services"
  });
}
