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
 *   0.22  LAND on the matching stair slot — the square becomes that card
 *   0.55  still glued to the slot, so it rides the deck as a card, then lifts
 *   0.66  drift point A inside "What we do"
 *   0.82  drift point B inside "What we do"
 *   1.00  settle into a centred row on the marquee
 */

type Vec = { cx: number; cy: number; w: number; h: number };
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
    w: lerp(A.w, B.w, t),
    h: lerp(A.h, B.h, t),
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

      const back = gsap.parseEase("back.out(1.7)");
      // A square's own footprint (viewport centre + width/height as a square).
      const centerOf = (el: HTMLElement): Vec => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.width };
      };
      // A stair slot's footprint (portrait card — the square fills it exactly).
      const slotOf = (ref: { current: HTMLElement | null }): Vec => {
        const el = ref.current;
        if (!el) return { cx: 0, cy: 0, w: 72, h: 72 };
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height };
      };

      type Frac = { x: number; y: number };
      const paths: {
        el: HTMLElement;
        wps: Waypoint[];
        slotRef: { current: HTMLDivElement | null };
        floater: HTMLElement;
        fA: Frac;
        fB: Frac;
      }[] = [];

      // The teaser squares must sit UNDER its content. A body-level element
      // can't (it's above the whole content column), so the teaser leg uses an
      // in-section floater at z-index:-1; isolate keeps it behind the text but
      // above the section's transparent backdrop.
      teaser.style.isolation = "isolate";

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
          // Flip-to-reveal: once the square lands on its card it rotates past
          // 90°; with the backface hidden it vanishes and the card photo
          // underneath shows through.
          backfaceVisibility: "hidden",
        });
        els.push(el);

        // In-teaser floater (z-index:-1, under the text) for the teaser leg.
        const floater = document.createElement("div");
        floater.className = `sq sq-${color} sq-travel`;
        teaser.appendChild(floater);
        gsap.set(floater, {
          position: "absolute",
          top: 0,
          left: 0,
          width: 72,
          height: 72,
          zIndex: -1,
          pointerEvents: "none",
          scale: 0,
        });
        els.push(floater);

        // The stair slot this square lands on / becomes (yellow→1, orange→2,
        // green→3), matching LogoSquares / AboutStairsSection.
        const slotRef = landingRefs[color];
        // Per-square drift fractions inside the teaser (fixed per load).
        const fA = { x: gsap.utils.random(0.12, 0.4), y: gsap.utils.random(0.14, 0.42) };
        const fB = { x: gsap.utils.random(0.5, 0.86), y: gsap.utils.random(0.5, 0.82) };
        const rowS = 72;
        const rowGap = 28;

        const wps: Waypoint[] = [
          { at: 0.0, get: () => centerOf(anchor) },
          { at: 0.06, ease: back, get: () => ({ ...centerOf(anchor), w: 72, h: 72 }) },
          // Land ON the stair slot and stay glued to it — the square IS the
          // card, riding the deck as it animates through the pin.
          { at: 0.22, get: () => slotOf(slotRef) },
          { at: 0.55, get: () => slotOf(slotRef) },
          {
            at: 0.66,
            get: () => {
              const r = teaser.getBoundingClientRect();
              return { cx: r.left + r.width * fA.x, cy: r.top + r.height * fA.y, w: 72, h: 72 };
            },
          },
          {
            at: 0.82,
            get: () => {
              const r = teaser.getBoundingClientRect();
              return { cx: r.left + r.width * fB.x, cy: r.top + r.height * fB.y, w: 72, h: 72 };
            },
          },
          {
            at: 1.0,
            get: () => {
              const r = marquee.getBoundingClientRect();
              const rowW = 3 * rowS + 2 * rowGap;
              const sx = r.left + r.width / 2 - rowW / 2;
              return { cx: sx + i * (rowS + rowGap) + rowS / 2, cy: r.top + r.height / 2, w: rowS, h: rowS };
            },
          },
        ];
        paths.push({ el, wps, slotRef, floater, fA, fB });
      });

      // Place every square for a given path phase (viewport → document coords,
      // transform-only). The traveling square travels and, on arrival at its
      // stair card, hands off (shrinks out) to that card's cover, which does
      // the flip (AboutStairsSection) — so every card reveals its photo with
      // the same deck-driven flip. The teaser leg is an in-section floater at
      // z-index:-1 so it sits under the content.
      const place = (phase: number) => {
        const sx = window.scrollX;
        const sy = window.scrollY;
        // Hand-off: full while travelling to the card, shrunk out once landed
        // (the card cover takes over from here on).
        const landed = smoothstep((phase - 0.22) / 0.05);
        const bodyScale = 1 - landed;
        // Teaser floater: visible only across the "What we do" drift.
        const teaserAmt =
          smoothstep((phase - 0.58) / 0.04) - smoothstep((phase - 0.86) / 0.04);
        const tw = teaser.offsetWidth;
        const th = teaser.offsetHeight;
        const dt = Math.min(1, Math.max(0, (phase - 0.62) / 0.24)); // fA→fB
        for (const { el, wps, floater, fA, fB } of paths) {
          const { cx, cy, w, h } = samplePath(wps, phase);
          gsap.set(el, {
            x: cx + sx - 50,
            y: cy + sy - 50,
            scaleX: (w / 100) * bodyScale,
            scaleY: (h / 100) * bodyScale,
          });
          const fx = fA.x + (fB.x - fA.x) * dt;
          const fy = fA.y + (fB.y - fA.y) * dt;
          gsap.set(floater, {
            left: fx * tw - 36,
            top: fy * th - 36,
            scale: teaserAmt,
          });
        }
      };

      // Section-aligned phase: the raw scroll→progress mapping is warped by the
      // stairs PIN (it swallows a big band of scroll at one point), which made
      // the "What we do" drift race past. So map the path phase to the REAL
      // scroll positions of each section (measured live, pin included), giving
      // every leg a speed that matches actually scrolling through it. Phase
      // values here mirror the waypoint `at`s above.
      const stairsEl =
        landingRefs.yellow.current?.closest<HTMLElement>(".about-stairs") ?? null;
      let cp: [number, number][] = [];
      const buildCheckpoints = () => {
        const vh = window.innerHeight;
        const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
        const tTop = docTop(teaser);
        // Phase 0 = the logo centred in the viewport (its section centres the
        // logo, so the section's centre is the logo's centre). Before this the
        // squares sit on the logo; the journey launches exactly at centre.
        const logoCentered =
          docTop(startSection) + startSection.offsetHeight / 2 - vh / 2;
        const pts: [number, number][] = [
          [logoCentered, 0.0], // logo centred → launch
          [(stairsEl ? docTop(stairsEl) : tTop) - 0.15 * vh, 0.22], // land on cards
          [tTop - vh, 0.55], // stairs done, teaser entering (spans the pin)
          [tTop + teaser.offsetHeight / 2 - vh / 2, 0.74], // teaser centred (drift)
          [docTop(marquee) + marquee.offsetHeight / 2 - vh / 2, 1.0], // marquee centred
        ];
        // Keep scroll values strictly increasing so the piecewise map is sane.
        for (let k = 1; k < pts.length; k++) {
          if (pts[k][0] <= pts[k - 1][0]) pts[k][0] = pts[k - 1][0] + 1;
        }
        cp = pts;
      };
      const phaseAt = (y: number) => {
        if (!cp.length) return 0;
        if (y <= cp[0][0]) return cp[0][1];
        const last = cp[cp.length - 1];
        if (y >= last[0]) return last[1];
        for (let k = 0; k < cp.length - 1; k++) {
          const [ya, pa] = cp[k];
          const [yb, pb] = cp[k + 1];
          if (y <= yb) return pa + (pb - pa) * ((y - ya) / (yb - ya));
        }
        return last[1];
      };

      buildCheckpoints();
      place(phaseAt(window.scrollY));

      // One trigger spans the journey; onUpdate maps live scroll → phase.
      ScrollTrigger.create({
        trigger: startSection,
        // Track from when the logo enters (so it sits on the logo before
        // centre); phaseAt clamps to 0 until the logo is centred.
        start: "top bottom",
        endTrigger: marquee,
        end: "center center",
        onUpdate: (self) => place(phaseAt(self.scroll())),
        onRefresh: (self) => {
          buildCheckpoints();
          place(phaseAt(self.scroll()));
        },
      });
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
