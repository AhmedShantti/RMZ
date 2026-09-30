import ShowreelSwipe, { type ShowreelVideo } from "./ShowreelSwipe";

/**
 * VideoSection — the showreel as a pinned, scroll-driven swipe (ShowreelSwipe):
 * the section sticks to the viewport and slides video 1 → 2 → 3, then releases
 * the page. Sits below the clients section, above markets/CTA. Videos are
 * CMS-driven (homeContent → Showreel, optional high-res source + poster per
 * video); empty falls back to the built-in placeholders.
 */
export default function VideoSection({
  videos,
}: {
  videos?: ShowreelVideo[];
}) {
  return (
    <section aria-label="Showreel" className="relative w-full">
      <ShowreelSwipe videos={videos} />
    </section>
  );
}
