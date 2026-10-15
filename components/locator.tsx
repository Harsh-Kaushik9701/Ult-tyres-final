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

interface PinCoord {
  x: number;
  y: number;
  labelAnchor: "start" | "middle" | "end";
  labelDx: number;
  labelDy: number;
}

// Hand-calibrated coordinates and smart label offsets for Australia SVG map (600x440)
const PIN_COORDINATES: Record<string, PinCoord> = {
  // Western Australia
  kewdale: { x: 108, y: 272, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  "loc-kewdale": { x: 108, y: 272, labelAnchor: "end", labelDx: -10, labelDy: 4 },

  // South Australia
  wingfield: { x: 298, y: 304, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  "loc-wingfield": { x: 298, y: 304, labelAnchor: "end", labelDx: -10, labelDy: 4 },

  // Victoria (Melbourne Metro distinct separation)
  laverton: { x: 342, y: 334, labelAnchor: "end", labelDx: -8, labelDy: 14 },
  "loc-laverton": { x: 342, y: 334, labelAnchor: "end", labelDx: -8, labelDy: 14 },
  dandenong: { x: 366, y: 342, labelAnchor: "start", labelDx: 8, labelDy: 14 },
  "loc-dandenong": { x: 366, y: 342, labelAnchor: "start", labelDx: 8, labelDy: 14 },

  // New South Wales (Sydney Metro & Newcastle distinct separation)
  "eastern-creek": { x: 404, y: 276, labelAnchor: "end", labelDx: -10, labelDy: 2 },
  "loc-easterncreek": { x: 404, y: 276, labelAnchor: "end", labelDx: -10, labelDy: 2 },
  botany: { x: 422, y: 284, labelAnchor: "start", labelDx: 10, labelDy: 4 },
  "loc-botany": { x: 422, y: 284, labelAnchor: "start", labelDx: 10, labelDy: 4 },
  newcastle: { x: 428, y: 254, labelAnchor: "start", labelDx: 10, labelDy: 2 },
  "loc-newcastle": { x: 428, y: 254, labelAnchor: "start", labelDx: 10, labelDy: 2 },

  // Queensland (Brisbane North, Central, South-East & Townsville distinct separation)
  "bald-hills": { x: 440, y: 196, labelAnchor: "start", labelDx: 10, labelDy: -2 },
  "loc-baldhills": { x: 440, y: 196, labelAnchor: "start", labelDx: 10, labelDy: -2 },
  rocklea: { x: 436, y: 212, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  "loc-rocklea": { x: 436, y: 212, labelAnchor: "end", labelDx: -10, labelDy: 4 },
  yatala: { x: 448, y: 228, labelAnchor: "start", labelDx: 10, labelDy: 8 },
  "loc-yatala": { x: 448, y: 228, labelAnchor: "start", labelDx: 10, labelDy: 8 },
  townsville: { x: 424, y: 122, labelAnchor: "start", labelDx: 10, labelDy: 4 },
  "loc-townsville": { x: 424, y: 122, labelAnchor: "start", labelDx: 10, labelDy: 4 }
};

function getLocationCoordinates(loc: NetworkLocation): PinCoord {
  const idKey = (loc.id || "").toLowerCase();
  const suburbKey = (loc.suburb || "").toLowerCase().replace(/[^a-z]/g, "");

  if (PIN_COORDINATES[idKey]) return PIN_COORDINATES[idKey];
  for (const [key, coord] of Object.entries(PIN_COORDINATES)) {
    const cleanKey = key.replace("loc-", "").replace(/[^a-z]/g, "");
    if (idKey.includes(cleanKey) || suburbKey.includes(cleanKey) || cleanKey.includes(suburbKey)) {
      return coord;
    }
  }

  // Robust calibrated projection fallback for Australia SVG (600x440)
  if (loc.latitude !== null && loc.longitude !== null) {
    const x = Math.round(((loc.longitude - 113) / (154 - 113)) * 355 + 95);
    const y = Math.round(((-loc.latitude - 10) / (40 - 10)) * 305 + 50);
    return { x, y, labelAnchor: "start", labelDx: 10, labelDy: 4 };
  }

  return { x: 300, y: 220, labelAnchor: "middle", labelDx: 0, labelDy: -12 };
}

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
            <span style={{ fontSize: 10, color: "var(--red)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>
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
          <g stroke="#3b4444" strokeWidth="1.2" strokeDasharray="3 3">
            <line x1="436" y1="212" x2="404" y2="276" /> {/* Brisbane (Rocklea) to Sydney (Eastern Creek) */}
            <line x1="404" y1="276" x2="342" y2="334" /> {/* Sydney to Melbourne (Laverton) */}
            <line x1="342" y1="334" x2="298" y2="304" /> {/* Melbourne to Adelaide (Wingfield) */}
            <line x1="298" y1="304" x2="108" y2="272" /> {/* Adelaide to Perth (Kewdale) */}
            <line x1="436" y1="212" x2="424" y2="122" /> {/* Brisbane to Townsville */}
            <line x1="404" y1="276" x2="428" y2="254" /> {/* Sydney to Newcastle */}
          </g>

          <text x="280" y="210" textAnchor="middle" fill="#323a3a" fontSize="22" fontWeight="900" letterSpacing="6">
            AUSTRALIA
          </text>

          {/* Location Markers */}
          {locations.map((loc) => {
            const coord = getLocationCoordinates(loc);
            const isSelected = selectedLocation?.id === loc.id;
            const isFilteredMatch = filtered.some((f) => f.id === loc.id);

            return (
              <g
                key={loc.id}
                transform={`translate(${coord.x}, ${coord.y})`}
                onClick={() => setSelectedId(loc.id)}
                style={{ cursor: "pointer", opacity: isFilteredMatch ? 1 : 0.28, transition: "opacity 0.25s ease" }}
              >
                {isSelected && (
                  <circle r="18" fill="rgba(215, 45, 36, 0.35)">
                    <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={isSelected ? 8 : 5}
                  fill={isSelected ? "var(--red)" : "#ffffff"}
                  stroke="#000000"
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <text
                  x={coord.labelDx}
                  y={coord.labelDy}
                  textAnchor={coord.labelAnchor}
                  fill={isSelected ? "#ffffff" : isFilteredMatch ? "#e2e8f0" : "#64748b"}
                  fontSize={isSelected ? "11" : "9.5"}
                  fontWeight={isSelected ? "800" : "600"}
                  letterSpacing="0.02em"
                  style={{ textShadow: "0 2px 5px rgba(0,0,0,0.95)" }}
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
                <span style={{ fontSize: 10, color: "var(--red)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
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
                    color: isActive ? "#ffffff" : "var(--ink)",
                    borderColor: isActive ? "var(--red)" : "var(--line)",
                    background: isActive ? "var(--red)" : "#ffffff"
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
                  border: isCurrent ? "2px solid var(--red)" : "1px solid var(--line)",
                  background: isCurrent ? "#fff8f7" : "#ffffff",
                  boxShadow: isCurrent ? "0 4px 18px rgba(215, 45, 36, 0.12)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <strong style={{ fontSize: 15, color: "var(--ink)" }}>{l.name}</strong>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isCurrent ? "#ffffff" : "var(--muted)",
                      background: isCurrent ? "var(--red)" : "#f3f4f6",
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
                    style={{ fontSize: 12, color: "var(--red)" }}
                  >
                    Directions
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
