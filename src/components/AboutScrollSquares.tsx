"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { useAboutProgress } from "./AboutAnimationContext";
import { logoSquareGap, logoSquareSize, type LogoSquareColor } from "@/lib/logoSquareSize";

/**
 * AboutScrollSquares — a scroll-driven, 7-stage animation of the three brand
 * squares (green / red / yellow), overlaid on the About page.
 *
 * Spec preferred GSAP ScrollTrigger; this project already runs Lenis smooth
 * scroll (native), so we drive it with a requestAnimationFrame loop + scroll
 * progress + lerp (the spec's allowed alternative) — lighter and integrates
 * with Lenis for free. The component is rendered as a fixed, pointer-events:none
 * overlay clipped to the viewport, so it never blocks interaction or adds
 * horizontal scroll.
 *
 * (Named AboutScrollSquares, not FloatingSquares, because that name is already
 * used by the decorative contact/careers squares.)
 *
 * Stages (interpolated 1:1 with scroll, smoothstep-eased between keyframes):
 *   1 (0%)        composed centred row, 110px, Green·Red·Yellow
 *   2 (~20%)      scatter to edges as 70px text markers
 *   3 (~34%)      cinematic collapse to an 18px centred cluster ("into the logo")
 *   4 (~45%)      large floats — yellow centre-right, red bottom-left @22°,
 *                 green off top-right
 *   5 (50→75%)    dispersed parallax float down the left, progressive tumble
 *   6 (~82%)      maximum chaos, full-width spread, max rotation
 *   7 (95→100%)   snap back to a composed centred row, 105px, Yellow·Red·Green
 *
 * prefers-reduced-motion → render Stage 1 permanently (no scroll animation).
 *
 * SIZE: the keyframe `size` values only drive the PATH (positions, and the
 * corner-pivot swing of rotated stages). What is drawn is always the shared
 * logo-square size (lib/logoSquareSize) — the same size as the squares on the
 * Home page — centred on the keyframe box's centre, so the movement is
 * unchanged.
 *
 * NOTE: KF, State, GREEN, RED, YELLOW, and sample() are exported so other
 * components can read the exact same keyframe data.
 */

export const COLORS = {
  green: "#8dc63f",
  red: "#e85d1e",
  yellow: "#fdc82f",
} as const;

export type Vec = { x: number; y: number };
export type KF = {
  at: number; // scroll progress 0..1
  size: number; // px
  rotate: number; // deg
  pos: (vw: number, vh: number) => Vec; // top-left in px
};

/** Left→right colour order of the two resting rows. */
const ROW_START: LogoSquareColor[] = ["green", "orange", "yellow"]; // stages 1 & 3
const ROW_END: LogoSquareColor[] = ["yellow", "orange", "green"]; // stage 7

/**
 * Centred horizontal row (resting states). The squares drawn in it have the
 * shared logo-square size and are spaced by the shared logo gaps (same as the
 * Home logo — lib/logoSquareSize), centred on the viewport. The keyframe `size`
 * is only the path box (see SIZE note above), so we return the top-left of a
 * `size` box whose CENTRE is where the drawn square belongs.
 */
const row = (
  vw: number,
  vh: number,
  size: number,
  order: LogoSquareColor[],
  color: LogoSquareColor,
  offsetY: number,
): Vec => {
  const sizes = order.map((c) => logoSquareSize(c, vw));
  const gaps = [logoSquareGap(order[0], order[1], vw), logoSquareGap(order[1], order[2], vw)];
  const total = sizes[0] + sizes[1] + sizes[2] + gaps[0] + gaps[1];
  const k = order.indexOf(color);
  let left = (vw - total) / 2;
  for (let i = 0; i < k; i++) left += sizes[i] + gaps[i];
  const centreX = left + sizes[k] / 2;

  return {
    x: centreX - size / 2,
    y: (vh - size) / 2 + offsetY,
  };
};

// ── Keyframes per square ──────────────────────────────────────────────────
// Order in stage 1 row: Green(0) Red(1) Yellow(2). In stage 7: Yellow(0) Red(1) Green(2).

export const GREEN: KF[] = [
  { at: 0.0, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, ROW_START, "green", 0) },
  { at: 0.111, size: 70, rotate: 0, pos: (w, h) => ({ x: w - 0.02 * w - 70, y: 0.18 * h }) },
  { at: 0.222, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, ROW_START, "green", 0) },
  { at: 0.333, size: 100, rotate: 0, pos: (w, h) => ({ x: w + 0.02 * w - 100, y: 0.05 * h }) },
  { at: 0.444, size: 95, rotate: 0, pos: (w, h) => ({ x: 0.08 * w, y: 0.08 * h }) },
  { at: 0.667, size: 100, rotate: 10, pos: (w, h) => ({ x: 0.12 * w, y: 0.05 * h }) },
  { at: 0.778, size: 110, rotate: 45, pos: (w, h) => ({ x: 0.35 * w, y: 0.08 * h }) },
  { at: 0.889, size: 105, rotate: 0, pos: (w, h) => row(w, h, 105, ROW_END, "green", -250) },
];

export const RED: KF[] = [
  { at: 0.0, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, ROW_START, "orange", 0) },
  { at: 0.111, size: 70, rotate: 0, pos: (w, h) => ({ x: 0.02 * w, y: 0.38 * h }) },
  { at: 0.222, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, ROW_START, "orange", 0) },
  { at: 0.333, size: 100, rotate: 22, pos: (w, h) => ({ x: 0.05 * w, y: 0.65 * h }) },
  { at: 0.444, size: 95, rotate: 15, pos: (w, h) => ({ x: 0.18 * w, y: 0.38 * h }) },
  { at: 0.667, size: 100, rotate: 35, pos: (w, h) => ({ x: 0.22 * w, y: 0.3 * h }) },
  { at: 0.778, size: 110, rotate: -15, pos: (w, h) => ({ x: w - 0.05 * w - 110, y: 0.35 * h }) },
  { at: 0.889, size: 105, rotate: 0, pos: (w, h) => row(w, h, 105, ROW_END, "orange", -250) },
];

export const YELLOW: KF[] = [
  { at: 0.0, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, ROW_START, "yellow", 0) },
  { at: 0.111, size: 70, rotate: 0, pos: (w, h) => ({ x: 0.02 * w, y: 0.08 * h }) },
  { at: 0.222, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, ROW_START, "yellow", 0) },
  { at: 0.333, size: 100, rotate: 0, pos: (w, h) => ({ x: w - 0.15 * w - 100, y: 0.4 * h }) },
  { at: 0.444, size: 95, rotate: 0, pos: (w, h) => ({ x: 0.03 * w, y: 0.15 * h }) },
  { at: 0.667, size: 100, rotate: 30, pos: (w, h) => ({ x: 0.05 * w, y: 0.5 * h }) },
  { at: 0.778, size: 110, rotate: 32, pos: (w, h) => ({ x: 0.3 * w, y: 0.68 * h }) },
  { at: 0.889, size: 105, rotate: 0, pos: (w, h) => row(w, h, 105, ROW_END, "yellow", -250) },
];

export type State = { x: number; y: number; size: number; rotate: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Sample a keyframe track at progress p, smoothstep-eased between keyframes. */
export function sample(kfs: KF[], p: number, vw: number, vh: number): State {
  let i = 0;
  while (i < kfs.length - 2 && p > kfs[i + 1].at) i++;
  const k0 = kfs[i];
  const k1 = kfs[i + 1];
  let t = k1.at === k0.at ? 0 : (p - k0.at) / (k1.at - k0.at);
  t = Math.max(0, Math.min(1, t));
  t = t * t * (3 - 2 * t); // smoothstep ease-in-out
  const a = k0.pos(vw, vh);
  const b = k1.pos(vw, vh);
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    size: lerp(k0.size, k1.size, t),
    rotate: lerp(k0.rotate, k1.rotate, t),
  };
}

export default function AboutScrollSquares() {
  const greenRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);

  // Hooks must always be called unconditionally, at the top level.
  const progress = useAboutProgress();

  useEffect(() => {
    // `red` is the logo's orange square.
    const pairs: [HTMLDivElement | null, KF[], LogoSquareColor][] = [
      [greenRef.current, GREEN, "green"],
      [redRef.current, RED, "orange"],
      [yellowRef.current, YELLOW, "yellow"],
    ];

    // Transform-only (translate + scale + rotate) so the browser composites on
    // the GPU — no per-frame layout/paint (animating width/height would thrash
    // layout and stutter the smooth scroll). Base size is 100px; scale to size.
    const write = (el: HTMLDivElement | null, s: State, edge: number) => {
      if (!el) return;
      // Centre of the original keyframe box (which pivoted about its top-left
      // corner), then draw the fixed-size square around that same centre.
      const half = s.size / 2;
      const rad = (s.rotate * Math.PI) / 180;
      const cx = s.x + half * (Math.cos(rad) - Math.sin(rad));
      const cy = s.y + half * (Math.sin(rad) + Math.cos(rad));
      el.style.transform = `translate3d(${cx - 50}px, ${cy - 50}px, 0) scale(${edge / 100}) rotate(${s.rotate}deg)`;
    };

    const render = (p: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      for (const [el, kfs, color] of pairs) write(el, sample(kfs, p, vw, vh), logoSquareSize(color, vw));
    };

    // Reduced motion → lock to Stage 1, update only on resize.
    if (prefersReducedMotion()) {
      render(0);
      const onResize = () => render(0);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    render(progress);
  }, [progress]);

  const base: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    transformOrigin: "50% 50%",
    borderRadius: 0,
    willChange: "transform",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      // Behind the section content (sections are z-index 1), above the page
      // background. Blur lives on each square (cheaper than blurring the whole
      // fixed layer every frame).
      style={{ zIndex: -1 }}
    >
      <div
        ref={greenRef}
        className="square-green"
        style={{ ...base, backgroundColor: COLORS.green }}
      />
      <div
        ref={redRef}
        className="square-red"
        style={{ ...base, backgroundColor: COLORS.red }}
      />
      <div
        ref={yellowRef}
        className="square-yellow"
        style={{ ...base, backgroundColor: COLORS.yellow }}
      />
    </div>
  );
}