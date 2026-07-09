"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Marquee } from "./ui/marquee"


const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
  isFocused,
  isBlurred,
  onHoverStart,
  onHoverEnd,
}: {
  img: string
  name: string
  username: string
  body: string
  isFocused: boolean
  isBlurred: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}) => {
  return (
    <figure
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={cn(
        "relative aspect-square w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // transition for scale, blur & z-index changes
        "transition-all duration-300 ease-out",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        // focus (hovered) state — scale up and rise above siblings
        isFocused && "z-10 scale-110 shadow-xl",
        // blurred state — everything else dims and softens while one card is focused
        isBlurred && "scale-95 opacity-50 blur-[2px]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemo() {
  // Track which card is currently hovered across BOTH rows so the
  // blur/focus effect applies globally, not just within a single row.
  const [hoveredUsername, setHoveredUsername] = useState<string | null>(null)

  const renderCard = (review: (typeof reviews)[number]) => {
    const isFocused = hoveredUsername === review.username
    const isBlurred = hoveredUsername !== null && !isFocused

    return (
      <ReviewCard
        key={review.username}
        {...review}
        isFocused={isFocused}
        isBlurred={isBlurred}
        onHoverStart={() => setHoveredUsername(review.username)}
        onHoverEnd={() => setHoveredUsername(null)}
      />
    )
  }

  return (
     // data hook: end waypoint of the traveling logo squares
     <div data-squares-marquee className="relative flex w-full flex-col items-stretch justify-center gap-4 bg-transparent py-6">
      <Marquee pauseOnHover className="w-full [--duration:20s] py-4">
        {firstRow.map(renderCard)}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-transparent to-transparent"></div>
    </div>
  )
}