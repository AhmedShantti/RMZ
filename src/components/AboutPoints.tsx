"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { LOGO_BOX_CSS, LOGO_TRIO, logoSquareSize, type LogoSquareColor } from "@/lib/logoSquareSize";
import { dockScroll } from "@/lib/aboutDocking";
import type { AboutImage } from "@/content/about";
import { COLORS } from "./AboutScrollSquares";

/**
 * The About page's numbered points, laid out as a staggered three-column grid
 * (one column on phones). Content comes from the CMS About sections: the small
 * label is the title, the body paragraphs are the text, the section image is the
 * picture. (The big italic section headline is intentionally not rendered.)
 *
 * The first three points have a square slot beside their number. The traveling
 * squares (AboutScrollSquares) are routed through those slots; the moment the
 * traveling square crosses its slot — "the slot's top edge is at 45% of the
 * viewport" (lib/aboutDocking) — a FIXED copy appears in the slot (it scrolls
 * with the content) and the column's reveal plays once. Scrolling back up
 * hides the copy again; the reveal stays played.
 *
 * Reduced motion / no JS: everything is visible immediately (the hidden start
 * states exist only in CSS under `prefers-reduced-motion: no-preference`).
 */
export type AboutPoint = {
  title: string;
  paragraphs: string[];
  image: AboutImage | null;
};

/** Slot colours, in point order: 01 yellow, 02 orange, 03 green. */
const SLOT_COLORS: LogoSquareColor[] = ["yellow", "orange", "green"];
const SLOT_FILL: Record<LogoSquareColor, string> = {
  yellow: COLORS.yellow,
  orange: COLORS.red, // the logo's orange square
  green: COLORS.green,
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function AboutPoints({ points }: { points: AboutPoint[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const cols = gsap.utils.toArray<HTMLElement>("[data-point]", root);
      const reduce = prefersReducedMotion();
      const played = new Set<number>();

      const sizeSlots = () => {
        root.querySelectorAll<HTMLElement>("[data-dock-slot]").forEach((slot) => {
          // Exactly the traveling squares' size (same shared function, rounded px).
          const n = logoSquareSize(slot.dataset.dockColor as LogoSquareColor, window.innerWidth);
          slot.style.width = slot.style.height = `${n}px`;
        });
      };

      const play = (col: HTMLElement) => {
        const q = (s: string) => col.querySelector(s);
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(q(".pt-num"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
          .fromTo(q(".pt-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, 0.13)
          .fromTo(q(".pt-title"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, 0.26)
          .fromTo(q(".pt-body"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, 0.39)
          .fromTo(q(".pt-img"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9 }, 0.52)
          .fromTo(q(".pt-img-inner"), { scale: 1.04 }, { scale: 1, duration: 0.9 }, 0.52);
      };

      // Docked ⇔ the page has scrolled to (or past) the pass-through point —
      // the same condition the traveling square uses to cross the slot.
      const check = () => {
        const vh = window.innerHeight;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - vh;
        cols.forEach((col, i) => {
          const slot = col.querySelector<HTMLElement>("[data-dock-slot]");
          const ref = slot ?? col.querySelector<HTMLElement>(".pt-head");
          if (!ref) return;
          const top = ref.getBoundingClientRect().top + y;
          const docked = reduce || y >= dockScroll(top, vh) || y >= max - 2;
          if (slot) slot.dataset.docked = String(docked);
          if (docked && !played.has(i)) {
            played.add(i);
            if (!reduce) play(col);
          }
        });
      };

      let raf = 0;
      const schedule = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(check);
      };
      const onResize = () => {
        sizeSlots();
        schedule();
      };

      sizeSlots();
      check();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("load", onResize);
      document.fonts?.ready.then(onResize);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", onResize);
      };
    },
    { scope: rootRef, dependencies: [points.length] },
  );

  return (
    <div ref={rootRef} className="about-points">
      {/* No JS: show everything (the hidden start states are CSS-only). */}
      <noscript>
        <style>{`.about-points .pt-num,.about-points .pt-title,.about-points .pt-body,.about-points .pt-line,.about-points .pt-img,.about-points .about-dock-sq{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
      </noscript>
      <div className="about-points-grid">
        {points.map((pt, i) => {
          const slotColor = SLOT_COLORS[i] as LogoSquareColor | undefined;
          return (
            <article
              key={i}
              data-point
              className="about-point"
              style={{ "--i": i % 3 } as CSSProperties}
            >
              {/* Header row — [number][square slot][line], identical in every column */}
              <div className="pt-head">
                <span className="pt-num font-display">{pad2(i + 1)}</span>
                {slotColor && (
                  <span
                    data-dock-slot
                    data-dock-index={i}
                    data-dock-color={slotColor}
                    aria-hidden="true"
                    className="about-dock-slot"
                    // Same size source as Home / the traveling squares (rounded
                    // to px on mount); this calc is the pre-hydration value.
                    style={{
                      width: `calc(${LOGO_BOX_CSS} * ${LOGO_TRIO[slotColor].width / 100})`,
                      height: `calc(${LOGO_BOX_CSS} * ${LOGO_TRIO[slotColor].width / 100})`,
                    }}
                  >
                    <span className="about-dock-sq" style={{ backgroundColor: SLOT_FILL[slotColor] }} />
                  </span>
                )}
                <span className="pt-line" aria-hidden="true" />
              </div>

              <h2 className="pt-title font-display">{pt.title}</h2>

              <div className="pt-body font-display">
                {pt.paragraphs.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
              </div>

              {/* Portrait image (ratio = --about-img-ratio, default 4:5) or a neutral frame */}
              <div className="pt-img">
                <div className="pt-img-inner">
                  {pt.image ? (
                    <Image
                      src={pt.image.url}
                      alt={pt.image.alt}
                      fill
                      sizes="(min-width: 1024px) min(26vw, 300px), (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
                      quality={85}
                      className="object-cover"
                      style={{ objectPosition: `${pt.image.focalX}% ${pt.image.focalY}%` }}
                    />
                  ) : (
                    // TODO: upload in /studio → About → Sections (portrait 4:5, ~1200×1500)
                    <span className="pt-img-placeholder font-body" aria-hidden="true">
                      [ IMAGE — 4:5 · 1200×1500 ]
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

