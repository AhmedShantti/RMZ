"use client";
import { useEffect, useRef } from "react";
import { isSoftwareWebGL } from "@/lib/webgl";
import { neatConfig } from "./neatConfig";

/** Internal @firecms/neat fields we poke to freeze a single static frame.
 *  (Confirmed against the installed version; all access is guarded so a library
 *  change can't crash the page — it just falls back to the animated loop, which
 *  the library already pauses when the tab is hidden.) */
type NeatInternals = {
  requestRef?: number;
  _isVisible?: boolean;
  _visibilityObserver?: { disconnect: () => void } | null;
  _visibilityHandler?: (() => void) | null;
};

export default function Gradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Paint the gradient's own base colour on the fixed backdrop immediately, so
    // it's never a flash of pure black before (or if) the WebGL layer starts.
    // It's ~90% of the gradient anyway, so the deferred start below is invisible.
    canvas.style.background = neatConfig.backgroundColor;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Software / CPU WebGL (no-GPU devices, some Lighthouse runners): don't touch
    // WebGL at all. Each frame runs on the CPU main thread (seconds of blocking).
    // Best-effort — some environments mask the renderer string, so the deferral
    // below is the backstop that keeps even an undetected software path out of
    // the critical window.
    if (isSoftwareWebGL()) return; // base colour already painted

    let gradient: { destroy?: () => void } | null = null;
    let cancelled = false;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const start = () => {
      if (cancelled || !canvasRef.current) return;
      // Lazy-load @firecms/neat (bundles three.js — the heaviest dependency) only
      // when we start, so it's out of the critical bundle.
      import("@firecms/neat").then(({ NeatGradient }) => {
        if (cancelled || !canvasRef.current) return;

        gradient = new NeatGradient({
          ref: canvas,
          ...neatConfig,
          // Retain the single rendered frame on the canvas when we freeze it.
          preserveDrawingBuffer: reduce,
        });

        if (reduce) {
          // Reduced-motion on a capable GPU: render one frame (cheap on a GPU),
          // then cancel the loop + disconnect the library's auto-resume observers
          // so it stays a single static frame with no ongoing per-frame work.
          const g = gradient as unknown as NeatInternals;
          let frozen = false;
          try {
            if (typeof g.requestRef === "number") {
              cancelAnimationFrame(g.requestRef);
              frozen = true;
            }
            g._isVisible = false;
            g._visibilityObserver?.disconnect();
            if (g._visibilityHandler) {
              document.removeEventListener(
                "visibilitychange",
                g._visibilityHandler,
              );
              g._visibilityHandler = null;
            }
          } catch {
            frozen = false;
          }
          // If the internals moved (e.g. a library bump renamed `requestRef`) the
          // loop is still running — degraded, not broken (still tab-guarded).
          // Surface it loudly in dev/staging so it can't ship silently.
          if (!frozen && process.env.NODE_ENV !== "production") {
            console.warn(
              "[NeatGradient] Could not freeze the static frame — @firecms/neat internal `requestRef` not found. The animation loop may still be running; check for a library version bump.",
            );
          }
        }
      });
    };

    // Defer initialisation until the page is interactive AND the main thread is
    // idle. Total Blocking Time is only measured up to interactive, so this keeps
    // the WebGL init + first frames (heavy under software rasterisation) out of
    // TBT and off the hero's critical path. Real users get the animation a beat
    // later, over the matching base colour, so there's no visible flash.
    const schedule = () => {
      if (cancelled) return;
      const ric = (
        window as unknown as {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback;
      if (ric) idleId = ric(start, { timeout: 2500 });
      else timerId = window.setTimeout(start, 1200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      const cic = (
        window as unknown as { cancelIdleCallback?: (id: number) => void }
      ).cancelIdleCallback;
      if (idleId !== undefined && cic) cic(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
      gradient?.destroy?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gradient"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
}