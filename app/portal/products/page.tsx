import { getDb, isMongoConfigured } from "@/lib/db";
import { DealerProductCatalog } from "@/components/portal";
import { currentSession } from "@/lib/session";
import { allCatalogueProducts } from "@/lib/catalogue-data";

export default async function PortalProducts() {
  const session = await currentSession();
  let products: any[] = [];

  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const docs = await db.collection("products").find({ active: { $ne: false } }).sort({ brand: 1, pattern: 1 }).toArray();
      if (docs && docs.length > 0) {
        products = docs.map((p) => ({
          id: p.id || String(p._id),
          brand: p.brand,
          application: p.application,
          pattern: p.pattern,
          size: p.size,
          ply_rating: p.ply_rating || p.plyRating,
          load_speed: p.load_speed || p.loadSpeed,
          tread_depth_mm: p.tread_depth_mm || p.treadDepthMm,
          image: p.image,
          stock: p.stock ?? 20,
          price: String(p.price || p.wholesalePrice || "350"),
          rrp: p.rrp,
          axle: p.axle
        }));
      }
    }
  } catch {}

  // Fallback to rich catalogue
  if (!products.length) {
    products = allCatalogueProducts.map((p) => ({
      id: p.id,
      brand: p.brand,
      application: p.application,
      pattern: p.pattern,
      size: p.size,
      ply_rating: p.plyRating,
      load_speed: p.loadSpeed,
      tread_depth_mm: p.treadDepthMm,
      image: p.image,
      stock: p.stock,
      price: String(p.wholesalePrice),
      rrp: p.rrp,
      axle: p.axle
    }));
  }

  return (
    <>
      <div className="eyebrow">Wholesale Dealer Catalogue</div>
      <h2 style={{ margin: "9px 0" }}>Commercial Tyre Inventory & Direct Ordering</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
        Instant wholesale pricing tier activated for <strong>{session?.email || "Dealer Account"}</strong>. Filter across Ralson, Blacklion, and Triangle commercial ranges by size, axle position, and duty cycle. Submit single or bulk orders directly to dispatch.
      </p>
      <DealerProductCatalog products={products} />
    </>
  );
}
