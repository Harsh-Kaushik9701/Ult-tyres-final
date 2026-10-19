import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getDb, isMongoConfigured } from "@/lib/db";
import { PageHero, ContactBand } from "@/components/site";
import { NetworkLocator, NetworkLocation } from "@/components/locator";
import { locations as knownLocations } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Dealer & Service Network Map – Australia",
  description: "Find your nearest Ultimate Tyres dealer, heavy truck alignment centre and distribution depot across Australia: Rocklea, Eastern Creek, Laverton, Wingfield and Kewdale.",
  keywords: ["truck tyre dealer near me", "tyre service network Australia", "truck alignment near me", "Ultimate Tyres locations"],
  path: "/network"
});
export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  let locations: NetworkLocation[] = knownLocations;

  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const docs = await db.collection("locations").find({ active: { $ne: false } }).sort({ state: 1, suburb: 1 }).toArray();
      if (docs && docs.length > 0) {
        const dbLocations: NetworkLocation[] = docs.map((d: any) => ({
          id: String(d.id || d._id),
          name: d.name,
          address: d.address,
          suburb: d.suburb,
          state: d.state,
          postcode: d.postcode || null,
          phone: d.phone || null,
          latitude: d.latitude ?? null,
          longitude: d.longitude ?? null,
          type: d.type,
          hours: d.hours,
          capabilities: d.capabilities
        }));
        // Ensure all national master locations are included if not present in DB
        const dbSuburbs = new Set(dbLocations.map((l) => (l.suburb || "").toLowerCase()));
        const missingFromMaster = knownLocations.filter(
          (kl) => !dbSuburbs.has((kl.suburb || "").toLowerCase())
        );
        locations = [...dbLocations, ...missingFromMaster];
      }
    }
  } catch (err) {
    console.warn("MongoDB network locations lookup bypassed, using knownLocations", err);
  }

  return (
    <>
      <PageHero
        eyebrow="Nationwide Transport Backbone · Interactive Locator"
        title="Find Local Support. Wherever You Work."
        intro="While the geography of Australia is vast, our national network map and distribution channels make us local. Connect with Ultimate Tyres wholesale distribution depots, heavy truck wheel alignment bays, and mobile fitting specialists across QLD, NSW, VIC, SA, and WA."
      />
      <section className="section">
        <div className="container">
          <NetworkLocator locations={locations} />
        </div>
      </section>
      <ContactBand />
    </>
  );
}
