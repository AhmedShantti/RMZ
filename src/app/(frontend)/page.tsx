import IntroLoader from "@/components/IntroLoader";
import HeroCursorField from "@/components/HeroCursorField";
import WordmarkMoment from "@/components/WordmarkMoment";
import ServicesTeaser from "@/components/ServicesTeaser";
import ClientsCollage from "@/components/ClientsCollage";
import VideoSection from "@/components/VideoSection";
import MarketsBlock from "@/components/MarketsBlock";
import { getHome, getServices, getContact, getSiteSettings } from "@/lib/cms";

export default async function Home() {
  const [home, servicesData, contact, settings] = await Promise.all([
    getHome(),
    getServices(),
    getContact(),
    getSiteSettings(),
  ]);

  // Number services 01..N by their full-list order, then keep the featured ones.
  const featured = servicesData.services
    .map((s, i) => ({
      index: String(i + 1).padStart(2, "0"),
      title: s.title,
      blurb: s.blurb,
      featuredOnHome: s.featuredOnHome,
    }))
    .filter((s) => s.featuredOnHome);

  return (
    <>
      <IntroLoader enabled={home.showIntroLoader} />
      <HeroCursorField
        kicker={home.heroKicker}
        statement={home.heroStatement}
        subline={home.heroSubline}
      />
      <WordmarkMoment />
      <ServicesTeaser services={featured} />
      <ClientsCollage />
      <VideoSection />
      <MarketsBlock
        asTeaser
        story={contact.heroStory}
        markets={contact.markets}
        socials={settings.socials}
        ctaLabel={home.teaserCtaLabel}
      />
    </>
  );
}
