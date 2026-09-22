import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import RunsText from "@/components/RunsText";
import { getPortfolio, getPortfolioPage, getMeta } from "@/lib/cms";
import { groupProjectsByCategory } from "@/lib/portfolioGrouping";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("portfolioContent", {
    title: "Portfolio",
    description:
      "Selected work from Rebel Mind Zone — brand identity, campaigns, packaging and content across the region.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

export default async function PortfolioPage() {
  const [page, projects] = await Promise.all([
    getPortfolioPage(),
    getPortfolio(),
  ]);

  const groups = groupProjectsByCategory(projects);

  return (
    <>
      <PageIntro
        kicker="Portfolio"
        title={<RunsText runs={page.pageTitle} />}
        lede={page.lede}
      />

      <section className="pb-28 sm:pb-36">
        {/* 90% of the page width, centered — wider than the hero above on
            purpose; at least 16px of side space is preserved at any width. */}
        <div className="mx-auto w-[min(90%,calc(100%-32px))]">
          <div className="flex flex-col gap-14 sm:gap-[72px]">
            {groups.map((group) => {
              const headingId = `category-${group.slug}`;
              return (
                <section key={group.key} aria-labelledby={headingId}>
                  <Reveal className="flex items-baseline justify-between gap-4">
                    <h2
                      id={headingId}
                      className="font-display text-cream text-[clamp(24px,2.6vw,36px)] italic"
                    >
                      {group.label}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="font-body text-cream-dim shrink-0 text-xs tracking-[0.2em]"
                    >
                      {String(group.projects.length).padStart(2, "0")}
                    </span>
                  </Reveal>

                  <div className="bg-cream/25 mt-[14px] h-px w-full" />

                  <ul className="category-row mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-7 xl:gap-10">
                    {group.projects.map((p) => (
                      <li
                        key={p.slug}
                        className="w-[88%] flex-none snap-start sm:w-[calc((100%-28px)/2)] xl:w-[calc((100%-80px)/3)]"
                      >
                        <Link
                          href={`/portfolio/${p.slug}`}
                          className="group focus-visible:outline-cream block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                        >
                          <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#151313]">
                            {p.cover?.src ? (
                              <Image
                                src={p.cover.src}
                                alt={`${p.name} cover image`}
                                fill
                                sizes="(max-width: 640px) 88vw, (max-width: 1279px) 45vw, 30vw"
                                className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center px-4">
                                <span className="font-display text-cream-dim text-center italic">
                                  {p.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="font-body text-cream-dim mt-4 text-[12px] tracking-[0.2em] uppercase sm:mt-5 sm:text-[13px]">
                            {p.market} · {group.label}
                          </p>
                          <h3 className="font-display text-cream mt-1 text-[clamp(22px,1.8vw,30px)]">
                            {p.name}
                          </h3>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <p className="font-body text-cream-dim mt-8 text-xs">
            * Placeholder projects — replace with real case studies.
          </p>
        </div>
      </section>
    </>
  );
}
