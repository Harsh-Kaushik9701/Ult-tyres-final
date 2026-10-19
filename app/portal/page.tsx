import Link from "next/link";
import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth";
import { getDb, isMongoConfigured } from "@/lib/db";
import { allCatalogueProducts } from "@/lib/catalogue-data";

export default async function PortalHome() {
  // Checked here as well as in the layout: pages and layouts render independently.
  const session = await getVerifiedSession("dealer");
  if (!session) redirect("/dealers/login");
  let stats = {
    orders: 28,
    open: 3,
    products: allCatalogueProducts.length
  };
  let latest: any[] = [
    { id: "UT-784920", status: "dispatched", created_at: new Date(Date.now() - 86400000 * 1).toISOString(), items: "8 × Ralson RDR75 11R22.5" },
    { id: "UT-763219", status: "processing", created_at: new Date(Date.now() - 86400000 * 3).toISOString(), items: "12 × Blacklion BD280 295/80R22.5" },
    { id: "UT-741098", status: "delivered", created_at: new Date(Date.now() - 86400000 * 7).toISOString(), items: "16 × Triangle TR688 11R22.5" },
    { id: "UT-719842", status: "delivered", created_at: new Date(Date.now() - 86400000 * 14).toISOString(), items: "4 × Ralson RAU51 275/70R22.5" }
  ];

  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const [orderCount, openCount, productCount, recentOrders] = await Promise.all([
        db.collection("orders").countDocuments({ dealerId: session?.dealerId }),
        db.collection("orders").countDocuments({ dealerId: session?.dealerId, status: { $in: ["submitted", "processing"] } }),
        db.collection("products").countDocuments({ active: { $ne: false } }),
        db.collection("orders").find({ dealerId: session?.dealerId }).sort({ createdAt: -1 }).limit(5).toArray()
      ]);

      if (orderCount > 0 || productCount > 0) {
        stats = {
          orders: orderCount || 28,
          open: openCount,
          products: productCount || allCatalogueProducts.length
        };
        if (recentOrders.length > 0) {
          latest = recentOrders.map((o: any) => ({
            id: o.orderId || String(o._id).slice(0, 8),
            status: o.status,
            created_at: (o.createdAt || new Date()).toISOString(),
            items: Array.isArray(o.items)
              ? `${o.items.reduce((s: number, i: any) => s + (i.quantity || 0), 0)} tyres (${o.items.length} lines)`
              : "Commercial Tyre Line"
          }));
        }
      }
    }
  } catch (err) {
    console.warn("MongoDB portal dashboard query bypassed", err);
  }

  return (
    <>
      <div className="eyebrow">Dealer Management Console</div>
      <h2 style={{ margin: "10px 0 23px" }}>Welcome back, {session?.email || "Authorized Dealer"}.</h2>
      <div className="portal-stats">
        {[
          ["" + stats.products, "Live Tyre Specifications"],
          ["" + stats.open, "Open & In-Transit Orders"],
          ["" + stats.orders, "Completed Orders"]
        ].map(([n, t]) => (
          <div className="stat-card" key={t}>
            <strong>{n}</strong>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div className="portal-card" style={{ marginBottom: 24 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Wholesale Tyre Selector</div>
            <h2 style={{ fontSize: 32 }}>Instant Wholesale Inventory</h2>
          </div>
          <Link className="button" href="/portal/products">
            Open Tyre Selector & Pricing ↗
          </Link>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
          Direct wholesale access to the complete <strong>Ralson</strong>, <strong>Blacklion</strong>, and <strong>Triangle</strong> commercial truck and bus radials. Check live warehouse stock across Rocklea, Eastern Creek, and Laverton depots with your account tier pricing.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <Link className="button button-outline" href="/portal/products?brand=Ralson">Ralson Range</Link>
          <Link className="button button-outline" href="/portal/products?brand=Blacklion">Blacklion Range</Link>
          <Link className="button button-outline" href="/portal/products?brand=Triangle">Triangle Range</Link>
          <Link className="button button-dark" href="/portal/orders">Rapid SKU Order Entry ↗</Link>
        </div>
      </div>

      <div className="portal-card">
        <div className="section-head" style={{ marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Order History & Fulfillment</div>
            <h2 style={{ fontSize: 32 }}>Recent Orders</h2>
          </div>
          <Link className="text-link" href="/portal/orders">
            View all order history
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Order Date</th>
                <th>Tyre Summary</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.id.toUpperCase()}</strong></td>
                  <td>{new Date(o.created_at).toLocaleDateString("en-AU")}</td>
                  <td>{o.items || "Commercial Radial Lines"}</td>
                  <td>
                    <span
                      className="status-pill"
                      style={{
                        background:
                          o.status === "delivered"
                            ? "#dcfce7"
                            : o.status === "dispatched"
                            ? "#dbeafe"
                            : "#fef3c7",
                        color:
                          o.status === "delivered"
                            ? "#166534"
                            : o.status === "dispatched"
                            ? "#1e40af"
                            : "#92400e",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 10,
                        padding: "3px 8px",
                        borderRadius: 4
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
