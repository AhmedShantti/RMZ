import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import RunsText from "@/components/RunsText";
import { portfolioPage } from "@/content/portfolio";
import { getPortfolio } from "@/lib/cms";

// Tile heights — equal 300px on mobile, varied on desktop for the editorial
// masonry feel (no two adjacent tiles share a height).
const PORTFOLIO_HEIGHTS = [
  "h-[300px] sm:h-[420px]",
  "h-[300px] sm:h-[300px]",
  "h-[300px] sm:h-[360px]",
];

// Portfolio is a collection with no page-header global — metadata stays static.
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work from Rebel Mind Zone — brand identity, campaigns, packaging and content across the region.",
};

export default async function PortfolioPage() {
  const projects = await getPortfolio();

  return (
    <>
      <PageIntro
        kicker="Portfolio"
        title={<RunsText runs={portfolioPage.pageTitle} />}
        lede={portfolioPage.lede}
      />

      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          {/* Editorial varied-height masonry. Column-based (true no-JS masonry)
              so adjacent tiles differ in height and pack flush.
              TODO: Replace placeholders with real project images. */}
          <Reveal>
            <ul className="columns-1 [column-gap:2px] sm:columns-2 lg:columns-3">
              {projects.map((p, i) => (
                <li
                  key={p.name}
                  className={`mb-[2px] break-inside-avoid ${PORTFOLIO_HEIGHTS[i % PORTFOLIO_HEIGHTS.length]}`}
                >
                  <Link
                    href="/contact"
                    className="group relative block h-full w-full overflow-hidden"
                  >
                    {/* image placeholder — fills + scales on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                      <span className="font-body text-sm text-[#666]">
                        [ PROJECT IMAGE — REPLACE ]
                      </span>
                    </div>
                    {/* darken on hover + a base gradient so text stays readable */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/25"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)",
                      }}
                    />
                    {/* name overlay — bottom-left, no background box */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-body text-cream-dim mb-1 text-[0.65rem] uppercase tracking-[0.2em]">
                        {p.market} · {p.discipline}
                      </p>
                      <h2 className="font-display text-2xl italic leading-tight text-white">
                        {p.name}
                      </h2>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <p className="font-body text-cream-dim mt-8 text-xs">
            * Placeholder projects — replace with real case studies.
          </p>
        </div>
      </section>
    </>
  );
}
