"use client";

import { useRef } from "react";
import { gsap, Flip, useGSAP, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { COLORS, type ColorKey, type SquareRefs, type StairRefs } from "./logoSquares.types";

/**
 * Controller for the traveling squares. It clones each static logo square and
 * animates the clones (the originals stay in the logo). Renders nothing visible
 * — clones are fixed-position elements appended to <body>.
 *
 *   Phase 1 — emerge: on scroll-in, each clone spawns on top of its original
 *   and pops outward with randomized rotation/stagger (once only).
 *
 *   Phase 2 — travel: right after a clone finishes emerging, a staggered
 *   delayedCall re-parents it into its matching stair slot and GSAP Flip
 *   animates the position/size change (fixed 64px square → 220px slot).
 *
 * Later phases (scroll-driven stair movement, counter + paragraph) hang off
 * the landed squares.
 */
export default function EmergeSquares({
  squareRefs,
  landingRefs,
}: {
  squareRefs: SquareRefs;
  landingRefs: StairRefs;
}) {
  // The emerged clone per colour — later phases grab these.
  const emergeRefs = useRef<Record<ColorKey, HTMLElement | null>>({
    yellow: null,
    orange: null,
    green: null,
  });

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const cleanupLenis = syncScrollTriggerWithLenis();
    const clones: HTMLElement[] = [];
    const delayedCalls: gsap.core.Tween[] = [];

    /** Phase 2 — Flip the clone from wherever it is into its stair slot. */
    const sendCloneToStairs = (clone: HTMLElement, slot: HTMLElement) => {
      const state = Flip.getState(clone);

      // Re-parent into the slot and switch to the landed styling. Clearing the
      // inline fixed-position props lets `.stair-square` (absolute, 100%)
      // define the end state that Flip animates toward.
      slot.appendChild(clone);
      clone.classList.add("stair-square");
      gsap.set(clone, {
        clearProps: "position,top,left,width,height,margin,zIndex",
      });

      Flip.from(state, {
        duration: 1,
        ease: "power2.inOut",
        scale: true,
        absolute: true,
        zIndex: 999, // stay above page content during flight
        onComplete: () => {
          clone.classList.remove("sq-clone");
          slot.classList.add("filled"); // turn the overflow crop back on
          // Phase 3 — the colour square dissolves, leaving the slot as a
          // cropped window onto the step photo beneath it.
          gsap.to(clone, { opacity: 0, duration: 0.5, delay: 0.25, ease: "power1.out" });
        },
      });
    };

    COLORS.forEach((color, i) => {
      const original = squareRefs[color].current;
      if (!original) return;

      const rect = original.getBoundingClientRect();
      const clone = original.cloneNode(true) as HTMLElement;
      clone.classList.add("sq-clone");
      document.body.appendChild(clone);

      // Sit the clone exactly on top of the original, invisible until it emerges.
      gsap.set(clone, {
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: 0,
        opacity: 0,
        zIndex: 999,
      });

      clones.push(clone);
      emergeRefs.current[color] = clone;

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
          clone,
          { scale: 0.4, opacity: 0, rotate: gsap.utils.random(-25, 25) },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.5,
            ease: "back.out(2)",
            // Phase 2 kick-off: staggered so the three don't move in unison.
            onComplete: () => {
              delayedCalls.push(
                gsap.delayedCall(i * 0.15, () => {
                  const slot = landingRefs[color].current;
                  if (slot) sendCloneToStairs(clone, slot);
                }),
              );
            },
          },
        );
    });

    // useGSAP reverts the tweens/ScrollTriggers; we also kill the chained
    // delayed calls, remove the clones and detach the Lenis listener.
    return () => {
      cleanupLenis();
      delayedCalls.forEach((d) => d.kill());
      clones.forEach((c) => c.remove());
    };
  }, []);

  return null;
}
