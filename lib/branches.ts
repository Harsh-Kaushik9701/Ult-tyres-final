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
  latitude: number;
  longitude: number;
  services: string[];
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
    mapsQuery: "Ultimate Tyre Services (24/7 Mobile service), 5 Permarig Pl, Rocklea QLD 4106, Australia",
    latitude: -27.5486,
    longitude: 153.0037,
    services: ["Tyre fitting", "Wheel alignment", "Wheel balancing", "Mobile service"]
  },
  {
    id: "yatala",
    name: "Yatala",
    street: "4 Ozkleen Place",
    suburb: "Yatala",
    state: "QLD",
    postcode: "4207",
    mapsQuery: "Ultimate Tyre Services, 4 Ozkleen Pl, Yatala QLD 4207, Australia",
    latitude: -27.7366,
    longitude: 153.2208,
    services: ["Tyre fitting", "Wheel balancing", "Mobile service"]
  },
  {
    id: "bald-hills",
    name: "Bald Hills",
    street: "79 Linkfield Road",
    suburb: "Bald Hills",
    state: "QLD",
    postcode: "4036",
    mapsQuery: "Ultimate Tyre Services, 79 Linkfield Rd, Bald Hills QLD 4036, Australia",
    latitude: -27.3131,
    longitude: 153.0127,
    services: ["Tyre fitting", "Puncture repair", "Mobile service"]
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

/** Same branches in the shape used by /api/locations and the admin screen. */
export const branchLocations = branches.map((b) => ({
  id: b.id,
  name: `Ultimate Tyres ${b.name}`,
  address: b.street,
  suburb: b.suburb,
  state: b.state,
  postcode: b.postcode,
  phone: "1300 110 002",
  latitude: b.latitude,
  longitude: b.longitude,
  capabilities: b.services
}));
