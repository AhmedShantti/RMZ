import Link from "next/link";
import MarketsColumns, { type Market } from "./MarketsColumns";
import RunsText, { type Run } from "./RunsText";
import Reveal from "./Reveal";

/**
 * Markets / CTA block (Redesigning Stage 3) — a 2-column layout:
 *   Left (~40%): the big "LET'S CREATE A NEW STORY" CTA (stacked, uppercase)
 *               with a row of 3 sharp accent squares directly below it.
 *   Right (~60%): the four regional markets in a 2×2 grid (MarketsColumns).
 *
 * Used as a teaser on the Home page. Content (story, markets, socials) is fed
 * from the CMS — only the layout changed here.
 */
type Social = { label: string; href: string };

type Props = {
  asTeaser?: boolean;
  story: Run[];
  markets: Market[];
  socials: Social[];
  ctaLabel?: string;
};

export default function MarketsBlock({
  asTeaser = false,
  story,
  markets,
  socials,
  ctaLabel = "Start a project",
}: Props) {
  // Drop the emphasised "STORY" run (and its trailing "..") onto its own line,
  // so the CTA stacks as LET'S CREATE A NEW / STORY — kept CMS-driven.
  const splitIdx = story.findIndex((r) => r.style === "italic");
  const lead = splitIdx > 0 ? story.slice(0, splitIdx) : story;
  const tail = splitIdx > 0 ? story.slice(splitIdx) : [];
  const Heading = (
    <h2 className="display-statement text-cream text-[clamp(2.2rem,5.5vw,4.5rem)] uppercase leading-[0.95]">
      <RunsText runs={lead} />
      {tail.length > 0 && <br />}
      <RunsText runs={tail} />
    </h2>
  );

  // 3 sharp accent squares (yellow · orange · green), 16px, 6px gap.
  const ctaSquares = (
    <div className="mt-6 flex gap-1.5" aria-hidden="true">
      <span className="h-4 w-4" style={{ backgroundColor: "var(--acc-yellow)" }} />
      <span className="h-4 w-4" style={{ backgroundColor: "var(--acc-orange)" }} />
      <span className="h-4 w-4" style={{ backgroundColor: "var(--acc-green)" }} />
    </div>
  );

  return (
    <section
      aria-label="Markets and contact"
      className="relative px-5 py-[100px] sm:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[2fr_3fr] lg:gap-20">
        {/* Left — CTA */}
        <Reveal>
          <div className="flex flex-col gap-8">
            <div>
              {asTeaser ? (
                <Link href="/contact" className="group block w-fit">
                  {Heading}
                </Link>
              ) : (
                Heading
              )}
              {ctaSquares}
            </div>

            {asTeaser && (
              <Link
                href="/contact"
                className="font-body text-cream-dim hover:text-rebel-red inline-flex w-fit items-center gap-2 text-sm transition-colors"
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            )}

            <div className="font-body text-cream-dim mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — 2×2 market grid */}
        <Reveal delay={0.1}>
          <MarketsColumns markets={markets} />
        </Reveal>
      </div>
    </section>
  );
}
