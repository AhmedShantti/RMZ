import Link from "next/link";
import { site } from "@/content/site";
import AccentBlocks from "./AccentBlocks";
import MarketsColumns from "./MarketsColumns";
import Reveal from "./Reveal";

/**
 * Markets / CTA block (TASK.md §5, storyboard p.7) — the big
 * "Let's create a new STORY.." statement + the four market columns. The
 * Egyptian market is the home/active market, rendered in red.
 *
 * Used full on /contact and as a teaser on the Home page.
 */
type Props = {
  /** Home teaser links the heading to /contact; the contact page does not. */
  asTeaser?: boolean;
};

export default function MarketsBlock({ asTeaser = false }: Props) {
  const Heading = (
    <h2 className="display-statement text-cream text-[clamp(2.4rem,7vw,6rem)]">
      Let&rsquo;s create a new{" "}
      <span className="italic">STORY</span>
      <span className="text-rebel-red">..</span>
    </h2>
  );

  return (
    <section
      aria-label="Markets and contact"
      className="relative px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <div className="flex flex-col gap-8">
            <AccentBlocks size={14} gap={8} />
            {asTeaser ? (
              <Link href="/contact" className="group w-fit">
                {Heading}
                <span className="font-body text-cream-dim group-hover:text-rebel-red mt-6 inline-flex items-center gap-2 text-sm transition-colors">
                  Start a project
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ) : (
              Heading
            )}
            <div className="font-body text-cream-dim mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {site.socials.map((s) => (
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

        <Reveal delay={0.1}>
          <MarketsColumns />
        </Reveal>
      </div>
    </section>
  );
}
