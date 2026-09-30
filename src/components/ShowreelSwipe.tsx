"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/lib/reducedMotion";
import {
  SCROLL_PER_VIDEO,
  SHOWREEL_DEFAULTS,
  SHOWREEL_MAX_WIDTH_PX,
  SHOWREEL_RATIOS,
  TRANSITION_SPEEDS,
  type ShowreelSettings,
} from "@/lib/homeSettings";

export type ShowreelVideo = {
  url?: string | null;
  /** Optional 1080p+ source, used on wide screens. */
  hdUrl?: string | null;
  poster?: string | null;
  /** Caption (optional). */
  title?: string;
  /** Screen-reader description; falls back to the caption. */
  ariaLabel?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const HD_QUERY = "(min-width: 900px)";
const DEFAULT_RATIO = SHOWREEL_RATIOS["16:9"];

// Video box width: full-bleed on phones, the CMS `videoWidth` % of the viewport
// from `sm` up (capped at SHOWREEL_MAX_WIDTH_PX), and never taller than the
// viewport minus room for the nav + counter. --vw / --ratio are set inline.
const BOX =
  "relative w-[min(100vw,calc((100svh_-_7rem)*var(--ratio)))] overflow-hidden bg-[#0e0e0e] sm:w-[min(calc(var(--vw)*1vw),var(--max-w),calc((100svh_-_7rem)*var(--ratio)))] sm:rounded-lg sm:border sm:border-white/10";

/**
 * Pinned, scroll-driven showreel. The stage sticks to the viewport and the
 * videos slide horizontally, one per scroll step (~100vh of scroll each);
 * after the last one the pin releases and the page scrolls on. Scrolling up
 * reverses it. Same GSAP ScrollTrigger + Lenis wiring as the rest of the page.
 *
 *  - Only the active video plays; the rest pause, and everything pauses when
 *    the stage is off-screen. The next video is preloaded.
 *  - Snapping is directional (on scroll-stop it settles on the next stop in the
 *    direction of travel), so a gentle scroll always advances and never traps.
 *  - Left/Right arrows and horizontal touch swipes step between videos.
 *  - prefers-reduced-motion: no pin, no slide — a plain stack of videos.
 */
export default function ShowreelSwipe({
  videos,
  settings = SHOWREEL_DEFAULTS,
}: {
  videos: ShowreelVideo[];
  settings?: ShowreelSettings;
}) {
  const reduce = useReducedMotion();
  const list = videos;
  const count = list.length;
  // 0 videos: nothing to show (VideoSection hides itself). 1 video, or reduced
  // motion: a plain, unpinned layout. Otherwise the pinned swipe.
  const pinned = !reduce && count > 1;
  const autoplay = !reduce;
  const duration = TRANSITION_SPEEDS[settings.transitionSpeed];
  const perVideo = SCROLL_PER_VIDEO[settings.scrollPerVideo];

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoEls = useRef<(HTMLVideoElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [near, setNear] = useState(false);
  const [hd, setHd] = useState(false);
  // Each video's own ratio (from its metadata) — used by aspect "source".
  const [sourceRatios, setSourceRatios] = useState<Record<number, number>>({});

  const ratioOf = (i: number) =>
    settings.aspect === "source"
      ? (sourceRatios[i] ?? DEFAULT_RATIO)
      : SHOWREEL_RATIOS[settings.aspect];
  const boxStyle = (i: number): CSSProperties =>
    ({
      "--vw": settings.videoWidth,
      "--max-w": `${SHOWREEL_MAX_WIDTH_PX}px`,
      "--ratio": ratioOf(i),
      aspectRatio: ratioOf(i),
    }) as CSSProperties;

  useEffect(() => {
    const mq = window.matchMedia(HD_QUERY);
    const sync = () => setHd(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Lazy: don't touch the network until the stage is near the viewport; pause
  // everything once it leaves.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const inViewIo = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    const nearIo = new IntersectionObserver(
      ([e]) => e.isIntersecting && setNear(true),
      { rootMargin: "100% 0px" },
    );
    inViewIo.observe(el);
    nearIo.observe(el);
    return () => {
      inViewIo.disconnect();
      nearIo.disconnect();
    };
  }, [pinned, count]);

  // Play the active video only while visible; pause the others.
  useEffect(() => {
    if (!autoplay) return;
    videoEls.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, inView, autoplay, count]);

  // Scroll is within the pinned stretch, edges included (ScrollTrigger's own
  // `isActive` is false at exactly progress 0 and 1).
  const inRange = useCallback(() => {
    const st = stRef.current;
    if (!st) return false;
    const y = st.scroll();
    return y >= st.start - 2 && y <= st.end + 2;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const st = stRef.current;
      if (!st) return;
      const idx = Math.max(0, Math.min(count - 1, i));
      const y = st.start + (idx / Math.max(1, count - 1)) * (st.end - st.start);
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(y, {
          duration,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [count, duration],
  );

  useGSAP(
    () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!pinned || !stage || !track) return;

      const cleanupLenis = syncScrollTriggerWithLenis();
      const last = count - 1;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const settle = () => {
        const st = stRef.current;
        if (!st || !st.isActive) return;
        // Wait out Lenis's own smoothing before deciding where to land.
        if (getLenis()?.isScrolling === "smooth") return schedule();
        const pos = st.progress * last;
        if (Math.abs(pos - Math.round(pos)) < 0.02) return;
        goTo(st.direction > 0 ? Math.ceil(pos) : Math.floor(pos));
      };
      const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(settle, 130);
      };

      const tween = gsap.to(track, {
        xPercent: (-100 * last) / count,
        ease: "none",
      });

      activeRef.current = 0;
      setActive(0);
      const st = ScrollTrigger.create({
        trigger: stage,
        // Centre the stage in the viewport: identical to "top top" when the
        // stage is full-height (desktop), and keeps the shorter phone stage
        // centred instead of stuck to the top.
        start: "center center",
        end: () => `+=${last * window.innerHeight * perVideo}`,
        pin: true,
        anticipatePin: 1,
        scrub: Math.min(1, duration * 0.75),
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.round(self.progress * last);
          if (i !== activeRef.current) {
            activeRef.current = i;
            setActive(i);
          }
          schedule();
        },
      });
      stRef.current = st;

      const onKey = (e: KeyboardEvent) => {
        if (!inRange() || e.altKey || e.ctrlKey || e.metaKey) return;
        const t = e.target as HTMLElement | null;
        if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
        if (t?.isContentEditable) return;
        if (e.key === "ArrowRight" && activeRef.current < last) {
          e.preventDefault();
          goTo(activeRef.current + 1);
        } else if (e.key === "ArrowLeft" && activeRef.current > 0) {
          e.preventDefault();
          goTo(activeRef.current - 1);
        }
      };
      window.addEventListener("keydown", onKey);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", onKey);
        cleanupLenis();
        stRef.current = null;
        st.kill();
        tween.kill();
      };
    },
    { scope: stageRef, dependencies: [pinned, count, goTo, inRange, perVideo, duration] },
  );

  // Horizontal swipe on touch screens (vertical drags stay native page scroll).
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s || !inRange()) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Next tick: Lenis is still in its touch state right at touchend and
      // would ignore a scrollTo issued now.
      const next = activeRef.current + (dx < 0 ? 1 : -1);
      setTimeout(() => goTo(next), 50);
    }
  };

  if (!count) return null;

  const src = (v: ShowreelVideo) => (hd && v.hdUrl ? v.hdUrl : v.url) ?? undefined;
  const preload = (i: number) =>
    !near ? "none" : !pinned || i === active || i === active + 1 ? "auto" : "metadata";
  const label = (v: ShowreelVideo) => v.ariaLabel || v.title;
  const fit = settings.objectFit === "contain" ? "object-contain" : "object-cover";

  const videoEl = (v: ShowreelVideo, i: number, extra = "") => (
    <video
      ref={(el) => {
        videoEls.current[i] = el;
      }}
      className={`absolute inset-0 h-full w-full ${fit} ${extra}`}
      src={src(v)}
      poster={v.poster ?? undefined}
      muted
      loop
      playsInline
      preload={preload(i)}
      aria-label={label(v)}
      onLoadedMetadata={(e) => {
        const { videoWidth: w, videoHeight: h } = e.currentTarget;
        if (settings.aspect === "source" && w && h) {
          setSourceRatios((r) => (r[i] === w / h ? r : { ...r, [i]: w / h }));
        }
      }}
    />
  );

  if (!pinned) {
    // One video (or reduced motion): no pin, no slide — a plain stack. Reduced
    // motion doesn't autoplay; click a video to play/pause it.
    return (
      <div ref={stageRef} className="flex w-full flex-col items-center gap-10 px-0 py-16 sm:px-6">
        {list.map((v, i) => (
          <figure key={i} className="flex w-full flex-col items-center gap-3">
            <div className={BOX} style={boxStyle(i)}>
              {videoEl(
                v,
                i,
                autoplay ? "" : "cursor-pointer",
              )}
              {!autoplay && (
                <button
                  type="button"
                  aria-label={`Play or pause${label(v) ? `: ${label(v)}` : ""}`}
                  className="absolute inset-0"
                  onClick={() => {
                    const el = videoEls.current[i];
                    if (!el) return;
                    if (el.paused) el.play().catch(() => {});
                    else el.pause();
                  }}
                />
              )}
            </div>
            {settings.showCaptions && v.title && (
              <figcaption className="font-body text-[11px] uppercase tracking-wider text-white/50">
                {v.title}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  }

  const caption = settings.showCaptions ? list[active]?.title : undefined;
  const showBar = settings.showCounter || settings.showDots || !!caption;

  return (
    <div
      ref={stageRef}
      data-squares-video
      className="relative flex w-full flex-col overflow-hidden pb-2 pt-16 sm:h-svh sm:pb-0 sm:pt-0"
      style={{ touchAction: "pan-y" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform sm:h-full"
        style={{ width: `${count * 100}%` }}
      >
        {list.map((v, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center justify-center sm:h-full"
            style={{ width: `${100 / count}%` }}
            aria-hidden={i !== active}
          >
            <figure className={BOX} style={boxStyle(i)}>
              {videoEl(v, i)}
            </figure>
          </div>
        ))}
      </div>

      {/* Progress — same counter treatment as the rest of the site. Reserved
          height, so toggling captions never moves the video. */}
      <div
        role="status"
        aria-live="polite"
        className="font-body pointer-events-none relative flex h-12 items-center justify-center gap-3 px-4 text-[11px] uppercase tabular-nums tracking-wider text-white/60 sm:absolute sm:inset-x-0 sm:bottom-6 sm:h-auto"
      >
        {showBar && (
          <>
            {settings.showCounter && (
              <span>
                {pad(active + 1)}/{pad(count)}
              </span>
            )}
            {settings.showDots && (
              <span className="flex gap-1.5" aria-hidden="true">
                {list.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                      i === active ? "bg-white" : "bg-white/25"
                    }`}
                  />
                ))}
              </span>
            )}
            {caption && (
              <span className="truncate text-white/40">
                {settings.showCounter || settings.showDots ? "— " : ""}
                {caption}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
