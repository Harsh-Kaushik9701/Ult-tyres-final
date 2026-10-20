import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/content";
import { PageHero, ContactBand } from "@/components/site";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { serviceKeywords } from "@/lib/page-seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

function findService(slug: string) {
  // wheel-alignment has its own dedicated page at app/services/wheel-alignment.
  return services.find((s) => s.slug === slug && s.slug !== "wheel-alignment");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return { title: "Fleet service not found", robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${service.title} – Commercial Fleet Service`,
    description: `${service.short} Ultimate Tyres supports commercial fleets across Australia.`,
    keywords: [...(serviceKeywords[service.slug] ?? []), service.category, "fleet services Australia"],
    path: `/services/${service.slug}`,
    // Branded 1200×630 image generated on the server by ./opengraph-image.tsx
    image: { url: `/services/${service.slug}/opengraph-image`, width: 1200, height: 630, alt: `${service.title} – Ultimate Tyres` }
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Fleet Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.body,
            serviceType: service.category,
            url: absoluteUrl(`/services/${service.slug}`),
            areaServed: { "@type": "Country", name: "Australia" },
            provider: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url }
          }
        ]}
      />
      <PageHero backdrop="services"
        eyebrow={`Fleet services · ${service.category}`}
        title={service.title}
        intro={service.short}
        trail={[{ name: "Fleet Services", path: "/services" }]}
      />
      <section className="section">
        <div className="container content-layout">
          <div className="content-main">
            <div className="eyebrow">The right service. The right time.</div>
            <h2>
              Less wear.
              <br />
              More road ahead.
            </h2>
            <p>{service.body}</p>
            <p>
              Our team can help you understand what’s right for your vehicle, how your fleet operates and the demands of
              your routes. We’ll talk through the options clearly and help you plan the next step.
            </p>
            <ul className="check-list">
              <li>Advice for your vehicle and operating conditions</li>
              <li>Professional service from an experienced team</li>
              <li>Support for ongoing fleet performance</li>
            </ul>
            <Link className="button button-dark" href="/contact">
              Enquire about {service.title} ↗
            </Link>
          </div>
          <aside className="side-panel">
            <h3>More fleet services</h3>
            <div className="footer-links">
              {services
                .filter((s) => s.slug !== slug)
                .slice(0, 7)
                .map((s) => (
                  <Link key={s.slug} href={"/services/" + s.slug}>
                    {s.title} ↗
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
