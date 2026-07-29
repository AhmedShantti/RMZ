import SectionWatermark from "./SectionWatermark";
import Reveal from "./Reveal";
import ShowreelMarquee, { type ShowreelVideo } from "./ShowreelMarquee";

/**
 * VideoSection (Redesigning Stage 2) — a full-width, continuous right-to-left
 * showreel marquee (ShowreelMarquee) over the shared "CLIENTS" watermark. Sits
 * below the clients collage, above markets/CTA.
 *
 * Hover a video to pause the row, scale it up + play it while the rest blur;
 * the hovered video reveals its own top (green) + bottom (orange) label bars —
 * the labels differ per video. No permanent side strips. Videos are CMS-driven
 * (homeContent → Showreel); empty falls back to the built-in placeholders.
 */
export default function VideoSection({
  videos,
}: {
  videos?: ShowreelVideo[];
}) {
  return (
    <section
      aria-label="Showreel"
      className="relative w-full overflow-hidden py-24"
    >
      

      <Reveal className="relative z-10 w-full">
        <ShowreelMarquee videos={videos} />
      </Reveal>
    </section>
  );
}
