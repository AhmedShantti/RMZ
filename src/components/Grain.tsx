/**
 * Ambient film grain (TASK.md §6) — fixed, full-viewport, above the red-light
 * layer but below content, pointer-events:none. Site-wide (whole site, not
 * just the hero — non-negotiable).
 *
 * Implementation: an SVG feTurbulence noise tile baked into a data-URI
 * background (rendered once by the browser, not re-filtered per frame), tiled
 * and blended over the stage. A cheap stepped "shimmer" nudges the tile
 * position; it's disabled under prefers-reduced-motion via the global rule in
 * globals.css (animation-duration forced to ~0).
 */
const NOISE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
     <filter id='n'>
       <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
       <feColorMatrix type='saturate' values='0'/>
       <feComponentTransfer><feFuncA type='linear' slope='0.55'/></feComponentTransfer>
     </filter>
     <rect width='100%' height='100%' filter='url(#n)'/>
   </svg>`,
);

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="grain-layer pointer-events-none fixed -inset-[8%]"
      style={{
        zIndex: "var(--z-grain)",
        backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        mixBlendMode: "screen",
        opacity: 0.13,
        willChange: "transform",
      }}
    />
  );
}
