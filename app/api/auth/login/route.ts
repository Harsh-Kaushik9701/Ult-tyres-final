import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb, isMongoConfigured } from "@/lib/db";
import { signSession, sessionCookieName, sessionCookieOptions, SESSION_TTL_SECONDS, type Session } from "@/lib/session";
import { demoLoginEnabled } from "@/lib/auth";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { BadRequest, clientIp, isSameOrigin, jsonError, forbiddenCrossSite, readJsonBody, str } from "@/lib/security";

// A real bcrypt hash of a random value: used so a login for an unknown email
// takes as long as one for a real email (prevents account discovery by timing).
const DUMMY_HASH = "$2a$12$jRvwoyczYEPziO4vxcggoObRWHsz4UeqUDODo2VWRlTwhkPFzAxTm";
const GENERIC_ERROR = "Email or password wasn’t recognised.";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Local-only demo accounts (see .env.example). Exact credentials only. */
function demoAccount(email: string, password: string): Omit<Session, "exp"> | null {
  if (!demoLoginEnabled()) return null;
  const dealerPass = process.env.DEMO_DEALER_PASSWORD || "dealer123";
  const adminPass = process.env.DEMO_ADMIN_PASSWORD || "admin123";
  if (email === "dealer@ultimatetyres.com.au" && safeEqual(password, dealerPass)) {
    return { id: "demo-dealer", email, role: "dealer", dealerId: "demo-dealer-qld", demo: true };
  }
  if (email === "admin@ultimatetyres.com.au" && safeEqual(password, adminPass)) {
    return { id: "demo-admin", email, role: "admin", demo: true };
  }
  return null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossSite();

  const ip = clientIp(request);
  const ipLimit = rateLimit(`login-ip:${ip}`, 20, 15 * 60_000);
  if (!ipLimit.ok) {
    return jsonError("Too many sign-in attempts. Please wait and try again.", 429, { "Retry-After": String(ipLimit.retryAfter) });
  }

  let email = "";
  let password = "";
  try {
    const body = await readJsonBody(request, 4 * 1024);
    email = str(body.email, 254).toLowerCase();
    password = typeof body.password === "string" ? body.password : "";
  } catch (error) {
    if (error instanceof BadRequest) return jsonError("Enter your email and password.", 400);
    throw error;
  }
  if (!email || !password || password.length > 200) return jsonError("Enter your email and password.", 400);

  const accountKey = `login-account:${email}`;
  const accountLimit = rateLimit(accountKey, 5, 15 * 60_000);
  if (!accountLimit.ok) {
    return jsonError("Too many sign-in attempts for this account. Please wait 15 minutes.", 429, {
      "Retry-After": String(accountLimit.retryAfter)
    });
  }

  try {
    let session: Omit<Session, "exp"> | null = demoAccount(email, password);

    if (!session && isMongoConfigured()) {
      const db = await getDb();
      const account = await db.collection("accounts").findOne({ email });
      const hash = typeof account?.password_hash === "string" && account.password_hash ? account.password_hash : DUMMY_HASH;
      const passwordOk = await bcrypt.compare(password, hash);

      if (account && passwordOk && account.active !== false && (account.role === "dealer" || account.role === "admin")) {
        let dealerId: string | undefined;
        if (account.role === "dealer") {
          const dealer = await db.collection("dealers").findOne({
            $or: [{ accountId: account._id }, { account_id: account._id }, { email }]
          });
          // A dealer login without a dealer record would see nobody's (or everybody's) data.
          if (!dealer) return jsonError("Your dealer account isn’t fully set up yet. Please contact Ultimate Tyres.", 403);
          dealerId = String(dealer._id);
        }
        session = { id: String(account._id), email: account.email, role: account.role, dealerId };
        await db.collection("accounts").updateOne({ _id: account._id }, { $set: { last_login_at: new Date() } });
      }
    } else if (!session) {
      await bcrypt.compare(password, DUMMY_HASH); // equalise timing
    }

    if (!session) return jsonError(GENERIC_ERROR, 401);

    resetRateLimit(accountKey);
    const token = signSession({ ...session, exp: Date.now() + SESSION_TTL_SECONDS * 1000 });
    const response = NextResponse.json({ role: session.role });
    response.cookies.set(sessionCookieName, token, sessionCookieOptions(request));
    return response;
  } catch (error) {
    console.error("login failed", error);
    return jsonError("Dealer sign-in is unavailable right now. Please try again shortly.", 503);
  }
}
