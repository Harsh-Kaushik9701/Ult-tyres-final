import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/portal", "/admin", "/api/", "/dealers/login"] },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
