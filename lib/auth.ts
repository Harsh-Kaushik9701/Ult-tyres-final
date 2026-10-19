import { ObjectId } from "mongodb";
import { cache } from "react";
import { currentSession, type Session } from "@/lib/session";
import { getDb, isMongoConfigured } from "@/lib/db";

/**
 * Returns the signed-in user only if they have the required role and – when the
 * database is connected – their account still exists and is active. This means
 * deactivating an account in MongoDB takes effect immediately instead of when
 * the 8-hour cookie expires.
 *
 * Cached per request, so layouts and pages can both call it cheaply.
 */
export const getVerifiedSession = cache(async (role: Session["role"]): Promise<Session | null> => {
  const session = await currentSession();
  if (!session || session.role !== role) return null;
  if (role === "dealer" && !session.dealerId) return null;

  if (session.demo) return demoLoginEnabled() ? session : null;

  if (!isMongoConfigured()) return null; // real accounts only exist in MongoDB
  try {
    if (!ObjectId.isValid(session.id)) return null;
    const db = await getDb();
    const account = await db
      .collection("accounts")
      .findOne({ _id: new ObjectId(session.id) }, { projection: { role: 1, active: 1, email: 1 } });
    if (!account || account.active === false || account.role !== role || account.email !== session.email) return null;
    return session;
  } catch (error) {
    console.error("session verification failed", error);
    return null;
  }
});

/**
 * Demo logins exist only for local testing: they need ENABLE_DEMO_LOGIN=true and
 * are always disabled in production builds.
 */
export function demoLoginEnabled() {
  return process.env.ENABLE_DEMO_LOGIN === "true" && process.env.NODE_ENV !== "production";
}
