"use client";

import {
  gsap,
  ScrollTrigger,
  useGSAP,
  syncScrollTriggerWithLenis,
} from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { COLORS, type SquareRefs, type StairRefs } from "./logoSquares.types";
import {
  PHASE,
  HANDOFF,
  smoothstep,
  samplePath,
  type Vec,
  type Waypoint,
} from "./logoSquaresPath";

/**
 * EmergeSquares — ONE continuous, scroll-scrubbed journey for the three brand
 * squares, from the logo down into the "What we do" section, where each one
 * settles into a permanent floater that drifts forever behind the section's
 * text. No opacity changes at any point on the MAIN travel element: each
 * square is always fully visible on its primary layer; it starts perfectly
 * overlapping its square inside the logo and physically travels the whole
 * way, sizes interpolating, never fading — EXCEPT for a single, one-way
 * cross-fade handoff to an in-section "floater" element once it arrives at
 * its resting cell (see "Floater handoff" below). There is no return leg:
 * the floater is the journey's destination.
 *
 * Design for "no cuts / no delay":
 *   - A SINGLE master ScrollTrigger spans logo → "What we do", so there are
 *     no per-phase triggers and thus no seams to jump between.
 *   - Each square follows one continuous waypoint path, sampled EVERY frame
 *     from LIVE element rects (getBoundingClientRect), so pinned sections and
 *     resizes can never introduce a stale jump — the position is always the
 *     true current layout.
 *   - Transform-only (translate + scale) on an absolute-in-<body> element, so
 *     it composites on the GPU.
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
 *   HOME    arrive at a fixed random resting cell inside "What we do" —
 *           the journey's end
 *
 * Floater handoff:
 *   The squares must sit UNDER the section's content. A body-level element
 *   can't (it's above the whole content column), so once a square nears its
 *   HOME cell it hands off to an in-section floater at z-index:-1
 *   (isolation:isolate on the section keeps it behind the text but above the
 *   section's transparent backdrop). The main element cross-fades out and
 *   the floater cross-fades in as HOME approaches; from then on the floater
 *   idles in place forever — independent of further scroll — via a per-square
 *   desynced sine-wave drift (see idleTick), instead of fading back out.
 */

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
  // Fixed random resting cell inside "What we do" — this square's permanent
  // home once it arrives (picked once per load, not re-rolled on refresh).
  home: Frac;
  qsEl: QuickSetters;
  qsFloater: Pick<QuickSetters, "x" | "y" | "scaleX" | "scaleY" | "autoAlpha">;
  // Idle-float state for the resting floater. Once a square arrives it
  // drifts organically here forever — independent of scroll — instead of
  // interpolating along the scroll path. Amplitudes/periods differ per
  // square (and per axis) so no two move in sync.
  idleActive: boolean;
  idleStart: number; // seconds (performance.now), when the idle drift began
  baseX: number; // local x the drift oscillates around (tracks the live path)
  baseY: number;
  idleEnv: number; // 0..1 envelope — ramps the wobble in, then stays at 1
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
    // Lower-cost variant for small screens: skip the 3D flip (cheaper
    // compositing, no perspective layer). The translate/scale journey itself
    // is unchanged so the animation stays fully intact on mobile, just lighter.
    const isCompact = window.matchMedia("(max-width: 767px)").matches;

    let scrollTriggerInstance: ScrollTrigger | null = null;
    let idleTickRef: (() => void) | null = null;

    // Deferred one frame: the later-sibling section refs (stairs/teaser)
    // aren't in the DOM during this layout effect.
    const setup = contextSafe!(() => {
      const startSection =
        squareRefs.yellow.current?.closest("section") ?? null;
      const teaser = document.querySelector<HTMLElement>(
        'section[aria-label="What we do"]',
      );
      // The z-index:-1 float layer lives in the page's content wrapper so it
      // paints behind EVERY section's content (teaser, clients, video) but
      // above the gradient — no per-section reparenting needed.
      const stage = document.querySelector<HTMLElement>("[data-squares-stage]");
      // Later float legs (fall back to the teaser cell if a section is absent).
      const clients = document.querySelector<HTMLElement>(
        "[data-squares-clients]",
      );
      const video = document.querySelector<HTMLElement>(
        'section[aria-label="Showreel"]',
      );
      // The journey needs the full home layout; bail otherwise (e.g. lab).
      if (!startSection || !teaser || !stage) return;

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
      // A 72px float cell at a fixed fractional spot inside a section.
      const cellIn = (el: HTMLElement, f: Frac): Vec => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width * f.x, cy: r.top + r.height * f.y, w: 72, h: 72 };
      };

      // The floater needs a positioned containing block to lay out against;
      // without this it would resolve against whatever positioned ancestor
      // happens to exist further up the tree, silently breaking the
      // local-coordinate math below.
      if (getComputedStyle(teaser).position === "static") {
        teaser.style.position = "relative";
      }
      // The squares rest BEHIND this section's content: isolate makes the
      // z-index:-1 floaters sit behind text but in front of the section's
      // (transparent) backdrop, instead of sinking through the whole page.
      teaser.style.isolation = "isolate";

      const paths: PathEntry[] = [];

      COLORS.forEach((color) => {
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

        // Float layer (z-index:-1) — lives in the page content wrapper so it
        // paints behind every section's content. Carries the square from the
        // teaser through the clients + video sections. Starts invisible;
        // cross-fades in once, as the square hands off from the main layer.
        const floater = document.createElement("div");
        floater.className = `sq sq-${color} sq-travel`;
        stage.insertBefore(floater, stage.firstChild);
        gsap.set(floater, {
          position: "absolute",
          top: 0,
          left: 0,
          width: 72,
          height: 72,
          zIndex: -1,
          pointerEvents: "none",
          // Plain opacity, NOT autoAlpha — autoAlpha also sets
          // visibility:hidden, and since every later frame only touches
          // "opacity" via quickSetter (not the virtual "autoAlpha"),
          // visibility would stay stuck hidden forever after this one call.
          opacity: 0,
        });
        els.push(floater);

        // The stair slot this square lands on / becomes (yellow→1, orange→2,
        // green→3), matching LogoSquares / AboutStairsSection.
        const slotRef = landingRefs[color];
        // Fixed random float cells (one per float section), picked once/load.
        const home: Frac = {
          x: gsap.utils.random(0.12, 0.88),
          y: gsap.utils.random(0.16, 0.82),
        };
        const hc: Frac = {
          x: gsap.utils.random(0.12, 0.88),
          y: gsap.utils.random(0.18, 0.8),
        };
        const hv: Frac = {
          x: gsap.utils.random(0.14, 0.86),
          y: gsap.utils.random(0.2, 0.78),
        };

        const wps: Waypoint[] = [
          { at: PHASE.LAUNCH, get: () => centerOf(anchor) },
          { at: PHASE.POP, ease: back, get: () => ({ ...centerOf(anchor), w: 72, h: 72 }) },
          // Land ON the stair slot and stay glued to it — the square IS the
          // card, riding the deck as it animates through the pin.
          { at: PHASE.LAND, get: () => slotOf(slotRef) },
          { at: PHASE.LEAVE, get: () => slotOf(slotRef) },
          // Float legs (behind content): "What we do" → Clients → Video.
          { at: PHASE.TEASER, get: () => cellIn(teaser, home) },
          { at: PHASE.CLIENTS, get: () => cellIn(clients ?? teaser, hc) },
          { at: PHASE.VIDEO, get: () => cellIn(video ?? teaser, hv) },
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
          home,
          qsEl,
          qsFloater,
          idleActive: false,
          idleStart: 0,
          baseX: 0,
          baseY: 0,
          idleEnv: 0,
          // Desynced organic drift — different amplitude/period per square and
          // per axis (X≠Y makes it a Lissajous-ish path, not a straight line).
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
      // reveals its photo with the same deck-driven flip. As it nears its
      // HOME cell it cross-fades to the in-section floater at z-index:-1,
      // once, and stays there.
      const place = (phase: number) => {
        const sx = window.scrollX;
        const sy = window.scrollY;
        const vhHalf = window.innerHeight / 2;

        // Float layer is positioned relative to the stage wrapper (its
        // containing block), so it can range across every float section.
        const stageRect = stage.getBoundingClientRect();

        // Cross-fade amount: 0 = fully on main layer, 1 = fully on floater.
        // One-way — there is no fade back to the main layer.
        const toFloater = smoothstep(
          (phase - HANDOFF.TO_FLOATER_START) /
            (HANDOFF.TO_FLOATER_END - HANDOFF.TO_FLOATER_START),
        );
        const floaterAmt = toFloater;

        // Once past the handoff, the floater idles forever — independent of
        // further scroll — instead of tracking any later phase; HOME is the
        // journey's end.
        const inIdle = phase >= HANDOFF.TO_FLOATER_END;
        // Ramp the wobble in over this band so there's no snap on arrival.
        const IDLE_PAD = 0.04;
        const idleEnv = smoothstep((phase - HANDOFF.TO_FLOATER_END) / IDLE_PAD);

        for (const p of paths) {
          const { wps, slotRef, qsEl, qsFloater } = p;
          const { cx, cy, w, h } = samplePath(wps, phase);

          // As each slot reaches viewport centre the square must uncover its
          // photo. Desktop does this with a 3D flip (rotationX + backface
          // hidden). Mobile skips 3D (janky there), so instead we fade the
          // square out by the same centre-proximity — transparent when centred
          // (photo shown), opaque when away (matching its stair cover).
          let rotationX = 0;
          let coverFade = 1;
          if (phase < 0.57) {
            const slot = slotRef.current;
            if (slot) {
              const r = slot.getBoundingClientRect();
              const dist = Math.abs(r.top + r.height / 2 - vhHalf);
              const prox = smoothstep(1 - dist / (window.innerHeight * 0.4));
              if (isCompact) coverFade = 1 - prox;
              else rotationX = -180 * prox; // negative = bottom edge rises
            }
          }

          // Main (body-level) layer — always positioned along the path so
          // there's no jump if floaterAmt snaps back to 0 mid-frame.
          qsEl.x(cx + sx - 50);
          qsEl.y(cy + sy - 50);
          qsEl.scaleX(w / 100);
          qsEl.scaleY(h / 100);
          qsEl.rotationX(rotationX);
          qsEl.autoAlpha((1 - floaterAmt) * coverFade);

          // Float layer — positioned relative to the stage wrapper's box.
          const localX = cx - stageRect.left - 36;
          const localY = cy - stageRect.top - 36;
          if (floaterAmt <= 0) {
            if (p.idleActive) p.idleActive = false;
          } else if (inIdle) {
            // Idle drift owns the floater's x/y (written by idleTick, so it
            // keeps moving even when scroll is paused, and forever after).
            // The drift centre tracks the LIVE path position every frame
            // until HOME is reached, then holds — and idleTick adds an
            // enveloped sine wobble on top.
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
            // Cross-fade-in window: track the scroll path so the swap with
            // the main layer is position-matched.
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
      // keep breathing forever once arrived, even when the user pauses or
      // scrolls no further. Only touches floaters whose path has flagged
      // idleActive; each drifts on two desynced sine waves around the centre
      // captured when idle began (so it starts from rest, no snap). Killed
      // and re-armed on refresh (below) so the drift centre is remeasured
      // after a resize.
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
      // which would make later legs race past. So map the path phase to the
      // REAL scroll positions of each section (measured live, pin included),
      // giving every leg a speed that matches actually scrolling through it.
      // Phase values here are the SAME PHASE constants used by the
      // waypoints above, so the two can't drift out of sync.
      const stairsEl =
        landingRefs.yellow.current?.closest<HTMLElement>(".about-stairs") ?? null;
      let cp: [number, number][] = [];
      const buildCheckpoints = () => {
        const vh = window.innerHeight;
        const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
        const tTop = docTop(teaser);
        // Phase LAUNCH = the logo centred in the viewport (its section
        // centres the logo, so the section's centre is the logo's centre).
        const logoCentered =
          docTop(startSection) + startSection.offsetHeight / 2 - vh / 2;
        // Each float leg lands its phase when that section is vertically
        // centred in the viewport.
        const center = (el: HTMLElement) =>
          docTop(el) + el.offsetHeight / 2 - vh / 2;
        const pts: [number, number][] = [
          [logoCentered, PHASE.LAUNCH],
          [(stairsEl ? docTop(stairsEl) : tTop) - 0.15 * vh, PHASE.LAND],
          [tTop - vh, PHASE.LEAVE], // stairs done, teaser entering (spans the pin)
          [center(teaser), PHASE.TEASER],
          [center(clients ?? teaser), PHASE.CLIENTS],
          [center(video ?? teaser), PHASE.VIDEO],
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
        // Span through the last float leg so the video section's phase is
        // reached (and held) as the user scrolls it into view.
        endTrigger: video ?? teaser,
        end: "bottom center",
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