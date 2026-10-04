import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import BtsVideos from "@/components/BtsVideos";
import { getBts, getMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("btsContent", {
    title: "Behind the scenes",
    description:
      "The people, sets and late nights behind Rebel Mind Zone's work — behind-the-scenes videos.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

/** /bts — the behind-the-scenes videos. Content: CMS → Pages → BTS. */
export default async function BtsPage() {
  const bts = await getBts();
  return (
    <>
      <PageIntro kicker="BTS" title={bts.title} lede={bts.lede} />
      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <BtsVideos items={bts.items} />
      </section>
    </>
  );
}
