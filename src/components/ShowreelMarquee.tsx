"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/reducedMotion";

export type ShowreelVideo = {
  url?: string | null;
  poster?: string | null;
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

function VideoCard({
  idx,
  video,
  active,
  onClick,
  cardRef,
}: {
  idx: number;
  video: ShowreelVideo;
  active: boolean;
  onClick: () => void;
  cardRef?: (el: HTMLElement | null) => void;
}) {
  return (
    <figure
      ref={cardRef}
      data-idx={idx}
      onClick={onClick}
      className={`showreel-card relative shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#0e0e0e] transition-transform duration-300 ${
        active ? "z-20 scale-110" : "scale-100"
      }`}
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
  const activeCardRef = useRef<HTMLElement | null>(null);

  const [focused, setFocused] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const list = videos && videos.length ? videos : DEFAULT_VIDEOS;

  useEffect(() => setMounted(true), []);

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

useEffect(() => {
  if (focused === null) return;

  const handleClick = (e: MouseEvent) => {
    if (
      activeCardRef.current &&
      !activeCardRef.current.contains(e.target as Node)
    ) {
      setFocused(null);
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setFocused(null);
  };

  document.addEventListener("mousedown", handleClick);
  document.addEventListener("keydown", handleKey);

  return () => {
    document.removeEventListener("mousedown", handleClick);
    document.removeEventListener("keydown", handleKey);
  };
}, [focused]);

  if (reduce) {
    return (
      <div className="flex w-full flex-wrap justify-center gap-4 px-5">
        {list.map((v, i) => (
          <VideoCard
          key={i}
          idx={i}
          video={v}
          active={focused === i}
          cardRef={(el) => {
            if (focused === i) activeCardRef.current = el;
          }}
          onClick={() =>
            setFocused((prev) => (prev === i ? null : i))
          }
          />
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
          <VideoCard
            key={i}
            idx={i}
            video={v}
            active={focused === i}
            onClick={() =>
              setFocused((prev) => (prev === i ? null : i))
            }
          />
        ))}
      </div>

      {mounted &&
        createPortal(
          <div
            aria-hidden="true"
            className={`fixed inset-0 z-[45] transition-opacity duration-300 ease-out ${
              active ? "" : "pointer-events-none"
            }`}
            style={{ opacity: active ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setFocused(null)}
            />

            {active && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
                onClick={() => setFocused(null)}
              >
                <div
                  className="relative aspect-video w-[min(80vw,1100px)] overflow-hidden rounded-xl bg-[#0e0e0e] shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
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