"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Showreel marquee — a full-width row of large videos that moves left→right as
 * the page is scrolled (scroll-scrubbed, not a continuous auto-loop). Hovering
 * a video opens a spotlight: the rest of the page is covered by an 80% black
 * overlay and the hovered clip plays, centred and enlarged, with its title
 * below. The spotlight is a body-level portal so it sits cleanly above the whole
 * page (below only the nav/menu chrome). Touch / no-hover / reduced-motion get a
 * static row with no scroll movement and no spotlight.
 *
 * Placeholders for now — pass `videos` with a `url` to drop real clips in.
 */
export type ShowreelVideo = {
  url?: string | null;
  poster?: string | null;
  /** Shown in the spotlight overlay on hover. */
  title?: string;
};

const DEFAULT_VIDEOS: ShowreelVideo[] = [
  { title: "How to succeed" },
  { title: "Think different" },
  { title: "Create bold" },
];

const CARD_W = "clamp(300px, 56vw, 760px)";

function PlayGlyph({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="39" stroke="white" strokeWidth="1.5" />
      <path d="M33 26 L57 40 L33 54 Z" fill="white" />
    </svg>
  );
}

function VideoCard({ idx, video }: { idx: number; video: ShowreelVideo }) {
  return (
    <figure
      data-idx={idx}
      className="showreel-card relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0e0e0e]"
      style={{ width: CARD_W, aspectRatio: "16 / 9" }}
    >
      {video.url ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={video.url}
          poster={video.poster ?? undefined}
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayGlyph />
          {video.title && (
            <span className="font-body absolute bottom-3 left-3 text-[11px] uppercase tracking-wide text-white/40">
              {video.title}
            </span>
          )}
        </div>
      )}
    </figure>
  );
}

export default function ShowreelMarquee({
  videos,
}: {
  videos?: ShowreelVideo[];
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // CMS videos when present, else the built-in placeholders.
  const list = videos && videos.length ? videos : DEFAULT_VIDEOS;

  useEffect(() => setMounted(true), []);

  // Scroll-driven left→right movement: map the section's scroll progress to the
  // row's translateX. As the page scrolls down the row slides right (from fully
  // shifted-left to its origin), so the videos read left→right.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    const row = rowRef.current;
    if (!root || !row) return;

    const cleanupLenis = syncScrollTriggerWithLenis();
    const section = root.closest("section") ?? root;
    const setX = gsap.quickSetter(row, "x", "px") as (v: number) => void;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const overflow = Math.max(0, row.scrollWidth - root.clientWidth);
        setX(-overflow * (1 - self.progress));
      },
    });
    return () => {
      st.kill();
      cleanupLenis();
    };
  }, [reduce, list.length]);

  // Hover focus — pointer over any card opens the spotlight; leaving the row
  // closes it. Only on real hover devices.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canHover) return;

    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(
        ".showreel-card",
      );
      if (card?.dataset.idx) setFocused(Number(card.dataset.idx));
    };
    const onLeave = () => setFocused(null);
    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  // Static, non-scrolling fallback (reduced-motion / SSR-safe base).
  if (reduce) {
    return (
      <div className="flex w-full flex-wrap justify-center gap-4 px-5">
        {list.map((v, i) => (
          <VideoCard key={i} idx={i} video={v} />
        ))}
      </div>
    );
  }

  const active = focused != null ? list[focused] : null;

  return (
    <div ref={rootRef} className="relative w-full overflow-hidden">
      <div
        ref={rowRef}
        className="flex w-max items-center gap-6 px-6 will-change-transform"
      >
        {list.map((v, i) => (
          <VideoCard key={i} idx={i} video={v} />
        ))}
      </div>

      {/* Spotlight overlay — body-level portal so it covers the whole page. */}
      {mounted &&
        createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[45] transition-opacity duration-300 ease-out"
            style={{ opacity: active ? 1 : 0 }}
          >
            <div className="absolute inset-0 bg-black/80" />
            {active && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
                <div className="relative aspect-video w-[min(80vw,1100px)] overflow-hidden rounded-xl bg-[#0e0e0e] shadow-2xl">
                  {active.url ? (
                    <video
                      key={focused}
                      className="h-full w-full object-cover"
                      src={active.url}
                      poster={active.poster ?? undefined}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PlayGlyph size={88} />
                    </div>
                  )}
                </div>
                {active.title && (
                  <h3 className="font-display text-cream text-center text-3xl italic sm:text-5xl">
                    {active.title}
                  </h3>
                )}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
