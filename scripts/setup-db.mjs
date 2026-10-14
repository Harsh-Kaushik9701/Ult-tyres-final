import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!uri) {
  console.error("Error: Set MONGODB_URI before running db:setup.");
  console.error("Example: MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority");
  process.exit(1);
}

const dbName = process.env.MONGODB_DB || "ultimate_tyres";
const client = new MongoClient(uri);

async function setup() {
  try {
    console.log(`Connecting to MongoDB... (database: ${dbName})`);
    await client.connect();
    const db = client.db(dbName);

    // 1. Setup collections and indexes
    console.log("Setting up collections and indexes...");
    await db.collection("accounts").createIndex({ email: 1 }, { unique: true });
    await db.collection("products").createIndex({ id: 1 }, { unique: true });
    await db.collection("products").createIndex({ brand: 1, size: 1 });
    await db.collection("orders").createIndex({ orderId: 1 }, { unique: true });
    await db.collection("orders").createIndex({ dealerId: 1 });
    await db.collection("locations").createIndex({ state: 1, suburb: 1 });

    // 2. Seed Locations
    const initialLocations = [
      {
        id: "loc-rocklea",
        name: "Rocklea National Hub & Fitment Centre",
        address: "5 Permarig Place",
        suburb: "Rocklea",
        state: "QLD",
        postcode: "4106",
        phone: "07 3187 7527",
        latitude: -27.54,
        longitude: 153.00,
        type: "Hub & Workshop",
        hours: "Mon-Fri 7:00am - 5:00pm, Sat 7:30am - 12:00pm",
        active: true
      },
      {
        id: "loc-yatala",
        name: "Yatala Commercial Fleet Branch",
        address: "4 Ozkleen Place",
        suburb: "Yatala",
        state: "QLD",
        postcode: "4207",
        phone: "07 3187 7527",
        latitude: -27.72,
        longitude: 153.24,
        type: "Commercial Service",
        hours: "Mon-Fri 7:00am - 5:00pm",
        active: true
      },
      {
        id: "loc-baldhills",
        name: "Bald Hills Northside Service Centre",
        address: "79 Linkfield Road",
        suburb: "Bald Hills",
        state: "QLD",
        postcode: "4036",
        phone: "07 3187 7527",
        latitude: -27.32,
        longitude: 153.01,
        type: "Workshop & Mobile Van",
        hours: "Mon-Fri 7:00am - 5:00pm",
        active: true
      }
    ];

    for (const loc of initialLocations) {
      await db.collection("locations").updateOne(
        { id: loc.id },
        { $set: loc },
        { upsert: true }
      );
    }
    console.log("Seeded initial service workshop locations.");

    // 3. Seed Products
    const productsPath = path.join(root, "public", "data", "ralson-products.json");
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
      for (const p of products) {
        await db.collection("products").updateOne(
          { id: p.id },
          {
            $set: {
              id: p.id,
              brand: p.brand || "Ralson",
              application: p.application,
              pattern: p.pattern,
              size: p.size,
              ply_rating: p.plyRating,
              load_speed: p.loadSpeed,
              measuring_rim: p.measuringRim,
              overall_diameter_mm: p.overallDiameterMm,
              overall_width_mm: p.overallWidthMm,
              tread_depth_mm: p.treadDepthMm,
              load_single: p.loadSingle,
              load_dual: p.loadDual,
              image: p.image,
              stock: 32,
              price: "365.00",
              active: true,
              updated_at: new Date()
            }
          },
          { upsert: true }
        );
      }
      console.log(`Seeded ${products.length} commercial tyre products into MongoDB.`);
    }

    // 4. Seed Admin Account if credentials provided
    const adminEmail = (process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@ultimatetyres.com.au").toLowerCase().trim();
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || "admin123";
    const adminHash = await bcrypt.hash(adminPassword, 12);

    await db.collection("accounts").updateOne(
      { email: adminEmail },
      {
        $set: {
          email: adminEmail,
          password_hash: adminHash,
          role: "admin",
          active: true,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`Admin account ready: ${adminEmail}`);

    // 5. Seed Demo Dealer Account
    const dealerEmail = "dealer@ultimatetyres.com.au";
    const dealerHash = await bcrypt.hash("dealer123", 12);
    const accountRes = await db.collection("accounts").findOneAndUpdate(
      { email: dealerEmail },
      {
        $set: {
          email: dealerEmail,
          password_hash: dealerHash,
          role: "dealer",
          active: true,
          updated_at: new Date()
        }
      },
      { upsert: true, returnDocument: "after" }
    );

    const accountId = accountRes?._id || "demo-dealer-account";
    await db.collection("dealers").updateOne(
      { email: dealerEmail },
      {
        $set: {
          accountId,
          business_name: "Queensland Transport Tyres Pty Ltd",
          abn: "45 109 874 321",
          phone: "07 3187 7527",
          state: "QLD",
          email: dealerEmail,
          address: "Unit 3, 12 Grindle Road, Rocklea QLD 4106",
          active: true,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`Demo dealer account ready: ${dealerEmail} / dealer123`);

    console.log("\n MongoDB setup complete successfully!");
  } catch (err) {
    console.error("MongoDB setup error:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

setup();
