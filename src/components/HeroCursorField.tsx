import Link from "next/link";
import RunsText, { type Run } from "./RunsText";
import { homeContent } from "@/content/home";

type HeroProps = {
  kicker?: string;
  statement?: Run[];
  subline?: string;
};

/** Total reveal units (non-whitespace characters) in the headline runs — matches
 *  the `.rt-unit` count RunsText emits. Used to normalise the per-character
 *  stagger so the whole headline reveal spans a fixed 0.5s regardless of length
 *  (the CSS equivalent of GSAP's `stagger: { amount: 0.5 }`). */
function revealUnitCount(runs: Run[]): number {
  return runs.reduce((n, r) => n + r.text.replace(/\s+/g, "").length, 0);
}

/**
 * Hero composition — kicker, statement, subline and CTA staggered in on load.
 *
 * The entrance is CSS-driven (see `.hero-enter` in globals.css), NOT JS. A CSS
 * animation runs on the compositor from the element's first paint — it does not
 * wait for React hydration and never re-renders the node — so the browser can
 * credit the Largest Contentful Paint at first paint instead of at the end of a
 * JS-timed tween. (The previous GSAP `.from()` held the hero at its start state
 * until hydration finished, then animated in, which pushed mobile LCP to ~6.6s;
 * this keeps it at ~FCP.) Movement, timing and easing match the old timeline
 * exactly; only the opacity fade is dropped so every element is painted from the
 * first frame. Static, visible end-state under prefers-reduced-motion.
 *
 * This is a server component (no hooks) — it ships no client JS of its own.
 */
export default function HeroCursorField({
  kicker = homeContent.heroKicker,
  statement = homeContent.heroStatement,
  subline = homeContent.heroSubline,
}: HeroProps = {}) {
  // Denominator for the char-stagger delay: last unit lands at +0.5s. Guard ≥1
  // so a one-character headline can't divide by zero in the CSS calc().
  const revealSpan = Math.max(revealUnitCount(statement) - 1, 1);

  return (
    <section
      aria-label="Rebel Mind Zone hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 sm:px-8"
    >
      <div
        className="hero-enter relative mx-auto flex w-full max-w-6xl flex-col items-center gap-7 py-28 text-center"
        style={{ "--rt-span": revealSpan } as React.CSSProperties}
      >
        {kicker && (
          <p
            data-hero-kicker
            className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]"
          >
            {kicker}
          </p>
        )}

        <h1 className="display-statement text-cream mx-auto max-w-5xl text-center text-[clamp(2.6rem,8.2vw,7rem)]">
          <RunsText runs={statement} reveal />
        </h1>

        {subline && (
          <p
            data-hero-sub
            className="font-body text-cream-dim mx-auto max-w-xl text-base text-balance sm:text-lg"
          >
            {subline}
          </p>
        )}

        <Link
          data-hero-cta
          href="/contact"
          // Hover uses `filter` (not opacity/transform) so it never fights the
          // entrance animation on a property it also drives.
          className="font-body bg-cream text-ink inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-[filter] duration-200 hover:brightness-95"
        >
          Start a project
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
