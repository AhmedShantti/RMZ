"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/reducedMotion";

type RailService = {
  index: string;
  title: string;
  blurb: string;
  items: string[];
};

/**
 * Services rail (TASK.md §5 /services, storyboard p.5–6): a numbered left rail
 * selects the active service. The active title is sharp cream with a crisp
 * sub-list; behind it the sub-items render large + blurred (the defocused-text
 * look). Inactive rail items dim. Data fed from the CMS via props.
 */
const EASE = [0.16, 1, 0.3, 1] as const;

export default function ServiceRail({ services }: { services: RailService[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const svc = services[active];

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => (a + 1) % services.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => (a - 1 + services.length) % services.length);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
      {/* numbered rail */}
      <nav aria-label="Services" className="lg:sticky lg:top-28 lg:self-start">
        <ul
          className="flex flex-col gap-1"
          role="tablist"
          aria-orientation="vertical"
          onKeyDown={onKeyNav}
        >
          {services.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.index}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  className="group flex w-full cursor-pointer items-baseline gap-4 py-2 text-left transition-colors"
                >
                  <span
                    className="font-body text-xs tabular-nums transition-colors"
                    style={{
                      color: on ? "var(--rebel-red)" : "var(--cream-dim)",
                    }}
                  >
                    {s.index}
                  </span>
                  <span
                    className="font-display text-xl italic transition-all duration-300"
                    style={{
                      color: on ? "var(--cream)" : "var(--cream-dim)",
                      opacity: on ? 1 : 0.45,
                    }}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* active stage */}
      <div
        role="tabpanel"
        aria-label={svc.title}
        className="relative min-h-[60vh] overflow-hidden"
      >
        {/* defocused large sub-items backdrop */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${active}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ filter: "blur(10px)" }}
          >
            {svc.items.map((it) => (
              <span
                key={it}
                className="font-display whitespace-nowrap text-[clamp(2.5rem,7vw,5rem)] italic leading-[1.05] text-cream"
              >
                {it}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* sharp foreground */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`fg-${active}`}
            className="relative flex min-h-[60vh] flex-col justify-center"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="font-body text-rebel-red mb-4 text-sm tabular-nums">
              {svc.index} / Service
            </span>
            <h2 className="font-display text-cream text-[clamp(2.8rem,8vw,5.5rem)] italic leading-[0.95]">
              {svc.title}
            </h2>
            <p className="font-body text-cream-dim mt-6 max-w-md text-base leading-relaxed">
              {svc.blurb}
            </p>
            <ul className="mt-10 flex flex-col gap-3">
              {svc.items.map((it) => (
                <li
                  key={it}
                  className="font-display text-cream flex items-center gap-3 text-lg"
                >
                  <span
                    aria-hidden="true"
                    className="bg-rebel-red inline-block h-[6px] w-[6px]"
                  />
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
