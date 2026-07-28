"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Full-bleed services hero carousel — crossfades through the CMS `heroImages`.
 * One image renders statically; two or more auto-advance every 5s (a soft
 * opacity crossfade). Static (first image only) under prefers-reduced-motion.
 * The page keeps its dark overlay + title on top of this.
 */
type HeroImage = { url: string; alt: string };
const INTERVAL_MS = 5000;

export default function ServicesHeroCarousel({
  images,
}: {
  images: HeroImage[];
}) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const len = images.length;

  useEffect(() => {
    if (reduce || len < 2) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % len), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce, len]);

  return (
    <>
      {images.map((img, i) => (
        <Image
          key={`${img.url}-${i}`}
          src={img.url}
          alt={img.alt || "Services"}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {len > 1 && (
        <div className="absolute bottom-10 right-10 z-10 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i === current ? "var(--cream)" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
