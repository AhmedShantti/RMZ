"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
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

const PARAGRAPHS = [
  "Step one — where the idea is born. Placeholder copy describing the first image.",
  "Step two — discipline shapes the boldness. Placeholder copy for the second image.",
  "Step three — the work meets the world. Placeholder copy for the third image.",
];

const IMG_LABELS = [
  "[ STEP 1 PHOTO — REPLACE ]",
  "[ STEP 2 PHOTO — REPLACE ]",
  "[ STEP 3 PHOTO — REPLACE ]",
];

export default function AboutStairsSection({
  landingRefs,
}: {
  landingRefs: StairRefs;
}) {
  const { yellow, orange, green } = landingRefs;
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const cleanupLenis = syncScrollTriggerWithLenis();
      const slots = [yellow, orange, green];

      // Card-deck choreography (reference video): every card's state is a pure
      // function of scroll progress — no thresholds, no index snapping. The
      // outgoing card shrinks (1 → 0.9), drifts up and fades while the next
      // rises from below (1.05 → 1); both stay visible mid-transition.
      const ease = gsap.parseEase("power2.inOut");
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

      const render = (p: number) => {
        const u = p * (slots.length - 1); // 0..2 → two transitions
        const enterY = window.innerHeight * 0.65; // rises from below centre
        const exitY = -window.innerHeight * 0.18; // subtle upward drift out

        slots.forEach((ref, i) => {
          const el = ref.current;
          if (!el) return;
          // Card 0 starts focused; card i enters over u ∈ [i-1, i] and
          // exits over u ∈ [i, i+1]. Both ramps are eased for the cinematic
          // feel; scrub smoothing does the rest.
          const enterF = i === 0 ? 1 : clamp01(u - (i - 1));
          const exitF = clamp01(u - i);
          const eIn = ease(enterF);
          const eOut = ease(exitF);

          gsap.set(el, {
            y: (1 - eIn) * enterY + eOut * exitY,
            scale: lerp(lerp(1.05, 1, eIn), 0.9, eOut),
            // fade in over the first half of the rise, out across the exit
            opacity: ease(clamp01(enterF * 2)) * (1 - eOut),
          });
        });

        // Counter/paragraph follow the focused card (rounds mid-transition).
        const step = Math.min(2, Math.max(0, Math.round(u)));
        setActiveStep((prev) => (prev !== step ? step : prev));
      };

      // Initial stack: card 1 focused, cards 2–3 waiting below (also keeps
      // them invisible before the pin, so nothing pokes out of the section).
      render(0);

      // One master trigger owns the pin; everything derives from its progress.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=2000",
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
      <div ref={yellow} className="stair-slot stair-1">
        <StairImg label={IMG_LABELS[0]} />
      </div>
      <div ref={orange} className="stair-slot stair-2">
        <StairImg label={IMG_LABELS[1]} />
      </div>
      <div ref={green} className="stair-slot stair-3">
        <StairImg label={IMG_LABELS[2]} />
      </div>

      {/* Phase 5 — counter (bottom-left) */}
      <div className="stairs-counter font-body" aria-hidden="true">
        <span className="current font-display text-cream text-4xl italic">
          0{activeStep + 1}
        </span>
        <span className="total text-cream-dim text-sm"> / 03</span>
      </div>

      {/* Phase 5 — paragraph (top-right); key remount = CSS crossfade */}
      <p className="stairs-paragraph font-body text-cream-dim text-sm leading-relaxed" key={activeStep}>
        {PARAGRAPHS[activeStep]}
      </p>
    </section>
  );
}

/** Cropped photo window — placeholder until real step photos exist.
 *  Swap for: <Image src="/images/step-N.jpg" alt="" fill className="object-cover" /> */
function StairImg({ label }: { label: string }) {
  return (
    // TODO: Replace with a real photo
    <div className="stair-img flex h-full w-full items-center justify-center bg-[#1a1a1a]">
      <span className="font-body px-2 text-center text-xs text-[#666]">{label}</span>
    </div>
  );
}
