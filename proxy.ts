import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on the server before every page and API request (Next.js 16 "proxy",
 * formerly middleware).
 *
 * 1. Content-Security-Policy with a fresh nonce per request. Next.js reads the
 *    nonce from the request header and adds it to every script it renders, so
 *    only our own scripts can run (blocks injected/XSS scripts).
 * 2. CSRF protection: state-changing API requests sent by a browser from another
 *    website are rejected.
 */

const STATE_CHANGING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function requestHost(request: NextRequest) {
  return (request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host)
    .split(",")[0]
    .trim()
    .toLowerCase();
}

function isLocalHost(host: string) {
  return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}

function buildCsp(nonce: string, { dev, https }: { dev: boolean; https: boolean }) {
  return [
    "default-src 'self'",
    // 'strict-dynamic' lets Next.js' nonce'd scripts load their chunks.
    // React needs 'unsafe-eval' in development only (better error stacks).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    // The site uses React inline style attributes, which need 'unsafe-inline' for styles (not scripts).
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    "media-src 'self'",
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Only upgrade requests when the site itself is served over HTTPS, so plain
    // http://localhost keeps working for local testing.
    ...(https ? ["upgrade-insecure-requests"] : [])
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = requestHost(request);

  // --- CSRF guard for API writes -------------------------------------------
  if (pathname.startsWith("/api/") && STATE_CHANGING.has(request.method)) {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");
    let sameOrigin = true;
    if (origin) {
      try {
        sameOrigin = new URL(origin).host.toLowerCase() === host;
      } catch {
        sameOrigin = false;
      }
    } else if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
      sameOrigin = false;
    }
    if (!sameOrigin) {
      return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
    }
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  // --- CSP nonce for pages --------------------------------------------------
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const https = (forwardedProto ?? request.nextUrl.protocol.replace(":", "")) === "https" && !isLocalHost(host);
  const csp = buildCsp(nonce, { dev: process.env.NODE_ENV === "development", https });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  // Signed-in areas must never be cached by browsers or shared caches.
  if (pathname.startsWith("/portal") || pathname.startsWith("/admin") || pathname.startsWith("/dealers/login")) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: [
    {
      // Everything except static build files, images, videos and data files.
      source: "/((?!_next/static|_next/image|images/|videos/|data/|favicon.ico|icon\\.jpg|robots\\.txt|sitemap\\.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
  ]
};
