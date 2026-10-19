import { NextResponse } from "next/server";
import { getVerifiedSession } from "@/lib/auth";
import { getDb, isMongoConfigured } from "@/lib/db";
import { locations as defaultLocations } from "@/lib/content";
import { allCatalogueProducts } from "@/lib/catalogue-data";
import { ObjectId, type Filter, type Document } from "mongodb";
import { BadRequest, cleanText, forbiddenCrossSite, isSameOrigin, jsonError, readJsonBody, str } from "@/lib/security";

/**
 * Builds a lookup query from an untrusted id. Only plain strings/numbers are
 * accepted – objects such as {"$ne": null} are rejected, which blocks NoSQL
 * operator injection.
 */
function matchIdQuery(raw: unknown): Filter<Document> | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return { id: raw };
  if (typeof raw !== "string") return null;
  const id = raw.trim();
  if (!id || id.length > 64) return null;
  if (/^[a-f0-9]{24}$/i.test(id)) return { $or: [{ _id: new ObjectId(id) }, { id }] };
  if (/^\d{1,12}$/.test(id)) return { $or: [{ id: Number(id) }, { id }] };
  if (/^[\w-]+$/.test(id)) return { id };
  return null;
}

function optionalNumber(value: unknown, min: number, max: number) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

export async function GET() {
  const session = await getVerifiedSession("admin");
  if (!session) {
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
  if (!isSameOrigin(request)) return forbiddenCrossSite();
  const session = await getVerifiedSession("admin");
  if (!session) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not yet connected. Configure MONGODB_URI to save permanent changes." },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request, 16 * 1024);
  } catch (error) {
    if (error instanceof BadRequest) return jsonError("Invalid request.", 400);
    throw error;
  }

  const needsId = ["approve", "decline", "stock", "order-status", "delete-location", "product"];
  const idQuery = matchIdQuery(body.action === "stock" ? body.productId : body.id);
  if (needsId.includes(String(body.action)) && !idQuery) return jsonError("Invalid record id.", 400);
  // Matches nothing when no id was required for this action.
  const appQuery: Filter<Document> = idQuery ?? { _id: { $exists: false }, id: { $exists: false } };

  try {
    const db = await getDb();

    if (body.action === "approve") {
      const app = await db.collection("dealer_applications").findOne({ ...appQuery, status: "pending" });
      if (!app) {
        return NextResponse.json({ error: "Application is no longer pending." }, { status: 404 });
      }
      const passwordHash = app.password_hash || app.passwordHash;
      if (typeof passwordHash !== "string" || !passwordHash.startsWith("$2")) {
        return jsonError("This application has no valid password and can’t be activated.", 400);
      }
      const email = String(app.email).toLowerCase().trim();
      if (await db.collection("accounts").findOne({ email }, { projection: { _id: 1 } })) {
        return jsonError("An account with this email already exists.", 409);
      }

      const accountDoc = {
        email,
        password_hash: passwordHash,
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
      await db.collection("dealer_applications").updateOne(appQuery, {
        $set: { status: "declined", reviewed_at: new Date() }
      });
      return NextResponse.json({ message: "Application declined." });
    }

    if (body.action === "stock") {
      const quantity = Number(body.quantity);
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > 1_000_000) {
        return NextResponse.json({ error: "Enter a valid non-negative stock quantity." }, { status: 400 });
      }
      await db.collection("products").updateOne(
        appQuery,
        { $set: { stock: quantity, updated_at: new Date() } },
        { upsert: false }
      );
      return NextResponse.json({ message: "Stock quantity updated." });
    }

    if (body.action === "price") {
      const dealerId = str(body.dealerId, 64);
      const productId = str(body.productId, 64);
      const price = Number(body.price);
      if (!/^[\w-]{1,64}$/.test(dealerId) || !/^[\w-]{1,64}$/.test(productId) || !Number.isFinite(price) || price < 0 || price > 1_000_000) {
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
      const statuses = ["submitted", "processing", "fulfilled", "dispatched", "delivered", "cancelled"];
      if (!statuses.includes(String(body.status))) return jsonError("Unknown order status.", 400);
      const status = String(body.status);
      const orderQuery = typeof body.id === "string" && /^UT-\d{6}$/.test(body.id) ? { orderId: body.id } : appQuery;
      await db.collection("orders").updateOne(orderQuery, {
        $set: { status, updated_at: new Date() }
      });
      return NextResponse.json({ message: "Order status updated." });
    }

    if (body.action === "location") {
      const latitude = optionalNumber(body.latitude, -90, 90);
      const longitude = optionalNumber(body.longitude, -180, 180);
      const doc = {
        name: cleanText(body.name, 160),
        address: cleanText(body.address, 200),
        suburb: cleanText(body.suburb, 100),
        state: str(body.state, 3).toUpperCase(),
        postcode: str(body.postcode, 4),
        phone: str(body.phone, 40),
        latitude,
        longitude,
        updated_at: new Date()
      };
      if (!doc.name || !doc.address || !doc.suburb || !["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].includes(doc.state)) {
        return NextResponse.json({ error: "Location name, address, suburb and a valid state are required." }, { status: 400 });
      }
      if (latitude === undefined || longitude === undefined || (doc.postcode && !/^\d{4}$/.test(doc.postcode))) {
        return jsonError("Check the postcode and map coordinates.", 400);
      }
      if (body.id) {
        if (!idQuery) return jsonError("Invalid record id.", 400);
        await db.collection("locations").updateOne(idQuery, { $set: doc });
      } else {
        await db.collection("locations").insertOne({ ...doc, created_at: new Date(), active: true });
      }
      return NextResponse.json({ message: "Dealer location saved." });
    }

    if (body.action === "delete-location") {
      await db.collection("locations").deleteOne(appQuery);
      return NextResponse.json({ message: "Location removed." });
    }

    if (body.action === "product") {
      const brand = cleanText(body.brand, 60);
      const pattern = cleanText(body.pattern, 60);
      const size = cleanText(body.size, 40);
      const application = cleanText(body.application, 80);
      if (!brand || !pattern || !size || !application) {
        return NextResponse.json({ error: "Brand, pattern, size and application are required." }, { status: 400 });
      }
      await db.collection("products").updateOne(
        appQuery,
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
