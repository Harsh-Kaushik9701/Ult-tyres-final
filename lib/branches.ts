/**
 * Ultimate Tyre Services branches – the single source for branch addresses,
 * Google Maps links and the embedded map used across the site.
 */

export type Branch = {
  id: string;
  name: string;
  note?: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  /** What Google Maps should search for – the business listing name plus address. */
  mapsQuery: string;
};

export const branches: Branch[] = [
  {
    id: "rocklea",
    name: "Rocklea",
    note: "Head office",
    street: "5 Permarig Place",
    suburb: "Rocklea",
    state: "QLD",
    postcode: "4106",
    mapsQuery: "Ultimate Tyre Services (24/7 Mobile service), 5 Permarig Pl, Rocklea QLD 4106, Australia"
  },
  {
    id: "yatala",
    name: "Yatala",
    street: "4 Ozkleen Place",
    suburb: "Yatala",
    state: "QLD",
    postcode: "4207",
    mapsQuery: "Ultimate Tyre Services, 4 Ozkleen Pl, Yatala QLD 4207, Australia"
  },
  {
    id: "bald-hills",
    name: "Bald Hills",
    street: "79 Linkfield Road",
    suburb: "Bald Hills",
    state: "QLD",
    postcode: "4036",
    mapsQuery: "Ultimate Tyre Services, 79 Linkfield Rd, Bald Hills QLD 4036, Australia"
  }
];

/** Google rating shown next to the branches. Update these numbers as reviews come in. */
export const googleRating = {
  rating: 4.9,
  count: 137,
  url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(branches[0].mapsQuery)
};

export function branchAddress(b: Branch) {
  return `${b.street}, ${b.suburb} ${b.state} ${b.postcode}`;
}

/** Keyless Google Maps embed (no API key or billing needed). */
export function mapEmbedUrl(b: Branch) {
  return `https://www.google.com/maps?q=${encodeURIComponent(b.mapsQuery)}&z=15&output=embed`;
}

export function directionsUrl(b: Branch) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.mapsQuery)}`;
}
