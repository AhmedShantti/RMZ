import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import AccentBlocks from "@/components/AccentBlocks";

export const metadata: Metadata = {
  title: "About",
  description:
    "Creative Rebellion is not chaos. Rebel Mind Zone is disciplined creativity — guided by experience, curiosity and innovation.",
};

const sections = [
  {
    kicker: "The idea",
    title: "Creative Rebellion",
    body: [
      "Not rebellion for the sake of rebellion. Ours is disciplined creativity — guided by experience, curiosity and innovation.",
      "We challenge the ordinary not to make noise, but to make better. The discipline is the point; the boldness is what it buys.",
    ],
  },
  {
    kicker: "The character",
    title: "Thoughtful, confident, bold",
    body: [
      "We challenge ideas to improve them, not to disrupt for its own sake. Strong opinions, lightly held — and always in service of the work.",
      "We connect people, perspectives and possibilities. The interesting answer usually lives where three of them meet.",
    ],
  },
  {
    kicker: "The personality",
    title: "Calm. Curious. A great listener.",
    body: [
      "Picture a mind that's confident without being loud — intelligent without being overwhelming, and relatable across generations.",
      "Someone who listens first, asks the better question, then says the bold thing once it's earned. That's the room we try to be.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        kicker="About"
        title={
          <>
            A bold creative mind that dares to challenge the{" "}
            <span className="italic">ordinary</span>.
          </>
        }
        lede="Rebel Mind Zone is a creative studio built on a simple, stubborn belief: discipline is what makes boldness work."
      />

      <div className="px-5 pb-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col">
          {sections.map((s, i) => (
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
            A bold creative mind that dares to challenge the{" "}
            <span className="italic">ordinary</span> in order to create{" "}
            <span className="text-rebel-red italic">extraordinary</span> ideas.
          </p>
        </Reveal>
      </section>
    </>
  );
}
