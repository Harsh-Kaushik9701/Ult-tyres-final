/**
 * Site shell — Server Components.
 *
 * Everything in this file renders on the server and ships no JavaScript to the
 * browser. Interactive parts live in components/site-client.tsx and are
 * re-exported here so existing imports keep working.
 */

import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import { siteConfig, telHref, whatsappHref } from "@/lib/site-config";
import { branchAddress, branches, directionsUrl } from "@/lib/branches";
import { HeaderNav, HeroCarousel as HeroCarouselClient, type HeroBanner, type NavEntry } from "@/components/site-client";

export { LeadForm } from "@/components/site-client";

const phone = siteConfig.phone;
const waEnquiry = whatsappHref("Hi Ultimate Tyres team, I have an enquiry regarding commercial tyres");
const waDisplay = "+61 482 094 850";

export function BrandMark({ priority = false }: { priority?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Ultimate Tyres Australia – Home">
      <Image src="/images/utlogo.jpg" alt="" width={48} height={48} className="brand-logo" priority={priority} />
      <span className="brand-copy">
        <span className="brand-name">ULTIMATE TYRES</span>
        <span className="brand-sub">Your Fleet. Our Drive.</span>
      </span>
    </Link>
  );
}

export function TopUtilityRibbon() {
  return (
    <div className="top-utility-ribbon">
      <div className="container top-utility-inner">
        <div className="top-utility-left">
          <a href={telHref()} className="utility-item">
            <span className="utility-icon" aria-hidden="true">📞</span>
            <span>
              Toll-Free: <strong>{phone}</strong>
            </span>
          </a>
          <span className="utility-divider" aria-hidden="true">|</span>
          <a
            href={whatsappHref("Hi Ultimate Tyres team, I would like to enquire about commercial tyres")}
            target="_blank"
            rel="noopener noreferrer"
            className="utility-item utility-wa"
          >
            <span className="wa-dot" aria-hidden="true" />
            <span>
              WhatsApp Direct: <strong>{waDisplay}</strong>
            </span>
          </a>
          <span className="utility-divider" aria-hidden="true">|</span>
          <span className="utility-tagline">The Ultimate Foundation for Every Journey</span>
        </div>

        <div className="top-utility-right">
          <Link href="/network" className="utility-link">
            <span>📍 Find a Branch</span>
          </Link>
          <span className="utility-divider" aria-hidden="true">|</span>
          <Link href="/dealers/login" className="utility-link utility-highlight">
            <span>🔑 Client Portal / Dealer Login</span>
          </Link>
          <span className="utility-divider" aria-hidden="true">|</span>
          <div className="utility-socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Ultimate Tyres on LinkedIn">IN</a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Ultimate Tyres on Facebook">FB</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Ultimate Tyres on Instagram">IG</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const navEntries: NavEntry[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  {
    id: "products",
    label: "Products",
    groups: [
      {
        heading: "Commercial Tyre Range",
        links: [
          { href: "/products", label: "Overview (All Tyres)" },
          { href: "/products/trucks", label: "Truck Tyres (Linehaul / Regional / Tipper)" },
          { href: "/products/buses", label: "Buses & Coach Tyres" }
        ]
      },
      {
        heading: "Flagship Brand Ranges",
        links: [
          { href: "/brands/ralson", label: "★ Ralson Commercial Radials" },
          { href: "/brands/blacklion", label: "★ Blacklion Heavy Series" },
          { href: "/brands/triangle", label: "★ Triangle Radial Range" }
        ]
      }
    ]
  },
  {
    id: "services",
    label: "Fleet Services",
    wide: true,
    groups: [
      {
        heading: "Fleet Services & Maintenance",
        links: [
          { href: "/services", label: "All Fleet Services Overview" },
          ...services.map((s, i) => ({
            href: `/services/${s.slug}`,
            label: `${i + 1}. ${s.title}${s.slug === "wheel-alignment" ? " (Specialist)" : ""}`,
            highlight: s.slug === "wheel-alignment"
          }))
        ]
      }
    ]
  },
  { href: "/news", label: "Insights" },
  { href: "/network", label: "Find a Branch" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Join Us" }
];

export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopUtilityRibbon />
      <header className="header">
        <div className="container header-main">
          <BrandMark priority />
          {/* Only the nav needs client state; the dealer links are server-rendered and passed in. */}
          <HeaderNav entries={navEntries}>
            <Link className="button button-outline" href="/dealers/apply">
              Become a Dealer
            </Link>
            <Link className="button" href="/dealers/login">
              Dealer Login
            </Link>
          </HeaderNav>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <BrandMark />
            <p style={{ marginTop: 12, lineHeight: 1.6 }}>
              Commercial tyres, precision alignment, and national wholesale distribution. The Dependable Co-Pilot for
              Australian transport fleets and dealers.
            </p>
            <div style={{ marginTop: 14 }}>
              <a className="text-link" href={waEnquiry} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp with Fleet Support
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Commercial Products</h2>
            <div className="footer-links">
              <Link href="/products">All Tyres Catalogue</Link>
              <Link href="/products/trucks">Heavy Truck Tyres</Link>
              <Link href="/products/buses">Bus & Coach Tyres</Link>
              <Link href="/brands/ralson">Ralson Commercial</Link>
              <Link href="/brands/blacklion">Blacklion Series</Link>
              <Link href="/brands/triangle">Triangle Radial Range</Link>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Fleet Services</h2>
            <div className="footer-links">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  style={s.slug === "wheel-alignment" ? { color: "var(--red)", fontWeight: 700 } : undefined}
                >
                  {s.title}
                  {s.slug === "wheel-alignment" ? " ↗" : ""}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Our Branches</h2>
            <div className="footer-links">
              <a href={telHref()}>Toll-Free · {phone}</a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                WhatsApp · {waDisplay}
              </a>
              {branches.map((b) => (
                <a key={b.id} href={directionsUrl(b)} target="_blank" rel="noopener noreferrer">
                  {b.name}
                  {b.note ? ` (${b.note.toLowerCase()})` : ""} · {branchAddress(b)}
                </a>
              ))}
              <Link href="/news">Fleet Insights</Link>
              <Link href="/network">Find a Branch</Link>
              <Link href="/dealers/login">Wholesale Dealer Portal</Link>
              <Link href="/dealers/apply">Become a Dealer</Link>
              <Link href="/contact">Contact Our Team</Link>
              <Link href="/careers">Careers & Join Us</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.legalName} · All Rights Reserved</span>
          <span>Your Fleet. Our Drive. · Australian Commercial Transport Partner</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsApp() {
  return (
    <>
      <a
        className="whatsapp-fab"
        href={waEnquiry}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly with Ultimate Tyres Fleet Support on WhatsApp"
      >
        <span className="wa-pulse-dot" aria-hidden="true" />
        <span className="wa-fab-text">WhatsApp Fleet Direct</span>
      </a>

      <div className="mobile-bottom">
        <a href={telHref()} className="mobile-bottom-btn">
          📞 Call {phone}
        </a>
        <Link href="/dealers/login" className="mobile-bottom-btn mobile-bottom-portal">
          🔑 Dealer Portal
        </Link>
      </div>
    </>
  );
}

export type Crumb = { name: string; path?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumb,
  trail
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Label for the current page in the breadcrumb (defaults to the title). */
  crumb?: string;
  /** Intermediate breadcrumb links between Home and the current page. */
  trail?: Crumb[];
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{intro}</p>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {trail?.map((c) => (
            <span key={c.name} style={{ display: "contents" }}>
              <span aria-hidden="true">›</span>
              {c.path ? <Link href={c.path}>{c.name}</Link> : <span>{c.name}</span>}
            </span>
          ))}
          <span aria-hidden="true">›</span>
          <span aria-current="page">{crumb || title}</span>
        </nav>
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text?: string; dark?: boolean }) {
  return (
    <div className={`section-head ${dark ? "section-head-dark" : ""}`}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

const banners: HeroBanner[] = [
  {
    eyebrow: "For the work that moves Australia",
    titleLine1: "Your fleet.",
    titleLine2: "Our drive.",
    text: "Tyres, service and the people behind them. We help Australian fleets stay on the road and ready for what's next.",
    image: "/images/hero-tyre.webp",
    alt: "Ralson commercial tyre tread",
    cta: [
      { label: "Find your tyres", href: "/products" },
      { label: "Talk to our team", href: "/contact", outline: true }
    ]
  },
  {
    eyebrow: "Commercial tyres · Real applications",
    titleLine1: "Built for",
    titleLine2: "the long haul.",
    text: "Find dependable commercial tyre options for line haul, regional routes and the last mile.",
    image: "/images/products/RMR61.webp",
    alt: "Ralson truck tyre render",
    cta: [
      { label: "Explore the range", href: "/products" },
      { label: "Get a quote", href: "/contact", outline: true }
    ]
  },
  {
    eyebrow: "Designed for demanding routes",
    titleLine1: "Ready for",
    titleLine2: "what's ahead.",
    text: "Explore commercial radial tyres shaped by real-world performance, rigorous testing and continuous engineering.",
    image: "/images/products/RMR51.webp",
    alt: "Ralson commercial radial tyre",
    cta: [
      { label: "See the range", href: "/products" },
      { label: "Talk to our team", href: "/contact", outline: true }
    ]
  },
  {
    eyebrow: "A better way to care for your fleet",
    titleLine1: "More life",
    titleLine2: "in every mile.",
    text: "Pair the right tyre with practical maintenance, precision wheel alignment and fitting support.",
    image: "/images/products/RDR75.webp",
    alt: "Ralson RDR75 commercial tyre",
    cta: [
      { label: "Fleet services", href: "/services" },
      { label: "Contact us", href: "/contact", outline: true }
    ]
  },
  {
    eyebrow: "Dealer opportunities",
    titleLine1: "Local knowledge.",
    titleLine2: "National backing.",
    text: "Join the Ultimate Tyres dealer network. Strong wholesale tiers, dependable national supply, and dedicated fleet support.",
    image: "/images/products/RAC82.webp",
    alt: "Commercial radial tyre for dealer network",
    cta: [
      { label: "Become a dealer", href: "/dealers/apply" },
      { label: "Explore our network", href: "/network", outline: true }
    ]
  }
];

const heroStats = [
  { value: "50+", label: "Years of engineering" },
  { value: "30+", label: "Countries served" },
  { value: "100%", label: "Australian support" }
];

/** Server wrapper: slide data is defined here and passed to the client carousel. */
export function HeroCarousel() {
  return <HeroCarouselClient banners={banners} stats={heroStats} />;
}

export function ContactBand() {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2>Keep your fleet moving.</h2>
          <p>Talk to a real team about tyres, service or becoming an Ultimate Tyres dealer.</p>
        </div>
        <div className="cta-actions">
          <Link className="button" href="/contact">
            Talk to our team ↗
          </Link>
          <Link className="button button-outline" href="/dealers/apply">
            Become a dealer
          </Link>
        </div>
      </div>
    </section>
  );
}
