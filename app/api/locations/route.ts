import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/db";
import { locations as defaultLocations } from "@/lib/content";

export async function GET() {
  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const docs = await db.collection("locations").find({ active: { $ne: false } }).sort({ state: 1, suburb: 1 }).toArray();
      if (docs && docs.length > 0) {
        return NextResponse.json(
          docs.map((d: any) => ({
            id: String(d._id || d.id),
            name: d.name,
            address: d.address,
            suburb: d.suburb,
            state: d.state,
            postcode: d.postcode,
            phone: d.phone,
            latitude: d.latitude,
            longitude: d.longitude,
            type: d.type,
            hours: d.hours,
            capabilities: d.capabilities
          }))
        );
      }
    }
  } catch (error) {
    console.error("location lookup failed, falling back to static locations", error);
  }
  return NextResponse.json(defaultLocations);
}
