"use client";

import { useMemo, useState } from "react";

/** Interactive fuel & tyre savings calculator (client island on the wheel alignment page). */
export function AlignmentCalculator() {
  const [truckCount, setTruckCount] = useState(10);
  const [kmPerYear, setKmPerYear] = useState(130000);
  const [fuelEconomy, setFuelEconomy] = useState(42); // L / 100km
  const [dieselPrice, setDieselPrice] = useState(2.05); // $/L

  const calculations = useMemo(() => {
    const totalKm = truckCount * kmPerYear;
    const totalLitres = (totalKm / 100) * fuelEconomy;
    const totalFuelCost = totalLitres * dieselPrice;
    // Conservative 5.5% fuel saving from squaring misaligned tandem drive axles & steer
    const fuelSavings = totalFuelCost * 0.055;
    // Tyre savings: longer steer/drive tyre life (approx $1,750 per truck per year)
    const tyreSavings = truckCount * 1750;
    return { totalFuelCost, fuelSavings, tyreSavings, totalSavings: fuelSavings + tyreSavings };
  }, [truckCount, kmPerYear, fuelEconomy, dieselPrice]);

  return (
    <div className="alignment-calc-grid">
      {/* Controls */}
      <div style={{ background: "#1c2020", padding: "clamp(18px, 4vw, 32px)", borderRadius: 10, border: "1px solid #2d3333" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label htmlFor="calc-trucks" style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>Number of Commercial Vehicles in Fleet</label>
            <strong style={{ color: "var(--yellow)", fontSize: 16 }}>{truckCount} Prime Movers</strong>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            id="calc-trucks"
            value={truckCount}
            onChange={(e) => setTruckCount(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--yellow)" }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label htmlFor="calc-km" style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>Average Kilometres per Truck / Year</label>
            <strong style={{ color: "#fff", fontSize: 16 }}>{kmPerYear.toLocaleString("en-AU")} km</strong>
          </div>
          <input
            type="range"
            min="50000"
            max="250000"
            step="5000"
            id="calc-km"
            value={kmPerYear}
            onChange={(e) => setKmPerYear(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--yellow)" }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label htmlFor="calc-fuel" style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>Average Fleet Fuel Economy</label>
            <strong style={{ color: "#fff", fontSize: 16 }}>{fuelEconomy} L / 100km</strong>
          </div>
          <input
            type="range"
            min="30"
            max="60"
            step="1"
            id="calc-fuel"
            value={fuelEconomy}
            onChange={(e) => setFuelEconomy(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--yellow)" }}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label htmlFor="calc-diesel" style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>Current Diesel Price per Litre</label>
            <strong style={{ color: "#fff", fontSize: 16 }}>${dieselPrice.toFixed(2)} / Litre</strong>
          </div>
          <input
            type="range"
            min="1.60"
            max="2.60"
            step="0.05"
            id="calc-diesel"
            value={dieselPrice}
            onChange={(e) => setDieselPrice(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--yellow)" }}
          />
        </div>
      </div>

      {/* Results Display */}
      <div style={{ background: "linear-gradient(145deg, #181c1c, #0d0f0f)", padding: "clamp(18px, 4vw, 36px)", borderRadius: 10, border: "2px solid var(--yellow)" }}>
        <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>
          Estimated Annual Savings
        </span>
        <div aria-live="polite" style={{ fontSize: "clamp(34px, 8vw, 52px)", fontWeight: 900, color: "#fff", margin: "12px 0 20px", fontFamily: "var(--display)", letterSpacing: ".02em" }}>
          ${Math.round(calculations.totalSavings).toLocaleString("en-AU")}
          <span style={{ fontSize: 18, color: "#9ca3af", fontWeight: 400 }}> / year</span>
        </div>

        <div className="alignment-stats-grid">
          <div>
            <span style={{ fontSize: 11, color: "#9ca3af", display: "block" }}>Annual Fuel Cost Reduction (5.5%)</span>
            <strong style={{ fontSize: 22, color: "#4ade80" }}>
              +${Math.round(calculations.fuelSavings).toLocaleString("en-AU")}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: 11, color: "#9ca3af", display: "block" }}>Extended Casing & Tread Life</span>
            <strong style={{ fontSize: 22, color: "var(--yellow)" }}>
              +${Math.round(calculations.tyreSavings).toLocaleString("en-AU")}
            </strong>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5, margin: "0 0 20px" }}>
          *Based on conservative 5.5% fuel recovery from correcting thrust angle and steer scuffing on tandem drive configurations, plus 30% extended casing life.
        </p>

        <a className="button" href="#book-alignment" style={{ width: "100%", justifyContent: "center", fontSize: 14 }}>
          Book Your Fleet Alignment Audit ↗
        </a>
      </div>
    </div>
  );
}
