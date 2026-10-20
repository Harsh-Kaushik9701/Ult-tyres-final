import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageBackdrop } from "@/components/site";
import { AlignmentCalculator } from "@/components/alignment-calculator";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { staticPageSeo } from "@/lib/page-seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  ...staticPageSeo.wheelAlignment,
  path: "/services/wheel-alignment"
});

/**
 * Server Component: all of this page's content renders on the server. Only the
 * savings calculator is interactive and ships as a small client island.
 */
export default function WheelAlignmentPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Fleet Services", path: "/services" },
            { name: "Wheel Alignment Services", path: "/services/wheel-alignment" }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Heavy truck & fleet wheel alignment",
            serviceType: "Wheel alignment",
            url: absoluteUrl("/services/wheel-alignment"),
            areaServed: { "@type": "Country", name: "Australia" },
            provider: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url }
          }
        ]}
      />
      {/* Hero Section */}
      <section className="page-hero has-backdrop" style={{ color: "#fff" }}>
        <PageBackdrop theme="trucks" />
        <div className="container page-hero-inner">
          <div className="eyebrow" style={{ color: "var(--yellow)" }}>Specialist Heavy Vehicle Fleet Service</div>
          <h1 style={{ fontSize: 46, maxWidth: 860, lineHeight: 1.15, margin: "16px 0" }}>
            Total Heavy Truck & Fleet Wheel Alignment Services
          </h1>
          <p style={{ maxWidth: 760, fontSize: 16, lineHeight: 1.6, color: "#d1d5db" }}>
            Millions of dollars have been spent on streamlining, employee downtime and engine efficiency, but most operators neglect one of the most effective ways to reduce operating costs... <strong>A Complete Wheel Alignment!</strong>
          </p>
          <div className="breadcrumb" style={{ marginTop: 24 }}>
            <Link href="/" style={{ color: "#9ca3af" }}>Home</Link>
            <span>›</span>
            <Link href="/services" style={{ color: "#9ca3af" }}>Fleet Services</Link>
            <span>›</span>
            <span style={{ color: "#fff" }}>Wheel Alignment Services</span>
          </div>
        </div>
      </section>

      {/* The 70% Misalignment Shocking Fact Section */}
      <section className="section" style={{ background: "#f8faf9" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 50px" }}>
            <span style={{ background: "#fee2e2", color: "#b91c1c", fontWeight: 800, padding: "6px 14px", borderRadius: 20, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Industry Fleet Alert
            </span>
            <h2 style={{ fontSize: 38, margin: "16px 0 12px" }}>
              Improper wheel alignment significantly shortens tyre life and increases fuel consumption.
            </h2>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
              It is estimated that over <strong>70% of the trucks on Australian roads have misaligned drive axles</strong>. To keep the truck tracking straight, the turning force of the rear axles must be offset by turning the front wheels in the opposite direction. This causes all wheels to scrub out, drastically altering fuel economy.
            </p>
          </div>

          {/* Technical Diagram Card */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "clamp(18px, 4vw, 36px)", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div className="alignment-diagram-grid">
              {/* Left Column: Visual Axle Alignment SVG */}
              <div>
                <div style={{ background: "#141717", borderRadius: 8, padding: "28px 20px", textAlign: "center" }}>
                  <svg viewBox="0 0 340 440" width="100%" height="340" style={{ maxWidth: 320, margin: "0 auto" }}>
                    {/* Truck Outline / Chassis */}
                    <rect x="130" y="40" width="80" height="340" rx="8" fill="#252a2a" stroke="#444d4d" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Centerline */}
                    <line x1="170" y1="20" x2="170" y2="400" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 4" />
                    <text x="175" y="32" fill="#facc15" fontSize="9" fontWeight="700">CHASSIS CENTERLINE</text>

                    {/* Steer Axle (Misaligned opposite to counteract drive thrust) */}
                    <g transform="rotate(-6 170 90)">
                      <line x1="80" y1="90" x2="260" y2="90" stroke="#ef4444" strokeWidth="3" />
                      {/* Left Steer Tyre */}
                      <rect x="70" y="70" width="22" height="42" rx="4" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                      {/* Right Steer Tyre */}
                      <rect x="248" y="70" width="22" height="42" rx="4" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                      {/* Scrub vector */}
                      <path d="M60 85 L35 70" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
                    </g>
                    <text x="170" y="125" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">STEER WHEELS COMPENSATING</text>

                    {/* Tandem Drive Axles (Skewed Angle Dog-Tracking) */}
                    <g transform="rotate(5 170 280)">
                      <line x1="60" y1="260" x2="280" y2="260" stroke="#f97316" strokeWidth="3" />
                      {/* Dual Tyres Left 1 */}
                      <rect x="52" y="242" width="18" height="38" rx="3" fill="#f97316" />
                      <rect x="74" y="242" width="18" height="38" rx="3" fill="#f97316" />
                      {/* Dual Tyres Right 1 */}
                      <rect x="248" y="242" width="18" height="38" rx="3" fill="#f97316" />
                      <rect x="270" y="242" width="18" height="38" rx="3" fill="#f97316" />

                      <line x1="60" y1="320" x2="280" y2="320" stroke="#f97316" strokeWidth="3" />
                      {/* Dual Tyres Left 2 */}
                      <rect x="52" y="302" width="18" height="38" rx="3" fill="#f97316" />
                      <rect x="74" y="302" width="18" height="38" rx="3" fill="#f97316" />
                      {/* Dual Tyres Right 2 */}
                      <rect x="248" y="302" width="18" height="38" rx="3" fill="#f97316" />
                      <rect x="270" y="302" width="18" height="38" rx="3" fill="#f97316" />

                      {/* Thrust angle push */}
                      <path d="M295 285 L330 260" stroke="#f97316" strokeWidth="2" />
                    </g>

                    <text x="170" y="375" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="700">MISALIGNED DRIVE AXLES (DOG-TRACKING)</text>
                  </svg>
                  <span style={{ display: "block", color: "#9ca3af", fontSize: 11, marginTop: 8 }}>
                    Figure 1: How skewed drive axles force continuous steer scrubbing and fuel drag.
                  </span>
                </div>
              </div>

              {/* Right Column: Key Facts & Scientific Evidence */}
              <div>
                <div style={{ background: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "16px 20px", marginBottom: 20, borderRadius: "0 8px 8px 0" }}>
                  <strong style={{ display: "block", color: "#991b1b", fontSize: 16 }}>
                    FACT: It takes just a tenth of an inch (1/10") to have a big impact on your cost!
                  </strong>
                  <p style={{ margin: "6px 0 0", color: "#7f1d1d", fontSize: 13, lineHeight: 1.5 }}>
                    When a rear axle is out of square by a mere 0.1 inches, the prime mover is pulled sideways by 8.5 feet for every mile travelled unless corrected by continuous counter-steering!
                  </p>
                </div>

                <h3 style={{ fontSize: 24, margin: "16px 0 12px" }}>Here's what our Total Wheel Alignment can do for you:</h3>
                <ul className="check-list" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  <li>
                    <strong>Improve Handling & Driver Safety:</strong> Proper alignment restores manufacturer-intended geometry, eliminating wandering, lane drift, and heavy steering effort while minimizing driver fatigue.
                  </li>
                  <li>
                    <strong>Minimize Rolling Resistance:</strong> Total alignment sets all wheels parallel to the vehicle centerline. This works with correct inflation pressure to eliminate tyre scuffing and slash diesel consumption.
                  </li>
                  <li>
                    <strong>Double Tyre Casing Life:</strong> Prevents premature shoulder wear, edge feathering, and uneven tread loss so casings reach full mileage and can be successfully retreaded 2+ times.
                  </li>
                  <li>
                    <strong>Extend Suspension & Tie-Rod Longevity:</strong> Eliminates continuous lateral twisting forces on bushes, torque rods, and spring hangers.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Fleet Alignment ROI & Fuel Savings Calculator */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ maxWidth: 780, margin: "0 auto 40px", textAlign: "center" }}>
            <div className="eyebrow" style={{ color: "var(--yellow)" }}>Interactive Fleet Calculator</div>
            <h2 style={{ fontSize: 36, margin: "12px 0" }}>Calculate Your Fleet's Annual Alignment Savings</h2>
            <p style={{ color: "#9ca3af", fontSize: 14 }}>
              Adjust the sliders below to your fleet's actual size and duty cycle. See how much diesel and tyre expenditure you recover every single year.
            </p>
          </div>

          <AlignmentCalculator />
        </div>
      </section>

      {/* 4-Step Alignment Process */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 700, margin: "0 auto 40px", textAlign: "center" }}>
            <div className="eyebrow">Precision Engineering Standard</div>
            <h2>How Ultimate Tyres Performs a Total Wheel Alignment</h2>
          </div>

          <div className="services-grid">
            {[
              {
                step: "01",
                title: "Steering & Suspension Physical Audit",
                desc: "We check kingpins, tie-rod ends, drag links, wheel bearings, torque arms, and leaf spring bushes for play before laser calibration begins."
              },
              {
                step: "02",
                title: "Tandem Drive Axle Squaring",
                desc: "We align and square both rear drive axles perpendicular to the vehicle chassis centerline, eliminating dog-tracking thrust angle."
              },
              {
                step: "03",
                title: "Steer Geometry & Camber/Caster Setup",
                desc: "Using precision optical laser heads, we calibrate toe-in, camber angles, and caster to OEM factory tolerances for maximum straight-line stability."
              },
              {
                step: "04",
                title: "Trailer Tracking & Verification Report",
                desc: "Full comprehensive printout report comparing Before vs After alignment angles for your fleet maintenance records."
              }
            ].map((s) => (
              <div className="service-card" key={s.step}>
                <span className="service-no">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Card */}
      <section id="book-alignment" className="section" style={{ background: "#f8faf9" }}>
        <div className="container content-layout">
          <div className="content-main">
            <div className="eyebrow">Fleet Booking Enquiry</div>
            <h2>Schedule a Wheel Alignment Audit for Your Vehicles</h2>
            <p>
              Whether you operate a single prime mover or manage a large distribution fleet, our heavy alignment bays accommodate rigids, semi-trailers, B-doubles, and road trains.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link className="button" href="/contact?topic=alignment">
                Enquire Online or Book Fleet Audit ↗
              </Link>
              <a
                className="button button-outline"
                href="tel:1300110002"
                style={{ marginLeft: 12, borderColor: "var(--ink)", color: "var(--ink)" }}
              >
                Call Hotline 1300 110 002
              </a>
            </div>
          </div>
          <aside className="side-panel">
            <h3>Alignment Bay Specifications</h3>
            <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18, margin: "12px 0", color: "var(--muted)" }}>
              <li>Computerised Optical Laser Technology</li>
              <li>Accommodates up to 6 Axles (Prime Mover + B-Double)</li>
              <li>Rapid 45-minute turnaround per vehicle</li>
              <li>Drive-through bays for easy B-double access</li>
              <li>Fully certified heavy vehicle mechanics</li>
            </ul>
            <div style={{ marginTop: 16 }}>
              <Link className="text-link" href="/network">
                Find nearest alignment location
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
