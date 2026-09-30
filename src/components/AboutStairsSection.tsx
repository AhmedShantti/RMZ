"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { homeContent, DEFAULT_STAIR_TITLES, type StairStep } from "@/content/home";
import {
  STAIR_OFFSETS,
  STAIR_RATIOS,
  STAIR_STEPS_MAX,
  STAIRS_DEFAULTS,
  TITLE_SIZES,
  type StairsSettings,
} from "@/lib/homeSettings";
import type { StairRefs } from "./logoSquares.types";

/**
 * The landing section for the traveling squares.
 *
 *   Phase 3 — each `.stair-slot` holds a cropped image (placeholder block
 *   until real photos land; swap for next/image). The brand squares no longer
 *   land here — they float behind the section (see EmergeSquares) — so each
 *   slot is a plain photo window that fades in on scroll.
 *
 *   Phase 4 — a single master ScrollTrigger pins the section and, on update,
 *   drives each slot's `y` at a different multiplier so the three feel like
 *   steps being walked down rather than one parallax layer.
 *
 *   Phase 5 — the same onUpdate derives the active step (0–2) into React
 *   state for the counter + crossfading paragraph.
 */

const imgLabel = (i: number) => `[ STEP ${i + 1} PHOTO — REPLACE ]`;

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function AboutStairsSection({
  landingRefs,
  steps: stepsProp = homeContent.stairs,
  settings = STAIRS_DEFAULTS,
}: {
  landingRefs: StairRefs;
  /** CMS-driven step content (photo + paragraph); falls back to the default. */
  steps?: StairStep[];
  /** CMS-driven sizing/typography (already clamped by normalizeStairsSettings). */
  settings?: StairsSettings;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  // Step count comes from the CMS list (the section adapts to 1…8 items).
  const steps = stepsProp.slice(0, STAIR_STEPS_MAX);
  const TOTAL = steps.length;
  const strideFactor = STAIR_OFFSETS[settings.offset];
  // One element per step. The first three double as the landingRefs the
  // EmergeSquares journey reads (it only uses them to locate this section).
  const slotEls = useRef<(HTMLDivElement | null)[]>([]);
  const setSlot = (i: number) => (el: HTMLDivElement | null) => {
    slotEls.current[i] = el;
    if (i === 0) landingRefs.yellow.current = el;
    if (i === 1) landingRefs.orange.current = el;
    if (i === 2) landingRefs.green.current = el;
  };
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const cleanupLenis = syncScrollTriggerWithLenis();
      const slots = slotEls.current.slice(0, TOTAL);

      // Continuous diagonal staircase: every card sits STEP·(i − u) down-right
      // of the centre — uniform spacing, all steps visible at once, the whole
      // flight of stairs climbing up-left as one function of scroll progress.
      // Each card wears its brand-colour cover square while waiting, and the
      // cover dissolves into the photo exactly as the card reaches focus (so
      // the traveling squares stay visible in the section however slowly the
      // user scrolls).
      const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

      const render = (p: number) => {
        const u = p * (slots.length - 1); // one unit per transition
        // Big diagonal stride (reference arrangement): the previous card sits
        // far up-left and the next far down-right, both partially cropped by
        // the viewport edges.
        const stride = Math.min(window.innerWidth, window.innerHeight) * strideFactor;

        slots.forEach((el, i) => {
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
        });

        // Counter/paragraph follow the focused card (rounds mid-transition).
        const step = Math.min(slots.length - 1, Math.max(0, Math.round(u)));
        setActiveStep((prev) => (prev !== step ? step : prev));
      };

      // Initial staircase: card 1 focused, the rest stepping down-right.
      render(0);

      // Reveal: the section stays invisible on approach and each card fades
      // in as it steps into place — a staggered staircase reveal. Counter and
      // paragraph appear with the last card.
      const ARRIVALS: [string, string][] = [
        ["top 42%", "top 30%"],
        ["top 27%", "top 15%"],
        ["top 12%", "top top"],
        ["top 12%", "top top"],
      ];
      slots.forEach((el, i) => {
        if (!el) return;
        const arrival = ARRIVALS[Math.min(i, ARRIVALS.length - 1)];
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            // land on the deck's resting dim for card i (render(0) values)
            opacity: Math.max(0.35, 1 - 0.65 * i),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: arrival[0],
              end: arrival[1],
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
        end: `+=${Math.max(1, slots.length - 1) * 1000}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => render(self.progress),
      });

      return cleanupLenis;
    },
    { scope: sectionRef, dependencies: [TOTAL, strideFactor], revertOnUpdate: true },
  );

  const sectionStyle = {
    "--stair-scale": settings.imageScale / 100,
    "--stair-ratio": STAIR_RATIOS[settings.aspect],
  } as CSSProperties;

  return (
    <section ref={sectionRef} className="about-stairs" style={sectionStyle}>
      {/* Photo windows that step down the flight as it's scrolled. */}
      {steps.map((step, i) => (
        <div key={i} ref={setSlot(i)} className="stair-slot" style={{ zIndex: i + 1 }}>
          <StairImg step={step} label={imgLabel(i)} index={i} />
        </div>
      ))}

      {/* Phase 5 — counter (bottom-left, oversized per the reference) + the
          step title on the same line (wrapping under it when it doesn't fit).
          Number and title share `activeStep` and the same keyed fade, so they
          change as one unit; the block has a reserved height, so titles of any
          length never shift the layout. */}
      <div
        className="stairs-counter font-body"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ "--stairs-title-size": TITLE_SIZES[settings.titleSize] } as CSSProperties}
      >
        <span className="stairs-counter-num">
          <span
            key={`n${activeStep}`}
            className="stairs-counter-swap current font-display text-cream text-[8rem] italic leading-none sm:text-[12rem]"
          >
            {pad2(activeStep + 1)}
          </span>
          <span className="total text-cream-dim text-lg"> / {pad2(TOTAL)}</span>
        </span>
        {stepTitle(steps, activeStep) && (
          <span
            key={`t${activeStep}`}
            className="stairs-counter-title stairs-counter-swap"
            style={{
              textTransform: settings.titleUppercase ? "uppercase" : "none",
              color: `color-mix(in srgb, var(--cream-dim) ${Math.round(settings.titleOpacity * 100)}%, transparent)`,
            }}
          >
            — {stepTitle(steps, activeStep)}
          </span>
        )}
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

const stepTitle = (steps: StairStep[], i: number) => {
  const step = steps[i];
  if (!step || step.showTitle === false) return "";
  return step.title?.trim() || DEFAULT_STAIR_TITLES[i] || "";
};

/** Cropped photo window — the CMS photo (object-cover, editor-set focus) or a labelled placeholder. */
function StairImg({ step, label, index }: { step?: StairStep; label: string; index: number }) {
  if (step?.photoUrl) {
    return (
      <Image
        src={step.photoUrl}
        alt={step.alt?.trim() || step.title?.trim() || `Step ${index + 1}`}
        fill
        // Cards are up to ~36vw wide (≤ 86vw on phones); 2x DPR needs the
        // larger candidates, so ask for the real rendered width + quality 85.
        sizes="(max-width: 640px) 86vw, 40vw"
        quality={85}
        style={{ objectPosition: step.imagePosition }}
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
