import { allCatalogueProducts, TyreItem } from "@/lib/catalogue-data";
import { getDb, isMongoConfigured } from "@/lib/db";

export type ProductRecord = {
  id: number;
  brand: string;
  application: string;
  pattern: string;
  size: string;
  plyRating: string;
  loadSpeed: string;
  measuringRim: string;
  overallDiameterMm: string;
  overallWidthMm: string;
  treadDepthMm: string;
  loadSingle: string;
  loadDual: string;
  image: string;
  wholesalePrice?: number;
  rrp?: number;
  stock?: number;
  axle?: string;
  features?: string[];
};

export async function getProducts(): Promise<ProductRecord[]> {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const docs = await db
        .collection("products")
        .find({ active: { $ne: false } })
        .sort({ brand: 1, pattern: 1, size: 1 })
        .toArray();

      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          id: d.id,
          brand: d.brand,
          application: d.application,
          pattern: d.pattern,
          size: d.size,
          plyRating: d.plyRating || d.ply_rating || "16PR",
          loadSpeed: d.loadSpeed || d.load_speed || "148/145L",
          measuringRim: d.measuringRim || d.measuring_rim || "8.25",
          overallDiameterMm: String(d.overallDiameterMm || d.overall_diameter_mm || "1050"),
          overallWidthMm: String(d.overallWidthMm || d.overall_width_mm || "295"),
          treadDepthMm: String(d.treadDepthMm || d.tread_depth_mm || "16.0"),
          loadSingle: d.loadSingle || d.load_single || "3150 kg",
          loadDual: d.loadDual || d.load_dual || "2900 kg",
          image: d.image,
          wholesalePrice: d.wholesalePrice || d.price,
          rrp: d.rrp,
          stock: d.stock,
          axle: d.axle,
          features: d.features
        }));
      }
    }
  } catch (err) {
    console.warn("MongoDB products fetch bypassed, using local catalogue", err);
  }
  return allCatalogueProducts as ProductRecord[];
}

export async function getProduct(id: number): Promise<ProductRecord | null> {
  const products = await getProducts();
  return products.find((product) => product.id === id) || null;
}
