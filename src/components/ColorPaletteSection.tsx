"use client";

import { useEffect, useRef, useState } from "react";
import { useAboutProgress } from "./AboutAnimationContext";
import { GREEN, RED, YELLOW, sample } from "./AboutScrollSquares";

const CREAM = "#f5f0e8";

// Fade-in window: text appears as squares approach the 70px "marker" stage.
// Fade-in window: text appears as squares approach the 70px "marker" stage.
const FADE_IN_START = 0.06;
const FADE_IN_END = 0.111; // fully visible exactly when squares hit this stage

// Fade-out is now scroll-progress based: begins right as squares start
// regrouping back toward the centred row, and finishes a little before
// they land at 0.222 (stage 3 — composed row again), so the text is
// fully gone before the squares recompose.
const FADE_OUT_START = 0.111;
const FADE_OUT_END = 0.2; // fully gone shortly before the 0.222 regroup

// Hard upper bound: once scroll passes this, force-hidden forever — prevents
// the text reappearing later when squares happen to grow past 70px again
// (e.g. stages 0.333/0.444/0.667/0.778/0.889 all use larger sizes).
const HARD_CUTOFF = FADE_OUT_END + 0.0005;

const smooth = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

/** Opacity from scroll-in (fade-in window) combined with scroll-out (fade-out window). */
const computeT = (p: number) => {
  if (p >= HARD_CUTOFF) return 0;

  let fadeIn = 1;
  if (p <= FADE_IN_START) fadeIn = 0;
  else if (p < FADE_IN_END) fadeIn = smooth((p - FADE_IN_START) / (FADE_IN_END - FADE_IN_START));

  let fadeOut = 1;
  if (p >= FADE_OUT_START) {
    fadeOut = 1 - smooth((p - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START));
  }

  return Math.min(fadeIn, fadeOut);
};

const LINE_WIDTH = 48; // px, connector length between square edge and text
const LINE_GAP = 16; // px, gap between line and text

/** Copy for the three scroll-revealed lines (from aboutContent → CMS). */
type ColorPaletteCopy = {
  line1: string;
  line2Lead: string;
  line2Rest: string;
  line3: string;
};

export default function ColorPaletteSection({
  copy,
}: {
  copy: ColorPaletteCopy;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const yellowLineRef = useRef<HTMLParagraphElement>(null);
  const greenLineRef = useRef<HTMLParagraphElement>(null);
  const redLineRef = useRef<HTMLParagraphElement>(null);
  const yellowConnectorRef = useRef<HTMLDivElement>(null);
  const greenConnectorRef = useRef<HTMLDivElement>(null);
  const redConnectorRef = useRef<HTMLDivElement>(null);

  const progress = useAboutProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const greenState = sample(GREEN, progress, vw, vh);
    const redState = sample(RED, progress, vw, vh);
    const yellowState = sample(YELLOW, progress, vw, vh);

    const positionLine = (
      el: HTMLParagraphElement | null,
      connectorEl: HTMLDivElement | null,
      state: { x: number; y: number; size: number },
      fromRight: boolean,
    ) => {
      if (!el) return;
      const centerY = state.y + state.size / 2;
      const t = computeT(progress);

      el.style.position = "fixed";
      el.style.top = `${centerY}px`;
      el.style.opacity = String(t);
      el.style.pointerEvents = t > 0.05 ? "auto" : "none";
      el.style.transform = `translateY(calc(-50% + ${(1 - t) * 40}px))`;
      if (fromRight) {
        el.style.right = `${vw - state.x + LINE_WIDTH + LINE_GAP}px`;
        el.style.left = "auto";
      } else {
        el.style.left = `${state.x + state.size + LINE_WIDTH + LINE_GAP}px`;
        el.style.right = "auto";
      }

      if (!connectorEl) return;
      connectorEl.style.position = "fixed";
      connectorEl.style.top = `${centerY}px`;
      connectorEl.style.width = `${LINE_WIDTH}px`;
      connectorEl.style.height = "1px";
      connectorEl.style.opacity = String(t);
      connectorEl.style.transform = "translateY(-50%)";
      if (fromRight) {
        connectorEl.style.right = `${vw - state.x}px`;
        connectorEl.style.left = "auto";
      } else {
        connectorEl.style.left = `${state.x + state.size}px`;
        connectorEl.style.right = "auto";
      }
    };

    positionLine(yellowLineRef.current, yellowConnectorRef.current, yellowState, false);
    positionLine(greenLineRef.current, greenConnectorRef.current, greenState, true);
    positionLine(redLineRef.current, redConnectorRef.current, redState, false);
  }, [progress, mounted]);

  return (
    <section
      id="about-colorpalette"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: "60vh", zIndex: 0 }}
    >
      <div style={{ position: "relative" }}>
        <div
          ref={yellowConnectorRef}
          style={{ background: "rgba(255,255,255,0.6)", opacity: 0 }}
        />
        <p
          ref={yellowLineRef}
          className="font-body"
          style={{
            fontFamily: "text-cream-dim",
            fontSize: "clamp(18px,2.5vw,28px)",
            fontWeight: 400,
            color: CREAM,
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          {copy.line1}
        </p>

        <div
          ref={greenConnectorRef}
          style={{ background: "rgba(255,255,255,0.6)", opacity: 0 }}
        />
        <p
          ref={greenLineRef}
          className="font-body"
          style={{
            fontSize: "clamp(18px,2.5vw,28px)",
            opacity: 0,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 900, fontStyle: "italic", color: CREAM }}>
            {copy.line2Lead}
          </span>{" "}
          <span style={{ fontWeight: 400, letterSpacing: "0.08em" }}>
            {copy.line2Rest}
          </span>
        </p>

        <div
          ref={redConnectorRef}
          style={{ background: "rgba(255,255,255,0.6)", opacity: 0 }}
        />
        <p
          ref={redLineRef}
          className="font-body"
          style={{
            fontSize: "clamp(18px,2.5vw,28px)",
            fontWeight: 400,
            color: CREAM,
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          {copy.line3}
        </p>
      </div>
    </section>
  );
}