import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content";
import { PageHero, ContactBand } from "@/components/site";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { staticPageSeo } from "@/lib/page-seo";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({ ...staticPageSeo.services, path: "/services" });

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Fleet Services", path: "/services" }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              url: absoluteUrl(`/services/${s.slug}`)
            }))
          }
        ]}
      />
      <PageHero backdrop="fitting"
        eyebrow="Fleet services"
        title="Keep your fleet working."
        intro="Practical tyre and vehicle services to help reduce avoidable downtime and keep every kilometre productive."
        crumb="Fleet Services"
      />
      <section className="section">
        <div className="container">
          <div className="article-grid">
            {services.map((s, i) => (
              <article className="article-card" key={s.slug}>
                <div className="article-meta">Fleet service · 0{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <Link className="text-link" href={"/services/" + s.slug} aria-label={`Explore ${s.title}`}>
                  Explore service
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
