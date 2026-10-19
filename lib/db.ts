import { MongoClient, type Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI || process.env.MONGODB_URL);
}

/**
 * Cached MongoDB connection.
 * - Short timeouts so pages fall back to built-in data quickly when the
 *   database is unreachable (e.g. testing on localhost with no internet).
 * - A failed connection is not cached, so the next request retries.
 */
export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured. Add your MongoDB connection string to environment variables.");
  }

  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS || 4000),
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
      appName: "ultimate-tyres-web"
    });
    globalThis._mongoClientPromise = client.connect().catch((error) => {
      globalThis._mongoClientPromise = undefined;
      throw error;
    });
  }
  return globalThis._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "ultimate_tyres");
}

export const database = getDb;
