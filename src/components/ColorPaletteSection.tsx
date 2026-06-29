"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Section 2 — Color Palette statement, scroll-driven.
 *
 * The section is taller than the viewport and its content is `sticky` to the
 * top, so as the user scrolls in, the three lines reveal one after another
 * (staggered, in sync with the squares scattering to the edges). Once fully
 * revealed they stay frozen/pinned in place for the rest of the section, then
 * release. A rAF loop reads the section geometry (reliable with Lenis); static
 * under prefers-reduced-motion.
 */
const YELLOW = "#fdc82f";
const RED = "#e85d1e";
const GREEN = "#8dc63f";
const CREAM = "#f5f0e8";

function Sq({ color, size = 55 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, backgroundColor: color, display: "block" }}
    />
  );
}

// reveal windows (in section progress 0..1), staggered then held
const WINDOWS: [number, number][] = [
  [0.04, 0.26],
  [0.2, 0.42],
  [0.36, 0.58],
];

const smooth = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

export default function ColorPaletteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line0Ref = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lineRefs = [line0Ref, line1Ref, line2Ref];
    const apply = (p: number) => {
      lineRefs.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const [a, b] = WINDOWS[i];
        const t = smooth((p - a) / (b - a));
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 40}px)`;
      });
    };

    if (prefersReducedMotion()) {
      apply(1);
      return;
    }

    let raf = 0;
    const loop = () => {
      const sec = sectionRef.current;
      if (sec) {
        const rect = sec.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
        apply(p);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="about-colorpalette"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: "190vh", zIndex: 1 }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Line 1 — yellow square (left edge) — "COLORPALATTE balances" */}
        <div ref={line0Ref} className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="absolute" style={{ left: 0, top: "35vh" }}>
            <Sq color={YELLOW} />
          </div>
          <div
            className="absolute hidden sm:block"
            style={{
              left: 55,
              top: "calc(35vh + 27px)",
              width: "calc(12vw - 55px)",
              height: 1,
              background: "rgba(255,255,255,0.6)",
            }}
          />
          <p
            className="font-body absolute"
            style={{
              left: "12vw",
              top: "calc(35vh + 6px)",
              fontSize: "clamp(18px,2.5vw,28px)",
              fontWeight: 400,
              color: CREAM,
            }}
          >
            COLORPALATTE balances
          </p>
        </div>

        {/* Line 2 — "BOLD EXPRESSION" — green square (right edge) */}
        <div ref={line1Ref} className="absolute inset-0" style={{ opacity: 0 }}>
          <p
            className="font-body absolute"
            style={{
              left: "18vw",
              top: "calc(45vh + 6px)",
              fontSize: "clamp(18px,2.5vw,28px)",
            }}
          >
            <span style={{ fontWeight: 900, fontStyle: "italic", color: CREAM }}>
              BOLD
            </span>{" "}
            <span style={{ fontWeight: 400, letterSpacing: "0.08em" }}>
              EXPRESSION
            </span>
          </p>
          <div
            className="absolute hidden sm:block"
            style={{
              right: 55,
              top: "calc(45vh + 27px)",
              width: "10vw",
              height: 1,
              background: "rgba(255,255,255,0.6)",
            }}
          />
          <div className="absolute" style={{ right: 0, top: "45vh" }}>
            <Sq color={GREEN} />
          </div>
        </div>

        {/* Line 3 — red square (left) — "with Professional Presence" */}
        <div ref={line2Ref} className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="absolute" style={{ left: "2vw", top: "58vh" }}>
            <Sq color={RED} />
          </div>
          <div
            className="absolute hidden sm:block"
            style={{
              left: "calc(2vw + 55px)",
              top: "calc(58vh + 27px)",
              width: "calc(10vw - 55px)",
              height: 1,
              background: "rgba(255,255,255,0.6)",
            }}
          />
          <p
            className="font-body absolute"
            style={{
              left: "12vw",
              top: "calc(58vh + 6px)",
              fontSize: "clamp(18px,2.5vw,28px)",
              fontWeight: 400,
              color: CREAM,
            }}
          >
            with Professional Presence
          </p>
        </div>
      </div>
    </section>
  );
}
