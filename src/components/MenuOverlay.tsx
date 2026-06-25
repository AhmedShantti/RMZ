"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { mainNav, legalNav } from "@/content/nav";
import { site } from "@/content/site";
import AccentBlocks from "./AccentBlocks";

type Props = { open: boolean; onClose: () => void };

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MenuOverlay({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Esc to close + focus trap + scroll lock (TASK.md §8)
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // focus the first link
    const first = focusables()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className="fixed inset-0 flex flex-col"
          style={{ zIndex: "var(--z-overlay)", background: "var(--ink)" }}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* local red ember so the overlay isn't flat black */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 90% at 100% 100%, color-mix(in srgb, var(--rebel-red) 26%, transparent), transparent 55%)",
            }}
          />

          <div className="relative flex items-center justify-between px-5 py-5 sm:px-8">
            <span className="font-display text-cream-dim text-sm italic">
              {site.shortName} — menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-display hover:text-rebel-red cursor-pointer text-lg italic transition-colors"
            >
              Close ✕
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="relative flex flex-1 flex-col justify-center gap-1 px-5 sm:px-8"
          >
            {mainNav.map((item, i) => {
              const active = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.18 + i * 0.05,
                    duration: 0.5,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-1"
                  >
                    <span className="font-body text-cream-dim w-8 text-xs tabular-nums">
                      {item.index}
                    </span>
                    <span
                      className="font-display text-[clamp(2.4rem,9vw,5.5rem)] italic leading-[0.95] transition-colors"
                      style={{ color: active ? "var(--rebel-red)" : "var(--cream)" }}
                    >
                      <span className="group-hover:text-rebel-red transition-colors">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <AccentBlocks size={10} />
              <span className="font-body text-cream-dim text-xs">
                Creative Rebellion is not chaos.
              </span>
            </div>
            <div className="font-body text-cream-dim flex gap-5 text-xs">
              {legalNav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="hover:text-cream transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
