"use client";

import type { SquareRefs } from "./logoSquares.types";

/**
 * The three static brand squares that live inside the "RMZ" logo mark. They
 * never move — EmergeSquares clones them and animates the clones, so scrolling
 * back up never destroys the logo. Refs are owned by the parent page (it needs
 * both these start points and the stair end points for the Flip travel).
 */
export default function LogoSquares({ squareRefs }: { squareRefs: SquareRefs }) {
  return (
    <div className="logo-squares" aria-hidden="true">
      <span ref={squareRefs.yellow} className="sq sq-yellow" />
      <span ref={squareRefs.orange} className="sq sq-orange" />
      <span ref={squareRefs.green} className="sq sq-green" />
    </div>
  );
}
