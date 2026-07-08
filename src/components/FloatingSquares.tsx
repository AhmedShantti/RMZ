"use client";

import { useId, useMemo } from "react";

/**
 * FloatingSquare — a single decorative brand square with ambient randomized
 * float motion. Purely decorative: absolutely positioned, sits behind content
 * (z: -1), never affects layout or blocks pointer events.
 *
 * Refactored from the old FloatingSquares (which rendered three squares as one
 * fixed cluster) into a single-square component so each square can be placed
 * independently — e.g. one on top of the form, one on the left, one on the
 * right — each floating on its own randomized loop.
 *
 * Position it by passing a `className` with the absolute offsets (top/left/…).
 */
type Color = "orange" | "green" | "yellow";

type Props = {
  /** edge length of the square in px */
  size?: number;
  /** brand color */
  color?: Color;
  /** absolute-position utilities for the wrapper, e.g. "-left-4 -top-6" */
  className?: string;
};

type FloatVars = {
  duration: number; // seconds, full loop
  delay: number; // seconds, negative so it starts mid-cycle (avoids synced start)
  driftX: number; // px
  driftY: number; // px
  rotateFrom: number; // deg
  rotateTo: number; // deg
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function randomFloat(): FloatVars {
  return {
    duration: rand(3, 6),
    delay: -rand(0, 6), // negative delay = starts partway through, so squares desync immediately
    driftX: rand(-40, 40),
    driftY: rand(-45, 45),
    rotateFrom: rand(-6, 6),
    rotateTo: rand(-6, 6),
  };
}

const COLOR_VAR: Record<Color, string> = {
  orange: "var(--acc-orange)",
  green: "var(--acc-green)",
  yellow: "var(--acc-yellow)",
};

export default function FloatingSquare({
  size = 80,
  color = "orange",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");

  // Compute once per mount, not per render, so the animation doesn't reset/jump.
  const vars = useMemo(() => randomFloat(), []);
  const name = `rmz-drift-${uid}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{
        zIndex: -1,
        width: size,
        height: size,
        
      }}
    >
      <style jsx>{`
        @keyframes ${name} {
          0%,
          100% {
            transform: translate(0px, 0px) rotate(${vars.rotateFrom}deg);
          }
          50% {
            transform: translate(${vars.driftX}px, ${vars.driftY}px)
              rotate(${vars.rotateTo}deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rmz-drift {
            animation: none !important;
          }
        }
      `}</style>

      <span
        className="rmz-drift absolute block"
        style={{
          width: size,
          height: size,
          top: 0,
          left: 0,
          backgroundColor: COLOR_VAR[color],
          animation: `${name} ${vars.duration}s ease-in-out ${vars.delay}s infinite`,
        }}
      />
    </div>
  );
}