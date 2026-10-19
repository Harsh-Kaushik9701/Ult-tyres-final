import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Session = { id: string; email: string; role: "dealer" | "admin"; dealerId?: string; exp: number; demo?: boolean };

const cookieName = "ut_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

declare global {
  var _utDevSessionSecret: string | undefined;
}

/**
 * HMAC key for session cookies.
 * - Production: SESSION_SECRET (32+ chars) is required. There is no hard-coded
 *   fallback any more, because anyone who knows a fallback key can forge an
 *   admin session.
 * - Development: if unset, a random key is generated for this server process.
 */
function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters.");
  }
  if (!globalThis._utDevSessionSecret) {
    globalThis._utDevSessionSecret = randomBytes(48).toString("base64url");
    console.warn("[session] SESSION_SECRET not set – using a temporary development key.");
  }
  return globalThis._utDevSessionSecret;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function signSession(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return payload + "." + signature(payload);
}

export function verifySessionToken(raw: string | undefined | null): Session | null {
  if (!raw || raw.length > 4096) return null;
  const parts = raw.split(".");
  if (parts.length !== 2) return null;
  const [payload, provided] = parts;
  if (!payload || !provided) return null;
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    if (session.role !== "dealer" && session.role !== "admin") return null;
    if (typeof session.id !== "string" || typeof session.email !== "string") return null;
    return session;
  } catch {
    return null;
  }
}

export async function currentSession(): Promise<Session | null> {
  return verifySessionToken((await cookies()).get(cookieName)?.value);
}

/**
 * Cookie flags. `secure` is on whenever the request came in over HTTPS, so the
 * login also works on plain http://localhost while staying secure in production.
 */
export function sessionCookieOptions(request: Request, maxAge = SESSION_TTL_SECONDS) {
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || new URL(request.url).protocol.replace(":", "");
  return {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
    priority: "high" as const
  };
}

export const sessionCookieName = cookieName;
