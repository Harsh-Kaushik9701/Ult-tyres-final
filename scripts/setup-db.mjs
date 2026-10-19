import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

try { process.loadEnvFile(path.join(root, ".env.local")); } catch {}
try { process.loadEnvFile(path.join(root, ".env")); } catch {}

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

    // 2. Seed Locations – the three branches (Rocklea head office, Yatala, Bald Hills).
    const initialLocations = [
      { id: "loc-rocklea", name: "Ultimate Tyres Rocklea (Head office)", address: "5 Permarig Place", suburb: "Rocklea", state: "QLD", postcode: "4106", phone: "1300 110 002", latitude: -27.5486, longitude: 153.0037, capabilities: ["Tyre fitting", "Wheel alignment", "Wheel balancing", "Mobile service"], active: true },
      { id: "loc-yatala", name: "Ultimate Tyres Yatala", address: "4 Ozkleen Place", suburb: "Yatala", state: "QLD", postcode: "4207", phone: "1300 110 002", latitude: -27.7366, longitude: 153.2208, capabilities: ["Tyre fitting", "Wheel balancing", "Mobile service"], active: true },
      { id: "loc-baldhills", name: "Ultimate Tyres Bald Hills", address: "79 Linkfield Road", suburb: "Bald Hills", state: "QLD", postcode: "4036", phone: "1300 110 002", latitude: -27.3131, longitude: 153.0127, capabilities: ["Tyre fitting", "Puncture repair", "Mobile service"], active: true }
    ];

    for (const loc of initialLocations) {
      await db.collection("locations").updateOne({ id: loc.id }, { $set: loc }, { upsert: true });
    }
    // Remove the old interstate placeholder hubs seeded by earlier versions of this script.
    await db.collection("locations").deleteMany({ id: { $in: ["loc-easterncreek", "loc-botany", "loc-newcastle", "loc-laverton", "loc-dandenong", "loc-wingfield", "loc-kewdale", "loc-townsville"] } });
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

    // 4. Seed Admin Account – only with an explicit, strong password.
    const adminEmail = (process.env.BOOTSTRAP_ADMIN_EMAIL || "").toLowerCase().trim();
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || "";
    if (adminEmail && adminPassword.length >= 12) {
      const adminHash = await bcrypt.hash(adminPassword, 12);
      await db.collection("accounts").updateOne(
        { email: adminEmail },
        { $set: { email: adminEmail, password_hash: adminHash, role: "admin", active: true, updated_at: new Date() } },
        { upsert: true }
      );
      console.log(`Admin account ready: ${adminEmail}`);
    } else {
      console.log("Skipped admin account: set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of 12+ characters.");
    }

    // 5. Optional demo dealer – never created unless explicitly requested.
    if (process.env.SEED_DEMO_DEALER === "true") {
      const dealerEmail = "dealer@ultimatetyres.com.au";
      const dealerPassword = process.env.DEMO_DEALER_PASSWORD && process.env.DEMO_DEALER_PASSWORD.length >= 12
        ? process.env.DEMO_DEALER_PASSWORD
        : randomBytes(12).toString("base64url");
      const dealerHash = await bcrypt.hash(dealerPassword, 12);
      const accountRes = await db.collection("accounts").findOneAndUpdate(
        { email: dealerEmail },
        { $set: { email: dealerEmail, password_hash: dealerHash, role: "dealer", active: true, updated_at: new Date() } },
        { upsert: true, returnDocument: "after" }
      );
      await db.collection("dealers").updateOne(
        { email: dealerEmail },
        {
          $set: {
            accountId: accountRes._id,
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
      console.log(`Demo dealer account ready: ${dealerEmail} / ${dealerPassword}`);
      console.log("WARNING: delete or deactivate this demo dealer before going live.");
    }

    console.log("\n MongoDB setup complete successfully!");
  } catch (err) {
    console.error("MongoDB setup error:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

setup();
