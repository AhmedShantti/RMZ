"use client";

import { useRef } from "react";
import WordmarkMoment from "./WordmarkMoment";
import LogoSquares from "./LogoSquares";
import EmergeSquares from "./EmergeSquares";
import AboutStairsSection from "./AboutStairsSection";
import type { SquareRefs, StairRefs } from "./logoSquares.types";
import "@/app/(frontend)/logo-squares.css";

/**
 * Home composition of the logo → emerge → stairs feature: the wordmark moment
 * hosts the three static logo squares (animation start points), and the stairs
 * section sits directly beneath it (landing slots). This client wrapper exists
 * because the six refs must live in one parent — the page itself is a server
 * component.
 */
export default function HomeLogoStairs() {
  const squareRefs: SquareRefs = {
    yellow: useRef<HTMLSpanElement>(null),
    orange: useRef<HTMLSpanElement>(null),
    green: useRef<HTMLSpanElement>(null),
  };
  const landingRefs: StairRefs = {
    yellow: useRef<HTMLDivElement>(null),
    orange: useRef<HTMLDivElement>(null),
    green: useRef<HTMLDivElement>(null),
  };

  return (
    <>
      <WordmarkMoment>
        {/* Invisible anchors over the trio inside the logo artwork — the
            emerge animation starts from the logo's own squares. */}
        <LogoSquares overlay squareRefs={squareRefs} />
      </WordmarkMoment>

      <EmergeSquares squareRefs={squareRefs} landingRefs={landingRefs} />

      {/* Centered 80% column; the pin-spacer lives inside it. */}
      <div className="mx-auto w-[80%]">
        <AboutStairsSection landingRefs={landingRefs} />
      </div>
    </>
  );
}
