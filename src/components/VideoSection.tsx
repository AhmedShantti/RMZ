import SectionWatermark from "./SectionWatermark";
import Reveal from "./Reveal";

/**
 * VideoSection (Redesigning Stage 2) — a video placeholder flanked by two
 * coloured vertical-text sidebar strips, over the shared "CLIENTS" watermark.
 * Sits directly below the clients collage, above markets/CTA.
 *
 *   Left strip  — brand green, "HOW TO SUCCESS"  (reads bottom → top)
 *   Right strip — brand orange, "HOW TO BE REBEL" (reads top → bottom)
 *
 * Strips + video are flush (one unified horizontal unit). Mobile (<768px): the
 * strips become 50px horizontal bars above/below the video with normal text.
 */
export default function VideoSection() {
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
          <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/90 md:rotate-180 md:[writing-mode:vertical-rl]">
            How to Success
          </span>
        </div>

        {/* video placeholder — 16:9 */}
        {/* TODO: Replace with the real RMZ showreel video */}
        <div className="relative aspect-video flex-1 bg-[#0e0e0e]">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              width="78"
              height="78"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rmz-pulse"
            >
              <circle cx="40" cy="40" r="39" stroke="white" strokeWidth="1.5" />
              <path d="M33 26 L57 40 L33 54 Z" fill="white" />
            </svg>
          </span>
        </div>

        {/* right strip — orange, reads top→bottom */}
        <div
          className="flex h-[44px] w-full items-center justify-center md:h-auto md:w-[58px]"
          style={{ backgroundColor: "var(--acc-orange)" }}
        >
          <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/90 md:[writing-mode:vertical-rl]">
            How to be Rebel
          </span>
        </div>
      </Reveal>
    </section>
  );
}
