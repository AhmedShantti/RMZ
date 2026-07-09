"use client";

import {
  gsap,
  ScrollTrigger,
  useGSAP,
  syncScrollTriggerWithLenis,
} from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { COLORS, type SquareRefs, type StairRefs } from "./logoSquares.types";

/**
 * EmergeSquares — ONE continuous, scroll-scrubbed journey for the three brand
 * squares, from the logo down to the marquee. No opacity changes at any point:
 * each square is always fully visible; it starts perfectly overlapping its
 * square inside the logo and physically travels the whole way, sizes
 * interpolating, never fading.
 *
 * Design for "no cuts / no delay":
 *   - A SINGLE master ScrollTrigger spans logo → marquee with one `scrub`, so
 *     there are no per-phase triggers and thus no seams to jump between.
 *   - Each square follows one continuous waypoint path, sampled EVERY frame
 *     from LIVE element rects (getBoundingClientRect), so pinned sections and
 *     resizes can never introduce a stale jump — the position is always the
 *     true current layout.
 *   - Transform-only (translate + scale) on an absolute-in-<body> element, so
 *     it composites on the GPU and, past the end, simply scrolls away with the
 *     page (its last document position is on the marquee).
 *
 * The waypoints (progress 0→1):
 *   0.00  sit exactly on the logo square (same size/pos → invisible seam)
 *   0.06  pop to travel size, still on the logo (a small back-eased beat)
 *   0.30  spread into the stairs region, upper screen
 *   0.50  descend the stairs diagonal, lower screen (moves through the pin)
 *   0.66  drift point A inside "What we do"
 *   0.82  drift point B inside "What we do"
 *   1.00  settle into a centred row on the marquee
 */

type Vec = { cx: number; cy: number; size: number };
type Waypoint = { at: number; ease?: (t: number) => number; get: () => Vec };

const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Sample the continuous path at global progress p (viewport coordinates). */
function samplePath(wps: Waypoint[], p: number): Vec {
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
    size: lerp(A.size, B.size, t),
  };
}

export default function EmergeSquares({
  squareRefs,
  landingRefs,
}: {
  squareRefs: SquareRefs;
  landingRefs: StairRefs;
}) {
  useGSAP((_, contextSafe) => {
    if (prefersReducedMotion()) return;

    const cleanupLenis = syncScrollTriggerWithLenis();
    const els: HTMLElement[] = [];

    // Deferred one frame: the later-sibling section refs (stairs/teaser/
    // marquee) aren't in the DOM during this layout effect.
    const setup = contextSafe!(() => {
      const startSection =
        squareRefs.yellow.current?.closest("section") ?? null;
      const teaser = document.querySelector<HTMLElement>(
        'section[aria-label="What we do"]',
      );
      const marquee = document.querySelector<HTMLElement>(
        "[data-squares-marquee]",
      );
      // The journey needs the full home layout; bail otherwise (e.g. lab).
      if (!startSection || !teaser || !marquee) return;
      // Keep landingRefs referenced (API parity) — used to prove the stairs
      // exist between logo and teaser.
      const stairs =
        landingRefs.yellow.current?.closest(".about-stairs") ?? null;

      const back = gsap.parseEase("back.out(1.7)");
      const vw = () => window.innerWidth;
      const vh = () => window.innerHeight;
      const centerOf = (el: HTMLElement): Vec => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, size: r.width };
      };

      const paths: { el: HTMLElement; wps: Waypoint[] }[] = [];

      COLORS.forEach((color, i) => {
        const anchor = squareRefs[color].current;
        if (!anchor) return;

        const el = document.createElement("div");
        el.className = `sq sq-${color} sq-travel`;
        document.body.appendChild(el);
        gsap.set(el, {
          position: "absolute",
          top: 0,
          left: 0,
          width: 100,
          height: 100,
          transformOrigin: "50% 50%",
          zIndex: 30, // above page content, below the fixed nav (z 40)
          pointerEvents: "none",
          force3D: true,
        });
        els.push(el);

        // Per-square drift fractions inside the teaser (fixed per load).
        const fA = { x: gsap.utils.random(0.12, 0.4), y: gsap.utils.random(0.14, 0.42) };
        const fB = { x: gsap.utils.random(0.5, 0.86), y: gsap.utils.random(0.5, 0.82) };
        const rowS = 72;
        const rowGap = 28;

        const wps: Waypoint[] = [
          { at: 0.0, get: () => centerOf(anchor) },
          { at: 0.06, ease: back, get: () => ({ ...centerOf(anchor), size: 72 }) },
          { at: 0.3, get: () => ({ cx: vw() * (0.3 + 0.07 * i), cy: vh() * (0.24 + 0.05 * i), size: 118 }) },
          { at: 0.5, get: () => ({ cx: vw() * (0.36 + 0.07 * i), cy: vh() * (0.74 + 0.03 * i), size: 118 }) },
          {
            at: 0.66,
            get: () => {
              const r = teaser.getBoundingClientRect();
              return { cx: r.left + r.width * fA.x, cy: r.top + r.height * fA.y, size: 72 };
            },
          },
          {
            at: 0.82,
            get: () => {
              const r = teaser.getBoundingClientRect();
              return { cx: r.left + r.width * fB.x, cy: r.top + r.height * fB.y, size: 72 };
            },
          },
          {
            at: 1.0,
            get: () => {
              const r = marquee.getBoundingClientRect();
              const rowW = 3 * rowS + 2 * rowGap;
              const sx = r.left + r.width / 2 - rowW / 2;
              return { cx: sx + i * (rowS + rowGap) + rowS / 2, cy: r.top + r.height / 2, size: rowS };
            },
          },
        ];
        paths.push({ el, wps });
      });

      // Place every square for a given global progress (viewport → document
      // coords, transform-only).
      const place = (p: number) => {
        const sx = window.scrollX;
        const sy = window.scrollY;
        for (const { el, wps } of paths) {
          const { cx, cy, size } = samplePath(wps, p);
          gsap.set(el, {
            x: cx + sx - 50,
            y: cy + sy - 50,
            scale: size / 100,
          });
        }
      };
      place(0);

      // The one master trigger — logo entering → marquee centred.
      ScrollTrigger.create({
        trigger: startSection,
        start: "top 75%",
        endTrigger: marquee,
        end: "center center",
        scrub: 1,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      });

      // Touch `stairs` so the (optional) presence check isn't dead code.
      void stairs;
    });

    const raf = requestAnimationFrame(setup);

    return () => {
      cancelAnimationFrame(raf);
      cleanupLenis();
      els.forEach((el) => el.remove());
    };
  }, []);

  return null;
}
