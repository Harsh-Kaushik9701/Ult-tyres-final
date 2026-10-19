import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles, services } from "@/lib/content";
import { ContactBand, HeroCarousel, SectionTitle } from "@/components/site";
import { JsonLd } from "@/components/json-ld";
import { BranchesSection } from "@/components/branches";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { staticPageSeo } from "@/lib/page-seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  ...staticPageSeo.home,
  absoluteTitle: true,
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, url: siteConfig.url }
        ]}
      />
      <HeroCarousel />

      {/* Trust Strip */}
      <div className="trust-strip">
        <div className="container trust-grid">
          {[
            ["01", "Commercial Tyre Expertise", "Heavy radials matched to Australian routes"],
            ["02", "Nationwide Logistics Hub", "Rocklea, Eastern Creek & Laverton depots"],
            ["03", "Precision Wheel Alignment", "Computerised laser bays cut fuel & wear"],
            ["04", "Frictionless Dealer Portal", "Live warehouse stock & rapid trade orders"]
          ].map(([n, t, s]) => (
            <div className="trust-item" key={n}>
              <div className="trust-icon">{n}</div>
              <div>
                <strong>{t}</strong>
                <span>{s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagship Brand Highlights: Ralson, Blacklion, Triangle */}
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Flagship Commercial Tyre Ranges"
            title="Engineered for Australian Freight."
            text="Explore the industry's premier commercial radials distributed by Ultimate Tyres across Australia. Built for linehaul prime movers, regional distribution, municipal bus fleets, and quarry tippers."
          />

          <div className="brand-grid" style={{ marginTop: 30 }}>
            {/* Ralson Card */}
            <div className="brand-card" style={{ display: "flex", flexDirection: "column", padding: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="brand-index">01 / RADIAL MASTERY</span>
                <span style={{ fontSize: 11, background: "#141717", color: "#fff", padding: "3px 8px", borderRadius: 4, fontWeight: 700 }}>
                  50+ Years Heritage
                </span>
              </div>
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0" }}>
                <Image
                  src="/images/products/RDR75.webp"
                  alt="Ralson RDR75 commercial tyre"
                  width={220}
                  height={160}
                  style={{ objectFit: "contain", maxHeight: 150, width: "auto" }}
                />
              </div>
              <h3>Ralson Commercial Radials</h3>
              <p style={{ flex: 1, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Engineered with high-tensile brass-coated steel belts for maximum casing integrity and high virgin mileage. Featuring the flagship RDR75 Linehaul Drive and RAU51 EV Coach radials.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <Link className="button button-dark" href="/brands/ralson" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
                  Explore Ralson ↗
                </Link>
                <Link className="button button-outline" href="/products" style={{ fontSize: 12 }}>
                  Specs
                </Link>
              </div>
            </div>

            {/* Blacklion Card */}
            <div className="brand-card" style={{ display: "flex", flexDirection: "column", padding: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="brand-index">02 / DEEP-TREAD TRACTION</span>
                <span style={{ fontSize: 11, background: "var(--red)", color: "#fff", padding: "3px 8px", borderRadius: 4, fontWeight: 800 }}>
                  22.5mm Deep Tread
                </span>
              </div>
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0" }}>
                <Image
                  src="/images/products/RDR55.webp"
                  alt="Blacklion commercial drive tyre"
                  width={220}
                  height={160}
                  style={{ objectFit: "contain", maxHeight: 150, width: "auto" }}
                />
              </div>
              <h3>Blacklion Heavy Series</h3>
              <p style={{ flex: 1, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Rugged performance engineered for high-torque Australian prime movers. Features the BD280 deep-tread drive, BF188 low-rolling-resistance steer, and BT165 super-single trailer radials.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <Link className="button button-dark" href="/brands/blacklion" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
                  Explore Blacklion ↗
                </Link>
                <Link className="button button-outline" href="/products" style={{ fontSize: 12 }}>
                  Specs
                </Link>
              </div>
            </div>

            {/* Triangle Card */}
            <div className="brand-card" style={{ display: "flex", flexDirection: "column", padding: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="brand-index">03 / GLOBAL SCALE</span>
                <span style={{ fontSize: 11, background: "var(--charcoal-900)", color: "var(--red)", border: "1px solid var(--red)", padding: "3px 8px", borderRadius: 4, fontWeight: 800 }}>
                  Proven Endurance
                </span>
              </div>
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0" }}>
                <Image
                  src="/images/products/RAC55.webp"
                  alt="Triangle commercial radial tyre"
                  width={220}
                  height={160}
                  style={{ objectFit: "contain", maxHeight: 150, width: "auto" }}
                />
              </div>
              <h3>Triangle Radial Range</h3>
              <p style={{ flex: 1, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Field-tested across interstate transport corridors. Renowned for high casing retreadability, even tread wear, and outstanding wet handling on the TR688 drive and TR657 steer patterns.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <Link className="button button-dark" href="/brands/triangle" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
                  Explore Triangle ↗
                </Link>
                <Link className="button button-outline" href="/products" style={{ fontSize: 12 }}>
                  Specs
                </Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link className="button" href="/products">
              View All 50+ Commercial Tyre Specifications ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Specialist Wheel Alignment Callout (Image 4 Requirement) */}
      <section className="section" style={{ background: "linear-gradient(135deg, #141717 0%, #1c2222 100%)", color: "#fff" }}>
        <div className="container">
          <div className="alignment-highlight-grid">
            <div>
              <div className="eyebrow" style={{ color: "var(--yellow)" }}>Specialist Fleet Engineering</div>
              <h2 style={{ fontSize: "clamp(24px, 5.5vw, 38px)", lineHeight: 1.15, margin: "14px 0" }}>
                Over 70% of Trucks Run with Misaligned Drive Axles.
              </h2>
              <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.6, maxWidth: 620 }}>
                When rear tandem drive axles are out of square, the turning force must be offset by counter-steering, causing all wheels to scrub continuously. It takes just a <strong>tenth of an inch (1/10")</strong> to cost your fleet thousands in unnecessary diesel and scrubbed rubber.
              </p>
              <ul className="check-list" style={{ color: "#e5e7eb", margin: "20px 0" }}>
                <li>Restore perfect straight-line tracking and eliminate dog-tracking</li>
                <li>Cut commercial fleet fuel consumption by 5% to 8%</li>
                <li>Extend steer and drive tyre casing life by up to 30%</li>
              </ul>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button" href="/services/wheel-alignment">
                  Interactive Fuel Savings Calculator ↗
                </Link>
                <Link className="button button-outline" href="/services/wheel-alignment" style={{ color: "#fff", borderColor: "#555" }}>
                  View Alignment Process
                </Link>
              </div>
            </div>

            <div style={{ background: "#1c2121", border: "1px solid #333a3a", borderRadius: 12, padding: "clamp(20px, 4vw, 32px)", textAlign: "center" }}>
              <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 800, textTransform: "uppercase" }}>
                Fleet ROI Benchmark
              </span>
              <div style={{ fontSize: "clamp(34px, 8vw, 44px)", fontWeight: 900, color: "var(--yellow)", margin: "10px 0" }}>
                $58,000+
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>
                Average annual diesel and tyre savings recovered for a 10-truck fleet with Total Laser Alignment.
              </p>
              <Link className="button button-dark" href="/services/wheel-alignment" style={{ width: "100%", justifyContent: "center" }}>
                Calculate For Your Fleet ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Services (9 Services) */}
      <section className="section section-dark">
        <div className="container">
          <SectionTitle
            eyebrow="Commercial Fleet Maintenance"
            title="Complete Care for Working Fleets."
            text="Tyres are just one part of fleet performance. Our specialist technicians help you protect casing life and minimize downtime across Australia."
            dark
          />
          <div className="services-grid">
            {services.slice(0, 6).map((s, i) => (
              <Link className="service-card" href={`/services/${s.slug}`} key={s.slug}>
                <span className="service-no">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span className="text-link">Explore service</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link className="button button-outline" href="/services">
              All 9 Fleet Services ↗
            </Link>
            <Link className="button" href="/services/wheel-alignment">
              Specialist Wheel Alignment Landing Page
            </Link>
          </div>
        </div>
      </section>

      {/* Dealer Portal Callout ("The Portal as a Product") */}
      <section className="section" style={{ background: "#f8faf9" }}>
        <div className="container feature-split">
          <div className="feature-media">
            <div
              style={{
                background: "#141717",
                borderRadius: 12,
                padding: 30,
                color: "#fff",
                boxShadow: "0 14px 40px rgba(0,0,0,0.12)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 11, background: "var(--red)", color: "#fff", padding: "3px 8px", borderRadius: 4, fontWeight: 800 }}>
                  B2B DEALER CONSOLE
                </span>
                <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>● Live Inventory Active</span>
              </div>
              <h3 style={{ fontSize: 24, margin: "0 0 10px" }}>Rapid Wholesale Ordering</h3>
              <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 20px" }}>
                Designed specifically for mobile devices. Check live Rocklea and Eastern Creek warehouse stock, wholesale trade pricing, and place rapid SKU orders directly from your phone while standing under a truck.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12, marginBottom: 20 }}>
                <div style={{ background: "#202525", padding: "10px 12px", borderRadius: 6 }}>
                  <span style={{ color: "var(--muted)", display: "block" }}>Trade Tiers</span>
                  <strong>Tier 1 Wholesale Rates</strong>
                </div>
                <div style={{ background: "#202525", padding: "10px 12px", borderRadius: 6 }}>
                  <span style={{ color: "var(--muted)", display: "block" }}>Fulfilment</span>
                  <strong>Same-Day Dispatch</strong>
                </div>
              </div>
              <Link className="button" href="/dealers/login" style={{ width: "100%", justifyContent: "center" }}>
                Launch Dealer Portal ↗
              </Link>
            </div>
          </div>

          <div className="feature-copy">
            <div className="eyebrow">Trade Network Integration</div>
            <h2>Frictionless Wholesale.<br />Zero Headaches.</h2>
            <p>
              For our authorized dealers, the new website is a powerful business tool. Say goodbye to endless phone tags and outdated paper price sheets.
            </p>
            <ul className="check-list">
              <li>Live warehouse stock counts across Ralson, Blacklion, and Triangle</li>
              <li>Real-time tyre selector with tread depth, load and ply specifications</li>
              <li>Rapid SKU bulk ordering grid with PO tagging and instant dispatch confirmation</li>
              <li>Consolidated order history and account invoice management</li>
            </ul>
            <div className="hero-actions" style={{ marginTop: 24 }}>
              <Link className="button button-dark" href="/dealers/login">
                Dealer Login ↗
              </Link>
              <Link className="button button-outline" href="/dealers/apply">
                Apply for Trade Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Thought Leadership (News & Blogs) */}
      <section className="section section-green">
        <div className="container">
          <SectionTitle
            eyebrow="Fleet Engineering Knowledge"
            title="Educational Authority from the Field."
            text="Ideas and technical guidance for fleet directors, workshop managers, and commercial operators."
            dark
          />
          <div className="article-grid">
            {articles.slice(0, 3).map((a) => (
              <article className="article-card" key={a.slug}>
                <div className="article-meta">
                  {a.category} · {a.date}
                </div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <Link className="text-link" href={`/news/${a.slug}`}>
                  Read technical article
                </Link>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Link className="text-link" href="/news">
              Explore all fleet insights
            </Link>
          </div>
        </div>
      </section>

      {/* Branches + Google map */}
      <BranchesSection />

      <ContactBand />
    </>
  );
}
