"use client";

import { useState, type ReactNode } from "react";
import { branchAddress, directionsUrl, mapEmbedUrl, type Branch } from "@/lib/branches";

/**
 * Branch list + Google map. Clicking a branch moves the map to it.
 * The list and the first map are rendered on the server; only switching runs in the browser.
 */
export function BranchMap({ branches, intro, footer }: { branches: Branch[]; intro: ReactNode; footer: ReactNode }) {
  const [active, setActive] = useState(branches[0].id);
  const current = branches.find((b) => b.id === active) ?? branches[0];

  return (
    <div className="branches-grid">
      <div className="branches-copy">
        {intro}
        <ul className="branch-list">
          {branches.map((b) => (
            <li key={b.id} className={b.id === active ? "active" : undefined}>
              <button
                type="button"
                className="branch-select"
                onClick={() => setActive(b.id)}
                aria-pressed={b.id === active}
                aria-controls="branch-map-frame"
              >
                <span className="branch-name">
                  {b.name}
                  {b.note && <span className="branch-note">{b.note}</span>}
                </span>
                <span className="branch-address">{branchAddress(b)}</span>
              </button>
              <a className="branch-directions" href={directionsUrl(b)} target="_blank" rel="noopener noreferrer">
                Directions <span aria-hidden="true">›</span>
                <span className="sr-only"> to {b.name} branch (opens Google Maps)</span>
              </a>
            </li>
          ))}
        </ul>
        {footer}
      </div>
      <div className="branch-map">
        {/* Shown behind the map, e.g. when testing offline and Google Maps can't load. */}
        <div className="branch-map-fallback" aria-hidden="true">
          <strong>{current.name}</strong>
          <span>{branchAddress(current)}</span>
        </div>
        <iframe
          id="branch-map-frame"
          key={current.id}
          src={mapEmbedUrl(current)}
          title={`Map showing Ultimate Tyre Services ${current.name}, ${branchAddress(current)}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
