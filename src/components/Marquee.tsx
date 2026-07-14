"use client";

import Image from "next/image";
import { Marquee } from "./ui/marquee";

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
      className="relative shrink-0 overflow-hidden border border-white/10"
      style={{ width: CARD_W, height: CARD_H, backgroundColor: card.color }}
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
  return (
    // data hook: EmergeSquares measures THIS element's box for the squares'
    // final landing waypoint AND owns its opacity (hidden until the squares
    // arrive). Only opacity is animated there — never layout — so the target
    // stays stable.
    <div
      data-squares-marquee
      className="relative flex w-full items-center justify-center overflow-hidden py-16"
    >
      <Marquee className="w-full [--duration:26s] [--gap:1.5rem]">
        {cards.map((c, i) => (
          <StoryCard key={i} card={c} />
        ))}
      </Marquee>
    </div>
  );
}
