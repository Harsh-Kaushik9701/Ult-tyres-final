/**
 * Short looping background videos for the top of inner pages
 * (built by scripts/build-page-backdrops.py into public/videos/backdrops/).
 */
export type BackdropTheme = "truck" | "fitting" | "trucks" | "shop" | "tread";

/** Bump when the backdrop files are rebuilt so browsers fetch the new versions. */
export const BACKDROP_VERSION = 1;

export function backdropFiles(theme: BackdropTheme) {
  const base = `/videos/backdrops/${theme}`;
  return { base, mobileBase: `${base}-mobile`, poster: `${base}.jpg?v=${BACKDROP_VERSION}` };
}
