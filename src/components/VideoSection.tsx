import ShowreelSwipe, { type ShowreelVideo } from "./ShowreelSwipe";
import type { ShowreelSettings } from "@/lib/homeSettings";

/**
 * VideoSection — the showreel as a pinned, scroll-driven swipe (ShowreelSwipe):
 * the section sticks to the viewport and slides through the videos, then
 * releases the page. Fully CMS-driven (homeContent → Showreel): the videos
 * (standard + optional high-res source, poster, caption) and the sizing /
 * behaviour settings. No videos → the section is not rendered at all; one
 * video → shown without pinning.
 */
export default function VideoSection({
  videos = [],
  settings,
}: {
  videos?: ShowreelVideo[];
  settings?: ShowreelSettings;
}) {
  if (!videos.length) return null;
  return (
    <section aria-label="Showreel" className="relative w-full">
      <ShowreelSwipe videos={videos} settings={settings} />
    </section>
  );
}
