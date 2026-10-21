import Link from "next/link";
import { allCatalogueProducts, type TyreItem } from "@/lib/catalogue-data";

/**
 * Tyre-position guide built around the truck type our fleets run: a cab-over
 * 6x4 prime mover. The illustration is an original, unbranded drawing (no
 * make, logo or plates). Rendered on the server; animation is CSS-only.
 */

type Position = {
  axle: TyreItem["axle"];
  no: string;
  title: string;
  text: string;
};

const POSITIONS: Position[] = [
  {
    axle: "Steer",
    no: "1",
    title: "Steer axle",
    text: "Precise handling, even shoulder wear and low rolling resistance on the front axle."
  },
  {
    axle: "Drive",
    no: "2",
    title: "Drive axles (tandem)",
    text: "Traction and torque on both drive axles, with deep tread for long casing life."
  },
  {
    axle: "Trailer",
    no: "3",
    title: "Trailer axles",
    text: "Low scrub and long life on the trailer behind – semi, B-double or road train."
  }
];

/** Distinct patterns for an axle position, each linked to its first tyre. */
function patternsFor(axle: TyreItem["axle"], limit = 6) {
  const seen = new Map<string, TyreItem>();
  for (const p of allCatalogueProducts) {
    const key = `${p.brand} ${p.pattern}`;
    if (p.axle === axle && !seen.has(key)) seen.set(key, p);
  }
  return Array.from(seen.entries()).slice(0, limit);
}

const WHEEL_Y = 292;
const WHEEL_R = 38;

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={WHEEL_Y} r={WHEEL_R} className="tpg-tyre" />
      <circle cx={cx} cy={WHEEL_Y} r={WHEEL_R - 4} className="tpg-tread" />
      <circle cx={cx} cy={WHEEL_Y} r={21} className="tpg-rim" />
      <circle cx={cx} cy={WHEEL_Y} r={14} className="tpg-rim-inner" />
      <circle cx={cx} cy={WHEEL_Y} r={6} className="tpg-hub" />
    </g>
  );
}

/*
 * Scale ~72 px per metre: wheel Ø1.05 m, wheelbase 3.9 m (steer → first drive),
 * drive axles 1.37 m apart, high-roof cab ~3.9 m tall. Facing right.
 */
const STEER = 700;
const DRIVE_1 = 420;
const DRIVE_2 = 321;

function PrimeMover() {
  return (
    <svg viewBox="0 0 900 360" className="tpg-truck" role="img" aria-labelledby="tpg-title">
      <title id="tpg-title">
        Cab-over 6x4 prime mover showing tyre positions: 1 steer axle at the front, 2 tandem drive axles at the
        rear, 3 trailer axles behind
      </title>
      {/* ground + shadow */}
      <line x1="60" y1="331" x2="860" y2="331" className="tpg-ground" />
      <ellipse cx="530" cy="333" rx="310" ry="7" className="tpg-shadow" />

      {/* chassis rail with rear light bar */}
      <rect x="252" y="250" width="520" height="17" rx="2" className="tpg-chassis" />
      <rect x="246" y="244" width="10" height="28" rx="2" className="tpg-chassis" />
      <rect x="244" y="248" width="6" height="8" rx="1" className="tpg-taillight" />

      {/* fifth wheel over the drive tandem */}
      <rect x="318" y="236" width="104" height="14" rx="3" className="tpg-fifth" />
      <path d="M322 236 q48 -12 96 0" className="tpg-fifth-top" />

      {/* drive mudguards */}
      <path d={`M${DRIVE_2 - 42} 262 A52 52 0 0 1 ${DRIVE_2 + 42} 262`} className="tpg-guard" />
      <path d={`M${DRIVE_1 - 42} 262 A52 52 0 0 1 ${DRIVE_1 + 42} 262`} className="tpg-guard" />

      {/* fuel tank + air tank between axles */}
      <rect x="486" y="256" width="118" height="40" rx="12" className="tpg-tank" />
      <line x1="498" y1="266" x2="592" y2="266" className="tpg-tank-line" />
      <rect x="470" y="262" width="14" height="28" rx="4" className="tpg-tank" />

      {/* cab body with front wheel arch */}
      <path
        className="tpg-cab"
        d={`M618 92 L782 92 Q796 92 799 106 L806 250 Q807 268 792 268 L${STEER + 43} 268
            A48 48 0 0 0 ${STEER - 43} 268 L624 268 Q616 268 616 260 Z`}
      />
      {/* high roof / air deflector */}
      <path d="M620 92 Q626 52 682 46 L760 46 Q788 48 790 92 Z" className="tpg-roof" />
      <path d="M640 80 L774 80" className="tpg-line-soft" />
      {/* windscreen edge + side window */}
      <path d="M792 104 L800 106 L805 182 L796 184 Z" className="tpg-glass" />
      <path d="M650 104 L780 104 Q788 104 789 112 L792 172 L650 172 Z" className="tpg-glass" />
      {/* door, handle, steps */}
      <path d="M636 100 L636 240" className="tpg-line" />
      <rect x="644" y="186" width="20" height="5" rx="2" className="tpg-handle" />
      <rect x="622" y="240" width="30" height="6" rx="2" className="tpg-step" />
      <rect x="622" y="254" width="30" height="6" rx="2" className="tpg-step" />
      {/* brand-neutral accent: red lower stripe */}
      <path d="M618 214 L803 214 L804 226 L618 226 Z" className="tpg-stripe" />
      {/* front grille, headlight, chrome bumper */}
      <rect x="796" y="190" width="12" height="20" rx="2" className="tpg-grille" />
      <rect x="798" y="216" width="10" height="9" rx="2" className="tpg-light" />
      <path d="M766 256 L812 256 Q822 256 822 266 L822 276 Q822 286 812 286 L766 286 Z" className="tpg-bumper" />
      {/* mirror */}
      <path d="M800 116 Q818 118 818 140" className="tpg-line" />
      <rect x="812" y="128" width="10" height="34" rx="3" className="tpg-mirror" />

      {/* wheels */}
      <Wheel cx={DRIVE_2} />
      <Wheel cx={DRIVE_1} />
      <Wheel cx={STEER} />

      {/* position markers */}
      <g className="tpg-marker">
        <line x1={STEER} y1={WHEEL_Y - 44} x2={STEER} y2="30" />
        <circle cx={STEER} cy="20" r="16" />
        <text x={STEER} y="26">1</text>
      </g>
      <g className="tpg-marker">
        <path d={`M${DRIVE_2} ${WHEEL_Y - 44} V60 H${DRIVE_1} V${WHEEL_Y - 44}`} />
        <circle cx={(DRIVE_1 + DRIVE_2) / 2} cy="48" r="16" />
        <text x={(DRIVE_1 + DRIVE_2) / 2} y="54">2</text>
      </g>
      <g className="tpg-marker tpg-marker-muted">
        <path d="M244 258 H132" />
        <circle cx="116" cy="258" r="16" />
        <text x="116" y="264">3</text>
        <text x="116" y="300" className="tpg-caption">to trailer</text>
      </g>
    </svg>
  );
}

export function TruckPositionGuide() {
  return (
    <section className="section tpg" aria-labelledby="tpg-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Tyres by position</div>
            <h2 id="tpg-heading">Built for the prime movers you run.</h2>
          </div>
          <p>
            Most of our fleets run cab-over 6×4 prime movers. Here’s where each tyre goes – pick the position to see
            matching patterns.
          </p>
        </div>

        <div className="tpg-figure">
          <PrimeMover />
        </div>

        <div className="tpg-cards">
          {POSITIONS.map((pos) => {
            const patterns = patternsFor(pos.axle);
            return (
              <article key={pos.axle} className="tpg-card">
                <div className="tpg-card-head">
                  <span className="tpg-badge" aria-hidden="true">
                    {pos.no}
                  </span>
                  <h3>{pos.title}</h3>
                </div>
                <p>{pos.text}</p>
                {patterns.length > 0 && (
                  <ul className="tpg-patterns" aria-label={`${pos.title} tyre patterns`}>
                    {patterns.map(([name, p]) => (
                      <li key={name}>
                        <Link href={`/products/${p.id}`}>{name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
