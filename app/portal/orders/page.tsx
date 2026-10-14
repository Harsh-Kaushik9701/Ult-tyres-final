import { RapidOrderForm } from "@/components/portal";
import { currentSession } from "@/lib/session";
import { getDb, isMongoConfigured } from "@/lib/db";
import { allCatalogueProducts } from "@/lib/catalogue-data";

export const dynamic = "force-dynamic";

export default async function PortalOrders() {
  const session = await currentSession();
  const products = allCatalogueProducts.map((p) => ({
    id: p.id,
    brand: p.brand,
    application: p.application,
    pattern: p.pattern,
    size: p.size,
    ply_rating: p.plyRating,
    load_speed: p.loadSpeed,
    tread_depth_mm: p.treadDepthMm,
    image: p.image,
    stock: p.stock,
    price: String(p.wholesalePrice),
    rrp: p.rrp,
    axle: p.axle
  }));

  let orders: any[] = [
    {
      id: "UT-784920",
      status: "dispatched",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      po: "PO-7721-QLD",
      items: [
        { brand: "Ralson", pattern: "RDR75", size: "11R22.5", quantity: 8, unitPrice: "385.00" },
        { brand: "Blacklion", pattern: "BF188", size: "295/80R22.5", quantity: 4, unitPrice: "395.00" }
      ]
    },
    {
      id: "UT-763219",
      status: "processing",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      po: "PO-7680-SYD",
      items: [
        { brand: "Blacklion", pattern: "BD280", size: "295/80R22.5", quantity: 12, unitPrice: "420.00" },
        { brand: "Triangle", pattern: "TRT01", size: "255/70R22.5", quantity: 6, unitPrice: "320.00" }
      ]
    },
    {
      id: "UT-741098",
      status: "delivered",
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      po: "PO-7512-MEL",
      items: [
        { brand: "Triangle", pattern: "TR688", size: "11R22.5", quantity: 16, unitPrice: "370.00" }
      ]
    },
    {
      id: "UT-719842",
      status: "delivered",
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      po: "PO-7320-BNE",
      items: [
        { brand: "Ralson", pattern: "RAU51", size: "275/70R22.5", quantity: 4, unitPrice: "390.00" }
      ]
    }
  ];

  try {
    if (isMongoConfigured()) {
      const db = await getDb();
      const docs = await db
        .collection("orders")
        .find(session?.dealerId ? { dealerId: session.dealerId } : {})
        .sort({ created_at: -1 })
        .limit(50)
        .toArray();
      if (docs && docs.length > 0) {
        orders = docs.map((o) => ({
          id: o.orderId || o.id || String(o._id),
          status: o.status || "processing",
          created_at: o.created_at || o.createdAt || new Date().toISOString(),
          po: o.poNumber || o.po || "PO-ONLINE",
          items: o.items || []
        }));
      }
    }
  } catch {}

  return (
    <>
      <div className="eyebrow">Rapid Wholesale Order</div>
      <h2 style={{ margin: "9px 0" }}>SKU Rapid Order Form</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
        Rapid wholesale ordering for authorized commercial dealers. Enter bulk quantities for Ralson, Blacklion, or Triangle commercial tyres, attach your purchase order reference, and submit directly to dispatch.
      </p>

      <RapidOrderForm products={products} />

      <div className="section-head" style={{ marginTop: 44, marginBottom: 16 }}>
        <div>
          <div className="eyebrow">Your Account</div>
          <h2 style={{ fontSize: 32 }}>Order History & Invoices</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Placed Date</th>
              <th>PO Number</th>
              <th>Items & Quantities</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.id.toUpperCase()}</strong></td>
                <td>{new Date(o.created_at).toLocaleDateString("en-AU")}</td>
                <td><span style={{ fontFamily: "monospace", fontSize: 12 }}>{o.po || "PO-ONLINE"}</span></td>
                <td>
                  <details style={{ cursor: "pointer" }}>
                    <summary style={{ fontWeight: 600 }}>
                      {o.items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) || 0} tyres (
                      {o.items?.length || 0} line items)
                    </summary>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#f8faf9", borderRadius: 4, fontSize: 11 }}>
                      {o.items?.map((item: any, i: number) => (
                        <div key={i} style={{ padding: "3px 0" }}>
                          • <strong>{item.quantity} × {item.brand} {item.pattern}</strong> ({item.size}) @ ${item.unitPrice || "380"}
                        </div>
                      ))}
                    </div>
                  </details>
                </td>
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
    </>
  );
}
