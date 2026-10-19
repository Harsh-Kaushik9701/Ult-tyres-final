import { headers } from "next/headers";
import { jsonLd } from "@/lib/seo";

/**
 * Renders structured data (schema.org JSON-LD) on the server.
 * Carries the per-request CSP nonce so it passes the Content-Security-Policy.
 */
export async function JsonLd({ data }: { data: unknown }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
