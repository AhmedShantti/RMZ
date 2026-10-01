import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import BannerTitle from "./BannerTitle";

/**
 * Full-width page banner: photo + bottom fade + (optional) animated title.
 * Used by the About page (with the scroll-squares overlay as `children`) and
 * the Portfolio page (no overlay).
 *
 * Layers, inside the banner's own box (it is an isolated stacking context):
 *   0 image (+ its gradients, masked so it dissolves into the page background)
 *   1 title scrim — soft local radial gradient behind the text only
 *   2 `children` — page-specific overlay (e.g. the About squares)
 *   3 title — anchored in the banner's box, never offset from the viewport
 *
 * Title position rule: left (inline-start) edge on the page gutter — the same
 * `px-5 sm:px-8` + `max-w-6xl` container as the content below — with its BOTTOM
 * edge at 60% of the banner's height (`--banner-title-bottom`, default 40% from
 * the banner's bottom). That puts it on the opaque part of the photo (the mask
 * only starts fading at 55%) and keeps it clear of the fixed header above and of
 * the About squares row (viewport centre = 77% of the banner height on desktop,
 * 100% on phones).
 *
 * `placement`:
 *   "absolute" — pinned to the top of the nearest positioned ancestor, behind the
 *                page content (z-index -2). The page provides the scroll space
 *                (About: the empty hero section) and must be an isolated
 *                stacking context. Full-bleed because its ancestor is.
 *   "flow"     — a normal block at the top of the page (Portfolio).
 *
 * Height: 50svh on phones, 65svh from `sm`. With no image and no
 * `placeholderLabel` the banner (and its title) is not rendered at all.
 */
export type PageBannerProps = {
  image: { url: string; width?: number; height?: number } | null;
  alt?: string;
  /** Crop focus, % from the top-left (default 50 / 50). */
  focalX?: number;
  focalY?: number;
  /** Newlines become line breaks; empty = no title. */
  title?: string;
  /** Use "h1" only if the page has no other h1. */
  headingLevel?: "h1" | "h2";
  /** Overlay rendered above the image/scrim and below the title. */
  children?: ReactNode;
  /** When there is no image: show a labelled placeholder instead of nothing. */
  placeholderLabel?: string;
  placement?: "absolute" | "flow";
  className?: string;
};

export default function PageBanner({
  image,
  alt = "",
  focalX = 50,
  focalY = 50,
  title = "",
  headingLevel = "h2",
  children,
  placeholderLabel,
  placement = "flow",
  className = "",
}: PageBannerProps) {
  if (!image && !placeholderLabel) return <>{children}</>;

  const text = title.trim();
  const rootStyle: CSSProperties = {
    isolation: "isolate",
    ...(placement === "absolute" ? { zIndex: -2 } : {}),
  };
  const mask = "linear-gradient(to bottom, #000 55%, transparent 100%)";

  return (
    <div
      data-page-banner
      className={`${
        placement === "absolute" ? "pointer-events-none absolute inset-x-0 top-0" : "relative"
      } h-[50svh] sm:h-[65svh] ${className}`}
      style={rootStyle}
    >
      {/* 0 — image + gradients, faded out at the bottom (mask) so it dissolves
          into the page's own background instead of ending in a hard edge. */}
      <div
        aria-hidden={image ? undefined : true}
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 0, maskImage: mask, WebkitMaskImage: mask }}
      >
        {image ? (
          <Image
            src={image.url}
            alt={alt}
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover"
            style={{ objectPosition: `${focalX}% ${focalY}%` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]">
            <span className="font-body absolute bottom-24 start-5 text-sm text-[#666] sm:start-8">
              {placeholderLabel}
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

      {/* 1 — scrim behind the title only: a soft radial gradient anchored at the
          inline-start edge, around the title's height. Mirrored in RTL. */}
      {text && (
        <div
          aria-hidden="true"
          className="page-banner-scrim pointer-events-none absolute inset-0 rtl:-scale-x-100"
          style={{ zIndex: 1 }}
        />
      )}

      {/* 2 — page-specific overlay slot (About: the fixed scroll squares). */}
      {children && <div style={{ position: "relative", zIndex: 2 }}>{children}</div>}

      {/* 3 — title */}
      {text && (
        <div
          className="pointer-events-none absolute inset-x-0 px-5 sm:px-8"
          style={{ zIndex: 3, bottom: "var(--banner-title-bottom, 40%)" }}
        >
          <noscript>
            <style>{`.about-title-word{opacity:1!important;transform:none!important}`}</style>
          </noscript>
          <div className="mx-auto max-w-6xl">
            <BannerTitle title={text} as={headingLevel} />
          </div>
        </div>
      )}
    </div>
  );
}
