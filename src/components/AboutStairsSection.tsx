"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { homeContent, type StairStep } from "@/content/home";
import type { StairRefs } from "./logoSquares.types";

/**
 * The landing section for the traveling squares.
 *
 *   Phase 3 — each `.stair-slot` holds a cropped image (placeholder block
 *   until real photos land; swap for next/image). The landed square fades out
 *   after arrival (see EmergeSquares) so the slot becomes a photo window.
 *
 *   Phase 4 — a single master ScrollTrigger pins the section and, on update,
 *   drives each slot's `y` at a different multiplier so the three feel like
 *   steps being walked down rather than one parallax layer.
 *
 *   Phase 5 — the same onUpdate derives the active step (0–2) into React
 *   state for the counter + crossfading paragraph.
 */

const IMG_LABELS = [
  "[ STEP 1 PHOTO — REPLACE ]",
  "[ STEP 2 PHOTO — REPLACE ]",
  "[ STEP 3 PHOTO — REPLACE ]",
  "[ STEP 4 PHOTO — REPLACE ]",
];

export default function AboutStairsSection({
  landingRefs,
  steps = homeContent.stairs,
}: {
  landingRefs: StairRefs;
  /** CMS-driven step content (photo + paragraph); falls back to the default. */
  steps?: StairStep[];
}) {
  const { yellow, orange, green } = landingRefs;
  const sectionRef = useRef<HTMLElement>(null);
  const TOTAL = steps.length;
  // 4th deck card — internal only (the logo has 3 squares to travel, so it
  // isn't a Flip landing target and stays out of the landingRefs API).
  const fourth = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const cleanupLenis = syncScrollTriggerWithLenis();
      const slots = [yellow, orange, green, fourth];

      // Continuous diagonal staircase: every card sits STEP·(i − u) down-right
      // of the centre — uniform spacing, all steps visible at once, the whole
      // flight of stairs climbing up-left as one function of scroll progress.
      // Each card wears its brand-colour cover square while waiting, and the
      // cover dissolves into the photo exactly as the card reaches focus (so
      // the traveling squares stay visible in the section however slowly the
      // user scrolls).
      const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
      const smooth = (t: number) => {
        const c = clamp01(t);
        return c * c * (3 - 2 * c);
      };

      const render = (p: number) => {
        const u = p * (slots.length - 1); // one unit per transition
        // Big diagonal stride (reference arrangement): the previous card sits
        // far up-left and the next far down-right, both partially cropped by
        // the viewport edges.
        const stride = Math.min(window.innerWidth, window.innerHeight) * 0.45;

        slots.forEach((ref, i) => {
          const el = ref.current;
          if (!el) return;
          const rel = i - u; // + waiting → 0 focused → − exited
          const wait = clamp01(rel);
          const gone = clamp01(-rel);

          gsap.set(el, {
            x: stride * rel,
            y: stride * rel,
            scale: 1 + 0.05 * wait - 0.1 * gone,
            // neighbours stay visible but dimmed (reference tint), both sides
            opacity: Math.max(0.35, 1 - 0.65 * Math.abs(rel)),
            // focused card on top; outgoing yields to incoming mid-transition
            zIndex: Math.round(100 - Math.abs(rel) * 10 - (rel < 0 ? 5 : 0)),
          });

          // Every card wears a repeating brand-colour cover (yellow/orange/
          // green/yellow…) that flips up to reveal its photo, completing
          // exactly as the card centres (rel → 0). The traveling logo squares
          // hand off to these on arrival, so all cards flip identically.
          const cover = el.querySelector<HTMLElement>(".stair-cover");
          if (cover) {
            const prox = smooth(1 - Math.abs(rel) / 0.4); // 1 centred → 0 away
            // The rotation carries the flip motion; opacity guarantees the
            // reveal. We fade the cover out as it flips past edge-on (prox 0.5
            // ≈ 90°) so the photo shows even where backface-visibility is
            // unreliable (mobile Safari left the flipped cover visible as a
            // trapezoid over the photo — the glitch).
            const hidePast = smooth((prox - 0.5) / 0.12);
            gsap.set(cover, {
              opacity: 1 - hidePast,
              rotationX: -180 * prox,
              transformPerspective: 700,
            });
          }
        });

        // Counter/paragraph follow the focused card (rounds mid-transition).
        const step = Math.min(slots.length - 1, Math.max(0, Math.round(u)));
        setActiveStep((prev) => (prev !== step ? step : prev));
      };

      // Initial staircase: card 1 focused, the rest stepping down-right.
      render(0);

      // Reveal: the section stays invisible on approach and each card fades
      // in exactly as its traveling square lands on it (same windows as
      // EmergeSquares' FADE_RANGES — keep in sync). The 4th card (no
      // traveler), counter and paragraph appear with the last arrival.
      const ARRIVALS: [string, string][] = [
        ["top 42%", "top 30%"],
        ["top 27%", "top 15%"],
        ["top 12%", "top top"],
        ["top 12%", "top top"],
      ];
      slots.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            // land on the deck's resting dim for card i (render(0) values)
            opacity: Math.max(0.35, 1 - 0.65 * i),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: ARRIVALS[i][0],
              end: ARRIVALS[i][1],
              scrub: true,
            },
          },
        );
      });
      [".stairs-counter", ".stairs-paragraph-wrap"].forEach((sel) => {
        gsap.fromTo(
          sel,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 20%",
              end: "top top",
              scrub: true,
            },
          },
        );
      });

      // One master trigger owns the pin; everything derives from its progress.
      // Scroll room scales with the number of transitions (1000px each).
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${(slots.length - 1) * 1000}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => render(self.progress),
      });

      return cleanupLenis;
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="about-stairs">
      {/* Slots 1–3 wear their brand-square cover (dissolves into the photo at
          focus); slot 4 is the extra step with no traveling square. */}
      <div ref={yellow} className="stair-slot stair-1">
        <StairImg step={steps[0]} label={IMG_LABELS[0]} />
        <span className="stair-cover" style={{ background: "var(--acc-yellow)" }} aria-hidden="true" />
      </div>
      <div ref={orange} className="stair-slot stair-2">
        <StairImg step={steps[1]} label={IMG_LABELS[1]} />
        <span className="stair-cover" style={{ background: "var(--acc-orange)" }} aria-hidden="true" />
      </div>
      <div ref={green} className="stair-slot stair-3">
        <StairImg step={steps[2]} label={IMG_LABELS[2]} />
        <span className="stair-cover" style={{ background: "var(--acc-green)" }} aria-hidden="true" />
      </div>
      <div ref={fourth} className="stair-slot stair-4">
        <StairImg step={steps[3]} label={IMG_LABELS[3]} />
        <span className="stair-cover" style={{ background: "var(--acc-yellow)" }} aria-hidden="true" />
      </div>

      {/* Phase 5 — counter (bottom-left, oversized per the reference) */}
      <div className="stairs-counter font-body" aria-hidden="true">
        <span className="current font-display text-cream text-[8rem] italic leading-none sm:text-[12rem]">
          0{activeStep + 1}
        </span>
        <span className="total text-cream-dim text-lg"> / 0{TOTAL}</span>
      </div>

      {/* Phase 5 — paragraph (top-right, off the travel diagonal);
          key remount on the inner <p> = CSS crossfade */}
      <div className="stairs-paragraph-wrap">
        <p className="stairs-paragraph font-body text-cream-dim text-xl leading-relaxed sm:text-2xl" key={activeStep}>
          {steps[activeStep]?.paragraph}
        </p>
      </div>
    </section>
  );
}

/** Cropped photo window — the CMS photo (object-cover) or a labelled placeholder. */
function StairImg({ step, label }: { step?: StairStep; label: string }) {
  if (step?.photoUrl) {
    return (
      <Image
        src={step.photoUrl}
        alt={step.alt}
        fill
        unoptimized
        sizes="(max-width: 640px) 240px, 26vw"
        className="stair-img object-cover"
      />
    );
  }
  return (
    <div className="stair-img flex h-full w-full items-center justify-center bg-[#1a1a1a]">
      <span className="font-body px-2 text-center text-xs text-[#666]">{label}</span>
    </div>
  );
}
