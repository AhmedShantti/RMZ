import type { Metadata } from "next";
import ServiceRail from "@/components/ServiceRail";
import RunsText from "@/components/RunsText";
import { getServices, getMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("servicesContent", {
    title: "Services",
    description:
      "Design, content, photography, video, creative consulting and development — six disciplines, one disciplined creative mind.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

export default async function ServicesPage() {
  const data = await getServices();
  const services = data.services.map((s, i) => ({
    index: String(i + 1).padStart(2, "0"),
    title: s.title,
    blurb: s.blurb,
    items: s.items,
  }));

  return (
    <>
      {/* Full-bleed service hero image (Redesigning Stage 5) */}
      {/* TODO: Replace with a real brand/client hero image */}
      <section className="relative min-h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
          <span className="font-body text-sm tracking-[0.2em] text-[#666]">
            [ SERVICE HERO IMAGE — REPLACE ]
          </span>
        </div>
        {/* dark overlay so the title stays readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2))",
          }}
        />
        {/* service name — bottom-left, 40px padding */}
        <div className="absolute bottom-0 left-0 p-10">
          <p className="font-body mb-3 text-xs uppercase tracking-[0.35em] text-white/70">
            Services
          </p>
          <h1 className="display-statement text-[clamp(2.4rem,6vw,5rem)] text-white">
            <RunsText runs={data.pageTitle} />
          </h1>
        </div>
      </section>

      <section className="px-5 pb-28 pt-16 sm:px-8 sm:pb-36 sm:pt-20">
        <p className="font-body text-cream-dim mx-auto mb-16 max-w-2xl text-lg leading-relaxed">
          {data.lede}
        </p>
        <ServiceRail services={services} />
      </section>
    </>
  );
}
