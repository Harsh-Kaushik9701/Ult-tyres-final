/**
 * SEO copy for each page: meta title, meta description and meta keywords.
 * Edit the text here — pages pick it up through buildMetadata() in lib/seo.ts.
 *
 * og:image: the default social image is /public/images/og-ultimate-tyres.jpg
 * (1200×630). Each service and Insights article also gets its own branded
 * og:image generated on the server (see opengraph-image.tsx in those folders);
 * product pages use the product photo.
 */

export const staticPageSeo = {
  home: {
    title: "Ultimate Tyres Australia | Commercial Truck & Bus Tyres, Fleet Services",
    description:
      "Commercial truck and bus tyres from Ralson, Blacklion and Triangle, plus wheel alignment, tyre fitting and fleet services across Australia. Your fleet. Our drive.",
    keywords: [
      "commercial tyres Australia",
      "truck tyres",
      "bus tyres",
      "fleet tyre services",
      "truck wheel alignment",
      "Ralson tyres",
      "Blacklion tyres",
      "Triangle tyres",
      "wholesale tyre dealer"
    ]
  },
  about: {
    title: "About Us – Our History, Facilities & Fleet Mission",
    description:
      "Learn about Ultimate Tyres Australia: our commercial tyre heritage, Rocklea distribution depot, laser alignment bays and mission as the dependable co-pilot for Australian fleets.",
    keywords: [
      "about Ultimate Tyres",
      "commercial tyre distributor Australia",
      "Rocklea tyre warehouse",
      "truck tyre company Brisbane",
      "fleet tyre partner"
    ]
  },
  services: {
    title: "Fleet Services – Truck Maintenance, Alignment & Tyre Fitting",
    description:
      "Commercial fleet services from Ultimate Tyres: truck maintenance, heavy vehicle wheel alignment, balancing, nitrogen inflation, puncture proofing, tyre fitting and wheel solutions.",
    keywords: [
      "fleet services",
      "truck maintenance",
      "heavy vehicle wheel alignment",
      "truck tyre fitting",
      "mobile tyre fitting",
      "nitrogen tyre inflation",
      "wheel balancing"
    ]
  },
  insights: {
    title: "Fleet Insights – Tyre Technology & Fleet Maintenance Articles",
    description:
      "Practical insights for Australian fleet managers: cost-per-kilometre analysis, wheel alignment, casing retreadability, tyre selection and heavy vehicle maintenance advice.",
    keywords: [
      "fleet insights",
      "truck tyre advice",
      "cost per kilometre tyres",
      "tyre retreading",
      "fleet maintenance blog",
      "commercial tyre guide"
    ]
  },
  wheelAlignment: {
    title: "Heavy Truck & Fleet Wheel Alignment Services",
    description:
      "Computerised laser wheel alignment for prime movers, trailers and B-doubles. Square drive axles, stop dog-tracking, cut fuel use by up to 8% and extend tyre life by up to 30%.",
    keywords: [
      "truck wheel alignment",
      "heavy vehicle wheel alignment",
      "fleet wheel alignment Brisbane",
      "laser alignment trucks",
      "dog tracking fix",
      "trailer alignment",
      "drive axle alignment"
    ]
  }
} as const;

/** Keywords for each service page, by slug. */
export const serviceKeywords: Record<string, string[]> = {
  "truck-maintenance": ["truck maintenance", "fleet maintenance", "heavy vehicle servicing", "preventative truck checks"],
  "wheel-alignment": ["truck wheel alignment", "heavy vehicle alignment", "laser wheel alignment", "dog tracking"],
  "wheel-balancing": ["truck wheel balancing", "car wheel balancing", "tyre balancing", "wheel vibration"],
  "steering-suspension": ["truck steering repair", "suspension repair", "heavy vehicle steering", "kingpin repair"],
  "nitrogen-inflation": ["nitrogen tyre inflation", "truck tyre pressure", "nitrogen filled tyres", "tyre heat"],
  "puncture-proofing": ["puncture proofing", "tyre sealant", "puncture prevention", "fleet downtime"],
  "tyre-fitting": ["truck tyre fitting", "mobile tyre fitting", "commercial tyre fitting", "on-site tyre service"],
  "ultimate-readyfit": ["tyre exchange", "ReadyFit", "pre-fitted wheels", "fleet tyre exchange program"],
  "u-wheels": ["truck rims", "commercial wheels", "alloy truck wheels", "U-Wheels"]
};

/** Keywords for each Insights article, by slug. */
export const articleKeywords: Record<string, string[]> = {
  "why-tenth-inch-misalignment-costs-fleets-thousands": [
    "axle misalignment",
    "truck wheel alignment cost",
    "dog tracking",
    "fleet fuel economy"
  ],
  "casing-life-and-cost-per-kilometer": ["cost per kilometre", "CPK tyres", "tyre casing life", "fleet tyre budget"],
  "electric-and-high-torque-truck-tyres": ["electric truck tyres", "EV bus tyres", "high torque tyres", "EV fleet"],
  "nitrogen-inflation-in-outback-conditions": [
    "road train tyres",
    "outback tyre pressure",
    "nitrogen inflation",
    "tyre heat management"
  ],
  "choosing-a-drive-tyre-for-australian-routes": [
    "drive tyre selection",
    "linehaul tyres",
    "regional truck tyres",
    "on off road truck tyres"
  ],
  "retreadability-guide-three-lives-per-casing": ["tyre retreading", "retreadable casings", "three life casing", "fleet sustainability"]
};

/** "14 Oct 2026" → "2026-10-14" (falls back to undefined if the date can't be read). */
export function toIsoDate(display: string): string | undefined {
  const parsed = new Date(display + " UTC");
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}
