"use client";

import type { SquareRefs } from "./logoSquares.types";
import { LOGO_TRIO } from "@/lib/logoSquareSize";

/**
 * The three static brand squares that live inside the "RMZ" logo mark. They
 * never move — EmergeSquares clones them and animates the clones, so scrolling
 * back up never destroys the logo. Refs are owned by the parent page (it needs
 * both these start points and the stair end points for the Flip travel).
 *
 * Two modes:
 *  - default: a visible standalone row (the lab harness).
 *  - overlay: invisible anchors positioned exactly over the trio that is part
 *    of the logo artwork itself (`/LOGO-b.svg`), so the emerge animation
 *    starts from the logo's own squares. Coordinates are percentages of the
 *    logo image box, measured from the artwork's pixels (aspect 691:211).
 */

// Trio bounding boxes inside LOGO-b.svg, % of the image box — shared with the
// About page's scroll squares (see lib/logoSquareSize).
type Box = { left: string; width: string; top: string; height: string };
const pct = (n: number) => `${n}%`;
const box = (k: keyof typeof LOGO_TRIO): Box => ({
  left: pct(LOGO_TRIO[k].left),
  top: pct(LOGO_TRIO[k].top),
  width: pct(LOGO_TRIO[k].width),
  height: pct(LOGO_TRIO[k].height),
});
const TRIO: Record<keyof SquareRefs, Box> = {
  yellow: box("yellow"),
  orange: box("orange"),
  green: box("green"),
};

export default function LogoSquares({
  squareRefs,
  overlay = false,
}: {
  squareRefs: SquareRefs;
  overlay?: boolean;
}) {
  const { yellow, orange, green } = squareRefs;

  if (!overlay) {
    return (
      <div className="logo-squares" aria-hidden="true">
        <span ref={yellow} className="sq sq-yellow" />
        <span ref={orange} className="sq sq-orange" />
        <span ref={green} className="sq sq-green" />
      </div>
    );
  }

  return (
    <div className="logo-squares logo-squares-overlay" aria-hidden="true">
      <span
        ref={yellow}
        className="sq sq-yellow sq-anchor"
        style={{ position: "absolute", ...TRIO.yellow }}
      />
      <span
        ref={orange}
        className="sq sq-orange sq-anchor"
        style={{ position: "absolute", ...TRIO.orange }}
      />
      <span
        ref={green}
        className="sq sq-green sq-anchor"
        style={{ position: "absolute", ...TRIO.green }}
      />
    </div>
  );
}
