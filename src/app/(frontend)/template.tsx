/**
 * Page transition (TASK.md §7): a short cross-fade in the red+grain language —
 * no flashy slides. `template.tsx` re-mounts per navigation, so the CSS
 * `page-fade` animation (globals.css) replays on each route. Static under
 * prefers-reduced-motion (the global reduced-motion rule zeroes the duration).
 *
 * Pure CSS + server component: adds no JavaScript to any page's hydration path.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
