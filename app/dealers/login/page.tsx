import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site";
import { LoginForm } from "@/components/catalog";
import { demoLoginEnabled } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Authorised Dealer Login",
  description:
    "Sign in to the Ultimate Tyres dealer portal for live wholesale tyre pricing, rapid SKU ordering, inventory and order fulfilment.",
  keywords: ["tyre dealer portal", "wholesale tyre ordering"],
  path: "/dealers/login",
  noIndex: true
});

export default function DealerLoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Commercial Fleet Network · Dealer Portal"
        title="Authorised Wholesale Portal."
        intro="Access live warehouse stock, wholesale trade pricing, rapid SKU ordering, and order tracking for Ralson, Blacklion, and Triangle commercial radials."
      />
      <section className="section">
        <div className="container content-layout">
          <LoginForm demo={demoLoginEnabled()} />
          <aside className="side-panel">
            <h3>Portal Features</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13, lineHeight: 1.5 }}>
              <div>
                <strong style={{ display: "block", color: "var(--ink)", marginBottom: 2 }}>
                  1. Live Wholesale Tyre Selector
                </strong>
                <span>Filter by brand (Ralson, Blacklion, Triangle), axle application, rim size, and load ratings.</span>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--ink)", marginBottom: 2 }}>
                  2. Photo & Technical Specifications
                </strong>
                <span>Inspect tread depths, ply ratings, single/dual load limits, and speed indices before ordering.</span>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--ink)", marginBottom: 2 }}>
                  3. Rapid SKU Order Form
                </strong>
                <span>Quick-entry bulk quantity grid with instant subtotal calculations and purchase order (PO) tagging.</span>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--ink)", marginBottom: 2 }}>
                  4. Real-Time Order History & Tracking
                </strong>
                <span>Track dispatch status from our Rocklea head office, Yatala and Bald Hills branches.</span>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
              <h4>Register for New Access</h4>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 16px" }}>
                Commercial tyre dealers, fleet workshops, and transport operators can apply for trade portal credentials.
              </p>
              <Link className="button button-dark" href="/dealers/apply" style={{ width: "100%", justifyContent: "center" }}>
                Apply to become a dealer ↗
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
