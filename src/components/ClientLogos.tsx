import Image from "next/image";
import Reveal from "./Reveal";
import { Marquee } from "./ui/marquee";

type Logo = { name: string; url: string | null; alt: string };

/** One scrolling row. Short lists are padded so a loop is always wider than the screen. */
function LogoRow({ items, reverse }: { items: Logo[]; reverse?: boolean }) {
  const loop = Array.from({ length: Math.max(1, Math.ceil(6 / items.length)) }, () => items).flat();
  return (
    <Marquee
      pauseOnHover
      reverse={reverse}
      repeat={3}
      className="w-full [--duration:50s] [--gap:5rem] sm:[--gap:7rem] motion-reduce:[&_.animate-marquee]:animate-none"
    >
      {loop.map((l, i) => (
        <div
          key={i}
          className="flex h-20 shrink-0 items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100 sm:h-28"
          // Padded duplicates are hidden from screen readers.
          aria-hidden={i >= items.length ? true : undefined}
        >
          {l.url ? (
            <span className="relative block h-16 w-44 sm:h-24 sm:w-64">
              <Image
                src={l.url}
                alt={i >= items.length ? "" : l.alt}
                fill
                sizes="(max-width: 640px) 176px, 256px"
                className="object-contain"
              />
            </span>
          ) : (
            <span className="font-display text-cream whitespace-nowrap text-3xl italic sm:text-4xl">{l.name}</span>
          )}
        </div>
      ))}
    </Marquee>
  );
}

/**
 * Home "Client logos" — two rows of the brands worked with, scrolling slowly in
 * opposite directions (pause on hover; static under reduced motion). The list is
 * split between the rows (one brand alone uses a single row). A brand without a
 * logo image shows its name as text. Renders nothing while the list is empty.
 */
export default function ClientLogos({ heading, items }: { heading: string; items: Logo[] }) {
  if (!items.length) return null;
  const mid = Math.ceil(items.length / 2);
  const top = items.slice(0, mid);
  const bottom = items.slice(mid);
  return (
    <section
      aria-label="Clients"
      className="relative border-t border-cream-dim/15 py-20 sm:py-28"
    >
      {heading && (
        <Reveal className="mb-12 px-5 text-center sm:px-8">
          <h2 className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]">{heading}</h2>
        </Reveal>
      )}
      <div className="flex flex-col gap-6 sm:gap-10">
        <LogoRow items={top} />
        {bottom.length > 0 && <LogoRow items={bottom} reverse />}
      </div>
    </section>
  );
}
