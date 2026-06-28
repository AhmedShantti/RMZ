import type { Metadata } from "next";
import Logo from "@/components/Logo";
import FloatingSquares from "@/components/FloatingSquares";
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

// TODO: Move the office address into the CMS (siteSettings) — placeholder for now.
const OFFICE_ADDRESS = "Office 102: Nasr City, Cairo, Egypt";

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([
    getContact(),
    getSiteSettings(),
  ]);

  return (
    <div className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        {/* Large centred logo */}
        <Reveal className="flex justify-center">
          <Logo className="w-[clamp(200px,40vw,280px)]" />
        </Reveal>

        {/* Heading framed by the floating squares */}
        <Reveal delay={0.05}>
          <div className="relative mt-14 flex flex-col items-center text-center">
            <FloatingSquares
              size={80}
              className="-top-6 left-2 hidden sm:block"
            />
            <h1 className="display-statement text-cream relative z-10 text-[clamp(2.6rem,7vw,5.5rem)]">
              <RunsText runs={contact.heroStory} />
            </h1>
            <p className="font-body text-cream-dim relative z-10 mt-6 max-w-md text-lg leading-relaxed">
              {contact.lede}
            </p>
          </div>
        </Reveal>

        {/* Info bar — address · email · arrow */}
        <Reveal delay={0.1}>
          <div className="border-cream-dim/30 mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b py-5">
            <span className="font-body text-cream-dim text-sm underline underline-offset-4">
              {OFFICE_ADDRESS}
            </span>
            <span className="font-body text-cream-dim flex items-center gap-3 text-sm">
              <a
                href={`mailto:${settings.email}`}
                className="underline underline-offset-4 hover:text-cream transition-colors"
              >
                {settings.email}
              </a>
              <a
                href={`mailto:${settings.email}`}
                aria-label="Email us"
                className="hover:text-cream transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 13L13 5M13 5H6M13 5V12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </span>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.14} className="mt-12">
          <ContactForm form={contact.form} />
        </Reveal>
      </div>

      {/* Markets — kept, moved below the form */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-28 max-w-6xl">
          <h2 className="font-display text-cream-dim mb-8 text-sm uppercase tracking-[0.3em]">
            {contact.whereWeWorkLabel}
          </h2>
          <MarketsColumns markets={contact.markets} />
        </div>
      </Reveal>
    </div>
  );
}
