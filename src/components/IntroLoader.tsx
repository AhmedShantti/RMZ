"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * First-visit intro loader (TASK.md §5.1, storyboard p.1–2): the accent trio
 * animates in on black with the red corner light, briefly rearranges, then the
 * curtain wipes up to reveal the site.
 *
 *  - Plays ONCE per browser session (sessionStorage) — does NOT replay on
 *    client-side navigation (the explicit requirement). New session replays.
 *  - Skippable — click or any key finishes immediately.
 *  - prefers-reduced-motion → resolves to the final state instantly (no anim).
 */
const KEY = "rmz_intro_seen";
const EASE = [0.16, 1, 0.3, 1] as const;

// storyboard order: green / orange / yellow
const TRIO = ["var(--acc-green)", "var(--acc-orange)", "var(--acc-yellow)"];

export default function IntroLoader({ enabled = true }: { enabled?: boolean }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem(KEY, "1");
    setDone(true);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!enabled) return; // CMS toggle: loader disabled
    const seen =
      typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1";
    if (seen) return;

    if (reduce) {
      // reduced motion → show final state instantly; mark as seen, never show
      sessionStorage.setItem(KEY, "1");
      return;
    }
    // Mount-time decision based on sessionStorage (unavailable during SSR), so
    // it must live in an effect. The seen flag is written in finish(), not
    // here, so Strict Mode's double-invoke can't strand the loader on-screen.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    document.body.style.overflow = "hidden";

    const t = setTimeout(finish, 1750);
    return () => clearTimeout(t);
  }, [enabled, reduce, finish]);

  useEffect(() => {
    if (!show) return;
    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    return () => {
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [show, finish]);

  if (!show) return null;

  return (
    <AnimatePresence onExitComplete={() => setShow(false)}>
      {!done && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: "var(--z-loader)", background: "var(--ink)" }}
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* red corner light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 90% at 100% 100%, color-mix(in srgb, var(--rebel-red) 34%, transparent), transparent 55%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            <div className="flex gap-3">
              {TRIO.map((c, i) => (
                <motion.span
                  key={c}
                  className="block h-7 w-7 sm:h-9 sm:w-9"
                  style={{ backgroundColor: c }}
                  initial={{ y: -40, opacity: 0, scale: 0.6 }}
                  animate={{
                    y: [-40, 0, 0, 0],
                    opacity: [0, 1, 1, 1],
                    scale: [0.6, 1, 1, 1],
                    x: [0, 0, (1 - i) * 14, 0],
                  }}
                  transition={{
                    duration: 1.3,
                    times: [0, 0.3, 0.65, 1],
                    delay: i * 0.08,
                    ease: EASE,
                  }}
                />
              ))}
            </div>
            <motion.span
              className="font-body text-cream-dim text-[0.65rem] uppercase tracking-[0.5em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.8] }}
              transition={{ duration: 1.4, times: [0, 0.5, 1] }}
            >
              Rebel Mind Zone
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
