import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import { roles } from "@/content/careers";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Creative rebels welcome. Open roles at Rebel Mind Zone for people who challenge the brief to make it better.",
};

export default function CareersPage() {
  return (
    <>
      <PageIntro
        kicker="Careers"
        title={
          <>
            Creative <span className="italic">rebels</span> welcome.
          </>
        }
        lede="We hire for point of view and the discipline to back it up. If you challenge the brief to make it better — not just louder — we should talk."
      />

      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          <ul className="border-t border-cream-dim/15">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <li className="border-b border-cream-dim/15">
                  <Link
                    href={`/contact`}
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
              Don&rsquo;t see your role? Make the case anyway.
            </p>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Open application — RMZ")}`}
              className="group border-cream/25 hover:border-rebel-red hover:text-rebel-red flex w-fit items-center gap-3 border px-6 py-3 transition-colors"
            >
              <span className="font-display text-lg italic">
                Send an open application
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
