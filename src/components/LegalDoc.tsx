import Reveal from "./Reveal";

/**
 * Calm single-column legal layout (TASK.md §5 /privacy & /terms): constrained
 * measure (~65ch), generous line-height, and a prominent template notice. The
 * copy is boilerplate — do not present as final.
 */
export type LegalSection = { heading: string; body: string[] };

type Props = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  showNotice?: boolean;
};

export default function LegalDoc({
  title,
  updated,
  intro,
  sections,
  showNotice = true,
}: Props) {
  return (
    <article className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[68ch]">
        {/* Prominent template-text notice */}
        {showNotice && (
          <p
            role="note"
            className="border-rebel-red/50 text-cream mb-12 border-l-2 bg-ink-soft px-5 py-4 text-sm leading-relaxed"
          >
            <strong className="font-semibold">Template text</strong> — review
            with legal counsel before publishing. The copy below is placeholder
            boilerplate, not final legal language.
          </p>
        )}

        <h1 className="font-display text-cream text-[clamp(2.4rem,6vw,4rem)] italic leading-none">
          {title}
        </h1>
        <p className="font-body text-cream-dim mt-4 text-sm">
          Last updated {updated}
        </p>

        <p className="font-body text-cream mt-10 text-lg leading-[1.75]">
          {intro}
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.02}>
              <section className="flex flex-col gap-3">
                <h2 className="font-display text-cream flex items-baseline gap-3 text-xl italic">
                  <span className="font-body text-rebel-red text-xs tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                {s.body.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="font-body text-cream-dim text-base leading-[1.75]"
                  >
                    {p}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}
