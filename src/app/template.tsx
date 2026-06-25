"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Page transition (TASK.md §7): a short cross-fade in the red+grain language —
 * no flashy slides. `template.tsx` re-mounts per navigation, so this fades each
 * route in. Static under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
