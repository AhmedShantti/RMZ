import SectionWatermark from "./SectionWatermark";
import Reveal from "./Reveal";
import ShowreelSlider from "./ShowreelSlider";

/**
 * VideoSection (Redesigning Stage 2) — a 3-video showreel slider (ShowreelSlider,
 * auto-advancing left→right) flanked by two coloured vertical-text sidebar
 * strips, over the shared "CLIENTS" watermark. Sits directly below the clients
 * collage, above markets/CTA.
 *
 *   Left strip  — brand green, "HOW TO SUCCESS"  (reads bottom → top)
 *   Right strip — brand orange, "HOW TO BE REBEL" (reads top → bottom)
 *
 * Strips + video are flush (one unified horizontal unit). Mobile (<768px): the
 * strips become 50px horizontal bars above/below the video with normal text.
 *
 * Strip labels come from the CMS (homeContent → Showreel).
 */
type Props = {
  leftLabel: string;
  rightLabel: string;
};

export default function VideoSection({ leftLabel, rightLabel }: Props) {
  return (
    <section
      aria-label="Showreel"
      className="relative w-full overflow-hidden py-20"
    >
      <SectionWatermark text="CLIENTS" />

      <Reveal className="relative z-10 mx-auto flex max-w-5xl flex-col px-5 sm:px-8 md:flex-row md:items-stretch">
        {/* left strip — green, reads bottom→top */}
        <div
          className="flex h-[44px] w-full items-center justify-center md:h-auto md:w-[58px]"
          style={{ backgroundColor: "var(--acc-green)" }}
        >
          <span className="font-body text-[1rem] font-medium uppercase tracking-[0.18em] text-white/90 md:rotate-180 md:[writing-mode:vertical-rl]">
            {leftLabel}
          </span>
        </div>

        {/* 16:9 showreel — three video placeholders auto-advancing left→right */}
        <ShowreelSlider />

        {/* right strip — orange, reads top→bottom */}
        <div
          className="flex h-[44px] w-full items-center justify-center md:h-auto md:w-[58px]"
          style={{ backgroundColor: "var(--acc-orange)" }}
        >
          <span className="font-body text-[1rem] font-medium uppercase tracking-[0.18em] text-white/90 md:[writing-mode:vertical-rl]">
            {rightLabel}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
