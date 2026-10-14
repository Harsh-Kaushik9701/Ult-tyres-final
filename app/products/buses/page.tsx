import type { Metadata } from "next";
import { ProductCatalog } from "@/components/catalog";
import { PageHero } from "@/components/site";
import { getProducts } from "@/lib/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commercial Bus & Coach Tyres · Urban Transit & Long-Distance",
  description: "Find certified commercial bus, electric bus and passenger coach radial tyres engineered for urban curb scrubbing and passenger comfort."
};

export const dynamic = "force-dynamic";

export default async function BusesPage() {
  const products = await getProducts();
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
      <PageHero
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
          <ProductCatalog products={filtered as any} />
        </div>
      </section>
    </>
  );
}
