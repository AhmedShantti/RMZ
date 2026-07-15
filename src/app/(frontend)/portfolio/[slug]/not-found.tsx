import Link from "next/link";
import PageIntro from "@/components/PageIntro";

/**
 * Unknown project slug. Scoped to the segment so a bad /portfolio/<x> lands on
 * something on-brand with a way back, rather than the bare app-wide 404.
 */
export default function ProjectNotFound() {
  return (
    <>
      <PageIntro
        kicker="Portfolio"
        title={
          <>
            That project <span className="italic">isn’t here</span>.
          </>
        }
        lede="The case study you're looking for has moved, or never existed. The rest of the work is still worth a look."
      />

      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-6xl">
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
      </section>
    </>
  );
}
