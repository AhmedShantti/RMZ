"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * First-visit intro loader — 3-phase choreographed square sequence
 * (animation-prompt.md / animation-task.md):
 *
 *   Phase 1 (initial) — Green · Orange · Yellow enter centred, side by side
 *                       (staggered fade-in, 600ms), then hold 800ms.
 *   Phase 2 (scatter) — all three move simultaneously (900ms): green to
 *                       left-centre, yellow upper-right (bottom on 50vh),
 *                       orange directly below yellow (gap = S).
 *   Phase 3 (final)   — positions hold; the brand label fades in (600ms),
 *                       then the curtain wipes up to reveal the site.
 *
 * JS only toggles `data-phase` + handles timing; CSS (globals.css) owns every
 * visual state. All motion is transform/opacity, positions viewport-relative.
 *
 *  - Plays ONCE per browser session (sessionStorage); never on client-side nav.
 *  - Skippable — click or any key finishes immediately.
 *  - prefers-reduced-motion → jumps straight to the final state, no animation.
 *  - `enabled` is the CMS intro-loader toggle.
 */
const KEY = "rmz_intro_seen";
type Phase = "initial" | "scatter" | "final";

// Timing (ms) — per the prompt's sequence.
const ENTRY = 600;
const HOLD = 800;
const SCATTER = 900;
const FINAL = 600;
const REVEAL = 700; // curtain wipe (matches CSS clip-path transition)

export default function IntroLoader({ enabled = true }: { enabled?: boolean }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("initial");
  const [exiting, setExiting] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const finish = useCallback(() => {
    clearTimers();
    sessionStorage.setItem(KEY, "1");
    setExiting(true);
    timers.current.push(
      window.setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
      }, REVEAL),
    );
  }, []);

  useEffect(() => {
    if (!enabled) return; // CMS toggle: loader disabled
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY) === "1") return; // once per session

    // Mount-time decision (sessionStorage is unavailable during SSR). The seen
    // flag is written in finish(), so Strict Mode's double-invoke can't strand
    // the loader on screen.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    document.body.style.overflow = "hidden";

    if (reduce) {
      // Reduced motion: skip directly to the final state (CSS makes it instant),
      // hold briefly, then reveal — no choreography.
      setPhase("final");
      timers.current.push(window.setTimeout(finish, FINAL));
      return clearTimers;
    }

    const t = timers.current;
    t.push(window.setTimeout(() => setPhase("scatter"), ENTRY + HOLD));
    t.push(window.setTimeout(() => setPhase("final"), ENTRY + HOLD + SCATTER));
    t.push(window.setTimeout(finish, ENTRY + HOLD + SCATTER + FINAL));
    return clearTimers;
  }, [enabled, reduce, finish]);

  // Skip on any click / key.
  useEffect(() => {
    if (!show) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [show, finish]);

  if (!show) return null;

  return (
    <div
      className="intro-loader fixed inset-0"
      data-phase={phase}
      data-exiting={exiting ? "true" : undefined}
      style={{ zIndex: "var(--z-loader)" }}
      aria-hidden="true"
    >
      <div className="intro-redlight" />
      <span className="intro-block intro-block-green" />
      <span className="intro-block intro-block-orange" />
      <span className="intro-block intro-block-yellow" />
      <span className="intro-label font-body text-cream-dim text-[0.65rem] uppercase tracking-[0.5em]">
        Rebel Mind Zone
      </span>
    </div>
  );
}
