import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, ContactBand } from "@/components/site";

export const metadata: Metadata = {
  title: "About Us · Brand History, Facilities & Fleet Mission",
  description:
    "Learn about Ultimate Tyres Australia, our commercial tyre engineering heritage, national warehouse facilities in Rocklea, and our mission as The Dependable Co-Pilot for Australian fleets."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The Dependable Co-Pilot · About Ultimate Tyres"
        title="The Ultimate Foundation for Every Journey."
        intro="In the commercial transport sector, downtime is the enemy. Ultimate Tyres provides unwavering reliability, industrial strength, and operational efficiency for Australian heavy fleets and tyre dealers."
      />

      {/* Brand History & Heritage */}
      <section className="section">
        <div className="container feature-split">
          <div className="feature-copy">
            <div className="eyebrow">Our History & Origins</div>
            <h2>
              Built Around the Demands<br />
              of Australian Transport.
            </h2>
            <p>
              Founded to bridge the gap between global tyre manufacturing powerhouses and the brutal realities of Australian roads, Ultimate Tyres has grown into a cornerstone commercial distributor. Australian transport operates under conditions unseen anywhere else in the world: extreme ambient heat, heavy axle loadings, multi-combination road trains, and vast transit distances between freight depots.
            </p>
            <p>
              We established exclusive national partnerships with premier radial engineering manufacturers: <strong>Ralson Tires</strong> (50+ years of industrial precision serving 30+ countries), <strong>Blacklion Commercial Radials</strong>, and <strong>Triangle Tire Range</strong>. Together, we supply Australian fleets and independent tyre dealers with radial casings that deliver true cost-per-kilometer profitability.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <Link className="button button-dark" href="/products">
                Explore Tyre Range ↗
              </Link>
              <Link className="button button-outline" href="/network">
                Our Facilities & Network
              </Link>
            </div>
          </div>
          <div className="feature-media">
            <Image
              src="/images/hero-tyre.webp"
              alt="Commercial tyre tread, engineered for hard-working fleets"
              width={860}
              height={860}
              priority
            />
            <span className="media-label">Engineered for 120,000+ km Virgin Mileage</span>
          </div>
        </div>
      </section>

      {/* Brand Pillars: Profitability through Durability, Frictionless Wholesale, Nationwide Backbone */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ maxWidth: 760, margin: "0 auto 40px", textAlign: "center" }}>
            <div className="eyebrow" style={{ color: "var(--yellow)" }}>Brand Archetype & Promise</div>
            <h2 style={{ fontSize: 38, margin: "12px 0" }}>The Dependable Co-Pilot</h2>
            <p style={{ color: "#9ca3af", fontSize: 14 }}>
              Australian B2B communication needs to be straight-talking, benefit-driven, and devoid of corporate jargon. We focus on the "holes" (uptime, fuel savings, and profitability), not just the "drill" (the tyre).
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <span className="service-no">01</span>
              <h3>Profitability Through Durability (CPK)</h3>
              <p>
                For fleets, we communicate Cost-Per-Kilometer. We don't just say "our tyres last longer"; we say "Maximise your casing life and cut fuel costs with our total alignment and premium radial solutions."
              </p>
            </div>

            <div className="service-card">
              <span className="service-no">02</span>
              <h3>Frictionless Wholesale Ordering</h3>
              <p>
                For dealers, the message is speed and access. Live warehouse inventory, rapid SKU-wise ordering directly from mobile devices under a truck, transparent tier pricing, and zero headaches.
              </p>
            </div>

            <div className="service-card">
              <span className="service-no">03</span>
              <h3>Nationwide Logistics Backbone</h3>
              <p>
                While the geography of Australia is vast, our network map and distribution channels make us local. Rapid overnight hot-shot freight connects capital cities and remote regional freight corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Detailing */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 760, margin: "0 auto 44px", textAlign: "center" }}>
            <div className="eyebrow">National Infrastructure</div>
            <h2>Facility Detailing & Operational Capabilities</h2>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              State-of-the-art warehousing and specialist heavy vehicle alignment bays supporting Australian fleet uptime.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
            <div style={{ background: "#f8faf9", border: "1px solid var(--line)", borderRadius: 8, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🏭</div>
              <h3 style={{ fontSize: 20, margin: "0 0 10px" }}>Rocklea Flagship Distribution Depot</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                Located at 5 Permarig Place, Rocklea QLD. Over 5,000 sqm of covered high-bay tyre warehousing holding 45,000+ commercial truck and bus radials in stock for immediate dispatch.
              </p>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>✓ Rocklea Freight Hub Hub</span>
            </div>

            <div style={{ background: "#f8faf9", border: "1px solid var(--line)", borderRadius: 8, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📐</div>
              <h3 style={{ fontSize: 20, margin: "0 0 10px" }}>Computerised Laser Alignment Bays</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                Full drive-through heavy alignment rigs accommodating prime movers, semi-trailers, and multi-combination B-doubles. Calibrated optical laser sensors square tandem drive axles within 0.01 degrees.
              </p>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow-deep)" }}>✓ Eliminates 70% Dog-Tracking</span>
            </div>

            <div style={{ background: "#f8faf9", border: "1px solid var(--line)", borderRadius: 8, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🚚</div>
              <h3 style={{ fontSize: 20, margin: "0 0 10px" }}>Mobile Fleet Fitting & Pit-Stop Units</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                Customized mobile commercial service trucks equipped with high-torque pneumatics, on-board nitrogen inflation compressors, and hydraulic bead breakers servicing yards across Brisbane, Sydney and Melbourne.
              </p>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>✓ 24/7 Yard Support</span>
            </div>

            <div style={{ background: "#f8faf9", border: "1px solid var(--line)", borderRadius: 8, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🔬</div>
              <h3 style={{ fontSize: 20, margin: "0 0 10px" }}>Casing Integrity & Retread Audit</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                Pressure-testing and non-destructive casing inspection. Every Ralson, Blacklion, and Triangle casing is verified for structural integrity to achieve its 3-life cascading lifecycle.
              </p>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>✓ ISO 9001 & ADR Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team / CTA */}
      <section className="section section-tight" style={{ background: "#141717", color: "#fff" }}>
        <div className="container feature-split">
          <div className="feature-copy">
            <div className="eyebrow" style={{ color: "var(--yellow)" }}>Real People. Real Know-How.</div>
            <h2 style={{ color: "#fff" }}>Ready to partner with a team that knows the road?</h2>
            <p style={{ color: "#9ca3af" }}>
              Call our Rocklea headquarters or connect directly with our technical fleet specialists. We are on standby for you right now.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <Link className="button" href="/contact">
                Talk to Our Team ↗
              </Link>
              <Link className="button button-outline" href="/dealers/apply" style={{ color: "#fff", borderColor: "#444" }}>
                Apply for Wholesale Account
              </Link>
            </div>
          </div>
          <div className="feature-media">
            <div style={{ height: "100%", minHeight: 280, display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--display)", fontSize: 32, textTransform: "uppercase", letterSpacing: ".05em" }}>
              Your Fleet. Our Drive.
            </div>
            <span className="media-label">Ultimate Tyres Australia</span>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
