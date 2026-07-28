"use client";

import { useEffect, useRef } from "react";
import { Marquee } from "./ui/marquee";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Showreel marquee — a full-width, continuous right-to-left row of large videos.
 * Hovering one pauses the row, scales that video up (centred on itself) and
 * plays it, while the rest blur back so the playing one is the focus. The
 * hovered video also reveals its own top + bottom label bars (the old green/
 * orange strips, now per-video). Touch / no-hover devices and reduced-motion
 * get a static, non-scrolling row (no play/scale/bars).
 *
 * Placeholders for now (play button + label) — pass `videos` with a `url` to
 * drop real clips in; each becomes a muted, looping <video> that plays on hover.
 */
export type ShowreelVideo = {
  url?: string | null;
  poster?: string | null;
  label?: string;
  /** Bars revealed on the hovered/scaled video — different per video. */
  topLabel?: string;
  bottomLabel?: string;
};

const DEFAULT_VIDEOS: ShowreelVideo[] = [
  {
    label: "Video 1 — replace",
    topLabel: "How to success",
    bottomLabel: "How to be rebel",
  },
  {
    label: "Video 2 — replace",
    topLabel: "Think different",
    bottomLabel: "Break the mould",
  },
  {
    label: "Video 3 — replace",
    topLabel: "Create bold",
    bottomLabel: "Stay rebel",
  },
];

const CARD_W = "clamp(300px, 56vw, 760px)";
const BAR_TRANSITION =
  "opacity 0.4s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)";

function VideoCard({ video }: { video: ShowreelVideo }) {
  return (
    <figure
      className="showreel-card relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0e0e0e]"
      style={{
        width: CARD_W,
        aspectRatio: "16 / 9",
        transformOrigin: "center center",
        willChange: "transform, filter",
        transition:
          "transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease",
      }}
    >
      {video.url ? (
        <video
          className="showreel-video absolute inset-0 h-full w-full object-cover"
          src={video.url}
          poster={video.poster ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="40" cy="40" r="39" stroke="white" strokeWidth="1.5" />
            <path d="M33 26 L57 40 L33 54 Z" fill="white" />
          </svg>
          {video.label && (
            <span className="font-body absolute bottom-3 left-3 text-[11px] uppercase tracking-wide text-white/40">
              {video.label}
            </span>
          )}
        </div>
      )}

      {/* Top / bottom label bars — hidden until the card is the hovered focus. */}
      {video.topLabel && (
        <div
          className="showreel-bar-top pointer-events-none absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-center"
          style={{
            backgroundColor: "var(--acc-green)",
            opacity: 0,
            transform: "translateY(-100%)",
            transition: BAR_TRANSITION,
          }}
        >
          <span className="font-body text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/95">
            {video.topLabel}
          </span>
        </div>
      )}
      {video.bottomLabel && (
        <div
          className="showreel-bar-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-10 items-center justify-center"
          style={{
            backgroundColor: "var(--acc-orange)",
            opacity: 0,
            transform: "translateY(100%)",
            transition: BAR_TRANSITION,
          }}
        >
          <span className="font-body text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/95">
            {video.bottomLabel}
          </span>
        </div>
      )}
    </figure>
  );
}

export default function ShowreelMarquee({
  videos = DEFAULT_VIDEOS,
}: {
  videos?: ShowreelVideo[];
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !canHover) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>(".showreel-card"),
    ).map((el) => ({
      el,
      video: el.querySelector<HTMLVideoElement>(".showreel-video"),
      top: el.querySelector<HTMLElement>(".showreel-bar-top"),
      bottom: el.querySelector<HTMLElement>(".showreel-bar-bottom"),
    }));
    if (!items.length) return;

    const apply = (focused: HTMLElement | null) => {
      for (const { el, video, top, bottom } of items) {
        const isFocus = el === focused;
        el.style.transform = isFocus ? "scale(1.1)" : "";
        el.style.filter =
          focused && !isFocus ? "blur(5px) brightness(0.6)" : "";
        el.style.zIndex = isFocus ? "3" : "1";
        if (top) {
          top.style.opacity = isFocus ? "1" : "0";
          top.style.transform = isFocus ? "translateY(0)" : "translateY(-100%)";
        }
        if (bottom) {
          bottom.style.opacity = isFocus ? "1" : "0";
          bottom.style.transform = isFocus
            ? "translateY(0)"
            : "translateY(100%)";
        }
        if (video) {
          if (isFocus) void video.play().catch(() => {});
          else video.pause();
        }
      }
    };

    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(
        ".showreel-card",
      );
      if (card) apply(card);
    };
    const onLeave = () => apply(null);
    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, videos.length]);

  if (reduce) {
    return (
      <div className="flex w-full flex-wrap justify-center gap-4 px-5">
        {videos.map((v, i) => (
          <VideoCard key={i} video={v} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative flex w-full items-center overflow-x-clip overflow-y-visible"
    >
      <Marquee pauseOnHover className="w-full [--duration:38s] [--gap:1.5rem]">
        {videos.map((v, i) => (
          <VideoCard key={i} video={v} />
        ))}
      </Marquee>
    </div>
  );
}
