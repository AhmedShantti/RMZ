"use client";

import { motion } from "motion/react";
import SectionWatermark from "./SectionWatermark";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * ClientsCollage (Redesigning Stage 1) — three portrait client photos in an
 * overlapping, slightly-rotated editorial collage over a giant faded "CLIENTS"
 * watermark, on the existing dark-red stage. Sticker badges sit on photos 1 & 3.
 *
 * Photos are clearly-labelled placeholders for now (no real imagery).
 * Desktop: overlapping + rotated collage. Mobile (<768px): stacked, full-width,
 * no rotation, no overlap.
 */
type Photo = {
  label: string;
  /** desktop-only transform classes (rotation + vertical offset + overlap) */
  deskClasses: string;
  z: string;
  width: string;
  badge?: { name: string; color: string; rotate: string };
};

const PHOTOS: Photo[] = [
  {
    label: "[ CLIENT PHOTO 1 — REPLACE ]",
    deskClasses: "md:translate-y-8 md:rotate-[-2deg] md:-mr-6",
    z: "z-20",
    width: "md:w-[260px]",
    badge: { name: "CLIENT NAME", color: "var(--acc-orange)", rotate: "-6deg" },
  },
  {
    label: "[ CLIENT PHOTO 2 — REPLACE ]",
    deskClasses: "md:-translate-y-8 md:rotate-0",
    z: "z-30",
    width: "md:w-[300px]",
  },
  {
    label: "[ CLIENT PHOTO 3 — REPLACE ]",
    deskClasses: "md:translate-y-8 md:rotate-[2deg] md:-ml-6",
    z: "z-20",
    width: "md:w-[260px]",
    badge: { name: "CLIENT NAME", color: "var(--acc-green)", rotate: "6deg" },
  },
];

export default function ClientsCollage() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="clients-heading"
      className="relative flex w-full min-h-[600px] items-center justify-center overflow-hidden py-20"
    >
      <h2 id="clients-heading" className="sr-only">
        Clients
      </h2>

      {/* dark-red bed, matching the site's red-light language */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(120% 100% at 50% 100%, color-mix(in srgb, var(--red-deep) 32%, transparent), transparent 62%)",
        }}
      />

      <SectionWatermark text="CLIENTS" />

      {/* collage */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 px-5 md:flex-row md:justify-center md:gap-0 sm:px-8">
        {PHOTOS.map((p, i) => (
          <motion.div
            key={p.label}
            className={`relative aspect-[3/4] w-full max-w-[300px] ${p.width} ${p.deskClasses} ${p.z}`}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* TODO: Replace with real client photo */}
            <div className="flex h-full w-full items-center justify-center border border-white/10 bg-[#1a1a1a]">
              <span className="font-body text-sm uppercase tracking-[0.2em] text-[#666]">
                {p.label}
              </span>
            </div>

            {/* sticker badge (photos 1 & 3) */}
            {p.badge && (
              <span
                className="font-body absolute bottom-10 left-1/2 z-20 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.15em]"
                style={{
                  backgroundColor: p.badge.color,
                  color: "var(--ink)",
                  transform: `translateX(-50%) rotate(${p.badge.rotate})`,
                }}
              >
                {p.badge.name}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
