"use client";

import { useEffect, useRef } from "react";
import Logo from "./Logo";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * The rmz wordmark moment (TASK.md §5.3, storyboard p.4): the large cream `rmz`
 * centered on black with the red light — a held, confident beat with a subtle
 * scroll-parallax reveal.
 *
 * The parallax is driven by a lightweight rAF loop reading the section's
 * viewport position rather than a motion library, so it adds nothing to the
 * initial hydration bundle. The mapping is identical to the previous
 * Motion/useScroll version: progress runs 0→1 as the section travels from
 * entering the bottom of the viewport to leaving the top; the lockup translates
 * +60px→−60px and fades 0→1 (by 35%), holds, then eases to 0.3 (by 100%).
 */
export default function WordmarkMoment({
  children,
}: {
  /** Optional content under the wordmark (e.g. the traveling logo squares). */
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    const box = boxRef.current;
    if (!section || !box) return;

    let raf = 0;
    const loop = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const denom = vh + rect.height;
      // offset ["start end", "end start"]: 0 when the section's top is at the
      // viewport bottom, 1 when its bottom is at the viewport top.
      const p = denom > 0 ? Math.min(1, Math.max(0, (vh - rect.top) / denom)) : 0;
      const y = 60 - 120 * p; // [0,1] → [60, -60]
      // opacity keyframes [0,0.35,0.65,1] → [0,1,1,0.3]
      let o: number;
      if (p < 0.35) o = p / 0.35;
      else if (p < 0.65) o = 1;
      else o = 1 - ((p - 0.65) / 0.35) * 0.7;
      box.style.transform = `translateY(${y}px)`;
      box.style.opacity = String(o);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      aria-label="Rebel Mind Zone wordmark"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" />
      <div
        ref={boxRef}
        className="relative w-[clamp(260px,52vw,620px)]"
        style={reduce ? undefined : { willChange: "transform, opacity" }}
      >
        {/* Large centred rmz signature lockup (real brand SVG) */}
        <Logo variant="signature" className="w-full" />
        {/* Inside the parallax box so overlay anchors track the logo. */}
        {children}
      </div>
    </section>
  );
}
