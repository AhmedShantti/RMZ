"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Logo from "./Logo";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * The rmz wordmark moment (TASK.md §5.3, storyboard p.4): the large cream `rmz`
 * centered on black with the red light — a held, confident beat with a subtle
 * scroll-parallax reveal.
 */
export default function WordmarkMoment() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0.3],
  );

  return (
    <section
      ref={ref}
      aria-label="Rebel Mind Zone wordmark"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 80% at 50% 120%, color-mix(in srgb, var(--rebel-red) 26%, transparent), transparent 60%)",
        }}
      />
      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative scale-[0.62] sm:scale-90 md:scale-110 lg:scale-125"
      >
        {/* Large centred rmz signature lockup */}
        <Logo variant="signature" size={150} />
      </motion.div>
    </section>
  );
}
