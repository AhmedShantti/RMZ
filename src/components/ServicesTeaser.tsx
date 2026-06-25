import Link from "next/link";
import Reveal from "./Reveal";

type TeaserService = { index: string; title: string; blurb: string };

/** Home services teaser (TASK.md §5.4) — short list, links into /services. */
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
              <li>
                <Link
                  href="/services"
                  className="group flex items-baseline gap-5 py-5 sm:gap-10"
                >
                  <span className="font-body text-cream-dim w-8 shrink-0 text-xs tabular-nums">
                    {s.index}
                  </span>
                  <span className="font-display group-hover:text-rebel-red flex-1 text-[clamp(1.6rem,4.5vw,2.8rem)] leading-tight italic transition-colors">
                    {s.title}
                  </span>
                  <span className="font-body text-cream-dim hidden max-w-xs text-sm md:block">
                    {s.blurb}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-cream-dim group-hover:text-rebel-red transition-colors"
                  >
                    ↗
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
