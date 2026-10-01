/**
 * Single source of truth for the brand-square size.
 *
 * The squares that travel down the Home page are exactly the size of the
 * squares inside the logo mark, so their size derives from two things that
 * live here: the width of the logo box (a clamp() of the viewport width) and
 * each square's share of it (measured from the artwork). Home reads them via
 * LogoSquares/WordmarkMoment (the DOM anchors it then measures); the About
 * page's scroll squares call `logoSquareSize()` — so both always match.
 */

/** Logo box width: the CSS value (WordmarkMoment) and its JS twin (below). */
export const LOGO_BOX_MIN = 260;
export const LOGO_BOX_VW = 52;
export const LOGO_BOX_MAX = 620;
export const LOGO_BOX_CSS = `clamp(${LOGO_BOX_MIN}px, ${LOGO_BOX_VW}vw, ${LOGO_BOX_MAX}px)`;

export const logoBoxWidth = (viewportWidth: number) =>
  Math.min(LOGO_BOX_MAX, Math.max(LOGO_BOX_MIN, (viewportWidth * LOGO_BOX_VW) / 100));

/** Trio bounding boxes inside LOGO-b.svg, % of the logo box (aspect 691:211). */
export const LOGO_TRIO = {
  yellow: { left: 34.88, top: 0, width: 7.38, height: 23.7 },
  orange: { left: 46.45, top: 0, width: 7.38, height: 23.7 },
  green: { left: 58.18, top: 0, width: 7.24, height: 23.7 },
} as const;

export type LogoSquareColor = keyof typeof LOGO_TRIO;

/**
 * Rendered edge (px) of a logo square at a viewport width. Rounded, because
 * Home reads the anchor's `offsetWidth` (an integer) for the travelling
 * squares — this reproduces that value exactly.
 */
export const logoSquareSize = (color: LogoSquareColor, viewportWidth: number) =>
  Math.round((logoBoxWidth(viewportWidth) * LOGO_TRIO[color].width) / 100);

/**
 * Edge-to-edge gap (px) between two ADJACENT logo squares (yellow↔orange or
 * orange↔green, in either order), as drawn in the logo artwork at this
 * viewport width. Unrounded, so rows built from it match Home's logo to the
 * sub-pixel. Shared by the About page's scroll squares.
 */
export const logoSquareGap = (a: LogoSquareColor, b: LogoSquareColor, viewportWidth: number) => {
  const [l, r] = LOGO_TRIO[a].left <= LOGO_TRIO[b].left ? [a, b] : [b, a];
  const gapPct = LOGO_TRIO[r].left - (LOGO_TRIO[l].left + LOGO_TRIO[l].width);
  return (logoBoxWidth(viewportWidth) * gapPct) / 100;
};
