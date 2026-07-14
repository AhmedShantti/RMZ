import Link from "next/link";
import AccentBlocks from "@/components/AccentBlocks";
import Reveal from "@/components/Reveal";
import ProjectImage from "./ProjectImage";
import type { Visual } from "@/content/portfolio";

/**
 * Case-study hero. Reads as PageIntro (kicker + big italic-serif statement) with
 * the project's meta row and main visual under it — so a project page announces
 * itself the same way every other inner page does.
 */
type Props = {
  name: string;
  category: string;
  client: string;
  year: string;
  result?: string;
  cover?: Visual;
};

export default function ProjectHero({
  name,
  category,
  client,
  year,
  result,
  cover,
}: Props) {
  return (
    <header className="relative px-5 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-6 flex items-center gap-4">
          <AccentBlocks size={12} />
          <Link
            href="/portfolio"
            className="font-body text-cream-dim hover:text-cream text-xs uppercase tracking-[0.35em] transition-colors duration-300"
          >
            Portfolio
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="display-statement text-cream max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] italic">
            {name}
          </h1>
        </Reveal>

        {result && (
          <Reveal delay={0.1}>
            <p className="font-body text-cream-dim mt-8 max-w-xl text-lg leading-relaxed">
              {result}
            </p>
          </Reveal>
        )}

        {/* Meta row — the fixed metadata every project carries. */}
        <Reveal delay={0.15}>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[color-mix(in_srgb,var(--cream-dim)_22%,transparent)] pt-8 sm:grid-cols-3">
            {[
              { label: "Client", value: client },
              { label: "Category", value: category },
              { label: "Year", value: year },
            ].map((m) => (
              <div key={m.label}>
                <dt className="font-body text-cream-dim mb-2 text-[0.65rem] uppercase tracking-[0.2em]">
                  {m.label}
                </dt>
                <dd className="font-display text-cream text-lg leading-snug">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Main visual — the one image on the page that isn't lazy-loaded. Renders
          its placeholder when no cover has been uploaded yet, so the hero keeps
          its shape while the CMS is still being filled in. */}
      <Reveal delay={0.2} className="mx-auto mt-16 max-w-6xl">
        <ProjectImage
          visual={cover ?? { alt: "", ratio: "16/9" }}
          ratio={cover?.ratio ?? "16/9"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1152px"
          priority
        />
      </Reveal>
    </header>
  );
}
