"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { useAboutProgress } from "./AboutAnimationContext";

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
 * NOTE: KF, State, GREEN, RED, YELLOW, and sample() are exported so other
 * components (e.g. ColorPaletteSection) can read the exact same keyframe
 * data and position themselves relative to the real square positions at any
 * given scroll progress, instead of duplicating/guessing positions.
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

/** Centred horizontal row helper (resting states). */
const row = (
  vw: number,
  vh: number,
  size: number,
  gap: number,
  index: number,
): Vec => {
  const total = 3 * size + 2 * gap;
  const startX = (vw - total) / 2;
  return { x: startX + index * (size + gap), y: (vh - size) / 2 };
};

// ── Keyframes per square ──────────────────────────────────────────────────
// Order in stage 1 row: Green(0) Red(1) Yellow(2). In stage 7: Yellow(0) Red(1) Green(2).

export const GREEN: KF[] = [
  { at: 0.0, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, 20, 0) },
  { at: 0.111, size: 70, rotate: 0, pos: (w, h) => ({ x: w - 0.02 * w - 70, y: 0.18 * h }) },
  { at: 0.222, size: 18, rotate: 0, pos: (w, h) => row(w, h, 18, 6, 0) },
  { at: 0.333, size: 100, rotate: 0, pos: (w, h) => ({ x: w + 0.02 * w - 100, y: 0.05 * h }) },
  { at: 0.444, size: 95, rotate: 0, pos: (w, h) => ({ x: 0.08 * w, y: 0.08 * h }) },
  { at: 0.667, size: 100, rotate: 10, pos: (w, h) => ({ x: 0.12 * w, y: 0.05 * h }) },
  { at: 0.778, size: 110, rotate: 45, pos: (w, h) => ({ x: 0.35 * w, y: 0.08 * h }) },
  { at: 0.889, size: 105, rotate: 0, pos: (w, h) => row(w, h, 105, 20, 2) },
];

export const RED: KF[] = [
  { at: 0.0, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, 20, 1) },
  { at: 0.111, size: 70, rotate: 0, pos: (w, h) => ({ x: 0.02 * w, y: 0.38 * h }) },
  { at: 0.222, size: 18, rotate: 0, pos: (w, h) => row(w, h, 18, 6, 1) },
  { at: 0.333, size: 100, rotate: 22, pos: (w, h) => ({ x: 0.05 * w, y: 0.65 * h }) },
  { at: 0.444, size: 95, rotate: 15, pos: (w, h) => ({ x: 0.18 * w, y: 0.38 * h }) },
  { at: 0.667, size: 100, rotate: 35, pos: (w, h) => ({ x: 0.22 * w, y: 0.3 * h }) },
  { at: 0.778, size: 110, rotate: -15, pos: (w, h) => ({ x: w - 0.05 * w - 110, y: 0.35 * h }) },
  { at: 0.889, size: 105, rotate: 0, pos: (w, h) => row(w, h, 105, 20, 1) },
];

export const YELLOW: KF[] = [
  { at: 0.0, size: 110, rotate: 0, pos: (w, h) => row(w, h, 110, 20, 2) },
  { at: 0.111, size: 70, rotate: 0, pos: (w, h) => ({ x: 0.02 * w, y: 0.08 * h }) },
  { at: 0.222, size: 18, rotate: 0, pos: (w, h) => row(w, h, 18, 6, 2) },
  { at: 0.333, size: 100, rotate: 0, pos: (w, h) => ({ x: w - 0.15 * w - 100, y: 0.4 * h }) },
  { at: 0.444, size: 95, rotate: 0, pos: (w, h) => ({ x: 0.03 * w, y: 0.15 * h }) },
  { at: 0.667, size: 100, rotate: 30, pos: (w, h) => ({ x: 0.05 * w, y: 0.5 * h }) },
  { at: 0.778, size: 110, rotate: 32, pos: (w, h) => ({ x: 0.3 * w, y: 0.68 * h }) },
  { at: 0.889, size: 105, rotate: 0, pos: (w, h) => row(w, h, 105, 20, 0) },
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
    const pairs: [HTMLDivElement | null, KF[]][] = [
      [greenRef.current, GREEN],
      [redRef.current, RED],
      [yellowRef.current, YELLOW],
    ];

    // Transform-only (translate + scale + rotate) so the browser composites on
    // the GPU — no per-frame layout/paint (animating width/height would thrash
    // layout and stutter the smooth scroll). Base size is 100px; scale to size.
    const write = (el: HTMLDivElement | null, s: State) => {
      if (!el) return;
      el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) scale(${s.size / 100}) rotate(${s.rotate}deg)`;
    };

    const render = (p: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      for (const [el, kfs] of pairs) write(el, sample(kfs, p, vw, vh));
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
    transformOrigin: "0 0",
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
      style={{ zIndex: 0 }}
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