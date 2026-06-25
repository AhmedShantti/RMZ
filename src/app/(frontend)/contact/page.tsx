import type { Metadata } from "next";
import AccentBlocks from "@/components/AccentBlocks";
import ContactForm from "@/components/ContactForm";
import MarketsColumns from "@/components/MarketsColumns";
import RunsText from "@/components/RunsText";
import Reveal from "@/components/Reveal";
import { getContact, getSiteSettings, getMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("contactContent", {
    title: "Contact",
    description:
      "Let's create a new story. Tell Rebel Mind Zone what you're making — across the Gulf, Levantine, Arab and Egyptian markets.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([
    getContact(),
    getSiteSettings(),
  ]);

  return (
    <div className="px-5 pb-28 pt-32 sm:px-8 sm:pb-36 sm:pt-40">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Left — the statement + the form */}
        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-6">
            <AccentBlocks size={14} gap={8} />
            <h1 className="display-statement text-cream text-[clamp(2.6rem,7vw,5.5rem)]">
              <RunsText runs={contact.heroStory} />
            </h1>
            <p className="font-body text-cream-dim max-w-md text-lg leading-relaxed">
              {contact.lede}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm form={contact.form} />
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col gap-3 pt-4">
            <div className="hairline" />
            <div className="font-body text-cream-dim flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="hover:text-cream transition-colors"
              >
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-cream transition-colors"
              >
                {settings.email}
              </a>
              {settings.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — the four markets (Egyptian in red) */}
        <Reveal delay={0.1}>
          <div className="lg:sticky lg:top-32">
            <h2 className="font-display text-cream-dim mb-8 text-sm uppercase tracking-[0.3em]">
              {contact.whereWeWorkLabel}
            </h2>
            <MarketsColumns markets={contact.markets} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
