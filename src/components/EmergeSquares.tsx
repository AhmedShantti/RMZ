"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  syncScrollTriggerWithLenis,
} from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import {
  COLORS,
  type ColorKey,
  type SquareRefs,
  type StairRefs,
} from "./logoSquares.types";

/**
 * Controller for the traveling squares. It clones each static logo square and
 * animates the clones (the originals stay in the logo). Renders nothing visible
 * — clones are elements appended to <body>.
 *
 * Every traveler is a wrapper (owns the FLIGHT transform) around an inner
 * square (owns the EMERGE pop + the arrival fade), so the two never fight
 * over the same `transform`.
 *
 *   Phase 1 — emerge: on scroll-in, the inner square pops out of its original
 *   with randomized rotation/stagger (once only, time-based — it's a beat).
 *
 *   Phase 2 — travel: SCRUBBED to scroll, not timed. The wrapper's flight to
 *   the stair slot maps onto the stairs section's approach ("top bottom" →
 *   staggered ends), so the squares are always mid-flight wherever the user
 *   is between the logo and the stairs — scroll slowly and they fly slowly,
 *   scroll back and they return. On arrival a scrubbed fade hands off to the
 *   slot's identical brand-colour cover (AboutStairsSection), which dissolves
 *   into the photo when its card reaches focus.
 *
 * All triggers are created at MOUNT with function-based values +
 * invalidateOnRefresh (creating them mid-scroll — e.g. in an onComplete —
 * computes their ranges from pinned/stale layout and breaks the scrub).
 */
export default function EmergeSquares({
  squareRefs,
  landingRefs,
}: {
  squareRefs: SquareRefs;
  landingRefs: StairRefs;
}) {
  // The traveling wrapper per colour — later phases grab these.
  const emergeRefs = useRef<Record<ColorKey, HTMLElement | null>>({
    yellow: null,
    orange: null,
    green: null,
  });

  useGSAP((_, contextSafe) => {
    if (prefersReducedMotion()) return;

    const cleanupLenis = syncScrollTriggerWithLenis();
    const wrappers: HTMLElement[] = [];
    const anchors: (() => void)[] = [];
    const refreshAnchors = () => anchors.forEach((fn) => fn());

    // Staggered arrival points so the three don't fly in unison, each with a
    // short scrubbed fade window ending at its arrival.
    const FLIGHT_ENDS = ["top 30%", "top 15%", "top top"];
    const FADE_RANGES: [string, string][] = [
      ["top 42%", "top 30%"],
      ["top 27%", "top 15%"],
      ["top 12%", "top top"],
    ];

    // React attaches refs and runs layout effects in ONE depth-first pass, so
    // the stair-slot refs (a LATER sibling's DOM) are still null while this
    // layout effect runs — defer all setup one frame. contextSafe keeps the
    // deferred tweens/triggers inside useGSAP's auto-cleanup context.
    const setup = contextSafe!(() => {
      COLORS.forEach((color, i) => {
        const original = squareRefs[color].current;
        const slot = landingRefs[color].current;
        if (!original || !slot) return;
        const section = slot.closest(".about-stairs") ?? slot;

        // wrapper = flight, inner = emerge pop + arrival fade
        const wrapper = document.createElement("div");
        wrapper.className = "sq-clone";
        const inner = original.cloneNode(true) as HTMLElement;
        inner.classList.remove("sq-anchor");
        inner.removeAttribute("style");
        gsap.set(inner, {
          display: "block",
          width: "100%",
          height: "100%",
          opacity: 0,
        });
        wrapper.appendChild(inner);
        document.body.appendChild(wrapper);
        wrappers.push(wrapper);
        emergeRefs.current[color] = wrapper;

        // Anchor the wrapper on the logo square in DOCUMENT coordinates —
        // re-measured on every ScrollTrigger refresh (resize, font load…).
        let ax = 0;
        let ay = 0;
        let aw = 1;
        let ah = 1;
        const anchor = () => {
          const a = original.getBoundingClientRect();
          ax = a.left + window.scrollX;
          ay = a.top + window.scrollY;
          aw = a.width || 1;
          ah = a.height || 1;
          gsap.set(wrapper, {
            position: "absolute",
            top: ay,
            left: ax,
            width: aw,
            height: ah,
            margin: 0,
            zIndex: 999,
            transformOrigin: "0 0",
          });
        };
        anchor();
        anchors.push(anchor);

        // Phase 2 — the scrubbed flight (logo → slot's pre-pin rect).
        gsap.to(wrapper, {
          x: () => {
            const d = slot.getBoundingClientRect();
            return d.left + window.scrollX - ax;
          },
          y: () => {
            const d = slot.getBoundingClientRect();
            return d.top + window.scrollY - ay;
          },
          scaleX: () => slot.getBoundingClientRect().width / aw,
          scaleY: () => slot.getBoundingClientRect().height / ah,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: FLIGHT_ENDS[i] ?? "top top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Arrival handoff — scrubbed fade onto the slot's identical cover
        // (reversible: scrolling back up brings the traveler back).
        const fade = gsap.to(inner, {
          opacity: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: FADE_RANGES[i][0],
            end: FADE_RANGES[i][1],
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 — the emerge pop (once, at the logo).
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".logo-squares",
              start: "top 80%",
              once: true,
            },
            delay: gsap.utils.random(0, 0.4), // randomized stagger per square
          })
          .fromTo(
            inner,
            { scale: 0.4, opacity: 0, rotate: gsap.utils.random(-25, 25) },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.5,
              ease: "back.out(2)",
              // Deep-load guard (scroll restoration past the stairs): if the
              // arrival fade has already fully played, stay handed-off.
              onComplete: () => {
                if (fade.scrollTrigger && fade.scrollTrigger.progress >= 1) {
                  gsap.set(inner, { opacity: 0 });
                }
              },
            },
          );
      });

      ScrollTrigger.addEventListener("refreshInit", refreshAnchors);
    });
    const raf = requestAnimationFrame(setup);

    // useGSAP reverts the tweens/ScrollTriggers; we also remove the clones,
    // the refresh listener and the Lenis hook.
    return () => {
      cancelAnimationFrame(raf);
      cleanupLenis();
      ScrollTrigger.removeEventListener("refreshInit", refreshAnchors);
      wrappers.forEach((c) => c.remove());
    };
  }, []);

  return null;
}
