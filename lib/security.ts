import { NextResponse } from "next/server";

/** Best-effort client IP for rate limiting. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "local";
}

/**
 * Defence-in-depth CSRF check (proxy.ts does the same). Browsers always send an
 * Origin header on cross-site POST/PATCH; reject it when it isn't this site.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(",")[0].trim().toLowerCase();
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

export class BadRequest extends Error {}

/** Reads a JSON object body with a size cap and rejects anything else. */
export async function readJsonBody(request: Request, maxBytes = 16 * 1024): Promise<Record<string, unknown>> {
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().startsWith("application/json")) throw new BadRequest("Expected a JSON request.");
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new BadRequest("Request is too large.");
  const text = await request.text();
  if (Buffer.byteLength(text) > maxBytes) throw new BadRequest("Request is too large.");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BadRequest("Malformed JSON.");
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new BadRequest("Expected a JSON object.");
  return data as Record<string, unknown>;
}

/** Coerces untrusted input to a trimmed, length-limited plain string (never an object). */
export function str(value: unknown, max: number): string {
  if (typeof value === "string") return value.trim().slice(0, max);
  if (typeof value === "number" && Number.isFinite(value)) return String(value).slice(0, max);
  return "";
}

/** Strips control characters (keeps newlines/tabs) from free text. */
export function cleanText(value: unknown, max: number): string {
  return str(value, max).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

export function jsonError(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ error: message }, { status, headers });
}

export function forbiddenCrossSite() {
  return jsonError("Cross-site request blocked.", 403);
}
