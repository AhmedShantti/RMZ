import Link from "next/link";
import Reveal from "./Reveal";

type TeaserService = {
  index: string;
  title: string;
  blurb: string;
  items?: string[];
};

/**
 * Home services teaser (TASK.md §5.4) — short list, links into /services.
 * Hovering a row expands it to reveal that service's related items as a list,
 * in the same editorial style (smaller italic display, cream-dim). The reveal
 * uses the grid-rows 0fr→1fr trick so it animates to the content's real height;
 * static (instant) under prefers-reduced-motion.
 */
export default function ServicesTeaser({
  services,
}: {
  services: TeaserService[];
}) {
  return (
    <section
      aria-label="What we do"
      className="relative border-t border-cream-dim/15 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]">
            What we do
          </h2>
          <Link
            href="/services"
            className="font-body text-cream-dim hover:text-rebel-red text-sm transition-colors"
          >
            All services →
          </Link>
        </Reveal>

        <ul className="divide-y divide-cream-dim/12">
          {services.map((s, i) => (
            <Reveal key={s.index} delay={i * 0.04}>
              <li className="group">
                <Link
                  href="/services"
                  className="flex items-baseline gap-5 py-5 sm:gap-10"
                >
                  <span className="font-body text-cream-dim w-8 shrink-0 text-xs tabular-nums">
                    {s.index}
                  </span>
                  <span className="font-display group-hover:text-rebel-red flex-1 text-[clamp(1.6rem,4.5vw,2.8rem)] leading-tight italic transition-colors">
                    {/* underline wipe — a hairline that scales in from the left
                        on hover (transform-only; instant, no wipe, under
                        reduced motion). Inner inline-block so it hugs the text
                        width, not the flex column. */}
                    <span className="relative inline-block after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-rebel-red after:content-[''] group-hover:after:scale-x-100 motion-safe:after:transition-transform motion-safe:after:duration-500 motion-safe:after:ease-[cubic-bezier(0.16,1,0.3,1)]">
                      {s.title}
                    </span>
                  </span>
                  <span className="font-body text-cream-dim hidden max-w-xs text-sm md:block">
                    {s.blurb}
                  </span>
                  {/* arrow slide — nudges up-right on hover (transform gated by
                      motion-safe; colour still changes under reduced motion). */}
                  <span
                    aria-hidden="true"
                    className="text-cream-dim group-hover:text-rebel-red transition-[color,transform] duration-300 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </Link>

                {/* Related items — collapsed by default, expanded on hover.
                    grid-rows 0fr→1fr animates to the content's real height. */}
                {s.items && s.items.length > 0 && (
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] motion-reduce:transition-none">
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-1.5 pb-6 pl-[3.25rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-150 sm:pl-[4.5rem] motion-reduce:transition-none">
                        {s.items.map((it) => (
                          <li
                            key={it}
                            className="font-display text-cream-dim text-base italic leading-snug sm:text-lg"
                          >
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
