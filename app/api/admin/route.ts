import { NextResponse } from "next/server";
import { currentSession } from "@/lib/session";
import { getDb, isMongoConfigured } from "@/lib/db";
import { locations as defaultLocations } from "@/lib/content";
import { allCatalogueProducts } from "@/lib/catalogue-data";
import { ObjectId } from "mongodb";

function matchIdQuery(id: any) {
  if (typeof id === "string" && ObjectId.isValid(id) && id.length === 24) {
    return { $or: [{ _id: new ObjectId(id) }, { id: id }, { id: Number(id) || id }] };
  }
  return { $or: [{ id: id }, { id: Number(id) || id }, { _id: id }] };
}

export async function GET() {
  const session = await currentSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  }

  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({
        applications: [],
        products: allCatalogueProducts.map((p) => ({
          id: p.id,
          brand: p.brand,
          application: p.application,
          pattern: p.pattern,
          size: p.size,
          active: true,
          stock: p.stock,
          count_prices: 1
        })),
        orders: [],
        dealers: [
          {
            id: "dealer-demo-qld",
            business_name: "Queensland Transport Tyres Pty Ltd",
            email: "dealer@ultimatetyres.com.au"
          }
        ],
        locations: defaultLocations
      });
    }

    const db = await getDb();
    const [applications, products, orders, dealers, locations] = await Promise.all([
      db.collection("dealer_applications").find({ status: "pending" }).sort({ created_at: -1 }).toArray(),
      db.collection("products").find().sort({ brand: 1, pattern: 1 }).limit(250).toArray(),
      db.collection("orders").find().sort({ created_at: -1 }).limit(40).toArray(),
      db.collection("dealers").find().sort({ business_name: 1 }).toArray(),
      db.collection("locations").find().sort({ state: 1, suburb: 1 }).toArray()
    ]);

    return NextResponse.json({
      applications: applications.map((a: any) => ({
        id: String(a._id || a.id),
        name: a.name,
        email: a.email,
        phone: a.phone,
        business_name: a.business_name || a.businessName,
        state: a.state,
        created_at: a.created_at || a.createdAt
      })),
      products: products.length
        ? products.map((p: any) => ({
            id: p.id || String(p._id),
            brand: p.brand,
            application: p.application,
            pattern: p.pattern,
            size: p.size,
            active: p.active !== false,
            stock: p.stock ?? 20,
            count_prices: 1
          }))
        : allCatalogueProducts.map((p) => ({
            id: p.id,
            brand: p.brand,
            application: p.application,
            pattern: p.pattern,
            size: p.size,
            active: true,
            stock: p.stock,
            count_prices: 1
          })),
      orders: orders.map((o: any) => ({
        id: o.orderId || o.id || String(o._id),
        status: o.status,
        created_at: o.created_at || o.createdAt,
        business_name: o.business_name || o.dealerBusinessName || "Authorised Dealer",
        lines: o.items?.length || 1
      })),
      dealers: dealers.map((d: any) => ({
        id: String(d._id || d.id),
        business_name: d.business_name || d.businessName,
        email: d.email
      })),
      locations: locations.length
        ? locations.map((l: any) => ({
            id: String(l._id || l.id),
            name: l.name,
            address: l.address,
            suburb: l.suburb,
            state: l.state,
            postcode: l.postcode,
            phone: l.phone,
            latitude: l.latitude,
            longitude: l.longitude
          }))
        : defaultLocations
    });
  } catch (error) {
    console.error("admin load failed", error);
    return NextResponse.json({ error: "Unable to load admin data from MongoDB." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const session = await currentSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not yet connected. Configure MONGODB_URI to save permanent changes." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const db = await getDb();

    if (body.action === "approve") {
      const appQuery = matchIdQuery(body.id);
      const app = await db.collection("dealer_applications").findOne({ ...appQuery, status: "pending" });
      if (!app) {
        return NextResponse.json({ error: "Application is no longer pending." }, { status: 404 });
      }

      const accountDoc = {
        email: String(app.email).toLowerCase().trim(),
        password_hash: app.password_hash || app.passwordHash || "",
        role: "dealer",
        active: true,
        created_at: new Date()
      };
      const accountRes = await db.collection("accounts").insertOne(accountDoc);

      const dealerDoc = {
        accountId: accountRes.insertedId,
        business_name: app.business_name || app.businessName,
        abn: app.abn,
        phone: app.phone,
        state: app.state,
        email: app.email,
        created_at: new Date()
      };
      await db.collection("dealers").insertOne(dealerDoc);

      await db.collection("dealer_applications").updateOne(appQuery, {
        $set: { status: "approved", reviewed_at: new Date() }
      });

      return NextResponse.json({ message: "Dealer approved and account activated." });
    }

    if (body.action === "decline") {
      const appQuery = matchIdQuery(body.id);
      await db.collection("dealer_applications").updateOne(appQuery, {
        $set: { status: "declined", reviewed_at: new Date() }
      });
      return NextResponse.json({ message: "Application declined." });
    }

    if (body.action === "stock") {
      const id = body.productId;
      const quantity = Number(body.quantity);
      if (!Number.isInteger(quantity) || quantity < 0) {
        return NextResponse.json({ error: "Enter a valid non-negative stock quantity." }, { status: 400 });
      }
      await db.collection("products").updateOne(
        matchIdQuery(id),
        { $set: { stock: quantity, updated_at: new Date() } },
        { upsert: false }
      );
      return NextResponse.json({ message: "Stock quantity updated." });
    }

    if (body.action === "price") {
      const dealerId = String(body.dealerId || "");
      const productId = body.productId;
      const price = Number(body.price);
      if (!dealerId || !Number.isFinite(price) || price < 0) {
        return NextResponse.json({ error: "Enter a dealer, product and valid price." }, { status: 400 });
      }
      await db.collection("dealer_prices").updateOne(
        { dealerId, productId },
        { $set: { dealerId, productId, unit_price: price, updated_at: new Date() } },
        { upsert: true }
      );
      return NextResponse.json({ message: "Dealer price saved." });
    }

    if (body.action === "order-status") {
      const status = ["submitted", "processing", "fulfilled", "dispatched", "delivered", "cancelled"].includes(body.status)
        ? body.status
        : "submitted";
      await db.collection("orders").updateOne(matchIdQuery(body.id), {
        $set: { status, updated_at: new Date() }
      });
      return NextResponse.json({ message: "Order status updated." });
    }

    if (body.action === "location") {
      const doc = {
        name: String(body.name || "").trim(),
        address: String(body.address || "").trim(),
        suburb: String(body.suburb || "").trim(),
        state: String(body.state || "").trim(),
        postcode: String(body.postcode || "").trim(),
        phone: String(body.phone || "").trim(),
        latitude: body.latitude === "" || body.latitude == null ? null : Number(body.latitude),
        longitude: body.longitude === "" || body.longitude == null ? null : Number(body.longitude),
        updated_at: new Date()
      };
      if (!doc.name || !doc.address || !doc.suburb || !doc.state) {
        return NextResponse.json({ error: "Location name, address, suburb and state are required." }, { status: 400 });
      }
      if (body.id) {
        await db.collection("locations").updateOne(matchIdQuery(body.id), { $set: doc });
      } else {
        await db.collection("locations").insertOne({ ...doc, created_at: new Date(), active: true });
      }
      return NextResponse.json({ message: "Dealer location saved." });
    }

    if (body.action === "delete-location") {
      await db.collection("locations").deleteOne(matchIdQuery(body.id));
      return NextResponse.json({ message: "Location removed." });
    }

    if (body.action === "product") {
      const brand = String(body.brand || "").trim();
      const pattern = String(body.pattern || "").trim();
      const size = String(body.size || "").trim();
      const application = String(body.application || "").trim();
      if (!brand || !pattern || !size || !application) {
        return NextResponse.json({ error: "Brand, pattern, size and application are required." }, { status: 400 });
      }
      await db.collection("products").updateOne(
        matchIdQuery(body.id),
        {
          $set: {
            brand,
            pattern,
            size,
            application,
            active: body.active === "true" || body.active === true,
            updated_at: new Date()
          }
        }
      );
      return NextResponse.json({ message: "Catalogue product updated." });
    }

    return NextResponse.json({ error: "Unknown admin action." }, { status: 400 });
  } catch (error) {
    console.error("admin change failed", error);
    return NextResponse.json({ error: "Could not save this change to MongoDB." }, { status: 503 });
  }
}
