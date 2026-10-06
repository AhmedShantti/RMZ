import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import type { Project } from "@/content/portfolio";

/**
 * Home "Selected work" — a grid of featured projects (picked in the CMS, else the
 * first six of the Portfolio). Same card as /portfolio: cover (or the name on a
 * dark tile while there is no cover yet), market · category, name, result line.
 */
export default function FeaturedWork({
  kicker,
  heading,
  projects,
  buttonLabel,
  buttonLink,
}: {
  kicker: string;
  heading: string;
  projects: Project[];
  buttonLabel: string;
  buttonLink: string;
}) {
  if (!projects.length) return null;
  return (
    <section
      aria-label="Selected work"
      className="relative border-t border-cream-dim/15 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 flex flex-col gap-3 sm:mb-16">
          {kicker && (
            <p className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]">{kicker}</p>
          )}
          {heading && (
            <h2 className="font-display text-cream text-[clamp(2rem,5vw,3.6rem)] italic leading-tight">
              {heading}
            </h2>
          )}
        </Reveal>

        <ul className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <li>
                <Link
                  href={`/portfolio/${p.slug}`}
                  className="group focus-visible:outline-cream block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#151313]">
                    {p.cover?.src ? (
                      <Image
                        src={p.cover.src}
                        alt={`${p.name} cover image`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 360px"
                        className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center px-4">
                        <span className="font-display text-cream-dim text-center italic">{p.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="font-body text-cream-dim mt-4 text-[12px] uppercase tracking-[0.2em] sm:mt-5 sm:text-[13px]">
                    {p.market} · {p.category.title}
                  </p>
                  <h3 className="font-display text-cream group-hover:text-rebel-red mt-1 text-[clamp(22px,1.8vw,30px)] transition-colors">
                    {p.name}
                  </h3>
                  {p.result && (
                    <p className="font-body text-cream-dim mt-2 text-sm leading-relaxed">{p.result}</p>
                  )}
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>

        {buttonLabel && buttonLink && (
          <Reveal className="mt-14 flex justify-center">
            <Link
              href={buttonLink}
              className="font-body text-cream border-cream/40 hover:border-rebel-red hover:text-rebel-red inline-flex items-center gap-2 border px-7 py-3 text-sm uppercase tracking-wider transition-colors"
            >
              {buttonLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
