import { currentSession } from "@/lib/session";
import { getDb, isMongoConfigured } from "@/lib/db";
import Link from "next/link";

export default async function PortalAccount() {
  const session = await currentSession();
  let dealer: any = {
    business_name: "Queensland Transport Tyres Pty Ltd",
    abn: "45 109 874 321",
    phone: "07 3187 7527",
    state: "QLD",
    email: session?.email || "dealer@ultimatetyres.com.au",
    address: "Unit 3, 12 Grindle Road, Rocklea QLD 4106",
    accountTier: "Tier 1 National Wholesale Fleet Partner",
    paymentTerms: "30 Days End of Month (Approved)",
    accountManager: "Mark Henderson · National Commercial Fleet Lead (0482 094 850)"
  };

  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const filter: any = session?.dealerId
        ? { $or: [{ id: session.dealerId }, { accountId: session.dealerId }, { email: session?.email }] }
        : { email: session?.email };
      const d = await db.collection("dealers").findOne(filter);
      if (d) {
        dealer = {
          ...dealer,
          business_name: d.business_name || d.businessName || dealer.business_name,
          abn: d.abn || dealer.abn,
          phone: d.phone || dealer.phone,
          state: d.state || dealer.state,
          email: d.email || session?.email || dealer.email,
          address: d.address || dealer.address
        };
      }
    }
  } catch {}

  return (
    <>
      <div className="eyebrow">Dealer Account Management</div>
      <h2 style={{ margin: "9px 0" }}>Account Profile & Wholesale Terms</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
        Review your authorised company details, assigned price tiers, delivery addresses, and commercial credit arrangements.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="portal-card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Company Information</h3>
          <div className="product-specs">
            <span>Trading Entity <strong>{dealer.business_name}</strong></span>
            <span>Australian Business Number <strong>{dealer.abn}</strong></span>
            <span>Registered Email <strong>{dealer.email}</strong></span>
            <span>Telephone <strong>{dealer.phone}</strong></span>
            <span>Primary Dispatch State <strong>{dealer.state}</strong></span>
            <span>Delivery Yard <strong>{dealer.address}</strong></span>
          </div>
          <div style={{ marginTop: 18 }}>
            <Link className="button button-dark" href="/contact">
              Request Profile Update ↗
            </Link>
          </div>
        </div>

        <div className="portal-card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Commercial Terms & Support</h3>
          <div className="product-specs">
            <span>Wholesale Price Tier <strong style={{ color: "var(--yellow-deep)" }}>{dealer.accountTier}</strong></span>
            <span>Credit Settlement <strong style={{ color: "#166534" }}>{dealer.paymentTerms}</strong></span>
            <span>Direct Account Manager <strong>{dealer.accountManager}</strong></span>
            <span>Dispatch Depot <strong>Rocklea National Distribution Center</strong></span>
            <span>Emergency Fleet Line <strong>1300 110 002 (24/7 Priority)</strong></span>
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <a className="button" href="https://wa.me/61482094850" target="_blank" rel="noreferrer">
              Message Account Manager on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
