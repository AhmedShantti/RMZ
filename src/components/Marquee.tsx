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
 *  - Hover focus: cards rest as solid colour blocks; hovering one lifts its
 *    colour veil (revealing the content) and scales it up while the rest stay
 *    filled and blur. The row pauses on hover so the card holds under the cursor.
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

/**
 * Card size — responsive (portrait 3.9:5, i.e. ×1.3077) so it doesn't swallow a
 * phone screen. Kept in sync with EmergeSquares' final waypoint, which computes
 * the same clamp so the squares morph into the actual card size.
 */
const CARD_W = "clamp(150px, 42vw, 260px)";
const CARD_H = "clamp(196px, 54.9vw, 340px)";

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
        transition:
          "transform 0.45s cubic-bezier(0.16,1,0.3,1), filter 0.45s ease",
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
        <span className="font-body absolute bottom-3 left-3 z-10 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
          {card.label}
        </span>
      )}
      {/* Colour veil — driven by the centre-focus loop: transparent at centre
          (content shows), fills to solid brand colour as the card leaves it.
          Starts filled so pre-JS / reduced-motion cards read as colour blocks. */}
      <span
        className="story-card-fill pointer-events-none absolute inset-0 z-20"
        style={{
          backgroundColor: card.color,
          opacity: 1,
          transition: "opacity 0.45s ease",
        }}
      />
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

  // Hover focus — cards rest as solid colour blocks; hovering one lifts its
  // colour veil (revealing the content) and scales it up, while the rest stay
  // filled and blur back. The row pauses on hover (see `pauseOnHover`) so the
  // hovered card holds still under the cursor.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(".story-card"),
    ).map((el) => ({
      el,
      fill: el.querySelector<HTMLElement>(".story-card-fill"),
    }));
    if (!items.length) return;

    // focused = the hovered card, or null for the resting state.
    const apply = (focused: HTMLElement | null) => {
      for (const { el, fill } of items) {
        const isFocus = el === focused;
        // Scale kept small enough that the grown card stays inside the row gap
        // (see --gap below) instead of overlapping its neighbours.
        el.style.transform = isFocus ? "scale(1.14)" : "";
        el.style.filter = focused && !isFocus ? "blur(3px)" : "";
        el.style.zIndex = isFocus ? "2" : "1";
        // Veil lifts on the hovered card, stays/returns to solid colour on the
        // rest (and on every card at rest).
        if (fill) fill.style.opacity = isFocus ? "0" : "1";
      }
    };

    // Skip the hover interaction on touch / no-hover devices (they can't
    // un-hover, so a tapped card would stay scaled up and overlap its
    // neighbours) and when reduced motion is requested. In both cases just
    // reveal each card's content statically — no scaling, blur or overlap.
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !canHover) {
      items.forEach(({ fill }) => {
        if (fill) fill.style.opacity = "0";
      });
      return;
    }

    apply(null); // establish the resting (all colour-filled) state
    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(
        ".story-card",
      );
      if (card) apply(card);
    };
    const onLeave = () => apply(null);
    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
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
      <Marquee pauseOnHover className="w-full [--duration:26s] [--gap:2.75rem]">
        {cards.map((c, i) => (
          <StoryCard key={i} card={c} />
        ))}
      </Marquee>
    </div>
  );
}
