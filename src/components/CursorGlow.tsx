"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";

type CursorGlowProps = {
  /** CSS color for the hot center of the glow. */
  color?: string;
  /** CSS color for the outer edge of the glow (fades to transparent past this). */
  colorDeep?: string;
  /** Radius of the glow, as a CSS length (e.g. "38rem"). */
  size?: string;
  /** Spring physics for how eagerly the glow chases the pointer. */
  stiffness?: number;
  damping?: number;
  mass?: number;
  /** Opacity of the glow layer. */
  opacity?: number;
  /** Blend mode — "screen" makes it light up dark backgrounds nicely. */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /**
   * If provided, the glow tracks the pointer *within* this element and is
   * sized/positioned to that element (use for a single section).
   * If omitted, the glow tracks the pointer across the whole viewport and
   * should be mounted once near the root of your app (e.g. in layout).
   */
  containerRef?: React.RefObject<HTMLElement>;
  /** Respect prefers-reduced-motion by hiding the glow entirely. Default true. */
  respectReducedMotion?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A soft, spring-eased colored glow that follows the cursor.
 *
 * Usage (whole page): mount once, fixed to the viewport.
 *   <CursorGlow />
 *
 * Usage (single section): pass a ref to the section you want it confined to.
 *   const ref = useRef<HTMLDivElement>(null);
 *   <div ref={ref} className="relative">
 *     <CursorGlow containerRef={ref} />
 *     ...content...
 *   </div>
 */
export default function CursorGlow({
  color = "#ff3b3b",
  colorDeep = "#8a0000",
  size = "38rem",
  stiffness = 90,
  damping = 28,
  mass = 0.8,
  opacity = 0.9,
  blendMode = "screen",
  containerRef,
  respectReducedMotion = true,
  className = "",
  style,
}: CursorGlowProps) {
  const [reduce, setReduce] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const glowX = useSpring(mx, { stiffness, damping, mass });
  const glowY = useSpring(my, { stiffness, damping, mass });
  const gxPct = useTransform(glowX, (v) => v * 100);
  const gyPct = useTransform(glowY, (v) => v * 100);

  const glowBg = useMotionTemplate`radial-gradient(${size} ${size} at ${gxPct}% ${gyPct}%, color-mix(in srgb, ${color} 40%, transparent) 0%, color-mix(in srgb, ${colorDeep} 30%, transparent) 26%, transparent 60%)`;

  useEffect(() => {
    setMounted(true);
    if (!respectReducedMotion) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [respectReducedMotion]);

  useEffect(() => {
    if (reduce) return;

    const target: HTMLElement | Window =
      containerRef?.current ?? window;

    const onMove = (e: PointerEvent) => {
      if (containerRef?.current) {
        const r = containerRef.current.getBoundingClientRect();
        mx.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
        my.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
      } else {
        mx.set(Math.min(1, Math.max(0, e.clientX / window.innerWidth)));
        my.set(Math.min(1, Math.max(0, e.clientY / window.innerHeight)));
      }
    };

    target.addEventListener("pointermove", onMove as EventListener, {
      passive: true,
    });
    return () =>
      target.removeEventListener("pointermove", onMove as EventListener);
  }, [reduce, mx, my, containerRef]);

  if (!mounted || reduce) return null;

  // Whole-page mode: fixed overlay covering the viewport.
  // Section mode: absolute overlay covering the passed containerRef.
  // If the caller passes their own positioning via `className`, this default
  // still applies but the caller's classes (applied after) win on conflicts
  // since Tailwind resolves by source order in most setups — pass an explicit
  // z-index via `style` for guaranteed stacking control.
  const positionClass = containerRef ? "absolute inset-0" : "fixed inset-0";

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none ${positionClass} ${className}`}
      style={{ background: glowBg, mixBlendMode: blendMode, opacity, ...style }}
    />
  );
}