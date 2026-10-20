"use client";

/**
 * Small client-side "islands". Everything else in the site shell is a Server
 * Component (see components/site.tsx). These pieces need the browser only for
 * interaction; their initial HTML is still rendered on the server.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { videoSources, MOBILE_QUERY, type VideoSource } from "@/lib/video";
import { CAREERS_TOPIC } from "@/lib/forms";

/* ------------------------------------------------------------------ */
/* Header navigation (dropdowns + mobile menu)                         */
/* ------------------------------------------------------------------ */

export type NavLink = { href: string; label: string; highlight?: boolean };
export type NavGroup = { heading: string; links: NavLink[] };
export type NavDropdown = { id: string; label: string; wide?: boolean; groups: NavGroup[] };
export type NavEntry = NavLink | NavDropdown;

function isDropdown(entry: NavEntry): entry is NavDropdown {
  return "groups" in entry;
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function HeaderNav({ entries, children }: { entries: NavEntry[]; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    setActiveDropdown(null);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setActiveDropdown(null);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isDesktop = () => typeof window !== "undefined" && window.innerWidth > 990;
  const close = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <nav ref={navRef} id="main-nav" className={`nav ${open ? "open" : ""}`} aria-label="Main navigation">
        {entries.map((entry) =>
          isDropdown(entry) ? (
            <div
              key={entry.id}
              className={`nav-dropdown ${activeDropdown === entry.id ? "open" : ""}`}
              onMouseEnter={() => isDesktop() && setActiveDropdown(entry.id)}
              onMouseLeave={() => isDesktop() && setActiveDropdown(null)}
            >
              <button
                type="button"
                className="nav-dropdown-btn"
                onClick={() =>
                  // On desktop, hover already opened the menu – a click shouldn't immediately close it.
                  setActiveDropdown((prev) => (prev === entry.id && !isDesktop() ? null : entry.id))
                }
                aria-expanded={activeDropdown === entry.id}
                aria-controls={`menu-${entry.id}`}
              >
                {entry.label} <span className="chevron" aria-hidden="true">⌄</span>
              </button>
              {/* Menus are always in the server HTML (good for crawlers) and shown with CSS. */}
              <div id={`menu-${entry.id}`} className={`nav-menu${entry.wide ? " nav-menu-wide" : ""}`}>
                {entry.groups.map((group) => (
                  <div key={group.heading} style={{ display: "contents" }}>
                    <div className="nav-menu-header">{group.heading}</div>
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={close}
                        aria-current={pathname === link.href ? "page" : undefined}
                        style={link.highlight ? { color: "var(--red)", fontWeight: 700 } : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={close}
              aria-current={isActive(pathname, entry.href) ? "page" : undefined}
            >
              {entry.label}
            </Link>
          )
        )}
      </nav>
      <div className="header-actions">
        {children}
        <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-controls="main-nav"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "☰"}
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Home page hero carousel                                             */
/* ------------------------------------------------------------------ */

export type HeroBanner = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  text: string;
  image: string;
  alt: string;
  cta: { label: string; href: string; outline?: boolean }[];
};

const SLIDE_DURATION = 5500;

/**
 * Hero background reel (scripts/build-hero-reel.py): one segment of exactly
 * SLIDE_DURATION per slide, in slide order, built from the ut2 + UT01–UT03 clips
 * (cropped, watermark-free, no audio) in Full HD – 1920x1080 desktop, 1080x1440 phones.
 * Bump the version when the files change so browsers fetch the new reel.
 */
const HERO_REEL = {
  sources: videoSources("/videos/hero-reel", "/videos/hero-reel-mobile", 3),
  poster: "/videos/hero-reel-poster.jpg?v=3",
  mobilePoster: "/videos/hero-reel-poster-mobile.jpg?v=3"
};

/**
 * Muted, looping background video. The poster (CSS background) shows instantly;
 * the video only downloads after the page loads, and not at all for visitors who
 * prefer reduced motion or have Data Saver on. It pauses while out of view.
 */
export function BackgroundVideo({
  sources,
  poster,
  mobilePoster,
  className = "",
  videoRef,
  onStart
}: {
  sources: VideoSource[];
  poster: string;
  mobilePoster?: string;
  className?: string;
  /** Lets a parent read the playback time (used to sync the hero slides). */
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  /** Called once, when the video first starts playing. */
  onStart?: (video: HTMLVideoElement) => void;
}) {
  const ownRef = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? ownRef;
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return;

    video.muted = true; // required for autoplay on iOS/Chrome
    video.load();
    const tryPlay = () => void video.play().catch(() => undefined);
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? tryPlay() : video.pause()),
      { threshold: 0.05 }
    );
    observer.observe(video);
    let started = false;
    const onPlaying = () => {
      setPlaying(true);
      if (!started) {
        started = true;
        onStartRef.current?.(video);
      }
    };
    video.addEventListener("playing", onPlaying);
    return () => {
      observer.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const posterStyle = {
    "--poster": `url(${poster})`,
    "--poster-mobile": `url(${mobilePoster ?? poster})`
  } as React.CSSProperties;

  return (
    <div className={`bg-video-wrap ${className}`} aria-hidden="true">
      <div className="bg-video-poster" style={posterStyle} />
      <video
        ref={ref}
        className={`bg-video${playing ? " is-playing" : ""}`}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} media={s.mobile ? MOBILE_QUERY : undefined} />
        ))}
      </video>
    </div>
  );
}


export function HeroCarousel({ banners, stats }: { banners: HeroBanner[]; stats: { value: string; label: string }[] }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** True once the background video is playing – from then on it drives the slides. */
  const [videoLive, setVideoLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(0);
  const slide = banners[active];
  const segment = SLIDE_DURATION / 1000;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Video-driven mode: the slide is whichever segment of the reel is playing.
  // Text fades out in the last moment of a segment and back in on the next one,
  // in step with the dip in the footage.
  useEffect(() => {
    const video = videoRef.current;
    if (!videoLive || !video) return;
    let raf = 0;
    const tick = () => {
      const t = video.currentTime;
      const index = Math.floor(t / segment) % banners.length;
      const remaining = segment - (t % segment);
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
        setAnimKey((k) => k + 1);
      }
      setFading(remaining < 0.3 && !video.paused);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [videoLive, segment, banners.length]);

  // When the video starts, jump it to the slide that's already showing.
  const onVideoStart = useCallback(
    (video: HTMLVideoElement) => {
      video.currentTime = activeRef.current * segment + 0.01;
      setFading(false);
      setAnimKey((k) => k + 1);
      setVideoLive(true);
    },
    [segment]
  );

  const go = useCallback(
    (n: number) => {
      const video = videoRef.current;
      if (videoLive && video) {
        video.currentTime = n * segment + 0.01; // footage and text follow
        return;
      }
      setFading(true);
      window.setTimeout(() => {
        setActive(n);
        setAnimKey((k) => k + 1);
        setFading(false);
      }, 380);
    },
    [videoLive, segment]
  );

  // Timer mode, used until the video plays (or if it never does: reduced motion, Data Saver).
  useEffect(() => {
    if (reducedMotion || videoLive) return;
    const timer = window.setTimeout(() => go((active + 1) % banners.length), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [active, animKey, go, banners.length, reducedMotion, videoLive]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Ultimate Tyres highlights">
      <BackgroundVideo {...HERO_REEL} className="hero-bg-wrap" videoRef={videoRef} onStart={onVideoStart} />
      <div className="hero-gradient" />
      <div className="hero-accent-strip" />
      <div className={`container hero-inner${fading ? " hero-fade" : ""}`}>
        <div className="hero-copy" aria-live="polite">
          <div className="hero-slide-no" aria-hidden="true">
            0{active + 1}
            <span>/ 0{banners.length}</span>
          </div>
          <div className="eyebrow">{slide.eyebrow}</div>
          {/* Server HTML always contains slide 1, so crawlers see the main <h1>. */}
          <h1>
            {slide.titleLine1}
            <br />
            <span>{slide.titleLine2}</span>
          </h1>
          <p>{slide.text}</p>
          <div className="hero-actions">
            {slide.cta.map((c) => (
              <Link key={c.href + c.label} className={`button${c.outline ? " button-outline" : ""}`} href={c.href}>
                {c.label} {!c.outline && "↗"}
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-image">
          <Image src={slide.image} alt={slide.alt} width={800} height={800} priority={active === 0} />
        </div>
        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-controls" role="tablist" aria-label="Homepage banners">
          <div className="hero-progress" aria-hidden="true">
            <div key={`progress-${animKey}`} className={`hero-progress-fill${reducedMotion ? "" : " running"}`} />
          </div>
          {banners.map((_, n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-label={"Show banner " + (n + 1)}
              aria-selected={active === n}
              onClick={() => go(n)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Lead / application form                                             */
/* ------------------------------------------------------------------ */

export function LeadForm({
  kind = "contact",
  initialTopic
}: {
  kind?: "contact" | "dealer-application" | "careers";
  /** Pre-selects the "I'm enquiring about" option on the contact form. */
  initialTopic?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [topic, setTopic] = useState(initialTopic || "Fleet tyres");

  async function submit(form: HTMLFormElement) {
    setBusy(true);
    setMessage("");
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, kind: effectiveKind })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn’t send that just now. Please try again.");
      form.reset();
      setMessage(data.message || "Thanks. The Ultimate Tyres team will be in touch.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
    setBusy(false);
  }

  const application = kind === "dealer-application";
  // On the contact form, choosing the careers topic turns it into a job enquiry.
  const careers = kind === "careers" || (kind === "contact" && topic === CAREERS_TOPIC);
  const effectiveKind = careers ? "careers" : kind;

  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
    >
      {application && (
        <>
          <div className="eyebrow">Dealer application</div>
          <h2>Let’s build a strong network.</h2>
          <p>Share a few details about your business. Applications are reviewed by our team before portal access is activated.</p>
        </>
      )}
      {kind === "careers" && (
        <>
          <div className="eyebrow">Careers</div>
          <h2>Bring your drive.</h2>
          <p>Tell us where you’re based and the kind of role you’re looking for.</p>
        </>
      )}
      {/* Honeypot: hidden from people, often filled in by spam bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Full name *</label>
          <input className="field" id="name" name="name" required maxLength={160} autoComplete="name" />
        </div>
        <div className="form-field">
          <label htmlFor="email">Work email *</label>
          <input className="field" id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone *</label>
          <input className="field" id="phone" name="phone" type="tel" required maxLength={40} autoComplete="tel" />
        </div>
        {application && (
          <>
            <div className="form-field">
              <label htmlFor="business">Business name *</label>
              <input className="field" id="business" name="business" required maxLength={180} autoComplete="organization" />
            </div>
            <div className="form-field">
              <label htmlFor="abn">ABN</label>
              <input className="field" id="abn" name="abn" maxLength={20} inputMode="numeric" />
            </div>
            <div className="form-field">
              <label htmlFor="state">State / territory *</label>
              <select className="select" id="state" name="state" required>
                <option value="">Select state</option>
                {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="password">Create portal password *</label>
              <input
                className="field"
                id="password"
                name="password"
                type="password"
                minLength={12}
                maxLength={128}
                autoComplete="new-password"
                required
              />
              <span style={{ fontSize: 9, color: "var(--muted)" }}>
                12 characters minimum. Your account is activated after approval.
              </span>
            </div>
          </>
        )}
        {careers && (
          <div className="form-field">
            <label htmlFor="role">Area of interest</label>
            <input className="field" id="role" name="role" maxLength={120} />
          </div>
        )}
        {kind === "contact" && (
          <div className="form-field">
            <label htmlFor="topic">I’m enquiring about</label>
            <select className="select" id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option>Fleet tyres</option>
              <option>Fleet services</option>
              <option>Dealer network</option>
              <option>General enquiry</option>
              <option>{CAREERS_TOPIC}</option>
            </select>
          </div>
        )}
        <div className="form-field full">
          <label htmlFor="message">
            {application ? "Tell us about your business *" : careers ? "A little about you" : "How can we help?"}
          </label>
          <textarea className="textarea" id="message" name="message" required={application} maxLength={4000} />
        </div>
      </div>
      <div className="form-actions">
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Sending…" : application ? "Send application" : careers ? "Send expression of interest" : "Send enquiry"} ↗
        </button>
        <span className="form-note" role="status">
          {message}
        </span>
      </div>
    </form>
  );
}
