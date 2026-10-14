"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";

export function PortalNav() {
  const path = usePathname();
  return (
    <nav className="portal-nav" aria-label="Dealer portal">
      <Link href="/portal" aria-current={path === "/portal" ? "page" : undefined}>
        Dashboard
      </Link>
      <Link href="/portal/products" aria-current={path === "/portal/products" ? "page" : undefined}>
        Wholesale Tyre Selector
      </Link>
      <Link href="/portal/orders" aria-current={path === "/portal/orders" ? "page" : undefined}>
        Rapid Order & History
      </Link>
      <Link href="/portal/account" aria-current={path === "/portal/account" ? "page" : undefined}>
        Account Profile
      </Link>
    </nav>
  );
}

export function SignOut() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="button button-outline"
      style={{ borderColor: "var(--line)", color: "var(--ink)", padding: "8px 16px" }}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST" });
        location.href = "/";
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

export type DealerProduct = {
  id: number;
  brand: string;
  application: string;
  pattern: string;
  size: string;
  ply_rating?: string;
  load_speed?: string;
  tread_depth_mm?: string;
  image: string;
  stock: number;
  price: string | null;
  rrp?: number;
  axle?: string;
};

export function DealerProductCatalog({ products }: { products: DealerProduct[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [axle, setAxle] = useState("all");
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchText =
        !query ||
        `${p.pattern} ${p.size} ${p.brand} ${p.application}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchBrand = brand === "all" || p.brand.toLowerCase() === brand.toLowerCase();
      const matchAxle =
        axle === "all" ||
        (p.axle && p.axle.toLowerCase() === axle.toLowerCase()) ||
        (axle === "bus" && (p.application.toLowerCase().includes("bus") || p.application.toLowerCase().includes("coach")));
      return matchText && matchBrand && matchAxle;
    });
  }, [products, query, brand, axle]);

  async function place(product: DealerProduct) {
    const quantity = Number(quantities[product.id] || 4);
    setBusyId(product.id);
    setMessage("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, quantity }],
          poNumber: poNumber || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Success: Ordered ${quantity} × ${product.brand} ${product.pattern} (${product.size}). Confirmation: ${data.orderId || "Submitted"}. Priority dispatch scheduled!`);
      } else {
        setMessage(data.error || "Order failed. Please try again.");
      }
    } catch {
      setMessage("Order submission error. Please try again.");
    }
    setBusyId(null);
  }

  return (
    <>
      {message && (
        <div
          style={{
            background: message.startsWith("✓") ? "#ecfdf5" : "#fef2f2",
            border: `1px solid ${message.startsWith("✓") ? "#10b981" : "#ef4444"}`,
            color: message.startsWith("✓") ? "#065f46" : "#991b1b",
            padding: "14px 20px",
            borderRadius: 8,
            marginBottom: 20,
            fontWeight: 600,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Brand & Category Tabs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button
          className={`button ${brand === "all" ? "button-dark" : "button-outline"}`}
          onClick={() => setBrand("all")}
          style={{
            padding: "8px 18px",
            fontSize: 13,
            color: brand === "all" ? "#fff" : "var(--ink)",
            borderColor: brand === "all" ? "transparent" : "var(--line)",
            background: brand === "all" ? "var(--ink)" : "#fff"
          }}
        >
          All Brands ({products.length})
        </button>
        {["Ralson", "Blacklion", "Triangle"].map((b) => {
          const isActive = brand.toLowerCase() === b.toLowerCase();
          const count = products.filter((p) => p.brand.toLowerCase() === b.toLowerCase()).length;
          return (
            <button
              key={b}
              className={`button ${isActive ? "button-dark" : "button-outline"}`}
              onClick={() => setBrand(b.toLowerCase())}
              style={{
                padding: "8px 18px",
                fontSize: 13,
                color: isActive ? "#fff" : "var(--ink)",
                borderColor: isActive ? "transparent" : "var(--line)",
                background: isActive ? "var(--ink)" : "#fff"
              }}
            >
              {b} ({count})
            </button>
          );
        })}
      </div>

      {/* Axle Tabs & Filter Bar */}
      <div className="catalog-tools" style={{ gap: 10, marginBottom: 14 }}>
        <input
          className="field"
          placeholder="Search by pattern (e.g. RDR75, BD280, TR688) or size (11R22.5)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tyre catalogue"
          style={{ minWidth: 260 }}
        />
        <select
          className="select"
          value={axle}
          onChange={(e) => setAxle(e.target.value)}
          aria-label="Filter by axle position"
        >
          <option value="all">All Axle Positions</option>
          <option value="Steer">Steer Axle</option>
          <option value="Drive">Drive Axle</option>
          <option value="Trailer">Trailer / Spread Axle</option>
          <option value="All-Position">All-Position / Mixed</option>
          <option value="bus">Bus & Coach</option>
        </select>
        <input
          className="field"
          placeholder="Optional PO # for this order"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          style={{ maxWidth: 200 }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
          Displaying {filtered.length} verified commercial specifications · Rocklea & Regional stock available
        </span>
        <span style={{ fontSize: 11, background: "var(--yellow)", color: "#000000", padding: "4px 10px", borderRadius: 4, fontWeight: 800 }}>
          ★ Tier 1 Wholesale Rates Active
        </span>
      </div>

      <div className="product-grid">
        {filtered.slice(0, 48).map((p) => {
          const qty = quantities[p.id] || "4";
          const unitPrice = Number(p.price) || 360;
          const lineTotal = unitPrice * Number(qty);
          return (
            <article className="product-card" key={p.id} style={{ display: "flex", flexDirection: "column" }}>
              <div className="product-visual" style={{ position: "relative" }}>
                <Image
                  src={p.image}
                  alt={`${p.brand} ${p.pattern} tyre`}
                  width={340}
                  height={340}
                  style={{ objectFit: "contain", maxHeight: 180 }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: p.brand === "Ralson" ? "#000000" : p.brand === "Blacklion" ? "var(--yellow)" : "#1a1a1a",
                    color: p.brand === "Blacklion" ? "#000000" : "#ffffff",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: 4,
                    textTransform: "uppercase"
                  }}
                >
                  {p.brand}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ margin: "4px 0" }}>{p.pattern}</h3>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{p.application}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>{p.size}</p>

              <div className="product-specs" style={{ margin: "12px 0", flex: 1 }}>
                <span>Size <strong>{p.size}</strong></span>
                <span>In-Stock <strong>{p.stock} units</strong></span>
                <span>Load/Speed <strong>{p.load_speed || "148/145L"}</strong></span>
                <span>Tread Depth <strong>{p.tread_depth_mm ? `${p.tread_depth_mm} mm` : "16.0 mm"}</strong></span>
                <span>
                  Wholesale Cost{" "}
                  <strong style={{ color: "var(--yellow-deep)", fontSize: 15 }}>
                    ${unitPrice.toFixed(2)}
                  </strong>
                </span>
                <span>
                  RRP / Margin{" "}
                  <strong>${p.rrp || Math.round(unitPrice * 1.3)} (+30%)</strong>
                </span>
              </div>

              {/* Order Controls */}
              <div style={{ background: "#f8faf9", padding: "10px", borderRadius: 6, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                  <span>Quantity</span>
                  <span style={{ color: "var(--yellow-deep)", fontWeight: 700 }}>Subtotal: ${lineTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="field"
                    type="number"
                    min="1"
                    max="1000"
                    value={qty}
                    onChange={(e) => setQuantities({ ...quantities, [p.id]: e.target.value })}
                    aria-label={`Quantity for ${p.brand} ${p.pattern}`}
                    style={{ width: 70, minHeight: 38, textAlign: "center", fontWeight: 700 }}
                  />
                  <button
                    className="button"
                    style={{ flex: 1, minHeight: 38, fontSize: 12, padding: "0 12px" }}
                    onClick={() => void place(p)}
                    disabled={busyId === p.id}
                  >
                    {busyId === p.id ? "Submitting…" : "Order Now ↗"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">No tyres match those filters. Try searching for "11R22.5" or choose "All Brands".</div>
      )}
    </>
  );
}

export function RapidOrderForm({ products }: { products: DealerProduct[] }) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [poNumber, setPoNumber] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedItems = useMemo(() => {
    return Object.entries(quantities)
      .map(([idStr, qty]) => {
        const product = products.find((p) => p.id === Number(idStr));
        return product && qty > 0 ? { product, qty, total: (Number(product.price) || 360) * qty } : null;
      })
      .filter(Boolean) as { product: DealerProduct; qty: number; total: number }[];
  }, [quantities, products]);

  const grandTotal = selectedItems.reduce((acc, curr) => acc + curr.total, 0);
  const totalUnits = selectedItems.reduce((acc, curr) => acc + curr.qty, 0);

  function updateQty(id: number, delta: number) {
    const current = quantities[id] || 0;
    const next = Math.max(0, current + delta);
    setQuantities({ ...quantities, [id]: next });
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage("Please enter a quantity for at least one tyre SKU.");
      return;
    }
    setBusy(true);
    setMessage("");

    try {
      const items = selectedItems.map((item) => ({
        productId: item.product.id,
        quantity: item.qty
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, poNumber, deliveryNotes })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Success: Bulk order submitted! Confirmation: ${data.orderId || "UT-ORDER"}. Our warehouse dispatch team is processing your ${totalUnits} tyres.`);
        setQuantities({});
        setPoNumber("");
        setDeliveryNotes("");
      } else {
        setMessage(data.error || "Order submission failed. Please try again.");
      }
    } catch {
      setMessage("Network error submitting bulk order.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submitOrder} style={{ marginTop: 12 }}>
      {message && (
        <div
          style={{
            background: message.startsWith("✓") ? "#ecfdf5" : "#fef2f2",
            border: `1px solid ${message.startsWith("✓") ? "#10b981" : "#ef4444"}`,
            color: message.startsWith("✓") ? "#065f46" : "#991b1b",
            padding: "14px 20px",
            borderRadius: 8,
            marginBottom: 20,
            fontWeight: 600,
            fontSize: 13
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 20 }}>
        <div className="form-field">
          <label htmlFor="rapid-po">Purchase Order (PO) Number</label>
          <input
            id="rapid-po"
            className="field"
            placeholder="e.g. PO-89214-BNE"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="rapid-notes">Delivery / Depot Notes</label>
          <input
            id="rapid-notes"
            className="field"
            placeholder="e.g. Rocklea Depot pickup or Site delivery"
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap" style={{ maxHeight: 420, overflowY: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Pattern</th>
              <th>Size</th>
              <th>Application</th>
              <th>Wholesale Price</th>
              <th>In-Stock</th>
              <th style={{ width: 140, textAlign: "center" }}>Order Qty</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 36).map((p) => {
              const qty = quantities[p.id] || 0;
              const unitPrice = Number(p.price) || 360;
              return (
                <tr key={p.id} style={{ background: qty > 0 ? "#f0fdf4" : undefined }}>
                  <td>
                    <span style={{ fontWeight: 800, color: p.brand === "Ralson" ? "#000000" : p.brand === "Blacklion" ? "var(--yellow-deep)" : "#333333" }}>
                      {p.brand}
                    </span>
                  </td>
                  <td><strong>{p.pattern}</strong></td>
                  <td>{p.size}</td>
                  <td>{p.application}</td>
                  <td><strong>${unitPrice.toFixed(2)}</strong></td>
                  <td><span style={{ color: "#16a34a", fontWeight: 700 }}>{p.stock}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => updateQty(p.id, -2)}
                        style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => setQuantities({ ...quantities, [p.id]: Math.max(0, Number(e.target.value)) })}
                        style={{ width: 50, textAlign: "center", height: 28, borderRadius: 4, border: "1px solid var(--line)", fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => updateQty(p.id, 2)}
                        style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid var(--line)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td><strong>${(unitPrice * qty).toFixed(2)}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Order Bar */}
      <div
        style={{
          marginTop: 20,
          background: "#000000",
          border: "1px solid #242828",
          borderTop: "3px solid var(--yellow)",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15
        }}
      >
        <div>
          <span style={{ fontSize: 12, color: "var(--muted)", display: "block" }}>Wholesale Order Summary</span>
          <strong style={{ fontSize: 20 }}>
            {totalUnits} Units · Total: ${grandTotal.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="button button-outline"
              onClick={() => setQuantities({})}
              style={{ color: "#fff", borderColor: "#444" }}
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="button"
            disabled={busy || totalUnits === 0}
            style={{ minWidth: 200, fontSize: 14 }}
          >
            {busy ? "Submitting Order…" : "Submit Wholesale Order ↗"}
          </button>
        </div>
      </div>
    </form>
  );
}
