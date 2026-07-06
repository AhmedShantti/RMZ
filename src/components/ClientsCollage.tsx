"use client";

import { motion } from "motion/react";
import SectionWatermark from "./SectionWatermark";
import { useReducedMotion } from "@/lib/reducedMotion";
import type { ClientPhoto } from "@/content/home";

/**
 * ClientsCollage (Redesigning Stage 1) — portrait client photos in an
 * overlapping, slightly-rotated editorial collage over a giant faded "CLIENTS"
 * watermark, on the existing dark-red stage. Sticker badges sit on some photos.
 *
 * Photo captions + badges come from the CMS (homeContent → Clients collage);
 * imagery stays placeholder until real photos land. Desktop: overlapping +
 * rotated collage. Mobile (<768px): stacked, full-width, no rotation/overlap.
 */

/** Per-position styling (design only — repeats if there are more than 3). */
const LAYOUT = [
  { deskClasses: "md:translate-y-8 md:rotate-[-2deg] md:-mr-6", z: "z-20", width: "md:w-[260px]", badgeRotate: "-6deg" },
  { deskClasses: "md:-translate-y-8 md:rotate-0", z: "z-30", width: "md:w-[300px]", badgeRotate: "0deg" },
  { deskClasses: "md:translate-y-8 md:rotate-[2deg] md:-ml-6", z: "z-20", width: "md:w-[260px]", badgeRotate: "6deg" },
];

const ACCENT: Record<ClientPhoto["badgeAccent"], string | null> = {
  orange: "var(--acc-orange)",
  green: "var(--acc-green)",
  none: null,
};

export default function ClientsCollage({ photos }: { photos: ClientPhoto[] }) {
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
        {photos.map((p, i) => {
          const layout = LAYOUT[i % LAYOUT.length];
          const badgeColor = ACCENT[p.badgeAccent];
          const showBadge = badgeColor !== null && p.badgeName.trim() !== "";
          return (
            <motion.div
              key={`${p.label}-${i}`}
              className={`relative aspect-[3/4] w-full max-w-[300px] ${layout.width} ${layout.deskClasses} ${layout.z}`}
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

              {/* sticker badge */}
              {showBadge && (
                <span
                  className="font-body absolute bottom-10 left-1/2 z-20 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    backgroundColor: badgeColor,
                    color: "var(--ink)",
                    transform: `translateX(-50%) rotate(${layout.badgeRotate})`,
                  }}
                >
                  {p.badgeName}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
