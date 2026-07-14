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
 * squares, from the logo down to the marquee. No opacity changes at any point
 * on the MAIN travel element: each square is always fully visible on its
 * primary layer; it starts perfectly overlapping its square inside the logo
 * and physically travels the whole way, sizes interpolating, never fading —
 * EXCEPT for a single, deliberate cross-fade handoff to an in-teaser
 * "floater" element while it drifts behind that section's text (see
 * "Floater handoff" below), after which it fades back to the main layer for
 * the marquee leg.
 *
 * Design for "no cuts / no delay":
 *   - A SINGLE master ScrollTrigger spans logo → marquee with one `scrub`, so
 *     there are no per-phase triggers and thus no seams to jump between.
 *   - Each square follows one continuous waypoint path, sampled EVERY frame
 *     from LIVE element rects (getBoundingClientRect), so pinned sections and
 *     resizes can never introduce a stale jump — the position is always the
 *     true current layout.
 *   - Transform-only (translate + scale) on an absolute-in-<body> element, so
 *     it composites on the GPU and, past the end, simply scrolls away with
 *     the page (its last document position is on the marquee).
 *   - All per-frame writes go through gsap.quickSetter instead of gsap.set,
 *     since quickSetter skips tween-instance creation entirely — this is the
 *     dominant cost when a function runs on every scroll tick.
 *
 * The waypoints (progress 0→1) — see PHASE below for the canonical values,
 * shared between the interpolation path (`wps`) and the scroll→phase mapping
 * (`buildCheckpoints`) so the two can never drift out of sync:
 *   LAUNCH  sit exactly on the logo square (same size/pos → invisible seam)
 *   POP     pop to travel size, still on the logo (a small back-eased beat)
 *   LAND    LAND on the matching stair slot — the square becomes that card
 *   LEAVE   still glued to the slot, so it rides the deck as a card, then lifts
 *   DRIFT_A drift point A inside "What we do" (floater layer, under text)
 *   DRIFT_B drift point B inside "What we do" (floater layer, under text)
 *   END     settle into a centred row on the marquee (main layer again)
 *
 * Floater handoff:
 *   The teaser squares must sit UNDER its content. A body-level element can't
 *   (it's above the whole content column), so the teaser leg hands off to an
 *   in-section floater at z-index:-1 (isolation:isolate on the section keeps
 *   it behind the text but above the section's transparent backdrop). The
 *   main element cross-fades out and the floater cross-fades in just before
 *   DRIFT_A, and the reverse happens just after DRIFT_B, so the visible
 *   square is always exactly one element at a time — no double-draw, no gap.
 */

type Vec = { cx: number; cy: number; w: number; h: number };
type Waypoint = { at: number; ease?: (t: number) => number; get: () => Vec };

// Canonical phase values — used by BOTH the interpolation waypoints and the
// scroll-position checkpoints, so the two mappings can never fall out of
// sync (previously these were separately hardcoded in two places).
const PHASE = {
  LAUNCH: 0,
  POP: 0.06,
  LAND: 0.22,
  LEAVE: 0.55,
  DRIFT_A: 0.66,
  DRIFT_B: 0.82,
  END: 1,
} as const;

// Cross-fade window around the teaser drift, kept slightly inside
// LEAVE→DRIFT_A and DRIFT_B→END so the swap completes before/after the
// drift points themselves.
const HANDOFF = {
  TO_FLOATER_START: 0.56,
  TO_FLOATER_END: 0.63,
  TO_MAIN_START: 0.80,
  TO_MAIN_END: 0.87,
} as const;

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

type Frac = { x: number; y: number };

type QuickSetters = {
  x: (v: number) => void;
  y: (v: number) => void;
  scaleX: (v: number) => void;
  scaleY: (v: number) => void;
  rotationX: (v: number) => void;
  autoAlpha: (v: number) => void;
};

type PathEntry = {
  el: HTMLElement;
  floater: HTMLElement;
  wps: Waypoint[];
  slotRef: { current: HTMLDivElement | null };
  fA: Frac;
  fB: Frac;
  qsEl: QuickSetters;
  qsFloater: Pick<QuickSetters, "x" | "y" | "scaleX" | "scaleY" | "autoAlpha">;
  // Idle-float state for the "What we do" leg (see place()/idleTick). The
  // floater drifts organically here — independent of scroll — instead of
  // interpolating along the scroll path. Amplitudes/periods differ per square
  // (and per axis) so no two move in sync.
  idleActive: boolean;
  idleStart: number; // seconds (performance.now), when the idle drift began
  baseX: number; // local x the drift oscillates around (tracks the live path)
  baseY: number;
  idleEnv: number; // 0..1 envelope — tapers the wobble to 0 at the window edges
  ampX: number;
  ampY: number;
  periodX: number; // seconds
  periodY: number;
};

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
    // Lower-cost variant for small screens: skip the 3D flip and shrink
    // the floater cross-fade window slightly (cheaper compositing, no
    // perspective layer). The translate/scale journey itself is unchanged
    // so the animation stays fully intact on mobile, just lighter.
    const isCompact = window.matchMedia("(max-width: 767px)").matches;

    let scrollTriggerInstance: ScrollTrigger | null = null;
    let idleTickRef: (() => void) | null = null;

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

      // The teaser floater needs a positioned containing block to lay out
      // against; without this it would resolve against whatever positioned
      // ancestor happens to exist further up the tree, silently breaking
      // the local-coordinate math below.
      if (getComputedStyle(teaser).position === "static") {
        teaser.style.position = "relative";
      }
      // The teaser squares must sit UNDER its content. A body-level element
      // can't (it's above the whole content column), so the teaser leg uses
      // an in-section floater at z-index:-1; isolate keeps it behind the
      // text but above the section's transparent backdrop.
      teaser.style.isolation = "isolate";

      const paths: PathEntry[] = [];

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
          autoAlpha: 1,
          // Flip-to-reveal: once the square lands on its card it rotates past
          // 90°; with the backface hidden it vanishes and the card photo
          // underneath shows through.
          backfaceVisibility: "hidden",
          transformPerspective: isCompact ? 0 : 700,
        });
        els.push(el);

        // In-teaser floater (z-index:-1, under the text) for the teaser leg.
        // Starts invisible; cross-fades in only while the square drifts
        // through the teaser, then cross-fades back out.
        const floater = document.createElement("div");
        floater.className = `sq sq-${color} sq-travel`;
        teaser.insertBefore(floater, teaser.firstChild);
        gsap.set(floater, {
          position: "absolute",
          top: 0,
          left: 0,
          width: 72,
          height: 72,
          zIndex: -1,
          pointerEvents: "none",
          autoAlpha: 0,
        });
        els.push(floater);

        // The stair slot this square lands on / becomes (yellow→1, orange→2,
        // green→3), matching LogoSquares / AboutStairsSection.
        const slotRef = landingRefs[color];
        // Per-square drift fractions inside the teaser (fixed per load).
        const fA = { x: gsap.utils.random(0.12, 0.4), y: gsap.utils.random(0.14, 0.42) };
        const fB = { x: gsap.utils.random(0.5, 0.86), y: gsap.utils.random(0.5, 0.82) };
        // Final marquee-card size — MUST match Marquee.tsx's StoryCard (w×h).
        const cardW = 180;
        const cardH = 240;
        const cardGap = 24;

        const wps: Waypoint[] = [
          { at: PHASE.LAUNCH, get: () => centerOf(anchor) },
          { at: PHASE.POP, ease: back, get: () => ({ ...centerOf(anchor), w: 72, h: 72 }) },
          // Land ON the stair slot and stay glued to it — the square IS the
          // card, riding the deck as it animates through the pin.
          { at: PHASE.LAND, get: () => slotOf(slotRef) },
          { at: PHASE.LEAVE, get: () => slotOf(slotRef) },
          {
            at: PHASE.DRIFT_A,
            get: () => {
              const r = teaser.getBoundingClientRect();
              return { cx: r.left + r.width * fA.x, cy: r.top + r.height * fA.y, w: 72, h: 72 };
            },
          },
          {
            at: PHASE.DRIFT_B,
            get: () => {
              const r = teaser.getBoundingClientRect();
              return { cx: r.left + r.width * fB.x, cy: r.top + r.height * fB.y, w: 72, h: 72 };
            },
          },
          // Morph into a portrait card (aspect 3/4) and settle onto the
          // marquee's card row — one square per card colour.
          {
            at: PHASE.END,
            get: () => {
              const r = marquee.getBoundingClientRect();
              const rowW = 3 * cardW + 2 * cardGap;
              const sx = r.left + r.width / 2 - rowW / 2;
              return {
                cx: sx + i * (cardW + cardGap) + cardW / 2,
                cy: r.top + r.height / 2,
                w: cardW,
                h: cardH,
              };
            },
          },
        ];

        // quickSetter per numeric property: this is the dominant perf win
        // for a function called on every scroll tick — it bypasses GSAP's
        // tween-instance creation that gsap.set() incurs each call.
        const qsEl: QuickSetters = {
          x: gsap.quickSetter(el, "x", "px") as (v: number) => void,
          y: gsap.quickSetter(el, "y", "px") as (v: number) => void,
          scaleX: gsap.quickSetter(el, "scaleX") as (v: number) => void,
          scaleY: gsap.quickSetter(el, "scaleY") as (v: number) => void,
          rotationX: gsap.quickSetter(el, "rotationX", "deg") as (v: number) => void,
          // "opacity" (quickSetter doesn't support the virtual "autoAlpha").
          autoAlpha: gsap.quickSetter(el, "opacity") as (v: number) => void,
        };
        const qsFloater = {
          x: gsap.quickSetter(floater, "x", "px") as (v: number) => void,
          y: gsap.quickSetter(floater, "y", "px") as (v: number) => void,
          scaleX: gsap.quickSetter(floater, "scaleX") as (v: number) => void,
          scaleY: gsap.quickSetter(floater, "scaleY") as (v: number) => void,
          autoAlpha: gsap.quickSetter(floater, "opacity") as (v: number) => void,
        };

        paths.push({
          el,
          floater,
          wps,
          slotRef,
          fA,
          fB,
          qsEl,
          qsFloater,
          idleActive: false,
          idleStart: 0,
          baseX: 0,
          baseY: 0,
          idleEnv: 0,
          // Desynced organic drift — different amplitude/period per square and
          // per axis (X≠Y makes it a Lissajous-ish path, not a straight line).
          // Amplitudes are large enough to read as clear floating; periods stay
          // slow so the velocity is gentle and the motion never feels jittery.
          ampX: gsap.utils.random(48, 84),
          ampY: gsap.utils.random(44, 78),
          periodX: gsap.utils.random(5, 8),
          periodY: gsap.utils.random(5.5, 8.5),
        });
      });

      // Place every square for a given path phase (viewport → document
      // coords, transform-only). The traveling square travels and, on
      // arrival at its stair card, hands off (shrinks out) to that card's
      // cover, which does the flip (AboutStairsSection) — so every card
      // reveals its photo with the same deck-driven flip. The teaser leg
      // cross-fades to an in-section floater at z-index:-1 so it sits under
      // the content, then cross-fades back for the marquee leg.
      const place = (phase: number) => {
        const sx = window.scrollX;
        const sy = window.scrollY;
        const vhHalf = window.innerHeight / 2;

        // Read the two shared rects ONCE per frame instead of once per
        // square (previously each square independently re-read these).
        const teaserRect = teaser.getBoundingClientRect();

        // Cross-fade amount: 0 = fully on main layer, 1 = fully on floater.
        const toFloater = smoothstep(
          (phase - HANDOFF.TO_FLOATER_START) /
            (HANDOFF.TO_FLOATER_END - HANDOFF.TO_FLOATER_START),
        );
        const toMain = smoothstep(
          (phase - HANDOFF.TO_MAIN_START) /
            (HANDOFF.TO_MAIN_END - HANDOFF.TO_MAIN_START),
        );
        // 0 while on main layer both before and after the teaser, 1 while
        // fully handed off to the floater in between.
        const floaterAmt = Math.min(1, Math.max(0, toFloater - toMain));

        // End: once the square has morphed into its portrait card on the
        // marquee row, dissolve it out — the marquee's identical colour card
        // is scrolling underneath, so the square "becomes" the marquee card.
        const endFade = smoothstep((phase - 0.94) / 0.06);

        // While fully handed off to the floater (between the two cross-fades),
        // the floater IDLE-drifts instead of tracking the scroll path.
        const inIdle =
          phase >= HANDOFF.TO_FLOATER_END && phase <= HANDOFF.TO_MAIN_END;
        // Taper the wobble to 0 at both edges of the idle window so the drift
        // offset is gone by the time control hands back to path-tracking —
        // no snap in either scroll direction. (PAD sits inside the cross-fades.)
        const IDLE_PAD = 0.04;
        const idleEnv = Math.min(
          smoothstep((phase - HANDOFF.TO_FLOATER_END) / IDLE_PAD),
          smoothstep((HANDOFF.TO_MAIN_END - phase) / IDLE_PAD),
        );

        for (const p of paths) {
          const { wps, slotRef, qsEl, qsFloater } = p;
          const { cx, cy, w, h } = samplePath(wps, phase);

          let rotationX = 0;
          if (!isCompact && phase < 0.57) {
            const slot = slotRef.current;
            if (slot) {
              const r = slot.getBoundingClientRect();
              const dist = Math.abs(r.top + r.height / 2 - vhHalf);
              const prox = smoothstep(1 - dist / (window.innerHeight * 0.4));
              rotationX = -180 * prox; // negative = bottom edge rises (down→up)
            }
          }

          // Main (body-level) layer — always positioned along the path so
          // there's no jump if floaterAmt snaps back to 0 mid-frame.
          qsEl.x(cx + sx - 50);
          qsEl.y(cy + sy - 50);
          qsEl.scaleX(w / 100);
          qsEl.scaleY(h / 100);
          qsEl.rotationX(rotationX);
          qsEl.autoAlpha((1 - floaterAmt) * (1 - endFade));

          // Floater (teaser-local) layer — only meaningfully visible during
          // the teaser drift; positioned relative to the teaser's own box.
          const localX = cx - teaserRect.left - 36;
          const localY = cy - teaserRect.top - 36;
          if (floaterAmt <= 0) {
            if (p.idleActive) p.idleActive = false;
          } else if (inIdle) {
            // Idle drift owns the floater's x/y (written by idleTick, so it
            // keeps moving even when the scroll is paused). The drift centre
            // tracks the LIVE path position every frame — direction-agnostic,
            // so entering the leg from either end centres on the right spot —
            // and idleTick adds an enveloped sine wobble on top.
            if (!p.idleActive) {
              p.idleActive = true;
              p.idleStart = performance.now() / 1000;
            }
            p.baseX = localX;
            p.baseY = localY;
            p.idleEnv = idleEnv;
            qsFloater.scaleX(w / 72);
            qsFloater.scaleY(h / 72);
          } else {
            // Cross-fade windows (handoff in/out): track the scroll path so the
            // swap with the main layer is position-matched.
            if (p.idleActive) p.idleActive = false;
            qsFloater.x(localX);
            qsFloater.y(localY);
            qsFloater.scaleX(w / 72);
            qsFloater.scaleY(h / 72);
          }
          qsFloater.autoAlpha(floaterAmt);
        }
      };

      // Idle drift: runs EVERY frame (independent of scroll) so the floaters
      // keep breathing even when the user pauses. Only touches floaters whose
      // path has flagged idleActive; each drifts on two desynced sine waves
      // around the centre captured when idle began (so it starts from rest,
      // no snap). Killed cleanly by place() when the leg is left, and on
      // refresh (below) so the drift centre is remeasured after a resize.
      const idleTick = () => {
        const t = performance.now() / 1000;
        for (const p of paths) {
          if (!p.idleActive) continue;
          const dt = t - p.idleStart;
          p.qsFloater.x(
            p.baseX + p.idleEnv * p.ampX * Math.sin((2 * Math.PI * dt) / p.periodX),
          );
          p.qsFloater.y(
            p.baseY + p.idleEnv * p.ampY * Math.sin((2 * Math.PI * dt) / p.periodY),
          );
        }
      };
      gsap.ticker.add(idleTick);
      idleTickRef = idleTick;

      // Section-aligned phase: the raw scroll→progress mapping is warped by
      // the stairs PIN (it swallows a big band of scroll at one point),
      // which made the "What we do" drift race past. So map the path phase
      // to the REAL scroll positions of each section (measured live, pin
      // included), giving every leg a speed that matches actually scrolling
      // through it. Phase values here are the SAME PHASE constants used by
      // the waypoints above, so the two can't drift out of sync.
      const stairsEl =
        landingRefs.yellow.current?.closest<HTMLElement>(".about-stairs") ?? null;
      let cp: [number, number][] = [];
      const buildCheckpoints = () => {
        const vh = window.innerHeight;
        const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
        const tTop = docTop(teaser);
        // Phase LAUNCH = the logo centred in the viewport (its section
        // centres the logo, so the section's centre is the logo's centre).
        // Before this the squares sit on the logo; the journey launches
        // exactly at centre.
        const logoCentered =
          docTop(startSection) + startSection.offsetHeight / 2 - vh / 2;
        const pts: [number, number][] = [
          [logoCentered, PHASE.LAUNCH],
          [(stairsEl ? docTop(stairsEl) : tTop) - 0.15 * vh, PHASE.LAND],
          [tTop - vh, PHASE.LEAVE], // stairs done, teaser entering (spans the pin)
          [tTop + teaser.offsetHeight / 2 - vh / 2, 0.74], // teaser centred (drift)
          [docTop(marquee) + marquee.offsetHeight / 2 - vh / 2, PHASE.END],
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
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: startSection,
        // Track from when the logo enters (so it sits on the logo before
        // centre); phaseAt clamps to 0 until the logo is centred.
        start: "top bottom",
        endTrigger: marquee,
        end: "center center",
        onUpdate: (self) => place(phaseAt(self.scroll())),
        onRefresh: (self) => {
          buildCheckpoints();
          // Drop any idle drift so its centre is re-captured against the new
          // layout on the next frame (resize-safe).
          paths.forEach((p) => (p.idleActive = false));
          place(phaseAt(self.scroll()));
        },
      });

      // Layout can still shift after this first measurement (web fonts
      // swapping in, lazily-loaded hero/teaser images resolving their
      // intrinsic size) — refresh once those settle so the checkpoints
      // don't stay stale until the next manual resize.
      document.fonts?.ready?.then(() => scrollTriggerInstance?.refresh());
      window.addEventListener(
        "load",
        () => scrollTriggerInstance?.refresh(),
        { once: true },
      );
    });

    const raf = requestAnimationFrame(setup);

    return () => {
      cancelAnimationFrame(raf);
      cleanupLenis();
      if (idleTickRef) gsap.ticker.remove(idleTickRef);
      scrollTriggerInstance?.kill();
      els.forEach((el) => el.remove());
    };
  }, []);

  return null;
}