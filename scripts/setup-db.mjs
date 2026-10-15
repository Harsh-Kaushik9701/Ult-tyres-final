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

    // 2. Seed Locations
    const initialLocations = [
      {
        id: "loc-rocklea",
        name: "Rocklea National Logistics Hub & Laser Alignment",
        address: "5 Permarig Place",
        suburb: "Rocklea",
        state: "QLD",
        postcode: "4106",
        phone: "07 3187 7527",
        latitude: -27.54,
        longitude: 153.00,
        type: "Flagship Distribution & Alignment Center",
        hours: "Mon - Fri: 6:30am - 5:30pm | Sat: 7:00am - 12:00pm",
        capabilities: ["Full Laser Alignment", "Heavy Truck Fitting", "Wholesale Depot", "Mobile Support"],
        active: true
      },
      {
        id: "loc-yatala",
        name: "Yatala Fleet Services & Heavy Balancing",
        address: "4 Ozkleen Place",
        suburb: "Yatala",
        state: "QLD",
        postcode: "4207",
        phone: "07 3187 7527",
        latitude: -27.72,
        longitude: 153.24,
        type: "Heavy Vehicle Service Centre",
        hours: "Mon - Fri: 7:00am - 5:00pm",
        capabilities: ["Truck Wheel Balancing", "Nitrogen Inflation", "Fleet Fitting", "Emergency Support"],
        active: true
      },
      {
        id: "loc-baldhills",
        name: "Bald Hills Northside Depot & Rapid Fitting",
        address: "79 Linkfield Road",
        suburb: "Bald Hills",
        state: "QLD",
        postcode: "4036",
        phone: "07 3187 7527",
        latitude: -27.32,
        longitude: 153.01,
        type: "Regional Fitting & Rapid Dispatch",
        hours: "Mon - Fri: 7:00am - 5:00pm",
        capabilities: ["Commercial Fitting", "ReadyFit Swap Service", "Puncture Proofing"],
        active: true
      },
      {
        id: "loc-easterncreek",
        name: "Sydney Western Freight Depot & Alignment Hub",
        address: "18 Wonderland Drive",
        suburb: "Eastern Creek",
        state: "NSW",
        postcode: "2766",
        phone: "02 8999 4110",
        latitude: -33.80,
        longitude: 150.86,
        type: "Interstate Freight & Wholesale Hub",
        hours: "Mon - Fri: 6:00am - 6:00pm",
        capabilities: ["Full Laser Alignment", "Rapid Wholesale Dispatch", "B-Double Drive-Through Bays"],
        active: true
      },
      {
        id: "loc-botany",
        name: "Sydney Port & Container Fitment Depot",
        address: "42 Bumborah Point Road",
        suburb: "Port Botany",
        state: "NSW",
        postcode: "2036",
        phone: "02 8999 4112",
        latitude: -33.98,
        longitude: 151.22,
        type: "Port Container & Rigids Centre",
        hours: "Mon - Fri: 6:30am - 5:00pm",
        capabilities: ["Stevedore & Container Fleet Fitment", "Heavy Radial Balancing", "Sidewall Scuff Inspection"],
        active: true
      },
      {
        id: "loc-newcastle",
        name: "Hunter Valley Transport & Haulage Depot",
        address: "12 John Renshaw Drive",
        suburb: "Beresfield",
        state: "NSW",
        postcode: "2322",
        phone: "02 4911 2800",
        latitude: -32.81,
        longitude: 151.65,
        type: "Heavy Haulage & Tipper Service",
        hours: "Mon - Fri: 7:00am - 5:00pm",
        capabilities: ["Tipper & Quarry Radials", "Laser Alignment", "On-Site Fleet Inspections"],
        active: true
      },
      {
        id: "loc-laverton",
        name: "Melbourne West Logistics Terminal & Alignment",
        address: "88 Boundary Road",
        suburb: "Laverton North",
        state: "VIC",
        postcode: "3026",
        phone: "03 9111 8720",
        latitude: -37.83,
        longitude: 144.80,
        type: "Major Victorian Wholesale & Alignment Hub",
        hours: "Mon - Fri: 6:00am - 6:00pm | Sat: 7:00am - 1:00pm",
        capabilities: ["Computerised Tandem Alignment", "ReadyFit Pit Stop", "High Volume Stockroom"],
        active: true
      },
      {
        id: "loc-dandenong",
        name: "Melbourne South-East Fitting Centre",
        address: "15 Frankston-Dandenong Road",
        suburb: "Dandenong South",
        state: "VIC",
        postcode: "3175",
        phone: "03 9111 8725",
        latitude: -37.99,
        longitude: 145.21,
        type: "Regional Commercial Service Depot",
        hours: "Mon - Fri: 7:00am - 5:00pm",
        capabilities: ["Truck Alignment", "Wheel Rim Solutions", "Heavy Radial Balancing"],
        active: true
      },
      {
        id: "loc-wingfield",
        name: "Adelaide Freight Corridor Depot & Alignment",
        address: "24 Cormack Road",
        suburb: "Wingfield",
        state: "SA",
        postcode: "5013",
        phone: "08 8122 3400",
        latitude: -34.84,
        longitude: 138.56,
        type: "Central Transport Hub & Alignment",
        hours: "Mon - Fri: 7:00am - 5:00pm",
        capabilities: ["Road Train Alignment", "Heavy Drive Radial Stock", "ReadyFit Swap"],
        active: true
      },
      {
        id: "loc-kewdale",
        name: "Perth Western Gateway Centre & Road Train Hub",
        address: "31 Miles Road",
        suburb: "Kewdale",
        state: "WA",
        postcode: "6105",
        phone: "08 6109 7780",
        latitude: -31.98,
        longitude: 115.96,
        type: "Western Australia Mining & Interstate Depot",
        hours: "Mon - Fri: 6:30am - 5:30pm",
        capabilities: ["Triple Road Train Fitment", "Cut-Resistant Compounds", "Wholesale Distribution"],
        active: true
      },
      {
        id: "loc-townsville",
        name: "North Queensland Highway Terminal",
        address: "54 Ingham Road",
        suburb: "Townsville",
        state: "QLD",
        postcode: "4810",
        phone: "07 4799 1200",
        latitude: -19.26,
        longitude: 146.80,
        type: "Northern Australia Road Train Hub",
        hours: "Mon - Fri: 6:30am - 5:00pm",
        capabilities: ["Severe Duty Heat Formulations", "Road Train Alignment", "Emergency Callout"],
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
