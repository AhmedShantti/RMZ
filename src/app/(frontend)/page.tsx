import IntroLoader from "@/components/IntroLoader";
import HeroCursorField from "@/components/HeroCursorField";
import HomeLogoStairs from "@/components/HomeLogoStairs";
import ServicesTeaser from "@/components/ServicesTeaser";
import VideoSection from "@/components/VideoSection";
import MarketsBlock from "@/components/MarketsBlock";
import { getHome, getServices, getContact, getSiteSettings } from "@/lib/cms";
import Gradient from "@/components/gradient/NeatGradient";
import ClientCard from "@/components/ClientCard";

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
      
      <div style={{ position: 'relative', minHeight: '100vh' }}>
       <Gradient />
       
      

      {/* your real content goes here, on top */}
      <div data-squares-stage style={{ position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>
        
        
 
        <HeroCursorField
        kicker={home.heroKicker}
        statement={home.heroStatement}
        subline={home.heroSubline}
      />
      {/* Wordmark + logo squares → emerge → stairs (pinned) */}
      <HomeLogoStairs stairs={home.stairs} />
      <ServicesTeaser services={featured}  />
     
      <ClientCard heading={home.clientsHeading} clients={home.clientCards} />
      
      <VideoSection
        leftLabel={home.showreel.leftLabel}
        rightLabel={home.showreel.rightLabel}
      />
      <MarketsBlock
        asTeaser
        story={contact.heroStory}
        markets={contact.markets}
        socials={settings.socials}
        ctaLabel={home.teaserCtaLabel}
      />
      </div>
      
    </div>

    
     
    </>
  );
}
