import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Foot of every case study: previous / next project + the return to the index.
 *
 * Prev and next wrap around the ordered project list, so there is never a dead
 * end. With a single project in the list both are omitted and only "Back to
 * Portfolio" renders.
 */
type Neighbour = { slug: string; name: string; discipline: string } | null;

type Props = {
  prev: Neighbour;
  next: Neighbour;
};

function PagerLink({
  project,
  direction,
}: {
  project: Neighbour;
  direction: "prev" | "next";
}) {
  if (!project) return <div />;

  const isNext = direction === "next";

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      rel={direction === "prev" ? "prev" : "next"}
      className={`group block py-10 ${isNext ? "sm:text-right" : ""}`}
    >
      <span className="font-body text-cream-dim group-hover:text-rebel-red mb-3 block text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300">
        {isNext ? "Next project" : "Previous project"}
      </span>
      <span className="font-display text-cream group-hover:text-rebel-red block text-3xl italic leading-tight transition-colors duration-300 sm:text-4xl">
        {project.name}
      </span>
      <span className="font-body text-cream-dim mt-2 block text-xs">
        {project.discipline}
      </span>
    </Link>
  );
}

export default function ProjectPager({ prev, next }: Props) {
  return (
    <nav
      aria-label="Project navigation"
      className="px-5 pb-28 sm:px-8 sm:pb-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="hairline" />

          {(prev || next) && (
            <div className="grid gap-4 border-b border-[color-mix(in_srgb,var(--cream-dim)_22%,transparent)] sm:grid-cols-2">
              <PagerLink project={prev} direction="prev" />
              <PagerLink project={next} direction="next" />
            </div>
          )}

          <div className="pt-10">
            <Link
              href="/portfolio"
              className="group font-body text-cream hover:text-rebel-red inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] transition-colors duration-300"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
              >
                ←
              </span>
              Back to Portfolio
            </Link>
          </div>
        </Reveal>
      </div>
    </nav>
  );
}
