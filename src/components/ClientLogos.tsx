import Image from "next/image";
import Reveal from "./Reveal";
import { Marquee } from "./ui/marquee";

type Logo = { name: string; url: string | null; alt: string };

/**
 * Home "Client logos" — a slowly scrolling row of the brands worked with (pauses
 * on hover; static under reduced motion). A brand without a logo image shows its
 * name as text. Renders nothing while the list is empty.
 */
export default function ClientLogos({ heading, items }: { heading: string; items: Logo[] }) {
  if (!items.length) return null;
  // Pad short lists so one loop is always wider than the screen (no gap at the seam).
  const loop = Array.from({ length: Math.max(1, Math.ceil(8 / items.length)) }, () => items).flat();
  return (
    <section
      aria-label="Clients"
      className="relative border-t border-cream-dim/15 py-20 sm:py-24"
    >
      {heading && (
        <Reveal className="mb-10 px-5 text-center sm:px-8">
          <h2 className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]">{heading}</h2>
        </Reveal>
      )}
      <Marquee
        pauseOnHover
        repeat={3}
        className="w-full [--duration:45s] [--gap:4.5rem] motion-reduce:[&_.animate-marquee]:animate-none"
      >
        {loop.map((l, i) => (
          <div
            key={i}
            className="flex h-14 shrink-0 items-center justify-center opacity-60 transition-opacity duration-300 hover:opacity-100"
            // Duplicates (the padded loop + marquee copies) are decorative.
            aria-hidden={i >= items.length ? true : undefined}
          >
            {l.url ? (
              <span className="relative block h-10 w-36">
                <Image src={l.url} alt={i < items.length ? l.alt : ""} fill sizes="144px" className="object-contain" />
              </span>
            ) : (
              <span className="font-display text-cream whitespace-nowrap text-2xl italic">{l.name}</span>
            )}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
