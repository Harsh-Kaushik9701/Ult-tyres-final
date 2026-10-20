import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProductCatalog } from "@/components/catalog";
import { PageHero } from "@/components/site";
import { getPublicProducts } from "@/lib/products";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Commercial Tyre Range – Ralson, Blacklion & Triangle",
  description: "Explore heavy commercial truck and bus radial tyres distributed by Ultimate Tyres across Australia, featuring Ralson, Blacklion and Triangle specifications.",
  keywords: ["truck tyres", "bus tyres", "commercial tyre range", "Ralson Australia", "Blacklion tyres", "Triangle tyres"],
  path: "/products"
});
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getPublicProducts();
  return (
    <>
      <PageHero backdrop="products"
        eyebrow="Commercial Fleet Range · National Wholesale"
        title="Tyres Engineered for the Australian Road."
        intro="Browse our current commercial product specifications across flagship brands: Ralson, Blacklion, and Triangle. From interstate linehaul prime movers to municipal bus fleets and quarry tippers, find your fitment."
      />
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 30, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginRight: 6 }}>Filter Range:</span>
            <Link className="button button-dark" href="/products/trucks">
              Truck Tyres ({products.filter((p) => !p.application.toLowerCase().includes("bus")).length})
            </Link>
            <Link className="button button-dark" href="/products/buses">
              Bus & Coach ({products.filter((p) => p.application.toLowerCase().includes("bus") || p.application.toLowerCase().includes("coach")).length})
            </Link>
            <div style={{ width: 1, height: 28, background: "var(--line)", margin: "0 4px" }} />
            {["Ralson", "Blacklion", "Triangle"].map((b) => (
              <Link
                key={b}
                className="button button-outline"
                style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                href={"/brands/" + b.toLowerCase()}
              >
                {b} ({products.filter((p) => p.brand.toLowerCase() === b.toLowerCase()).length})
              </Link>
            ))}
            <Link className="button" style={{ marginLeft: "auto" }} href="/dealers/login">
              Dealer Wholesale Login ↗
            </Link>
          </div>
          <ProductCatalog products={products} />
        </div>
      </section>
    </>
  );
}
