import AccentBlocks from "./AccentBlocks";
import Reveal from "./Reveal";

/**
 * Shared inner-page intro header. Clears the fixed nav and sets the editorial
 * tone: kicker + big italic-serif title + optional lede.
 */
type Props = {
  kicker: string;
  title: React.ReactNode;
  lede?: string;
};

export default function PageIntro({ kicker, title, lede }: Props) {
  return (
    <header className="relative px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-6 flex items-center gap-4">
          <AccentBlocks size={12} />
          <span className="font-body text-cream-dim text-xs uppercase tracking-[0.35em]">
            {kicker}
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display-statement text-cream max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)]">
            {title}
          </h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.1}>
            <p className="font-body text-cream-dim mt-8 max-w-xl text-lg leading-relaxed">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
