/**
 * Short looping background videos for the top of inner pages
 * (built by scripts/build-page-backdrops.py into public/videos/backdrops/).
 */
/** One theme per tab – each uses footage that isn't on the home page or any other tab. */
export type BackdropTheme =
  | "about"
  | "branch"
  | "contact"
  | "services"
  | "alignment"
  | "products"
  | "insights"
  | "dealer"
  | "login";

/** Bump when the backdrop files are rebuilt so browsers fetch the new versions. */
export const BACKDROP_VERSION = 2;

export function backdropFiles(theme: BackdropTheme) {
  const base = `/videos/backdrops/${theme}`;
  return { base, mobileBase: `${base}-mobile`, poster: `${base}.jpg?v=${BACKDROP_VERSION}` };
}
