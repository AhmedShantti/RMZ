import Image from "next/image";
import type { AboutImage } from "@/content/about";

/**
 * Full-bleed banner at the very top of the About page. It is absolutely
 * positioned inside the page wrapper (which is exactly viewport-wide minus the
 * scrollbar — no 100vw, so no horizontal scroll) and sits at z-index -2: above
 * the page background, but BEHIND the fixed scroll-squares overlay (z -1), the
 * page content and the fixed header, so the squares still float over it and
 * the header is never cut off. The empty `#about-hero` section below provides
 * the scroll space it occupies.
 *
 * Height: 50svh on phones, 65svh from `sm`. `object-fit: cover` with the CMS
 * focal point; a dark gradient at the bottom blends it into the page, and a
 * faint one at the top keeps the header legible.
 */
export default function AboutBanner({ image }: { image: AboutImage | null }) {
  return (
    <div
      aria-hidden={image ? undefined : true}
      className="pointer-events-none absolute inset-x-0 top-0 h-[50svh] overflow-hidden sm:h-[65svh]"
      // The banner itself fades out at the bottom (mask), so it dissolves into
      // the page's own background gradient instead of ending in a hard edge.
      style={{
        zIndex: -2,
        maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)",
      }}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
          style={{ objectPosition: `${image.focalX}% ${image.focalY}%` }}
        />
      ) : (
        // TODO: upload the banner in /studio → About → Banner (landscape,
        // ≥2400px wide, e.g. 2400×1350, JPG/WebP ≤ ~500 KB) + alt text.
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <span className="font-body absolute bottom-24 start-5 text-sm text-[#666] sm:start-8">
            [ ABOUT BANNER — 2400×1350 · UPLOAD IN /studio ]
          </span>
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0) 70%), linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%)",
        }}
      />
    </div>
  );
}
