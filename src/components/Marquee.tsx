"use client";

import { Marquee } from "./ui/marquee";

/**
 * The three brand squares end their journey here: they morph into three
 * portrait cards (ClientsCollage shape/style — aspect 3/4, hairline border) in
 * the brand colours, which then recur across the marquee's scrolling loop.
 * EmergeSquares hands the traveling squares off onto this row.
 */
const STORY_CARDS = [
  { color: "var(--acc-yellow)" },
  { color: "var(--acc-orange)" },
  { color: "var(--acc-green)" },
];

/** Card size — kept in sync with EmergeSquares' final waypoint (w×h). */
const CARD_W = 180;
const CARD_H = 240;

function StoryCard({ color }: { color: string }) {
  return (
    <figure
      className="relative shrink-0 overflow-hidden border border-white/10"
      style={{ width: CARD_W, height: CARD_H, backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

export function MarqueeDemo() {
  return (
    // data hook: the traveling logo squares land / dissolve onto this row.
    <div
      data-squares-marquee
      className="relative flex w-full items-center justify-center overflow-hidden py-12"
    >
      <Marquee className="w-full [--duration:24s] [--gap:1.5rem]">
        {STORY_CARDS.map((c, i) => (
          <StoryCard key={i} color={c.color} />
        ))}
      </Marquee>
    </div>
  );
}
