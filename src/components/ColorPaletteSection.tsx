"use client";

import { useEffect, useRef, useState } from "react";
import { useAboutProgress } from "./AboutAnimationContext";
import { GREEN, RED, YELLOW, sample } from "./AboutScrollSquares";

const CREAM = "#f5f0e8";

// Fade-in window: text appears as squares approach the 70px "marker" stage.
const FADE_IN_START = 0.06;
const FADE_IN_END = 0.111; // fully visible exactly when squares hit this stage

// Fade-out is tied to the squares' actual size, not scroll distance: as they
// shrink from 70px (stage 0.111) down toward the 18px cluster (stage 0.222),
// the text fades out in lockstep, fully gone right as squares go small.
const SIZE_AT_FADE_START = 70; // px — squares' size where fade-out begins
const SIZE_AT_FADE_END = 18; // px — squares' size where text is fully gone

// Hard upper bound: once scroll passes this, force-hidden forever — prevents
// the text reappearing later when squares happen to grow past 70px again
// (e.g. stages 0.333/0.444/0.667/0.778/0.889 all use larger sizes).
const HARD_CUTOFF = 0.2;

const smooth = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

/** Opacity from scroll-in (fade-in window) combined with size-based fade-out. */
const computeT = (p: number, size: number) => {
  if (p >= HARD_CUTOFF) return 0;

  let fadeIn = 1;
  if (p <= FADE_IN_START) fadeIn = 0;
  else if (p < FADE_IN_END) fadeIn = smooth((p - FADE_IN_START) / (FADE_IN_END - FADE_IN_START));

  let fadeOut = 1;
  if (p >= FADE_IN_END) {
    fadeOut = smooth(
      (size - SIZE_AT_FADE_END) / (SIZE_AT_FADE_START - SIZE_AT_FADE_END),
    );
  }

  return Math.min(fadeIn, fadeOut);
};

const LINE_WIDTH = 48; // px, connector length between square edge and text
const LINE_GAP = 16; // px, gap between line and text

export default function ColorPaletteSection() {
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
      const t = computeT(progress, state.size);

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
          COLORPALATTE balances
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
            BOLD
          </span>{" "}
          <span style={{ fontWeight: 400, letterSpacing: "0.08em" }}>
            EXPRESSION
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
          with Professional Presence
        </p>
      </div>
    </section>
  );
}