"use client";

import { useRef } from "react";
import LogoSquares from "@/components/LogoSquares";
import EmergeSquares from "@/components/EmergeSquares";
import AboutStairsSection from "@/components/AboutStairsSection";
import type { SquareRefs, StairRefs } from "@/components/logoSquares.types";
import "../../logo-squares.css";

/**
 * Isolation harness for the logo-squares → emerge → stairs feature. Holds all
 * six refs (logo start points + stair end points) and wires the components
 * together. Not linked in the nav — a scratch route for building/testing the
 * animation phase by phase.
 */
export default function LogoSquaresLab() {
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
    <main>
      <section className="lab-hero">
        <LogoSquares squareRefs={squareRefs} />
      </section>

      <EmergeSquares squareRefs={squareRefs} landingRefs={landingRefs} />

      <AboutStairsSection landingRefs={landingRefs} />
    </main>
  );
}
