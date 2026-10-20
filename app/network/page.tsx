import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero, ContactBand } from "@/components/site";
import { BranchesSection } from "@/components/branches";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { branchAddress, branches, directionsUrl } from "@/lib/branches";
import { siteConfig, telHref } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Find a Branch – Rocklea, Yatala & Bald Hills",
  description:
    "Ultimate Tyres branches at Rocklea (head office), Yatala and Bald Hills in South East Queensland, plus mobile service vans. Directions, services and one number: 1300 110 002.",
  keywords: [
    "tyre shop Rocklea",
    "truck tyres Yatala",
    "truck tyres Bald Hills",
    "mobile truck tyre service Brisbane",
    "truck tyres near me"
  ],
  path: "/network"
});

export default function NetworkPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Find a Branch", path: "/network" }
        ])}
      />
      <PageHero backdrop="truck"
        eyebrow="Find us · South East Queensland"
        title="Three branches. Mobile vans on the road."
        intro="Visit us at Rocklea, Yatala or Bald Hills, or ring one number and our mobile vans come to you."
        crumb="Find a Branch"
      />
      <BranchesSection showAllLink={false} />
      <section className="section" style={{ background: "#f8faf9" }}>
        <div className="container">
          <div className="branch-cards">
            {branches.map((b) => (
              <article key={b.id} className="branch-card">
                <h2>
                  {b.name}
                  {b.note && <span className="branch-note">{b.note}</span>}
                </h2>
                <p className="branch-address">{branchAddress(b)}</p>
                <ul className="check-list">
                  {b.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="branch-card-actions">
                  <a href={directionsUrl(b)} target="_blank" rel="noopener noreferrer">
                    Directions ›
                  </a>
                  <a href={telHref()}>{siteConfig.phone}</a>
                </div>
              </article>
            ))}
          </div>
          <p className="branch-mobile-note">
            Our mobile vans come to you. <a href={telHref()}>Ring {siteConfig.phone}</a> to check your area.
          </p>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
