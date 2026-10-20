import type { NextConfig } from "next";

/**
 * Security headers sent with every response (pages, API routes and static files).
 * The Content-Security-Policy is set per request in proxy.ts because it needs a nonce.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  },
  // Browsers ignore HSTS on plain http://localhost, so this is safe for local testing.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Images are served as-is from /public (already optimised .webp files); this
  // also means no external image service is needed when testing offline.
  images: { unoptimized: true },
  async redirects() {
    // Careers now lives on the contact page.
    return [{ source: "/careers", destination: "/contact?topic=careers", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(images|videos)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }]
      }
    ];
  }
};

export default nextConfig;
