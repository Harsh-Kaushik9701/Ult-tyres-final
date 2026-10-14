import ralsonRaw from "@/public/data/ralson-products.json";

export interface TyreItem {
  id: number;
  brand: "Ralson" | "Blacklion" | "Triangle";
  application: string; // e.g., "Line Haul", "Regional", "Urban Bus", "Construction / Mixed", "Trailer"
  axle: "Steer" | "Drive" | "Trailer" | "All-Position";
  pattern: string;
  size: string;
  plyRating: string;
  loadSpeed: string;
  measuringRim: string;
  overallDiameterMm: string;
  overallWidthMm: string;
  treadDepthMm: string;
  loadSingle: string;
  loadDual: string;
  image: string;
  wholesalePrice: number;
  rrp: number;
  stock: number;
  features: string[];
}

// Map existing Ralson raw items into enriched items with prices and stock
const enrichedRalson: TyreItem[] = (ralsonRaw as any[]).map((item, idx) => {
  let axle: TyreItem["axle"] = "All-Position";
  const app = item.application || "Regional";
  const p = item.pattern.toUpperCase();
  if (p.includes("DR") || p.includes("DC") || p.includes("RDL")) axle = "Drive";
  else if (p.includes("TR") || p.includes("RTL")) axle = "Trailer";
  else if (p.includes("MR") || p.includes("RSL")) axle = "Steer";
  else axle = "All-Position";

  // Bus application check
  let finalApp = app;
  if (p.includes("AU51") || p.includes("AC52")) {
    finalApp = "Bus / Coach";
  }

  const basePrice = 360 + (idx % 8) * 25;

  return {
    id: item.id || idx + 1,
    brand: "Ralson",
    application: finalApp,
    axle,
    pattern: item.pattern,
    size: item.size,
    plyRating: item.plyRating || "16/18PR",
    loadSpeed: item.loadSpeed || "148/145M",
    measuringRim: item.measuringRim || "8.25",
    overallDiameterMm: String(item.overallDiameterMm || "1050"),
    overallWidthMm: String(item.overallWidthMm || "295"),
    treadDepthMm: String(item.treadDepthMm || "15.0"),
    loadSingle: item.loadSingle || "3150 kg",
    loadDual: item.loadDual || "2900 kg",
    image:
      item.image && (item.image.includes("RSL51") || item.image.includes("RDL52") || item.image.includes("RDL55"))
        ? p.includes("DL")
          ? "/images/products/RDR75.webp"
          : "/images/products/RMR61.webp"
        : item.image || "/images/products/RMR61.webp",
    wholesalePrice: basePrice,
    rrp: Math.round(basePrice * 1.32),
    stock: 24 + ((idx * 7) % 80),
    features: [
      "Ultra-durable casing engineered for Australian operating conditions",
      "Cut & chip resistant tread compound for extended casing life",
      "Low rolling resistance geometry reducing fleet CPK"
    ]
  };
});

// Blacklion Commercial Tyre Range
const blacklionItems: TyreItem[] = [
  {
    id: 101,
    brand: "Blacklion",
    application: "Line Haul",
    axle: "Drive",
    pattern: "BD280",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145L",
    measuringRim: "8.25",
    overallDiameterMm: "1055",
    overallWidthMm: "279",
    treadDepthMm: "22.5",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RDR75.webp",
    wholesalePrice: 385,
    rrp: 495,
    stock: 64,
    features: ["Extra-deep 22.5mm tread depth", "Aggressive block design for high torque drive axles", "Tie-bars to resist heel-toe irregular wear"]
  },
  {
    id: 102,
    brand: "Blacklion",
    application: "Line Haul",
    axle: "Drive",
    pattern: "BD280",
    size: "295/80R22.5",
    plyRating: "18PR",
    loadSpeed: "152/148M",
    measuringRim: "9.00",
    overallDiameterMm: "1044",
    overallWidthMm: "298",
    treadDepthMm: "22.5",
    loadSingle: "3550 kg @ 850 kPa",
    loadDual: "3150 kg @ 850 kPa",
    image: "/images/products/RDR75.webp",
    wholesalePrice: 420,
    rrp: 540,
    stock: 48,
    features: ["Extra-deep 22.5mm tread depth", "Wide shoulder footprint for maximum stability", "Exceptional wet traction on interstate highways"]
  },
  {
    id: 103,
    brand: "Blacklion",
    application: "Regional",
    axle: "Drive",
    pattern: "BD175",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145L",
    measuringRim: "8.25",
    overallDiameterMm: "1054",
    overallWidthMm: "279",
    treadDepthMm: "20.5",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RDR55.webp",
    wholesalePrice: 375,
    rrp: 485,
    stock: 52,
    features: ["Open shoulder drive for regional distribution", "Excellent stone ejection grooves", "High mileage compound for start-stop routes"]
  },
  {
    id: 104,
    brand: "Blacklion",
    application: "Line Haul",
    axle: "Steer",
    pattern: "BF188",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145M",
    measuringRim: "8.25",
    overallDiameterMm: "1050",
    overallWidthMm: "279",
    treadDepthMm: "15.0",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RMR61.webp",
    wholesalePrice: 360,
    rrp: 465,
    stock: 76,
    features: ["5-rib premium steer pattern", "Decoupling groove prevents irregular shoulder wear", "Micro-siping delivers responsive wet braking"]
  },
  {
    id: 105,
    brand: "Blacklion",
    application: "Line Haul",
    axle: "Steer",
    pattern: "BF188",
    size: "295/80R22.5",
    plyRating: "18PR",
    loadSpeed: "152/148M",
    measuringRim: "9.00",
    overallDiameterMm: "1044",
    overallWidthMm: "298",
    treadDepthMm: "15.5",
    loadSingle: "3550 kg @ 850 kPa",
    loadDual: "3150 kg @ 850 kPa",
    image: "/images/products/RMR61.webp",
    wholesalePrice: 395,
    rrp: 510,
    stock: 58,
    features: ["Heavy front-axle rating", "Low rolling resistance compound saves up to 3% fuel", "Optimised contact patch for precision steering"]
  },
  {
    id: 106,
    brand: "Blacklion",
    application: "Trailer",
    axle: "Trailer",
    pattern: "BT165",
    size: "385/65R22.5",
    plyRating: "20PR",
    loadSpeed: "160K",
    measuringRim: "11.75",
    overallDiameterMm: "1072",
    overallWidthMm: "389",
    treadDepthMm: "16.0",
    loadSingle: "4500 kg @ 900 kPa",
    loadDual: "–",
    image: "/images/products/RTR71.webp",
    wholesalePrice: 470,
    rrp: 610,
    stock: 32,
    features: ["Super single trailer fitment", "Reinforced solid shoulders resist scrub on tight roundabouts", "Four wide longitudinal grooves for aquaplaning resistance"]
  },
  {
    id: 107,
    brand: "Blacklion",
    application: "Trailer",
    axle: "Trailer",
    pattern: "BT165",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145L",
    measuringRim: "8.25",
    overallDiameterMm: "1050",
    overallWidthMm: "279",
    treadDepthMm: "14.5",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RTR51.webp",
    wholesalePrice: 345,
    rrp: 445,
    stock: 84,
    features: ["Specialised spread axle trailer formulation", "Resists lateral scrub on tri-axles", "Premium casing suitable for multiple retreads"]
  },
  {
    id: 108,
    brand: "Blacklion",
    application: "Bus / Coach",
    axle: "All-Position",
    pattern: "BH188",
    size: "275/70R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145J",
    measuringRim: "8.25",
    overallDiameterMm: "958",
    overallWidthMm: "276",
    treadDepthMm: "19.0",
    loadSingle: "3150 kg @ 900 kPa",
    loadDual: "2900 kg @ 900 kPa",
    image: "/images/products/RAU51.webp",
    wholesalePrice: 390,
    rrp: 505,
    stock: 40,
    features: ["Reinforced sidewall kerbing ribs for city bus curbs", "High-scrub urban compound", "Quiet running pattern for passenger comfort"]
  },
  {
    id: 109,
    brand: "Blacklion",
    application: "Construction / Mixed",
    axle: "Drive",
    pattern: "BC100",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145K",
    measuringRim: "8.25",
    overallDiameterMm: "1060",
    overallWidthMm: "279",
    treadDepthMm: "21.0",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RDC66.webp",
    wholesalePrice: 395,
    rrp: 515,
    stock: 36,
    features: ["Severe duty on/off road lug tread", "Anti-chip compounding prevents quarry rock cutting", "Deep self-cleaning tread voids"]
  }
];

// Triangle Commercial Tyre Range
const triangleItems: TyreItem[] = [
  {
    id: 201,
    brand: "Triangle",
    application: "Line Haul",
    axle: "Drive",
    pattern: "TR688",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145L",
    measuringRim: "8.25",
    overallDiameterMm: "1055",
    overallWidthMm: "279",
    treadDepthMm: "21.5",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RDR52.webp",
    wholesalePrice: 370,
    rrp: 480,
    stock: 70,
    features: ["Australia's proven high-mileage drive radial", "Interlocking centre blocks minimise tread squirm", "High casing durability for 2+ retreads"]
  },
  {
    id: 202,
    brand: "Triangle",
    application: "Line Haul",
    axle: "Drive",
    pattern: "TR688",
    size: "295/80R22.5",
    plyRating: "18PR",
    loadSpeed: "152/148M",
    measuringRim: "9.00",
    overallDiameterMm: "1044",
    overallWidthMm: "298",
    treadDepthMm: "21.5",
    loadSingle: "3550 kg @ 850 kPa",
    loadDual: "3150 kg @ 850 kPa",
    image: "/images/products/RDR52.webp",
    wholesalePrice: 410,
    rrp: 530,
    stock: 54,
    features: ["Deep 21.5mm traction blocks", "Optimised footprint distributes axle weight evenly", "Tested across regional Australian freight routes"]
  },
  {
    id: 203,
    brand: "Triangle",
    application: "Line Haul",
    axle: "Steer",
    pattern: "TR657",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145M",
    measuringRim: "8.25",
    overallDiameterMm: "1050",
    overallWidthMm: "279",
    treadDepthMm: "15.0",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RAC55.webp",
    wholesalePrice: 350,
    rrp: 450,
    stock: 62,
    features: ["Continuous shoulder ribs ensure straight-line tracking", "Wide outer channels for high-speed water displacement", "Low rolling resistance casing saves fuel"]
  },
  {
    id: 204,
    brand: "Triangle",
    application: "Line Haul",
    axle: "Steer",
    pattern: "TR657",
    size: "295/80R22.5",
    plyRating: "18PR",
    loadSpeed: "152/148M",
    measuringRim: "9.00",
    overallDiameterMm: "1044",
    overallWidthMm: "298",
    treadDepthMm: "15.5",
    loadSingle: "3550 kg @ 850 kPa",
    loadDual: "3150 kg @ 850 kPa",
    image: "/images/products/RAC55.webp",
    wholesalePrice: 385,
    rrp: 495,
    stock: 44,
    features: ["High load rating for modern prime movers", "Uniform pressure distribution prevents shoulder cupping", "Quiet highway running"]
  },
  {
    id: 205,
    brand: "Triangle",
    application: "Regional",
    axle: "All-Position",
    pattern: "TR668",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145K",
    measuringRim: "8.25",
    overallDiameterMm: "1054",
    overallWidthMm: "279",
    treadDepthMm: "16.5",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RAC52.webp",
    wholesalePrice: 355,
    rrp: 460,
    stock: 80,
    features: ["All-position versatility for tippers, mixers and regional trucks", "Tough 4-rib zigzag pattern gives strong grip on dirt and bitumen", "Thick undertread protects steel belt package"]
  },
  {
    id: 206,
    brand: "Triangle",
    application: "Regional",
    axle: "Drive",
    pattern: "TRD02",
    size: "11R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145L",
    measuringRim: "8.25",
    overallDiameterMm: "1055",
    overallWidthMm: "279",
    treadDepthMm: "20.0",
    loadSingle: "3150 kg @ 830 kPa",
    loadDual: "2900 kg @ 830 kPa",
    image: "/images/products/RDR65.webp",
    wholesalePrice: 365,
    rrp: 475,
    stock: 65,
    features: ["Directional block pattern maximizes drive axle bite", "Stone rejectors prevent drilling into casing", "Excellent heat dissipation during long runs"]
  },
  {
    id: 207,
    brand: "Triangle",
    application: "Trailer",
    axle: "Trailer",
    pattern: "TRT01",
    size: "255/70R22.5",
    plyRating: "16PR",
    loadSpeed: "140/137J",
    measuringRim: "7.50",
    overallDiameterMm: "930",
    overallWidthMm: "255",
    treadDepthMm: "13.5",
    loadSingle: "2500 kg @ 830 kPa",
    loadDual: "2300 kg @ 830 kPa",
    image: "/images/products/RTR51.webp",
    wholesalePrice: 320,
    rrp: 415,
    stock: 45,
    features: ["Low profile trailer tyre for drop-deck semi-trailers", "Reinforced bead construction for high sideways G-forces", "Resistant to scuffing on tight turns"]
  },
  {
    id: 208,
    brand: "Triangle",
    application: "Bus / Coach",
    axle: "All-Position",
    pattern: "TR685",
    size: "275/70R22.5",
    plyRating: "16PR",
    loadSpeed: "148/145J",
    measuringRim: "8.25",
    overallDiameterMm: "958",
    overallWidthMm: "276",
    treadDepthMm: "18.5",
    loadSingle: "3150 kg @ 900 kPa",
    loadDual: "2900 kg @ 900 kPa",
    image: "/images/products/RAC82.webp",
    wholesalePrice: 380,
    rrp: 490,
    stock: 35,
    features: ["Purpose-built city passenger bus and coach radial", "Heavy scuff ribs on both sidewalls resist curb wear", "Optimised siping delivers smooth braking and passenger safety"]
  }
];

export const allCatalogueProducts: TyreItem[] = [
  ...enrichedRalson,
  ...blacklionItems,
  ...triangleItems
];
