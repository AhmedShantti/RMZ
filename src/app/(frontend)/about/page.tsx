import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import AccentBlocks from "@/components/AccentBlocks";
import RunsText from "@/components/RunsText";
import { getAbout, getMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("aboutContent", {
    title: "About",
    description:
      "Creative Rebellion is not chaos. Rebel Mind Zone is disciplined creativity — guided by experience, curiosity and innovation.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <PageIntro
        kicker="About"
        title={<RunsText runs={about.pageTitle} />}
        lede={about.lede}
      />

      <div className="px-5 pb-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col">
          {about.sections.map((s, i) => (
            <Reveal key={s.kicker}>
              <section className="grid gap-6 border-t border-cream-dim/15 py-14 sm:py-20 lg:grid-cols-[280px_1fr] lg:gap-16">
                <div className="flex items-start gap-4">
                  <span className="font-body text-rebel-red text-xs tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="font-body text-cream-dim text-xs uppercase tracking-[0.3em]">
                    {s.kicker}
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <h2 className="font-display text-cream text-[clamp(1.9rem,4.5vw,3.2rem)] italic leading-tight">
                    {s.title}
                  </h2>
                  {s.body.map((p) => (
                    <p
                      key={p.slice(0, 24)}
                      className="font-body text-cream-dim max-w-2xl text-lg leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>

      {/* full-bleed editorial closer (logo deck p.9) */}
      <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 90% at 100% 100%, color-mix(in srgb, var(--rebel-red) 28%, transparent), transparent 55%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-5xl">
          <AccentBlocks size={14} gap={8} className="mb-8" />
          <p className="display-statement text-cream text-[clamp(2.2rem,6vw,4.8rem)]">
            <RunsText runs={about.closingStatement} />
          </p>
        </Reveal>
      </section>
    </>
  );
}
