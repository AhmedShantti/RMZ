import Image from "next/image";
import type { Visual, VisualRatio } from "@/content/portfolio";

/**
 * The one image primitive every case-study block draws through.
 *
 * Two jobs:
 *  1. Hold the aspect ratio. The box owns the ratio and the image is `fill` +
 *     `object-cover`, so nothing ever stretches regardless of the source's own
 *     dimensions.
 *  2. Degrade honestly. No real project photography exists yet, so a visual with
 *     no `src` renders the site's existing placeholder tile (#1a1a1a + label) at
 *     the same ratio — the layout is identical the day the images land.
 *
 * `unoptimized` matches AboutStairsSection: Payload serves media from its own
 * route, and the optimizer isn't configured for it.
 */
/**
 * Height ceiling for every case-study image. The ratio still decides the shape,
 * but a tall one (4/3, 4/5, 9/16) can no longer take over the whole screen — the
 * box stops growing here and the image covers within it. Change this one value
 * to resize every image on the page.
 */
const MAX_HEIGHT = "60vh";

type Props = {
  visual: Visual;
  /** Falls back to the visual's own ratio, then 4/3. */
  ratio?: VisualRatio;
  sizes: string;
  className?: string;
  /** Above-the-fold visuals skip lazy-loading. */
  priority?: boolean;
  /** Adds the group-hover zoom used by the portfolio cards. */
  zoomOnHover?: boolean;
  /** Override the shared height ceiling (e.g. tighter for gallery columns). */
  maxHeight?: string;
};

export default function ProjectImage({
  visual,
  ratio,
  sizes,
  className = "",
  priority = false,
  zoomOnHover = false,
  maxHeight = MAX_HEIGHT,
}: Props) {
  const aspect = ratio ?? visual.ratio ?? "4/3";
  const zoom = zoomOnHover
    ? "transition-transform duration-300 ease-out group-hover:scale-[1.03]"
    : "";

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className="relative w-full overflow-hidden bg-[#1a1a1a]"
        style={{ aspectRatio: aspect.replace("/", " / "), maxHeight }}
      >
        {visual.src ? (
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            unoptimized
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className={`object-cover ${zoom}`}
          />
        ) : (
          // Placeholder — mirrors the treatment already used on /portfolio and
          // /services. aria-hidden because the caption/alt carries the meaning.
          <div
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center ${zoom}`}
          >
            <span className="font-body px-3 text-center text-xs tracking-[0.2em] text-[#666]">
              [ IMAGE — REPLACE ]
            </span>
          </div>
        )}
      </div>

      {visual.caption && (
        <figcaption className="font-body text-cream-dim mt-3 text-xs leading-relaxed">
          {visual.caption}
        </figcaption>
      )}
    </figure>
  );
}
