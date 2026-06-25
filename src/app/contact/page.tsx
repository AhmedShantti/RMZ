import type { Metadata } from "next";
import { site } from "@/content/site";
import AccentBlocks from "@/components/AccentBlocks";
import ContactForm from "@/components/ContactForm";
import MarketsColumns from "@/components/MarketsColumns";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's create a new story. Tell Rebel Mind Zone what you're making — across the Gulf, Levantine, Arab and Egyptian markets.",
};

export default function ContactPage() {
  return (
    <div className="px-5 pb-28 pt-32 sm:px-8 sm:pb-36 sm:pt-40">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Left — the statement + the form */}
        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-6">
            <AccentBlocks size={14} gap={8} />
            <h1 className="display-statement text-cream text-[clamp(2.6rem,7vw,5.5rem)]">
              Let&rsquo;s create a new <span className="italic">STORY</span>
              <span className="text-rebel-red">..</span>
            </h1>
            <p className="font-body text-cream-dim max-w-md text-lg leading-relaxed">
              Tell us what you&rsquo;re making. The more honest the brief, the
              better the work — start anywhere.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col gap-3 pt-4">
            <div className="hairline" />
            <div className="font-body text-cream-dim flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="hover:text-cream transition-colors"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="hover:text-cream transition-colors"
              >
                {site.email}
              </a>
              {site.socials.map((s) => (
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
              Where we work
            </h2>
            <MarketsColumns />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
