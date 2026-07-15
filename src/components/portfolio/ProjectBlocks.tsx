import Reveal from "@/components/Reveal";
import ProjectImage from "./ProjectImage";
import type { MockupKind, ProjectBlock, Visual } from "@/content/portfolio";

/**
 * The case-study block library + its renderer.
 *
 * `ProjectBlocks` walks a project's ordered `blocks` array and renders each one.
 * A project renders exactly the blocks it declares, in the order it declares
 * them — one project may be hero + overview + gallery, another the full study.
 * Nothing here assumes a neighbouring block exists, so no arrangement breaks.
 *
 * Motion is the site's existing language only: `Reveal` (rise + fade, once,
 * 0.7s, cubic-bezier(0.16,1,0.3,1)), and the 300ms ease-out hover scale already
 * used by the portfolio cards. Nothing new is introduced.
 *
 * To add a block: add a variant to ProjectBlock (content/portfolio.ts), a case
 * below, and a matching block config in payload/fields/projectBlocks.ts.
 */

/* Shared shell so every block sits on the same horizontal grid and rhythm. */
function Section({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <section
      aria-label={label}
      className={`px-5 py-16 sm:px-8 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/* The small uppercase kicker used above section content across the site. */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-body text-cream-dim mb-8 text-[0.65rem] uppercase tracking-[0.2em]">
      {children}
    </h2>
  );
}

/* Gallery sizes — tells the browser how wide each image actually renders. */
const SIZES = {
  full: "(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1152px",
  half: "(max-width: 640px) 100vw, (max-width: 1024px) 46vw, 570px",
  third: "(max-width: 640px) 100vw, (max-width: 1024px) 31vw, 376px",
};

/* ── Overview — idea / goal / challenge. Renders only the parts present. ───── */
function Overview({ block }: { block: Extract<ProjectBlock, { type: "overview" }> }) {
  const entries = [
    { label: "The idea", value: block.idea },
    { label: "The goal", value: block.goal },
    { label: "The challenge", value: block.challenge },
  ].filter((e) => e.value);

  if (!entries.length) return null;

  return (
    <Section label={block.heading ?? "Overview"}>
      <Reveal>
        <Kicker>{block.heading ?? "Overview"}</Kicker>
      </Reveal>
      <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
        {entries.map((e, i) => (
          <Reveal key={e.label} delay={i * 0.05}>
            <h3 className="font-display text-cream mb-3 text-xl italic">
              {e.label}
            </h3>
            <p className="font-body text-cream-dim text-lg leading-relaxed">
              {e.value}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Services / scope of work ──────────────────────────────────────────────── */
function Services({ block }: { block: Extract<ProjectBlock, { type: "services" }> }) {
  if (!block.items.length) return null;

  return (
    <Section label={block.heading ?? "Scope of work"}>
      <Reveal>
        <Kicker>{block.heading ?? "Scope of work"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <ul className="border-t border-[color-mix(in_srgb,var(--cream-dim)_22%,transparent)]">
          {block.items.map((item, i) => (
            <li
              key={item}
              className="flex items-baseline gap-6 border-b border-[color-mix(in_srgb,var(--cream-dim)_22%,transparent)] py-5"
            >
              <span className="font-body text-cream-dim text-xs tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-cream text-xl sm:text-2xl">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/* ── Full-width image ──────────────────────────────────────────────────────── */
function ImageFull({ block }: { block: Extract<ProjectBlock, { type: "imageFull" }> }) {
  return (
    <Section>
      <Reveal>
        <ProjectImage visual={block.image} ratio={block.image.ratio ?? "16/9"} sizes={SIZES.full} />
      </Reveal>
    </Section>
  );
}

/* ── Two- and three-column galleries ───────────────────────────────────────── */
function Gallery({ images, cols }: { images: Visual[]; cols: 2 | 3 }) {
  if (!images.length) return null;

  // Falls back to a single column on mobile, so a missing image never leaves a
  // hole and a short array never stretches to fill the row.
  const grid = cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <Section>
      <div className={`grid grid-cols-1 gap-[2px] ${grid}`}>
        {images.map((image, i) => (
          <Reveal key={`${image.alt}-${i}`} delay={i * 0.05}>
            <ProjectImage
              visual={image}
              sizes={cols === 2 ? SIZES.half : SIZES.third}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Mockups — mobile / desktop / branding / packaging / social / campaign ─── */
const MOCKUP_LABEL: Record<MockupKind, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
  branding: "Branding",
  packaging: "Packaging",
  social: "Social media",
  campaign: "Campaign",
};

/* Mobile mockups are tall, so they get a narrower column than the rest. */
function Mockups({ block }: { block: Extract<ProjectBlock, { type: "mockups" }> }) {
  if (!block.images.length) return null;

  const isMobile = block.kind === "mobile";
  const count = block.images.length;

  // Column count follows the image count so a set never leaves an orphan tile
  // on a half-empty row (3 images → 3 columns, not 2 + 1).
  const cols = isMobile
    ? "grid-cols-2 sm:grid-cols-3"
    : count === 1
      ? "grid-cols-1"
      : count % 3 === 0
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  const sizes = isMobile
    ? SIZES.third
    : count === 1
      ? SIZES.full
      : count % 3 === 0
        ? SIZES.third
        : SIZES.half;

  return (
    <Section label={block.heading ?? `${MOCKUP_LABEL[block.kind]} mockups`}>
      <Reveal>
        <Kicker>{block.heading ?? MOCKUP_LABEL[block.kind]}</Kicker>
      </Reveal>
      <div className={`grid gap-[2px] ${cols}`}>
        {block.images.map((image, i) => (
          <Reveal key={`${image.alt}-${i}`} delay={i * 0.05}>
            <ProjectImage
              visual={image}
              ratio={image.ratio ?? (isMobile ? "9/16" : "16/9")}
              sizes={sizes}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Short text between visuals — the pull-quote beat ──────────────────────── */
function TextBreak({ block }: { block: Extract<ProjectBlock, { type: "textBreak" }> }) {
  return (
    <Section className="sm:py-32">
      <Reveal>
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="display-statement text-cream text-[clamp(1.6rem,3.4vw,2.6rem)] italic">
            {block.text}
          </p>
          {block.attribution && (
            <cite className="font-body text-cream-dim mt-6 block text-xs uppercase not-italic tracking-[0.2em]">
              {block.attribution}
            </cite>
          )}
        </blockquote>
      </Reveal>
    </Section>
  );
}

/* ── Results / key numbers ─────────────────────────────────────────────────── */
function Stats({ block }: { block: Extract<ProjectBlock, { type: "stats" }> }) {
  if (!block.items.length) return null;

  return (
    <Section label={block.heading ?? "Results"}>
      <Reveal>
        <Kicker>{block.heading ?? "Results"}</Kicker>
      </Reveal>
      <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {block.items.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.05}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="display-statement text-rebel-red block text-[clamp(2.8rem,6vw,4.5rem)]">
                {stat.value}
              </span>
              <span className="font-body text-cream-dim mt-2 block text-sm leading-relaxed">
                {stat.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}

/* ── Before / after ────────────────────────────────────────────────────────── */
function BeforeAfter({ block }: { block: Extract<ProjectBlock, { type: "beforeAfter" }> }) {
  const pair = [
    { label: "Before", visual: block.before },
    { label: "After", visual: block.after },
  ];

  return (
    <Section label={block.heading ?? "Before and after"}>
      <Reveal>
        <Kicker>{block.heading ?? "Before / After"}</Kicker>
      </Reveal>
      <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-2">
        {pair.map((side, i) => (
          <Reveal key={side.label} delay={i * 0.05}>
            <div className="relative">
              <ProjectImage
                visual={side.visual}
                ratio={side.visual.ratio ?? "4/3"}
                sizes={SIZES.half}
              />
              <span className="font-body absolute left-4 top-4 bg-[var(--ink)]/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-white">
                {side.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      {block.note && (
        <Reveal delay={0.1}>
          <p className="font-body text-cream-dim mt-8 max-w-xl text-lg leading-relaxed">
            {block.note}
          </p>
        </Reveal>
      )}
    </Section>
  );
}

/* ── Video ─────────────────────────────────────────────────────────────────────
   A real `url` renders a native <video> with the poster as its still. With no
   url, the poster (or a placeholder) renders under the site's existing pulsing
   play mark — the same treatment as the home showreel. */
function Video({ block }: { block: Extract<ProjectBlock, { type: "video" }> }) {
  return (
    <Section label={block.heading ?? "Video"}>
      {block.heading && (
        <Reveal>
          <Kicker>{block.heading}</Kicker>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        {block.url ? (
          <video
            controls
            preload="none"
            poster={block.poster?.src ?? undefined}
            className="aspect-video w-full bg-[#0e0e0e] object-cover"
          >
            <source src={block.url} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden bg-[#0e0e0e]">
            {block.poster?.src && (
              <ProjectImage
                visual={block.poster}
                ratio="16/9"
                sizes={SIZES.full}
                className="absolute inset-0"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <svg
                width="78"
                height="78"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rmz-pulse"
              >
                <circle cx="40" cy="40" r="39" stroke="white" strokeWidth="1.5" />
                <path d="M33 26 L57 40 L33 54 Z" fill="white" />
              </svg>
            </span>
          </div>
        )}
      </Reveal>
      {block.caption && (
        <Reveal delay={0.1}>
          <p className="font-body text-cream-dim mt-3 text-xs leading-relaxed">
            {block.caption}
          </p>
        </Reveal>
      )}
    </Section>
  );
}

/* ── Final summary ─────────────────────────────────────────────────────────── */
function Summary({ block }: { block: Extract<ProjectBlock, { type: "summary" }> }) {
  return (
    <Section label={block.heading ?? "Summary"}>
      <Reveal>
        <Kicker>{block.heading ?? "In the end"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="display-statement text-cream max-w-3xl text-[clamp(1.5rem,3vw,2.2rem)]">
          {block.body}
        </p>
      </Reveal>
      {block.quote && (
        <Reveal delay={0.1}>
          <figure className="mt-12 max-w-2xl border-l-2 border-[var(--rebel-red)] pl-6">
            <blockquote className="font-display text-cream text-xl italic leading-relaxed">
              “{block.quote}”
            </blockquote>
            {block.quoteAuthor && (
              <figcaption className="font-body text-cream-dim mt-3 text-xs uppercase tracking-[0.2em]">
                {block.quoteAuthor}
              </figcaption>
            )}
          </figure>
        </Reveal>
      )}
    </Section>
  );
}

/* ── Renderer ──────────────────────────────────────────────────────────────── */
function renderBlock(block: ProjectBlock, key: string) {
  switch (block.type) {
    case "overview":
      return <Overview key={key} block={block} />;
    case "services":
      return <Services key={key} block={block} />;
    case "imageFull":
      return <ImageFull key={key} block={block} />;
    case "galleryTwo":
      return <Gallery key={key} images={block.images} cols={2} />;
    case "galleryThree":
      return <Gallery key={key} images={block.images} cols={3} />;
    case "mockups":
      return <Mockups key={key} block={block} />;
    case "textBreak":
      return <TextBreak key={key} block={block} />;
    case "stats":
      return <Stats key={key} block={block} />;
    case "beforeAfter":
      return <BeforeAfter key={key} block={block} />;
    case "video":
      return <Video key={key} block={block} />;
    case "summary":
      return <Summary key={key} block={block} />;
    default:
      // An unknown block (e.g. a CMS block added before this file ships) is
      // skipped rather than crashing the page.
      return null;
  }
}

export default function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) {
  if (!blocks.length) return null;
  return <>{blocks.map((block, i) => renderBlock(block, `${block.type}-${i}`))}</>;
}
