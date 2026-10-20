import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProductCatalog } from "@/components/catalog";
import { PageHero } from "@/components/site";
import { getPublicProducts } from "@/lib/products";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Commercial Truck Tyres – Line Haul, Regional & On/Off Road",
  description: "Browse heavy commercial truck tyres across Ralson, Blacklion and Triangle for line haul, regional, construction and multi-combination freight routes.",
  keywords: ["truck tyres", "line haul tyres", "regional truck tyres", "tipper tyres", "11R22.5 tyres", "295/80R22.5 tyres"],
  path: "/products/trucks"
});
export const dynamic = "force-dynamic";

export default async function TrucksPage() {
  const products = await getPublicProducts();
  const filtered = products.filter(
    (p) => !p.application.toLowerCase().includes("bus") && !p.application.toLowerCase().includes("coach")
  );

  return (
    <>
      <PageHero backdrop="products"
        eyebrow="Heavy Vehicle Freight · Truck Tyres"
        title="Commercial Truck Tyres for the Miles Ahead."
        intro="Browse high-performance radial patterns engineered for Australian interstate linehaul, regional logistics, and severe on/off road conditions across Ralson, Blacklion, and Triangle."
        crumb="Truck tyres"
      />
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26, alignItems: "center" }}>
            <Link className="button button-outline" href="/products">All Tyres</Link>
            <Link className="button button-dark" href="/products/trucks">Truck Tyres ({filtered.length})</Link>
            <Link className="button button-outline" href="/products/buses">Bus & Coach</Link>
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
