/**
 * Path geometry for the EmergeSquares journey — the pure, DOM-free core of the
 * three brand squares' scroll-scrubbed travel from the logo down into the
 * sections. Leaf module: no GSAP, no DOM, no app imports — just types, the
 * canonical phase/handoff constants, and the interpolation math. The animation
 * component (EmergeSquares.tsx) owns everything with side effects.
 */

/** A square's footprint in viewport coordinates: centre + width/height. */
export type Vec = { cx: number; cy: number; w: number; h: number };

/** A point on the continuous path: fires at global progress `at`, reads its
 *  live footprint via `get`, optionally eased into from the previous point. */
export type Waypoint = { at: number; ease?: (t: number) => number; get: () => Vec };

// Canonical phase values — used by BOTH the interpolation waypoints and the
// scroll-position checkpoints, so the two mappings can never fall out of
// sync (previously these were separately hardcoded in two places).
//
// The squares pop off the logo and then spend the whole journey on the
// z-index:-1 floater, drifting from section to section behind the content —
// there is no landing on the stair cards. Float legs:
//   STAIRS   drift around the About stairs section
//   TEASER   "What we do"
//   CLIENTS  the clients section
//   VIDEO    the showreel — the resting section
export const PHASE = {
  LAUNCH: 0,
  POP: 0.06,
  // The stairs section PINS for a long scroll, so its viewport position is
  // fixed — a single cell would just hover in place. Three sub-cells let each
  // square wander across the section as the pin is scrolled.
  STAIRS_A: 0.22,
  STAIRS_B: 0.36,
  STAIRS_C: 0.5,
  TEASER: 0.65,
  CLIENTS: 0.83,
  VIDEO: 1,
} as const;

// One-way cross-fade window: main layer → floater, right after the pop, so the
// squares leave the logo and immediately float. There is no return window — the
// floater carries each square through every section and idles there forever.
export const HANDOFF = {
  TO_FLOATER_START: 0.08,
  TO_FLOATER_END: 0.16,
} as const;

export const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Sample the continuous path at global progress p (viewport coordinates). */
export function samplePath(wps: Waypoint[], p: number): Vec {
  if (p <= wps[0].at) return wps[0].get();
  const last = wps[wps.length - 1];
  if (p >= last.at) return last.get();
  let i = 0;
  while (i < wps.length - 2 && p > wps[i + 1].at) i++;
  const a = wps[i];
  const b = wps[i + 1];
  const t = (b.ease ?? smoothstep)((p - a.at) / (b.at - a.at));
  const A = a.get();
  const B = b.get();
  return {
    cx: lerp(A.cx, B.cx, t),
    cy: lerp(A.cy, B.cy, t),
    w: lerp(A.w, B.w, t),
    h: lerp(A.h, B.h, t),
  };
}
