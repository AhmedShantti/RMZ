"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Marquee } from "./ui/marquee";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * The three brand squares end their journey here: they morph into three
 * portrait cards (aspect 3/4, brand colours) that then recur across the
 * marquee's scrolling loop. EmergeSquares hands the traveling squares off onto
 * this row.
 *
 * Two behaviours worth knowing:
 *  - The row starts hidden and is faded in by EmergeSquares (phase-driven) the
 *    moment the traveling squares arrive on it — so reveal and arrival are
 *    perfectly synced and reverse together on scroll-up. EmergeSquares owns
 *    this element's opacity via the `data-squares-marquee` hook; here it just
 *    renders at its default (visible) state for the reduced-motion path.
 *  - Each card is an image container (object-cover) backed by its brand colour,
 *    so the colour-square → card handoff is seamless and a real photo just
 *    drops in when one lands. Until then it shows the brand colour + a label.
 *  - Centre focus: a per-frame loop scales up whichever card is crossing the
 *    page's horizontal centre and blurs/dims the rest by their distance from it.
 */
export type MarqueeCard = {
  color: string;
  photoUrl?: string | null;
  alt?: string;
  label?: string;
};

const DEFAULT_CARDS: MarqueeCard[] = [
  { color: "var(--acc-yellow)", label: "01" },
  { color: "var(--acc-orange)", label: "02" },
  { color: "var(--acc-green)", label: "03" },
];

/** Card size — kept in sync with EmergeSquares' final waypoint (cardW × cardH). */
const CARD_W = 260;
const CARD_H = 340;

function StoryCard({ card }: { card: MarqueeCard }) {
  return (
    <figure
      className="story-card relative shrink-0 overflow-hidden border border-white/10"
      style={{
        width: CARD_W,
        height: CARD_H,
        backgroundColor: card.color,
        transformOrigin: "center center",
        willChange: "transform, filter",
      }}
      aria-hidden="true"
    >
      {card.photoUrl ? (
        <Image
          src={card.photoUrl}
          alt={card.alt ?? ""}
          fill
          unoptimized
          sizes="260px"
          className="object-cover"
        />
      ) : (
        <span className="font-body absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
          {card.label}
        </span>
      )}
    </figure>
  );
}

export function MarqueeDemo({
  cards = DEFAULT_CARDS,
}: {
  cards?: MarqueeCard[];
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Centre focus — every frame, scale up whichever card is crossing the page's
  // horizontal centre and blur/dim the others by their distance from it. Driven
  // off live geometry because the marquee scrolls continuously via CSS.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(
      root.querySelectorAll<HTMLElement>(".story-card"),
    );
    if (!els.length) return;

    const MAX_SCALE = 0.28; // +28% at dead centre
    const MAX_BLUR = 4; // px on the farthest cards
    const smooth = (t: number) => t * t * (3 - 2 * t);
    let raf = 0;

    const tick = () => {
      const mid = window.innerWidth / 2;
      const focus = Math.min(window.innerWidth * 0.42, 480); // falloff radius
      for (const el of els) {
        const r = el.getBoundingClientRect();
        // Centre X is invariant under a centre-origin scale, so this is stable.
        const d = Math.abs(r.left + r.width / 2 - mid);
        const t = smooth(Math.max(0, 1 - d / focus)); // 1 at centre → 0 far off
        el.style.transform = `scale(${(1 + MAX_SCALE * t).toFixed(3)})`;
        const blur = MAX_BLUR * (1 - t);
        el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "";
        el.style.opacity = (0.55 + 0.45 * t).toFixed(3);
        el.style.zIndex = t > 0.5 ? "2" : "1";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, cards.length]);

  return (
    // data hook: EmergeSquares measures THIS element's box for the squares'
    // final landing waypoint AND owns its opacity (hidden until the squares
    // arrive). Only opacity is animated there — never layout — so the target
    // stays stable. x-only clip lets the centred card scale up past the row.
    <div
      ref={rootRef}
      data-squares-marquee
      className="relative flex w-full items-center justify-center overflow-x-clip py-20"
    >
      <Marquee className="w-full [--duration:26s] [--gap:1.5rem]">
        {cards.map((c, i) => (
          <StoryCard key={i} card={c} />
        ))}
      </Marquee>
    </div>
  );
}
