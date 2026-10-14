import type { Metadata } from "next";
import { getDb, isMongoConfigured } from "@/lib/db";
import { PageHero, ContactBand } from "@/components/site";
import { NetworkLocator, NetworkLocation } from "@/components/locator";
import { locations as knownLocations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Interactive Dealer & Service Network Map Australia",
  description:
    "Find your nearest Ultimate Tyres dealer, heavy truck alignment center, and wholesale distribution depot across Australia. Rocklea, Eastern Creek, Laverton, Wingfield, and Kewdale."
};

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  let locations: NetworkLocation[] = knownLocations;

  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const docs = await db.collection("locations").find({ active: { $ne: false } }).sort({ state: 1, suburb: 1 }).toArray();
      if (docs && docs.length > 0) {
        locations = docs.map((d: any) => ({
          id: String(d._id || d.id),
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
