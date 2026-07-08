"use client";

import RunsText, { type Run } from "./RunsText";
import { homeContent } from "@/content/home";

type HeroProps = {
  kicker?: string;
  statement?: Run[];
  subline?: string;
};

/**
 * Static hero composition — centered statement, no animation.
 */
export default function HeroCursorField({
  kicker = homeContent.heroKicker,
  statement = homeContent.heroStatement,
  subline = homeContent.heroSubline,
}: HeroProps = {}) {
  return (
    <section
      aria-label="Rebel Mind Zone hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 sm:px-8"
    >
      <div className="relative mx-auto w-full max-w-6xl py-28 text-center">
        <h1 className="display-statement text-center text-cream max-w-5xl text-[clamp(2.6rem,8.2vw,7rem)] mx-auto">
          <RunsText runs={statement} />
        </h1>
      </div>
    </section>
  );
}