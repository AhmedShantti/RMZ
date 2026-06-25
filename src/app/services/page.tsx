import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ServiceRail from "@/components/ServiceRail";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Design, content, photography, video, creative consulting and development — six disciplines, one disciplined creative mind.",
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        kicker="Services"
        title={
          <>
            Six disciplines, <span className="italic">one</span> disciplined{" "}
            <span className="text-rebel-red italic">mind</span>.
          </>
        }
        lede="Pick a number. Each offering is a focused practice — sharp where it counts, quiet everywhere else."
      />
      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <ServiceRail />
      </section>
    </>
  );
}
