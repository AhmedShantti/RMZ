"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, syncScrollTriggerWithLenis } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/lib/reducedMotion";
import ShowreelModal from "./ShowreelModal";

export type ShowreelVideo = {
  url?: string | null;
  /** Optional 1080p+ source, used on wide screens. */
  hdUrl?: string | null;
  poster?: string | null;
  title?: string;
};

const DEFAULT_VIDEOS: ShowreelVideo[] = [
  { title: "How to succeed" },
  { title: "Think different" },
  { title: "Create bold" },
];

// Video box: full-bleed on phones, ~80% of the viewport width from `sm` up
// (capped so 16:9 always fits under the nav on short/wide screens).
const BOX =
  "relative aspect-video w-screen overflow-hidden bg-[#0e0e0e] sm:w-[min(80vw,calc((100svh_-_7rem)*1.7778))] sm:rounded-lg sm:border sm:border-white/10";

const pad = (n: number) => String(n).padStart(2, "0");
const HD_QUERY = "(min-width: 900px)";

/** Placeholder card while a slot has no video uploaded yet. */
function Placeholder({ title }: { title?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="40" r="39" stroke="white" strokeWidth="1.5" />
        <path d="M33 26 L57 40 L33 54 Z" fill="white" />
      </svg>
      {title && (
        <span className="font-body absolute bottom-3 left-3 text-[11px] uppercase tracking-wide text-white/40">
          {title}
        </span>
      )}
    </div>
  );
}

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
export default function ShowreelSwipe({ videos }: { videos?: ShowreelVideo[] }) {
  const reduce = useReducedMotion();
  const list = videos && videos.length ? videos : DEFAULT_VIDEOS;
  const count = list.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoEls = useRef<(HTMLVideoElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [near, setNear] = useState(false);
  const [hd, setHd] = useState(false);
  // Standalone view (lightbox) of one video, opened by clicking the slider.
  const [modal, setModal] = useState<{ i: number; time: number; opener: HTMLElement } | null>(null);
  const modalRef = useRef(false);
  useEffect(() => {
    modalRef.current = modal !== null;
  }, [modal]);
  const press = useRef<{ x: number; y: number } | null>(null);
  const lastSwipe = useRef(0);

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
  }, [reduce]);

  // Play the active video only while visible; pause the others.
  useEffect(() => {
    videoEls.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView && !modal) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, inView, reduce, modal]);

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
          duration: 0.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [count],
  );

  useGSAP(
    () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (reduce || !stage || !track || count < 2) return;

      const cleanupLenis = syncScrollTriggerWithLenis();
      const last = count - 1;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const settle = () => {
        const st = stRef.current;
        if (!st || !st.isActive || modalRef.current) return;
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

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${last * window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
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
        if (modalRef.current || !inRange() || e.altKey || e.ctrlKey || e.metaKey) return;
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
    { scope: stageRef, dependencies: [reduce, count, goTo, inRange] },
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
    if (!s || modalRef.current || !inRange()) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Next tick: Lenis is still in its touch state right at touchend and
      // would ignore a scrollTo issued now.
      lastSwipe.current = e.timeStamp;
      const next = activeRef.current + (dx < 0 ? 1 : -1);
      setTimeout(() => goTo(next), 50);
    }
  };

  // Open only for a real click/tap on the active video — never after a swipe or drag.
  const openModal = (i: number, el: HTMLElement) => {
    const v = list[i];
    if (!v?.url || modalRef.current) return;
    modalRef.current = true;
    setModal({ i, time: videoEls.current[i]?.currentTime ?? 0, opener: el });
  };
  const onFigureClick = (i: number, e: React.MouseEvent<HTMLElement>) => {
    const p = press.current;
    press.current = null;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) return;
    if (e.timeStamp - lastSwipe.current < 500) return;
    openModal(i, e.currentTarget);
  };
  const closeModal = useCallback(() => setModal(null), []);

  const src = (v: ShowreelVideo) => (hd && v.hdUrl ? v.hdUrl : v.url) ?? undefined;
  const preload = (i: number) =>
    !near ? "none" : i === active || i === active + 1 ? "auto" : "metadata";

  if (reduce) {
    // No pin, no slide: a simple stack. Click a video to play/pause it.
    return (
      <div ref={stageRef} className="flex w-full flex-col items-center gap-8 px-0 py-16 sm:px-6">
        {list.map((v, i) => (
          <figure key={i} className={BOX}>
            {v.url ? (
              <video
                ref={(el) => {
                  videoEls.current[i] = el;
                }}
                className="absolute inset-0 h-full w-full cursor-pointer object-cover"
                src={src(v)}
                poster={v.poster ?? undefined}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={v.title}
                onClick={(e) => {
                  const el = e.currentTarget;
                  if (el.paused) el.play().catch(() => {});
                  else el.pause();
                }}
              />
            ) : (
              <Placeholder title={v.title} />
            )}
          </figure>
        ))}
      </div>
    );
  }

  return (
    <>
    <div
      ref={stageRef}
      data-squares-video
      className="relative h-svh w-full overflow-hidden"
      style={{ touchAction: "pan-y" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${count * 100}%` }}
      >
        {list.map((v, i) => (
          <div
            key={i}
            className="flex h-full shrink-0 items-center justify-center"
            style={{ width: `${100 / count}%` }}
            aria-hidden={i !== active}
          >
            <figure
              className={`${BOX} group ${v.url && i === active ? "cursor-pointer" : ""}`}
              {...(v.url && i === active
                ? {
                    role: "button",
                    tabIndex: 0,
                    "aria-label": v.title ? `Play video with sound: ${v.title}` : "Play video with sound",
                    onPointerDown: (e: React.PointerEvent) => {
                      press.current = { x: e.clientX, y: e.clientY };
                    },
                    onClick: (e: React.MouseEvent<HTMLElement>) => onFigureClick(i, e),
                    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openModal(i, e.currentTarget);
                      }
                    },
                  }
                : { tabIndex: -1 })}
            >
              {v.url ? (
                <video
                  ref={(el) => {
                    videoEls.current[i] = el;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={src(v)}
                  poster={v.poster ?? undefined}
                  muted
                  loop
                  playsInline
                  preload={preload(i)}
                  aria-label={v.title}
                />
              ) : (
                <Placeholder title={v.title} />
              )}
              {v.url && i === active && (
                <span
                  aria-hidden="true"
                  className="font-body pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/80 transition-colors group-hover:border-white/50 group-hover:text-white"
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 1l9 5-9 5z" />
                  </svg>
                  Play with sound
                </span>
              )}
            </figure>
          </div>
        ))}
      </div>

      {/* Progress — same counter treatment as the rest of the site. */}
      <div
        role="status"
        aria-live="polite"
        className="font-body pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 text-[11px] uppercase tabular-nums tracking-wider text-white/60"
      >
        <span>
          {pad(active + 1)}/{pad(count)}
        </span>
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
        {list[active]?.title && <span className="text-white/40">— {list[active].title}</span>}
      </div>
    </div>

    {modal && list[modal.i]?.url && (
      <ShowreelModal
        src={(list[modal.i].hdUrl || list[modal.i].url) as string}
        poster={list[modal.i].poster}
        title={list[modal.i].title}
        startTime={modal.time}
        frameClassName={BOX}
        returnFocusTo={modal.opener}
        onClose={closeModal}
      />
    )}
    </>
  );
}
