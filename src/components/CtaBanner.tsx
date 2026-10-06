import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

/**
 * Home closing call-to-action banner — kicker, big heading, optional line, a
 * button, and an optional dimmed background image. All text from the CMS.
 */
export default function CtaBanner({
  kicker,
  heading,
  text,
  buttonLabel,
  buttonLink,
  imageUrl,
}: {
  kicker: string;
  heading: string;
  text: string;
  buttonLabel: string;
  buttonLink: string;
  imageUrl: string | null;
}) {
  if (!heading && !buttonLabel) return null;
  const external = /^https?:\/\//i.test(buttonLink);
  const btn =
    "font-body text-cream bg-rebel-red inline-flex w-fit items-center gap-2 rounded-none px-8 py-4 text-sm uppercase tracking-wider transition-opacity hover:opacity-90";
  return (
    <section
      aria-label="Start a project"
      className="relative isolate overflow-hidden border-t border-cream-dim/15 px-5 py-28 sm:px-8 sm:py-40"
    >
      {imageUrl && (
        <>
          <Image src={imageUrl} alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/65" />
        </>
      )}
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        {kicker && (
          <p className="font-display text-cream-dim text-sm uppercase tracking-[0.3em]">{kicker}</p>
        )}
        {heading && (
          <h2 className="display-statement text-cream text-[clamp(2.4rem,7vw,5.5rem)] italic">{heading}</h2>
        )}
        {text && <p className="font-body text-cream-dim max-w-xl text-lg leading-relaxed">{text}</p>}
        {buttonLabel && buttonLink && (
          <div className="mt-4">
            {external ? (
              <a href={buttonLink} className={btn} target="_blank" rel="noopener noreferrer">
                {buttonLabel}
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <Link href={buttonLink} className={btn}>
                {buttonLabel}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
