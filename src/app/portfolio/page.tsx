import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import { projects } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work from Rebel Mind Zone — brand identity, campaigns, packaging and content across the region.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        kicker="Portfolio"
        title={
          <>
            We solved the problems of <span className="italic">dozens</span> of
            clients.
          </>
        }
        lede="A few of the stories we've built. (Placeholder work shown until the real case studies land.)"
      />

      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          <ul className="grid grid-cols-1 gap-px overflow-hidden border border-cream-dim/12 sm:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={(i % 2) * 0.06}>
                <li className="h-full">
                  <Link
                    href="/contact"
                    className="group bg-ink hover:bg-ink-soft relative flex h-full flex-col gap-6 p-8 outline-offset-[-2px] transition-colors sm:p-10"
                  >
                    {/* grain-shift accent on hover: a faint red wash */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(80% 80% at 80% 100%, color-mix(in srgb, var(--rebel-red) 14%, transparent), transparent 60%)",
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="font-body text-cream-dim text-xs tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="font-body text-cream-dim text-[0.7rem] uppercase tracking-[0.25em]">
                        {p.market} · {p.discipline}
                      </span>
                    </div>

                    <div className="relative mt-auto flex flex-col gap-3">
                      <h2 className="font-display w-fit text-[clamp(2rem,5vw,3.4rem)] italic leading-none">
                        <span className="group-hover:text-rebel-red inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                          {p.name}
                        </span>
                        {/* red underline grow */}
                        <span
                          aria-hidden="true"
                          className="bg-rebel-red mt-2 block h-[2px] w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                        />
                      </h2>
                      <p className="font-body text-cream-dim text-sm">
                        {p.client}
                      </p>
                      <p className="font-body text-cream max-w-sm text-base leading-relaxed">
                        {p.result}
                      </p>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>

          <p className="font-body text-cream-dim mt-8 text-xs">
            * Placeholder projects — replace with real case studies.
          </p>
        </div>
      </section>
    </>
  );
}
