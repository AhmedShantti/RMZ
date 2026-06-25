import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import RunsText from "@/components/RunsText";
import { getCareers, getCareerRoles, getMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("careersContent", {
    title: "Careers",
    description:
      "Creative rebels welcome. Open roles at Rebel Mind Zone for people who challenge the brief to make it better.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

export default async function CareersPage() {
  const [careers, roles] = await Promise.all([getCareers(), getCareerRoles()]);

  return (
    <>
      <PageIntro
        kicker="Careers"
        title={<RunsText runs={careers.pageTitle} />}
        lede={careers.lede}
      />

      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          <ul className="border-t border-cream-dim/15">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <li className="border-b border-cream-dim/15">
                  <Link
                    href={r.applyTarget}
                    className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-body text-cream-dim text-xs tabular-nums">
                        0{i + 1}
                      </span>
                      <h2 className="font-display group-hover:text-rebel-red text-[clamp(1.6rem,4vw,2.6rem)] italic leading-tight transition-colors">
                        {r.title}
                      </h2>
                    </div>
                    <p className="font-body text-cream-dim ml-10 max-w-md flex-1 text-sm sm:ml-0">
                      {r.blurb}
                    </p>
                    <div className="font-body text-cream-dim ml-10 flex shrink-0 items-center gap-4 text-xs uppercase tracking-[0.15em] sm:ml-0">
                      <span>{r.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.location}</span>
                      <span
                        aria-hidden="true"
                        className="group-hover:text-rebel-red transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>

          <p className="font-body text-cream-dim mt-6 text-xs">
            * Placeholder roles — replace with real openings.
          </p>

          <Reveal className="mt-16 flex flex-col items-start gap-5">
            <p className="font-display text-cream max-w-2xl text-[clamp(1.6rem,4vw,2.6rem)] italic leading-tight">
              {careers.openApplicationHeading}
            </p>
            <a
              href={careers.ctaTarget}
              className="group border-cream/25 hover:border-rebel-red hover:text-rebel-red flex w-fit items-center gap-3 border px-6 py-3 transition-colors"
            >
              <span className="font-display text-lg italic">
                {careers.ctaLabel}
              </span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
