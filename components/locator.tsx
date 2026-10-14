"use client";

import { useMemo, useState } from "react";

export type NetworkLocation = {
  id: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string | null;
  phone: string | null;
  tollfree?: string | null;
  latitude: number | null;
  longitude: number | null;
  type?: string;
  hours?: string;
  capabilities?: string[];
};

export function NetworkLocator({ locations }: { locations: NetworkLocation[] }) {
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(locations[0]?.id || null);

  const states = useMemo(() => {
    return ["all", ...Array.from(new Set(locations.map((l) => l.state))).sort()];
  }, [locations]);

  const filtered = useMemo(() => {
    return locations.filter((x) => {
      const matchQuery =
        !query ||
        `${x.name} ${x.address} ${x.suburb} ${x.state} ${x.postcode || ""} ${x.type || ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchState = selectedState === "all" || x.state === selectedState;
      return matchQuery && matchState;
    });
  }, [locations, query, selectedState]);

  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedId) || filtered[0] || locations[0];
  }, [locations, selectedId, filtered]);

  // Convert lat/long to SVG canvas coordinates (600 x 440)
  function getCoordinates(lat: number, lng: number) {
    // Australia bounding box approx:
    // Longitude: 112 to 154 -> width ~42 deg
    // Latitude: -10 to -44 -> height ~34 deg
    const x = ((lng - 112) / 42) * 500 + 50;
    const y = ((lat - (-10)) / (-34)) * 340 + 50;
    return { x: Math.round(x), y: Math.round(y) };
  }

  return (
    <div className="locator-layout" style={{ gap: 30 }}>
      {/* Interactive Map Visual Panel */}
      <div
        className="map-panel"
        style={{
          background: "linear-gradient(145deg, #121415 0%, #1a1e1e 100%)",
          borderRadius: 12,
          padding: 24,
          position: "relative",
          overflow: "hidden",
          border: "1px solid #2a3030",
          boxShadow: "0 12px 36px rgba(0,0,0,0.2)"
        }}
        aria-label="Map of Ultimate Tyres dealer locations across Australia"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>
              Live Distribution Network
            </span>
            <strong style={{ display: "block", color: "#fff", fontSize: 16 }}>Australia National Backbone</strong>
          </div>
          <span style={{ fontSize: 11, background: "#252b2b", color: "#4ade80", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>
            ● {locations.length} Strategic Hubs
          </span>
        </div>

        <svg viewBox="0 0 600 440" role="img" aria-label="Interactive map outline of Australia" style={{ width: "100%", height: "auto" }}>
          {/* Australia Mainland Path */}
          <path
            d="M 125,60 L 175,42 240,45 281,56 323,42 365,54 390,82 429,92 443,124 475,140 461,178 475,202 450,222 434,260 405,285 378,319 346,337 314,330 289,351 256,331 228,342 201,319 171,316 149,293 119,284 98,259 83,229 92,199 81,174 98,143 93,117 110,94 Z"
            fill="#222828"
            stroke="#3b4444"
            strokeWidth="2.5"
          />
          {/* Tasmania */}
          <path
            d="M 370,375 Q 385,372 390,390 L 375,405 360,392 Z"
            fill="#222828"
            stroke="#3b4444"
            strokeWidth="2"
          />

          {/* Interstate Freight Corridor lines */}
          <g stroke="#374151" strokeWidth="1" strokeDasharray="3 3">
            <line x1="435" y1="210" x2="410" y2="280" /> {/* Brisbane to Sydney */}
            <line x1="410" y1="280" x2="350" y2="330" /> {/* Sydney to Melbourne */}
            <line x1="350" y1="330" x2="300" y2="300" /> {/* Melbourne to Adelaide */}
            <line x1="300" y1="300" x2="110" y2="270" /> {/* Adelaide to Perth */}
            <line x1="435" y1="210" x2="425" y2="120" /> {/* Brisbane to Townsville */}
          </g>

          <text x="290" y="210" textAnchor="middle" fill="#3f4a4a" fontSize="22" fontWeight="900" letterSpacing="6">
            AUSTRALIA
          </text>

          {/* Location Markers */}
          {locations.map((loc) => {
            if (loc.latitude === null || loc.longitude === null) return null;
            const { x, y } = getCoordinates(loc.latitude, loc.longitude);
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <g
                key={loc.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => setSelectedId(loc.id)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <circle r="18" fill="rgba(255, 199, 0, 0.35)">
                    <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={isSelected ? 9 : 6}
                  fill={isSelected ? "var(--yellow)" : "#d4a800"}
                  stroke="#000000"
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <text
                  y="-14"
                  textAnchor="middle"
                  fill={isSelected ? "#ffffff" : "#9ca3af"}
                  fontSize={isSelected ? "11" : "9"}
                  fontWeight={isSelected ? "800" : "600"}
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                >
                  {loc.suburb}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Hub Quick Detail Card (Overlaid on Map) */}
        {selectedLocation && (
          <div
            style={{
              marginTop: 14,
              background: "#1c2121",
              border: "1px solid #333a3a",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#fff"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <span style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 800, textTransform: "uppercase" }}>
                  Selected Depot · {selectedLocation.state}
                </span>
                <strong style={{ fontSize: 16, display: "block", margin: "2px 0 4px" }}>
                  {selectedLocation.name}
                </strong>
                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                  {selectedLocation.address}, {selectedLocation.suburb} {selectedLocation.state} {selectedLocation.postcode}
                </p>
                {selectedLocation.hours && (
                  <span style={{ display: "block", fontSize: 11, color: "#4ade80", marginTop: 4 }}>
                    🕒 {selectedLocation.hours}
                  </span>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <a
                  className="button"
                  href={`tel:${selectedLocation.phone?.replace(/[^+\d]/g, "")}`}
                  style={{ fontSize: 12, padding: "6px 14px" }}
                >
                  Call {selectedLocation.phone}
                </a>
              </div>
            </div>

            {selectedLocation.capabilities && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {selectedLocation.capabilities.map((cap) => (
                  <span
                    key={cap}
                    style={{
                      background: "#283030",
                      color: "#d1d5db",
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 4
                    }}
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search & List Panel */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <input
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suburb, city, state (e.g. Rocklea, Sydney, Perth, 4106)..."
            aria-label="Search dealer locations"
            style={{ width: "100%", marginBottom: 10 }}
          />

          {/* State Filter Buttons */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {states.map((st) => {
              const isActive = selectedState === st;
              return (
                <button
                  key={st}
                  type="button"
                  className={`button ${isActive ? "button-dark" : "button-outline"}`}
                  onClick={() => setSelectedState(st)}
                  style={{
                    padding: "6px 14px",
                    fontSize: 11,
                    color: isActive ? "#fff" : "var(--ink)",
                    borderColor: isActive ? "transparent" : "var(--line)",
                    background: isActive ? "var(--ink)" : "#fff"
                  }}
                >
                  {st === "all" ? "All Australia" : st}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, fontWeight: 600 }}>
          Found {filtered.length} service locations in network
        </div>

        <div className="locator-list" style={{ maxHeight: 520, overflowY: "auto", paddingRight: 6 }}>
          {filtered.map((l) => {
            const isCurrent = selectedLocation?.id === l.id;
            return (
              <article
                className="location-card"
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                style={{
                  cursor: "pointer",
                  border: isCurrent ? "2px solid var(--yellow)" : "1px solid var(--line)",
                  background: isCurrent ? "#fffde6" : "#fff",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <strong style={{ fontSize: 15, color: "var(--ink)" }}>{l.name}</strong>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isCurrent ? "#000" : "var(--muted)",
                      background: isCurrent ? "var(--yellow)" : "#f3f4f6",
                      padding: "2px 8px",
                      borderRadius: 4
                    }}
                  >
                    {l.state}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0" }}>
                  {[l.address, l.suburb, l.state, l.postcode].filter(Boolean).join(", ")}
                </span>
                {l.type && (
                  <span style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, display: "block" }}>
                    {l.type}
                  </span>
                )}
                <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
                  {l.phone && (
                    <a className="text-link" href={"tel:" + l.phone.replace(/[^+\d]/g, "")} style={{ fontSize: 12 }}>
                      Call {l.phone}
                    </a>
                  )}
                  <a
                    className="text-link"
                    href={`https://maps.google.com/?q=${encodeURIComponent(l.name + " " + l.address + " " + l.suburb)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, color: "var(--yellow-deep)" }}
                  >
                    Directions ↗
                  </a>
                </div>
              </article>
            );
          })}
          {!filtered.length && (
            <div className="empty-state">No locations match your search query. Try another city or state.</div>
          )}
        </div>
      </div>
    </div>
  );
}
