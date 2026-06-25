"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { useReducedMotion } from "@/lib/reducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import AccentBlocks from "./AccentBlocks";

/**
 * The signature moment (TASK.md §6). The hero composition reacts to the cursor:
 *
 *  1. Cursor-tracked red light — a soft red focal point eases toward the
 *     pointer (spring), so moving the mouse drags a light across the grain.
 *  2. Reactive grain — a <canvas> noise field paints a denser grain spotlight
 *     that follows the pointer (eased), re-seeded per few frames to shimmer.
 *  3. Parallax — accent blocks, hairline rules and the statement drift on
 *     springs at different depths.
 *
 * Damped springs (not 1:1 jitter). 60fps: pointer writes to motion values /
 * refs, never React state. Touch / no-fine-pointer → gentle ambient autoplay.
 * prefers-reduced-motion → static composition (no canvas, no parallax).
 */
export default function HeroCursorField() {
  const reduce = useReducedMotion();
  // Parallax only on a fine pointer (mouse). Touch keeps the ambient glow +
  // grain but no layout-shifting parallax (which could clip at the edges).
  const finePointer = useMediaQuery("(pointer: fine)");
  const interactive = finePointer && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Normalized pointer 0..1 (raw), drives the eased springs below.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Eased focal point for the red glow.
  const glowX = useSpring(mx, { stiffness: 90, damping: 28, mass: 0.8 });
  const glowY = useSpring(my, { stiffness: 90, damping: 28, mass: 0.8 });
  const gxPct = useTransform(glowX, (v) => v * 100);
  const gyPct = useTransform(glowY, (v) => v * 100);
  const glowBg = useMotionTemplate`radial-gradient(38rem 38rem at ${gxPct}% ${gyPct}%, color-mix(in srgb, var(--rebel-red) 40%, transparent) 0%, color-mix(in srgb, var(--red-deep) 30%, transparent) 26%, transparent 60%)`;

  // Centered parallax springs (-1..1).
  const cx = useSpring(0, { stiffness: 50, damping: 18, mass: 0.7 });
  const cy = useSpring(0, { stiffness: 50, damping: 18, mass: 0.7 });

  // Layer transforms at different depths (small — editorial, not a toy).
  const stmtX = useTransform(cx, (v) => v * -7);
  const stmtY = useTransform(cy, (v) => v * -6);
  const trioAX = useTransform(cx, (v) => v * 14);
  const trioAY = useTransform(cy, (v) => v * 12);
  const trioBX = useTransform(cx, (v) => v * -18);
  const trioBY = useTransform(cy, (v) => v * -14);
  const ruleX = useTransform(cx, (v) => v * 10);

  // Keep raw pointer + parallax springs in sync without re-rendering.
  useEffect(() => {
    const unsub = [
      mx.on("change", (v) => cx.set(v * 2 - 1)),
      my.on("change", (v) => cy.set(v * 2 - 1)),
    ];
    return () => unsub.forEach((u) => u());
  }, [mx, my, cx, cy]);

  // Pointer tracking + reactive grain canvas.
  useEffect(() => {
    if (reduce) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      const r = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Eased pointer in local px (start centered).
    let ex = w / 2,
      ey = h / 2;
    let tx = ex,
      ty = ey;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      mx.set(Math.min(1, Math.max(0, tx / r.width)));
      my.set(Math.min(1, Math.max(0, ty / r.height)));
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    // Noise tile (re-seeded periodically for shimmer).
    const tileSize = 128;
    const tile = document.createElement("canvas");
    tile.width = tile.height = tileSize;
    const tctx = tile.getContext("2d")!;
    const seedNoise = () => {
      const img = tctx.createImageData(tileSize, tileSize);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      tctx.putImageData(img, 0, 0);
    };
    seedNoise();
    let pattern = ctx.createPattern(tile, "repeat")!;

    let raf = 0;
    let frame = 0;
    const SPOT = 300; // spotlight radius (px)

    const draw = (time: number) => {
      frame++;

      // Ambient autoplay when there's no fine pointer (touch).
      if (!fine) {
        const t = time / 1000;
        const ax = (Math.sin(t * 0.45) * 0.5 + 0.5) * 0.7 + 0.15;
        const ay = (Math.cos(t * 0.33) * 0.5 + 0.5) * 0.6 + 0.2;
        tx = ax * w;
        ty = ay * h;
        mx.set(ax);
        my.set(ay);
      }

      // Ease the spotlight toward the target.
      ex += (tx - ex) * 0.09;
      ey += (ty - ey) * 0.09;

      // Re-seed noise every few frames -> grain shimmer.
      if (frame % 3 === 0) {
        seedNoise();
        pattern = ctx.createPattern(tile, "repeat")!;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      // Fill with the noise pattern, jittered slightly.
      const ox = (Math.random() * 6) | 0;
      const oy = (Math.random() * 6) | 0;
      ctx.save();
      ctx.translate(-ox, -oy);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w + ox + 8, h + oy + 8);
      ctx.restore();

      // Mask the grain down to a soft spotlight around the eased pointer.
      ctx.globalCompositeOperation = "destination-in";
      const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, SPOT);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.45, "rgba(255,255,255,0.4)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, mx, my]);

  return (
    <section
      ref={sectionRef}
      aria-label="Rebel Mind Zone hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 sm:px-8"
    >
      {/* Strong red light bed for the hero (over the global ember) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 120% at 100% 100%, color-mix(in srgb, var(--rebel-red) 30%, transparent), transparent 55%)",
        }}
      />

      {/* Cursor-tracked red focal glow (eased) */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glowBg, mixBlendMode: "screen", opacity: 0.9 }}
        />
      )}

      {/* Reactive grain spotlight canvas */}
      {!reduce && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ mixBlendMode: "screen", opacity: 0.32 }}
        />
      )}

      {/* Composition */}
      <div className="relative mx-auto w-full max-w-6xl py-28">
        {/* top hairline + accent trio (parallax) */}
        <motion.div
          style={interactive ? { x: ruleX } : undefined}
          className="mb-10 flex items-center gap-5"
        >
          <motion.span style={interactive ? { x: trioAX, y: trioAY } : undefined}>
            <AccentBlocks size={12} />
          </motion.span>
          <span className="hairline flex-1" />
          <span className="font-body text-cream-dim text-[0.7rem] uppercase tracking-[0.35em]">
            Creative Rebellion
          </span>
        </motion.div>

        {/* the editorial statement (mixed roman/italic/weight) */}
        <motion.h1
          style={interactive ? { x: stmtX, y: stmtY } : undefined}
          className="display-statement text-cream max-w-5xl text-[clamp(2.6rem,8.2vw,7rem)]"
        >
          <span className="font-normal uppercase tracking-[-0.01em]">
            Color palette
          </span>{" "}
          <span className="text-cream-dim italic">balances</span>{" "}
          <span className="font-black uppercase text-rebel-red">
            bold expression
          </span>{" "}
          <span className="text-cream-dim italic">with</span>{" "}
          <span className="italic">Professional Presence.</span>
        </motion.h1>

        {/* bottom hairline + second accent (deeper parallax) */}
        <motion.div
          style={interactive ? { x: ruleX } : undefined}
          className="mt-12 flex items-center gap-5"
        >
          <span className="font-body text-cream-dim max-w-xs text-sm">
            A creative studio for brands with the courage to challenge the
            ordinary.
          </span>
          <span className="hairline flex-1" />
          <motion.span style={interactive ? { x: trioBX, y: trioBY } : undefined}>
            <AccentBlocks size={12} />
          </motion.span>
        </motion.div>
      </div>

      {/* scroll cue, bottom-center */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <motion.span
          className="font-body text-cream-dim flex flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em]"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll
          <span aria-hidden="true" className="text-base leading-none">
            ↓
          </span>
        </motion.span>
      </div>
    </section>
  );
}
