"use client";

import Link from "next/link";
import { useRef } from "react";
import RunsText, { type Run } from "./RunsText";
import { homeContent } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";

type HeroProps = {
  kicker?: string;
  statement?: Run[];
  subline?: string;
};

/**
 * Hero composition — kicker, statement, subline and CTA staggered in on load
 * via a GSAP timeline (opacity + translateY only). Static under
 * prefers-reduced-motion (the timeline is never created, so everything renders
 * at its natural, visible state). The per-character reveal of the headline is
 * layered on separately (RunsText `reveal`) in a later pass.
 */
export default function HeroCursorField({
  kicker = homeContent.heroKicker,
  statement = homeContent.heroStatement,
  subline = homeContent.heroSubline,
}: HeroProps = {}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // One entrance timeline: kicker → headline (per-character stagger of the
      // RunsText `.rt-unit` spans) → subline → CTA. Absolute positions keep the
      // whole cascade ~1.5s regardless of headline length; `stagger.amount`
      // caps the per-character spread so the CTA never queues behind a long
      // headline. gsap.from sets each hidden start pre-paint. Transform +
      // opacity only (autoAlpha = opacity + visibility).
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });
      tl.from("[data-hero-kicker]", { autoAlpha: 0, y: 16 }, 0.1)
        .from(
          ".rt-unit",
          { autoAlpha: 0, yPercent: 80, duration: 0.6, stagger: { amount: 0.5 } },
          0.25,
        )
        .from("[data-hero-sub]", { autoAlpha: 0, y: 16 }, 0.6)
        .from("[data-hero-cta]", { autoAlpha: 0, y: 16 }, 0.8);
    },
    { scope },
  );

  return (
    <section
      aria-label="Rebel Mind Zone hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 sm:px-8"
    >
      <div
        ref={scope}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-7 py-28 text-center"
      >
        {kicker && (
          <p
            data-hero-kicker
            className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]"
          >
            {kicker}
          </p>
        )}

        <h1 className="display-statement text-cream mx-auto max-w-5xl text-center text-[clamp(2.6rem,8.2vw,7rem)]">
          <RunsText runs={statement} reveal />
        </h1>

        {subline && (
          <p
            data-hero-sub
            className="font-body text-cream-dim mx-auto max-w-xl text-base text-balance sm:text-lg"
          >
            {subline}
          </p>
        )}

        <Link
          data-hero-cta
          href="/contact"
          // Hover uses `filter` (not opacity/transform) so it never carries a
          // CSS transition on a property GSAP animates on entry — a CSS
          // transition on opacity here fights the autoAlpha tween and can pin
          // the button at opacity:0 under React Strict Mode's double-mount.
          className="font-body bg-cream text-ink inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-[filter] duration-200 hover:brightness-95"
        >
          Start a project
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
