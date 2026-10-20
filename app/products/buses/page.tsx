import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProductCatalog } from "@/components/catalog";
import { PageHero } from "@/components/site";
import { getPublicProducts } from "@/lib/products";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Bus & Coach Tyres – Urban Transit & Long Distance",
  description: "Commercial bus, electric bus and coach radial tyres engineered for urban kerb scrubbing, passenger comfort and long-distance coach routes in Australia.",
  keywords: ["bus tyres", "coach tyres", "electric bus tyres", "275/70R22.5 tyres", "transit bus tyres"],
  path: "/products/buses"
});
export const dynamic = "force-dynamic";

export default async function BusesPage() {
  const products = await getPublicProducts();
  const filtered = products.filter(
    (p) =>
      p.application.toLowerCase().includes("bus") ||
      p.application.toLowerCase().includes("coach") ||
      p.pattern.toUpperCase().includes("AU51") ||
      p.pattern.toUpperCase().includes("AC52") ||
      p.pattern.toUpperCase().includes("AC55")
  );

  return (
    <>
      <PageHero backdrop="trucks"
        eyebrow="Passenger Transit Fleet · Bus & Coach Tyres"
        title="Bus & Coach Tyres, Ready for the Route."
        intro="Explore commercial radial specifications designed for municipal buses, electric transit fleets, and long-distance passenger coaches. Engineered with heavy sidewall kerb protectors and high-scrub compound formulations."
        crumb="Bus tyres"
      />
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26, alignItems: "center" }}>
            <Link className="button button-outline" href="/products">All Tyres</Link>
            <Link className="button button-outline" href="/products/trucks">Truck Tyres</Link>
            <Link className="button button-dark" href="/products/buses">Bus & Coach ({filtered.length})</Link>
            <div style={{ marginLeft: "auto" }}>
              <Link className="button" href="/dealers/login">Wholesale Dealer Portal ↗</Link>
            </div>
          </div>
          <ProductCatalog products={filtered} />
        </div>
      </section>
    </>
  );
}
