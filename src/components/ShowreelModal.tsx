"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Standalone view for a showreel video: a lightbox opened from the pinned
 * slider, at the same displayed size as the slider's video (`frameClassName`),
 * playing WITH sound (the open comes from a user click, so unmuted play() is
 * allowed; if the browser still refuses we fall back to muted + a visible
 * unmute button).
 *
 * Rendered through a portal on <body> (the slider's pinned/transformed
 * container would break `position: fixed`). While open it locks page scroll
 * (Lenis + native), traps focus, and closes on backdrop click, Escape, the X
 * button, or when the page is hidden. Focus returns to `returnFocusTo`.
 */
export type ShowreelModalProps = {
  src: string;
  poster?: string | null;
  title?: string;
  /** Continue from this playback time (the slider video's currentTime). */
  startTime?: number;
  /** Same sizing classes as the slider's video box. */
  frameClassName: string;
  /** Element that opened the modal — focus goes back to it on close. */
  returnFocusTo?: HTMLElement | null;
  onClose: () => void;
};

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const FOCUSABLE = 'button, input, [href], [tabindex]:not([tabindex="-1"])';

export default function ShowreelModal({
  src,
  poster,
  title,
  startTime = 0,
  frameClassName,
  returnFocusTo,
  onClose,
}: ShowreelModalProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const downOnBackdrop = useRef(false);

  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const close = useCallback(() => onClose(), [onClose]);

  // Fade/scale in on the next frame (instant under reduced motion).
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Lock page scroll while open; restore on close.
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, pad: document.body.style.paddingRight };
    const sbw = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      html.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.pad;
      lenis?.start();
    };
  }, []);

  // Focus in on open, back to the opener on close.
  useEffect(() => {
    const root = rootRef.current;
    root?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => returnFocusTo?.focus({ preventScroll: true });
  }, [returnFocusTo]);

  // Escape, focus trap, and close when the page is hidden.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const a = document.activeElement;
      if (e.shiftKey && (a === first || !rootRef.current?.contains(a))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (a === last || !rootRef.current?.contains(a))) {
        e.preventDefault();
        first.focus();
      }
    };
    const onHidden = () => document.hidden && close();
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [close]);

  // Start playback with sound from the slider's current time.
  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    if (startTime > 0 && startTime < v.duration) v.currentTime = startTime;
    v.muted = false;
    v.play().catch(() => {
      // Autoplay-with-sound refused: fall back to muted, offer an unmute button.
      v.muted = true;
      setMuted(true);
      setNeedsUnmute(true);
      v.play().catch(() => {});
    });
  };

  // Unload the media on close so nothing keeps buffering or playing.
  useEffect(() => {
    const v = videoRef.current;
    return () => {
      if (!v) return;
      v.pause();
      // Only once the element is really gone (not on a StrictMode re-mount).
      setTimeout(() => {
        if (v.isConnected) return;
        v.removeAttribute("src");
        v.load();
      }, 0);
    };
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) setNeedsUnmute(false);
  };

  const dur = reduce ? "0.01ms" : "350ms";
  const btn =
    "font-body flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 px-2 text-[11px] uppercase tracking-wider text-white/80 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-white";

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Video: ${title}` : "Video"}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      style={{ opacity: shown ? 1 : 0, transition: `opacity ${dur} cubic-bezier(0.16,1,0.3,1)` }}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Only a press AND release on the backdrop closes (a drag that ends
        // there, e.g. from the seek bar, must not).
        if (e.target === e.currentTarget && downOnBackdrop.current) close();
        downOnBackdrop.current = false;
      }}
    >
      <button
        type="button"
        data-close
        aria-label="Close video"
        onClick={close}
        className={`${btn} absolute right-4 top-4 h-10 w-10 text-lg sm:right-6 sm:top-6`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={frameClassName}
        style={{
          transform: shown || reduce ? "scale(1)" : "scale(0.96)",
          transition: `transform ${dur} cubic-bezier(0.16,1,0.3,1)`,
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          src={src}
          poster={poster ?? undefined}
          loop
          playsInline
          preload="auto"
          aria-label={title}
          onClick={toggle}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        />

        {needsUnmute && (
          <button
            type="button"
            onClick={toggleMute}
            className={`${btn} absolute left-3 top-3 px-3`}
          >
            Sound off — tap to unmute
          </button>
        )}

        {/* Minimal control bar: play/pause, seek, mute, volume. */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={btn}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <rect x="1.5" y="1" width="3" height="10" />
                <rect x="7.5" y="1" width="3" height="10" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M2 1l9 5-9 5z" />
              </svg>
            )}
          </button>
          <span className="font-body hidden w-10 text-[11px] tabular-nums text-white/60 sm:block">{fmt(time)}</span>
          <input
            type="range"
            aria-label="Seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            onChange={(e) => {
              const v = videoRef.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-white"
          />
          <span className="font-body hidden w-10 text-[11px] tabular-nums text-white/60 sm:block">{fmt(duration)}</span>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} className={btn}>
            {muted ? "Muted" : "Sound"}
          </button>
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = videoRef.current;
              const val = Number(e.target.value);
              setVolume(val);
              if (v) {
                v.volume = val;
                v.muted = val === 0;
                setMuted(v.muted);
                if (val > 0) setNeedsUnmute(false);
              }
            }}
            className="hidden h-1 w-20 cursor-pointer accent-white sm:block"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
