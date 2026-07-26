"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Showreel slider — three video placeholders that auto-advance one at a time,
 * moving left→right, looping forever. Sits in the 16:9 frame between the two
 * coloured strips (VideoSection).
 *
 * LTR motion: the current slide sits centred (0%); the slide that just left
 * exits to the RIGHT (+100%); every other slide waits off-screen to the LEFT
 * (−100%), ready to enter from the left. Only the current/previous slides
 * transition — the rest snap (transition: none) so they never fly across the
 * frame while resetting from +100% back to −100%.
 *
 * Placeholders for now (play button + label) — swap in real <video>/<iframe>
 * per slide, or wire a CMS array, later.
 */
const SLIDES = [
  { label: "Video 1 — replace" },
  { label: "Video 2 — replace" },
  { label: "Video 3 — replace" },
];
const INTERVAL_MS = 4500;
const SLIDE_MS = 800;

export default function ShowreelSlider() {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const len = SLIDES.length;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % len),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [reduce, len]);

  const previous = (current - 1 + len) % len;

  return (
    <div className="relative aspect-video flex-1 overflow-hidden bg-[#0e0e0e]">
      {SLIDES.map((s, i) => {
        const isCurrent = i === current;
        const isPrevious = i === previous;
        const x = isCurrent ? "0%" : isPrevious ? "100%" : "-100%";
        const animate = isCurrent || isPrevious;
        return (
          <div
            key={i}
            aria-hidden={!isCurrent}
            className="absolute inset-0 flex items-center justify-center bg-[#0e0e0e]"
            style={{
              transform: `translateX(${x})`,
              transition:
                animate && !reduce
                  ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
                  : "none",
            }}
          >
            {/* TODO: replace with the real showreel video for this slide */}
            <svg
              width="78"
              height="78"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rmz-pulse"
              aria-hidden="true"
            >
              <circle cx="40" cy="40" r="39" stroke="white" strokeWidth="1.5" />
              <path d="M33 26 L57 40 L33 54 Z" fill="white" />
            </svg>
            <span className="font-body absolute bottom-4 left-4 text-[11px] uppercase tracking-wide text-white/40">
              {s.label}
            </span>
          </div>
        );
      })}

      {/* slide indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                i === current ? "var(--cream)" : "rgba(255,255,255,0.28)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
