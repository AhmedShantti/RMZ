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
 *   Phase 3 — after the stairs, the squares fade back in and drift on a
 *   randomized scrubbed path through the "What we do" section (behind its
 *   text: z-index drops under the content while there).
 *
 *   Phase 4 — they converge into a centred row that settles on the marquee
 *   section (placeholder arrangement — the marquee gets its own pass later).
 *   Both phases no-op on pages without those sections (e.g. the lab).
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
    const floaters: HTMLElement[] = [];
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
      // The journey ends in the "What we do" section (absent on the lab page
      // → the final phase simply doesn't run there).
      const teaser = document.querySelector<HTMLElement>(
        'section[aria-label="What we do"]',
      );
      // The squares rest BEHIND this section's content: isolate makes the
      // z-index:-1 floaters sit behind the text but in front of the section's
      // (transparent) backdrop, instead of sinking below the whole content
      // column (which is its own stacking context).
      if (teaser) teaser.style.isolation = "isolate";

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

        // Phase 3 (final) — the journey ends in "What we do". The traveler
        // flies into the section (above content) and hands off to an ambient
        // floater that lives INSIDE the section at z-index:-1, drifting
        // randomly forever behind the text.
        if (teaser) {
          const S = 72; // floating-square size
          // Random home cell within the section for this square.
          const home = {
            fx: gsap.utils.random(0.12, 0.88),
            fy: gsap.utils.random(0.16, 0.82),
          };

          // The resting floater — a child of the section, behind its content.
          const floater = original.cloneNode(true) as HTMLElement;
          floater.className = `sq sq-${color} sq-floater`;
          floater.removeAttribute("style");
          teaser.appendChild(floater);
          floaters.push(floater);
          gsap.set(floater, { opacity: 0 });

          // Position (re-evaluated on refresh); drift animates x/y on top.
          const placeFloater = () => {
            const t = teaser.getBoundingClientRect();
            gsap.set(floater, {
              position: "absolute",
              width: S,
              height: S,
              left: home.fx * t.width - S / 2,
              top: home.fy * t.height - S / 2,
              zIndex: -1,
            });
          };
          placeFloater();
          anchors.push(placeFloater);

          // Ambient random drift — forever, independent of scroll.
          gsap.to(floater, {
            x: () => gsap.utils.random(-45, 45),
            y: () => gsap.utils.random(-45, 45),
            rotation: () => gsap.utils.random(-25, 25),
            duration: () => gsap.utils.random(3.5, 6.5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            delay: i * 0.5,
          });

          // Traveler re-appears after the stairs and flies to the home cell.
          gsap.to(inner, {
            opacity: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: teaser,
              start: "top 96%",
              end: "top 70%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          gsap.to(wrapper, {
            x: () => {
              const t = teaser.getBoundingClientRect();
              return t.left + window.scrollX + home.fx * t.width - S / 2 - ax;
            },
            y: () => {
              const t = teaser.getBoundingClientRect();
              return t.top + window.scrollY + home.fy * t.height - S / 2 - ay;
            },
            scaleX: () => S / aw,
            scaleY: () => S / ah,
            rotation: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: teaser,
              start: "top bottom",
              end: "top 50%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          // Handoff: as it lands, the traveler fades out and the floater in.
          const HANDOFF: [string, string] = ["top 58%", "top 44%"];
          gsap.to(inner, {
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: teaser,
              start: HANDOFF[0],
              end: HANDOFF[1],
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          gsap.fromTo(
            floater,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: teaser,
                start: HANDOFF[0],
                end: HANDOFF[1],
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
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
      floaters.forEach((f) => f.remove());
    };
  }, []);

  return null;
}
