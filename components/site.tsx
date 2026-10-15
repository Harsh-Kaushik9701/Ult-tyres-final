"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { navItems, services } from "@/lib/content";
import Image from "next/image";

const phone = process.env.NEXT_PUBLIC_PHONE || "1300 110 002";
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "61482094850";

export function BrandMark() {
  return (
    <Link href="/" className="brand" aria-label="Ultimate Tyres Australia - Home">
      <Image
        src="/images/utlogo.jpg"
        alt="Ultimate Tyres Logo"
        width={48}
        height={48}
        className="brand-logo"
        priority
      />
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
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="utility-item">
            <span className="utility-icon">📞</span>
            <span>Toll-Free: <strong>{phone}</strong></span>
          </a>
          <span className="utility-divider">|</span>
          <a
            href={`https://wa.me/${whatsapp}?text=Hi%20Ultimate%20Tyres%20team%2C%20I%20would%20like%20to%20enquire%20about%20commercial%20tyres`}
            target="_blank"
            rel="noreferrer"
            className="utility-item utility-wa"
          >
            <span className="wa-dot" />
            <span>WhatsApp Direct: <strong>+61 482 094 850</strong></span>
          </a>
          <span className="utility-divider">|</span>
          <span className="utility-tagline">The Ultimate Foundation for Every Journey</span>
        </div>

        <div className="top-utility-right">
          <Link href="/network" className="utility-link">
            <span>📍 Interactive Network Map</span>
          </Link>
          <span className="utility-divider">|</span>
          <Link href="/dealers/login" className="utility-link utility-highlight">
            <span>🔑 Client Portal / Dealer Login</span>
          </Link>
          <span className="utility-divider">|</span>
          <div className="utility-socials">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Ultimate Tyres on LinkedIn">IN</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Ultimate Tyres on Facebook">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Ultimate Tyres on Instagram">IG</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setOpen(false);
  }, [pathname]);

  // Close menus on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleMouseEnter = (name: string) => {
    if (typeof window !== "undefined" && window.innerWidth > 990) {
      setActiveDropdown(name);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth > 990) {
      setActiveDropdown(null);
    }
  };

  return (
    <>
      <TopUtilityRibbon />
      <header className="header">
        <div className="container header-main">
          <BrandMark />
          <nav ref={navRef} className={`nav ${open ? "open" : ""}`} aria-label="Main navigation">
            <Link href="/" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
              Home
            </Link>
            <Link href="/about" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
              About Us
            </Link>

            {/* Products Dropdown */}
            <div
              className={`nav-dropdown ${activeDropdown === "products" ? "open" : ""}`}
              onMouseEnter={() => handleMouseEnter("products")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="nav-dropdown-btn"
                onClick={() => toggleDropdown("products")}
                aria-expanded={activeDropdown === "products"}
                aria-haspopup="true"
              >
                Products <span className="chevron">⌄</span>
              </button>
              {activeDropdown === "products" && (
                <div className="nav-menu" role="menu">
                  <div className="nav-menu-header">Commercial Tyre Range</div>
                  <Link href="/products" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    Overview (All Tyres)
                  </Link>
                  <Link href="/products/trucks" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    Truck Tyres (Linehaul / Regional / Tipper)
                  </Link>
                  <Link href="/products/buses" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    Buses & Coach Tyres
                  </Link>
                  <div className="nav-menu-header" style={{ marginTop: 8 }}>
                    Flagship Brand Ranges
                  </div>
                  <Link href="/brands/ralson" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    ★ Ralson Commercial Radials
                  </Link>
                  <Link href="/brands/blacklion" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    ★ Blacklion Heavy Series
                  </Link>
                  <Link href="/brands/triangle" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    ★ Triangle Radial Range
                  </Link>
                </div>
              )}
            </div>

            {/* Fleet Services Dropdown */}
            <div
              className={`nav-dropdown ${activeDropdown === "services" ? "open" : ""}`}
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="nav-dropdown-btn"
                onClick={() => toggleDropdown("services")}
                aria-expanded={activeDropdown === "services"}
                aria-haspopup="true"
              >
                Fleet Services <span className="chevron">⌄</span>
              </button>
              {activeDropdown === "services" && (
                <div className="nav-menu nav-menu-wide" role="menu">
                  <div className="nav-menu-header">Fleet Services & Maintenance</div>
                  <Link href="/services" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    All Fleet Services Overview
                  </Link>
                  <Link href="/services/truck-maintenance" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    1. Truck Maintenance
                  </Link>
                  <Link href="/services/wheel-alignment" onClick={() => { setOpen(false); setActiveDropdown(null); }} style={{ color: "var(--red)", fontWeight: 700 }}>
                    2. Wheel Alignment Services *(Specialist)*
                  </Link>
                  <Link href="/services/wheel-balancing" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    3. Truck & Car Wheel Balancing
                  </Link>
                  <Link href="/services/steering-suspension" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    4. Steering & Suspension Repair
                  </Link>
                  <Link href="/services/nitrogen-inflation" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    5. Nitrogen Tyre Inflation
                  </Link>
                  <Link href="/services/puncture-proofing" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    6. Puncture Proofing
                  </Link>
                  <Link href="/services/tyre-fitting" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    7. Tyre Fitting Services
                  </Link>
                  <Link href="/services/ultimate-readyfit" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    8. Ultimate Tyre Exchange (ReadyFit)
                  </Link>
                  <Link href="/services/u-wheels" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
                    9. Wheel & Rim Solution (U-Wheels)
                  </Link>
                </div>
              )}
            </div>

            <Link href="/news" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
              News & Blogs
            </Link>
            <Link href="/network" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
              Network Map
            </Link>
            <Link href="/contact" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
              Contact
            </Link>
            <Link href="/careers" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
              Join Us
            </Link>
          </nav>

          <div className="header-actions">
            <Link className="button button-outline" href="/dealers/apply">
              Become a Dealer
            </Link>
            <Link className="button" href="/dealers/login">
              Dealer Login
            </Link>
            <button
              className="menu-toggle"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? "×" : "☰"}
            </button>
          </div>
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
              Commercial tyres, precision alignment, and national wholesale distribution. The Dependable Co-Pilot for Australian transport fleets and dealers.
            </p>
            <div style={{ marginTop: 14 }}>
              <a
                className="text-link"
                href={`https://wa.me/${whatsapp}?text=Hi%20Ultimate%20Tyres%20team%2C%20I%20have%20an%20enquiry%20regarding%20commercial%20tyres`}
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp with Fleet Support
              </a>
            </div>
          </div>

          <div>
            <h4>Commercial Products</h4>
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
            <h4>Fleet Services</h4>
            <div className="footer-links">
              <Link href="/services/wheel-alignment" style={{ color: "var(--red)", fontWeight: 700 }}>
                Wheel Alignment Services ↗
              </Link>
              <Link href="/services/truck-maintenance">Truck Maintenance</Link>
              <Link href="/services/wheel-balancing">Wheel Balancing</Link>
              <Link href="/services/steering-suspension">Steering & Suspension</Link>
              <Link href="/services/nitrogen-inflation">Nitrogen Tyre Inflation</Link>
              <Link href="/services/tyre-fitting">Tyre Fitting Services</Link>
              <Link href="/services/ultimate-readyfit">ReadyFit Tyre Exchange</Link>
              <Link href="/services/u-wheels">U-Wheels & Rims</Link>
            </div>
          </div>

          <div>
            <h4>National Distribution</h4>
            <div className="footer-links">
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>Toll-Free · {phone}</a>
              <a href="https://wa.me/61482094850">WhatsApp · +61 482 094 850</a>
              <span>Headquarters · 5 Permarig Pl, Rocklea QLD</span>
              <Link href="/network">Interactive Network Map</Link>
              <Link href="/dealers/login">Wholesale Dealer Portal</Link>
              <Link href="/dealers/apply">Become a Dealer</Link>
              <Link href="/contact">Contact Our Team</Link>
              <Link href="/careers">Careers & Join Us</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ultimate Tyres Australia Pty Ltd · All Rights Reserved</span>
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
        href={`https://wa.me/${whatsapp}?text=Hi%20Ultimate%20Tyres%20team%2C%20I%20have%20an%20enquiry%20regarding%20commercial%20tyres`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat directly with Ultimate Tyres Fleet Support on WhatsApp"
      >
        <span className="wa-pulse-dot" />
        <span className="wa-fab-text">WhatsApp Fleet Direct</span>
      </a>

      <div className="mobile-bottom">
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="mobile-bottom-btn">
          📞 Call {phone}
        </a>
        <Link href="/dealers/login" className="mobile-bottom-btn mobile-bottom-portal">
          🔑 Dealer Portal
        </Link>
      </div>
    </>
  );
}

export function PageHero({ eyebrow, title, intro, crumb }: { eyebrow:string; title:string; intro:string; crumb?:string }) {
  return <section className="page-hero"><div className="container"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{intro}</p><div className="breadcrumb"><Link href="/">Home</Link><span>›</span><span>{crumb||title}</span></div></div></section>;
}

export function SectionTitle({ eyebrow, title, text, dark=false }: { eyebrow:string; title:string; text?:string; dark?:boolean }) {
  return <div className={`section-head ${dark ? "section-head-dark" : ""}`}><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{text&&<p>{text}</p>}</div>;
}

const banners = [
  {
    kind: "video",
    src: "/videos/ralson-performance.mp4",
    eyebrow: "For the work that moves Australia",
    title: <>Your fleet.<br/><span>Our drive.</span></>,
    text: "Tyres, service and the people behind them. We help Australian fleets stay on the road and ready for what's next.",
    image: "/images/hero-tyre.webp",
    alt: "Ralson commercial tyre tread",
    cta: [{ label: "Find your tyres", href: "/products" }, { label: "Talk to our team", href: "/contact", outline: true }]
  },
  {
    kind: "video",
    src: "/videos/rdr75.mp4",
    eyebrow: "Commercial tyres · Real applications",
    title: <>Built for<br/><span>the long haul.</span></>,
    text: "Find dependable commercial tyre options for line haul, regional routes and the last mile.",
    image: "/images/products/RMR61.webp",
    alt: "Ralson truck tyre render",
    cta: [{ label: "Explore the range", href: "/products" }, { label: "Get a quote", href: "/contact", outline: true }]
  },
  {
    kind: "video",
    src: "/videos/ralson-performance.mp4",
    eyebrow: "Designed for demanding routes",
    title: <>Ready for<br/><span>what's ahead.</span></>,
    text: "Explore commercial radial tyres shaped by real-world performance, rigorous testing and continuous engineering.",
    image: "/images/products/RMR51.webp",
    alt: "Ralson commercial radial tyre",
    cta: [{ label: "See the range", href: "/products" }, { label: "Talk to our team", href: "/contact", outline: true }]
  },
  {
    kind: "video",
    src: "/videos/rdr75.mp4",
    eyebrow: "A better way to care for your fleet",
    title: <>More life<br/><span>in every mile.</span></>,
    text: "Pair the right tyre with practical maintenance, precision wheel alignment and fitting support.",
    image: "/images/products/RDR75.webp",
    alt: "Ralson RDR75 commercial tyre",
    cta: [{ label: "Fleet services", href: "/services" }, { label: "Contact us", href: "/contact", outline: true }]
  },
  {
    kind: "video",
    src: "/videos/ralson-performance.mp4",
    eyebrow: "Dealer opportunities",
    title: <>Local knowledge.<br/><span>National backing.</span></>,
    text: "Join the Ultimate Tyres dealer network. Strong wholesale tiers, dependable national supply, and dedicated fleet support.",
    image: "/images/products/RAC82.webp",
    alt: "Commercial radial tyre for dealer network",
    cta: [{ label: "Become a dealer", href: "/dealers/apply" }, { label: "Explore our network", href: "/network", outline: true }]
  },
];
const stats = [{ value: "50+", label: "Years of engineering" }, { value: "30+", label: "Countries served" }, { value: "100%", label: "Australian support" }];
const SLIDE_DURATION = 5500;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const slide = banners[active];

  const go = useCallback((n: number) => {
    setFading(true);
    setTimeout(() => {
      setActive(n);
      setAnimKey((k) => k + 1);
      setFading(false);
    }, 380);
  }, []);

  /* auto-advance timer */
  useEffect(() => {
    const timer = setTimeout(() => {
      go((active + 1) % banners.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [active, animKey, go]);

  return (
    <section className="hero">
      <div className="hero-bg-wrap">
        {banners.map((b, i) => (
          <div key={i} className={`hero-bg-layer${i === active ? " active" : ""}`}>
            {b.src && b.src.endsWith(".mp4") ? (
              <video autoPlay muted loop playsInline poster={b.image}>
                <source src={b.src} type="video/mp4" />
              </video>
            ) : null}
          </div>
        ))}
      </div>
      <div className="hero-gradient" />
      <div className="hero-accent-strip" />
      <div className={`container hero-inner${fading ? " hero-fade" : ""}`}>
        <div className="hero-copy">
          <div className="hero-slide-no">
            0{active + 1}
            <span>/ 0{banners.length}</span>
          </div>
          <div className="eyebrow">{slide.eyebrow}</div>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          <div className="hero-actions">
            {slide.cta.map((c, i) => (
              <Link
                key={i}
                className={`button${(c as any).outline ? " button-outline" : ""}`}
                href={c.href}
              >
                {c.label} {!(c as any).outline && "↗"}
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-image">
          <Image
            src={slide.image}
            alt={slide.alt}
            width={800}
            height={800}
            priority={active === 0}
          />
        </div>
        <div className="hero-stats">
          {stats.map((s, i) => (
            <div key={i} className="hero-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-controls" role="tablist" aria-label="Homepage banners">
          <div
            className="hero-progress"
            role="progressbar"
            aria-valuenow={active + 1}
            aria-valuemin={1}
            aria-valuemax={banners.length}
            title={`Slide ${active + 1} of ${banners.length}`}
          >
            <div key={`progress-${animKey}`} className="hero-progress-fill running" />
          </div>
          {banners.map((_, n) => (
            <button
              key={n}
              role="tab"
              aria-label={"Show banner " + (n + 1)}
              aria-current={active === n}
              onClick={() => go(n)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactBand() {
  return <section className="cta-band"><div className="container cta-inner"><div><h2>Keep your fleet moving.</h2><p>Talk to a real team about tyres, service or becoming an Ultimate Tyres dealer.</p></div><div className="cta-actions"><Link className="button" href="/contact">Talk to our team ↗</Link><Link className="button button-outline" href="/dealers/apply">Become a dealer</Link></div></div></section>;
}

export function LeadForm({ kind="contact" }: {kind?:"contact"|"dealer-application"|"careers"}) {
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(form:HTMLFormElement) {
    setBusy(true); setMessage("");
    const values=Object.fromEntries(new FormData(form).entries());
    try {
      const response=await fetch("/api/lead",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...values,kind})});
      const data=await response.json();
      if (!response.ok) throw new Error(data.error||"We couldn’t send that just now. Please try again.");
      form.reset(); setMessage(data.message||"Thanks. The Ultimate Tyres team will be in touch.");
    } catch(error) { setMessage(error instanceof Error?error.message:"Please try again."); }
    setBusy(false);
  }
  const application=kind==="dealer-application";
  const careers=kind==="careers";
  return <form className="form-card" onSubmit={e=>{e.preventDefault();void submit(e.currentTarget);}}>
    {application&&<><div className="eyebrow">Dealer application</div><h2>Let’s build a strong network.</h2><p>Share a few details about your business. Applications are reviewed by our team before portal access is activated.</p></>}
    {careers&&<><div className="eyebrow">Careers</div><h2>Bring your drive.</h2><p>Tell us where you’re based and the kind of role you’re looking for.</p></>}
    <div className="form-grid">
      <div className="form-field"><label htmlFor="name">Full name *</label><input className="field" id="name" name="name" required autoComplete="name"/></div>
      <div className="form-field"><label htmlFor="email">Work email *</label><input className="field" id="email" name="email" type="email" required autoComplete="email"/></div>
      <div className="form-field"><label htmlFor="phone">Phone *</label><input className="field" id="phone" name="phone" required autoComplete="tel"/></div>
      {application&&<><div className="form-field"><label htmlFor="business">Business name *</label><input className="field" id="business" name="business" required/></div><div className="form-field"><label htmlFor="abn">ABN</label><input className="field" id="abn" name="abn"/></div><div className="form-field"><label htmlFor="state">State / territory *</label><select className="select" id="state" name="state" required><option value="">Select state</option>{["NSW","VIC","QLD","SA","WA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div><div className="form-field"><label htmlFor="password">Create portal password *</label><input className="field" id="password" name="password" type="password" minLength={12} autoComplete="new-password" required/><span style={{fontSize:9,color:"var(--muted)"}}>12 characters minimum. Your account is activated after approval.</span></div></>}
      {careers&&<div className="form-field"><label htmlFor="role">Area of interest</label><input className="field" id="role" name="role"/></div>}
      {!application&&!careers&&<div className="form-field"><label htmlFor="topic">I’m enquiring about</label><select className="select" id="topic" name="topic"><option>Fleet tyres</option><option>Fleet services</option><option>Dealer network</option><option>General enquiry</option></select></div>}
      <div className="form-field full"><label htmlFor="message">{application?"Tell us about your business *":careers?"A little about you":"How can we help?"}</label><textarea className="textarea" id="message" name="message" required={application}/></div>
    </div>
    <div className="form-actions"><button className="button" type="submit" disabled={busy}>{busy?"Sending…":application?"Send application":careers?"Send expression of interest":"Send enquiry"} ↗</button><span className="form-note" role="status">{message}</span></div>
  </form>;
}
