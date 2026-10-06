import IntroLoader from "@/components/IntroLoader";
import HeroCursorField from "@/components/HeroCursorField";
import HomeLogoStairs from "@/components/HomeLogoStairs";
import ServicesTeaser from "@/components/ServicesTeaser";
import VideoSection from "@/components/VideoSection";
import MarketsBlock from "@/components/MarketsBlock";
import { getHome, getServices, getContact, getSiteSettings, getBts, getHomeSections, getFeaturedProjects } from "@/lib/cms";
import Gradient from "@/components/gradient/NeatGradient";
import BtsSection from "@/components/BtsSection";
import FeaturedWork from "@/components/FeaturedWork";
import ClientLogos from "@/components/ClientLogos";
import CtaBanner from "@/components/CtaBanner";

const SHOW_SHOWREEL = false;

export default async function Home() {
  const [home, servicesData, contact, settings, bts, sections] = await Promise.all([
    getHome(),
    getServices(),
    getContact(),
    getSiteSettings(),
    getBts(),
    getHomeSections(),
  ]);
  const featuredProjects = sections.featured.enabled ? await getFeaturedProjects(sections.featured.slugs) : [];

  // Number services 01..N by their full-list order, then keep the featured ones.
  const featured = servicesData.services
    .map((s, i) => ({
      index: String(i + 1).padStart(2, "0"),
      title: s.title,
      blurb: s.blurb,
      items: s.items,
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

      {/* Selected work — featured projects (CMS: Home sections) */}
      {sections.featured.enabled && (
        <FeaturedWork
          kicker={sections.featured.kicker}
          heading={sections.featured.heading}
          projects={featuredProjects}
          buttonLabel={sections.featured.buttonLabel}
          buttonLink={sections.featured.buttonLink}
        />
      )}
     
      {/* BTS section (was Clients): each card opens its video on /bts */}
      <BtsSection
        heading={bts.homeHeading}
        items={bts.items.map((it) => ({
          name: it.title,
          category: it.label,
          photoUrl: it.imageUrl,
          alt: it.imageAlt,
          href: `/bts#${it.slug}`,
          videoUrl: it.videoUrl,
          landscape: it.landscape,
        }))}
      />
      
      {/* Client logos + closing call-to-action (CMS: Home sections) */}
      {sections.logos.enabled && (
        <ClientLogos heading={sections.logos.heading} items={sections.logos.items} />
      )}
      {sections.cta.enabled && <CtaBanner {...sections.cta} />}

      {/* Showreel is switched off for now (kept in the codebase) — flip SHOW_SHOWREEL to bring it back. */}
      {SHOW_SHOWREEL && <VideoSection videos={home.showreel.videos} />}
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
