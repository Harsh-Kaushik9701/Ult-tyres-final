import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands } from "@/lib/content";
import { PageHero, ContactBand } from "@/components/site";
import { ProductCatalog } from "@/components/catalog";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand: slug } = await params;
  const b = brands.find((x) => x.slug.toLowerCase() === slug.toLowerCase());
  return {
    title: b ? `${b.name} Commercial Tyres` : "Tyres",
    description: b?.copy || "Commercial tyre range and specifications from Ultimate Tyres Australia."
  };
}

export default async function BrandPage({
  params
}: {
  params: Promise<{ brand: string }>;
}): Promise<React.ReactElement> {
  const { brand: slug } = await params;
  const brand = brands.find((x) => x.slug.toLowerCase() === slug.toLowerCase());
  if (!brand) return notFound();

  const all = await getProducts();
  const brandProducts = all.filter((p) => p.brand.toLowerCase() === brand.name.toLowerCase());

  // Distinct brand image for showcase
  const heroImage =
    slug === "ralson"
      ? "/images/products/RDR75.webp"
      : slug === "blacklion"
      ? "/images/products/RDR55.webp"
      : "/images/products/RAC55.webp";

  return (
    <>
      <PageHero
        eyebrow={`${brand.name} Commercial Radial Range · Ultimate Tyres`}
        title={brand.strap}
        intro={brand.copy}
      />

      <section className="section">
        <div className="container feature-split">
          <div className="feature-media">
            <Image
              src={heroImage}
              alt={`${brand.name} commercial tyre range`}
              width={800}
              height={640}
              priority
            />
            <span className="media-label">{brand.name} Commercial Series</span>
          </div>
          <div className="feature-copy">
            {brand.logo && (
              <div style={{ marginBottom: 18 }}>
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={220}
                  height={60}
                  style={{ objectFit: "contain", objectPosition: "left" }}
                />
              </div>
            )}
            <div className="eyebrow">Engineering Leadership</div>
            <h2>
              {brand.name} Radial Tyres.<br />
              Engineered for Australian Freight.
            </h2>
            <p>{brand.description || brand.copy}</p>
            <ul className="check-list">
              <li>Comprehensive axle coverage: Steer, Drive, Trailer, and Coach radials</li>
              <li>Heavy-duty steel casing architecture built for multiple retread lifecycles</li>
              <li>Tested and proven across major Australian highway and regional corridors</li>
              <li>Wholesale trade pricing and live inventory for approved network dealers</li>
            </ul>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <Link className="button button-dark" href="/contact">
                Request Fleet Quote for {brand.name} ↗
              </Link>
              <Link className="button button-outline" href="/dealers/login">
                Dealer Login / Place Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Product Specifications */}
      <section className="section section-green">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{brand.name} Product Specifications</div>
              <h2>Current Commercial Range ({brandProducts.length} Patterns & Sizes)</h2>
            </div>
            <Link className="button button-dark" href="/dealers/login">
              Wholesale Order Portal ↗
            </Link>
          </div>
          <ProductCatalog products={brandProducts as any} />
        </div>
      </section>

      <ContactBand />
    </>
  );
}
