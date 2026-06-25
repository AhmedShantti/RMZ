import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
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
      <PageIntro
        kicker="Services"
        title={<RunsText runs={data.pageTitle} />}
        lede={data.lede}
      />
      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <ServiceRail services={services} />
      </section>
    </>
  );
}
