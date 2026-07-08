# Feature Spec: Logo Squares → Emerge → Stairs Scroll Section

Stack: Next.js / React
Animation: GSAP + ScrollTrigger + Flip plugin

Give this whole document to Claude Code as the task description. It's broken into
independent phases so it can be built and tested incrementally.

---

## 0. Install

```bash
npm install gsap @gsap/react
```

GSAP's `Flip` and `ScrollTrigger` plugins ship inside the core `gsap` package, no
separate install needed. Register them once in a client component:

```jsx
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);
```

---

## 1. Component structure

```
components/
  LogoSquares.jsx        // the 3 static squares inside the "RMZ" logo
  EmergeSquares.jsx       // the 3 clone squares that spawn + travel
  AboutStairsSection.jsx  // the landing section: stairs + counter + paragraph
```

Both `LogoSquares` and `AboutStairsSection` need to expose a ref to an empty
placeholder `<div>` where the traveling clone squares should start and end.
This is the key trick for Phase 3 below (Flip).

```jsx
// LogoSquares.jsx
export default function LogoSquares({ squareRefs }) {
  return (
    <div className="logo-squares">
      <span ref={squareRefs.yellow} className="sq sq-yellow" />
      <span ref={squareRefs.orange} className="sq sq-orange" />
      <span ref={squareRefs.green}  className="sq sq-green" />
    </div>
  );
}
```

```jsx
// AboutStairsSection.jsx
export default function AboutStairsSection({ landingRefs }) {
  return (
    <section className="about-stairs">
      <div ref={landingRefs.yellow} className="stair-slot stair-1" />
      <div ref={landingRefs.orange} className="stair-slot stair-2" />
      <div ref={landingRefs.green}  className="stair-slot stair-3" />
      {/* counter + paragraph, see Phase 4/5 */}
    </section>
  );
}
```

The parent page holds all 6 refs and passes them down, since the animation
timeline needs to know both the start point (logo) and end point (stairs).

---

## 2. Phase 1 — Emerge animation (random spawn)

Trigger: when the hero/logo section scrolls into view (use a ScrollTrigger with
`start: "top 80%"`, `once: true` — it should only happen the first time).

For each of the 3 static squares, clone a new element positioned exactly on
top of the original (`getBoundingClientRect`), then animate it outward with
randomized values so the three don't move identically.

```jsx
import { useGSAP } from "@gsap/react";

useGSAP(() => {
  const clones = [];

  Object.entries(squareRefs).forEach(([color, ref], i) => {
    const original = ref.current;
    const rect = original.getBoundingClientRect();

    const clone = original.cloneNode(true);
    clone.classList.add("sq-clone");
    document.body.appendChild(clone);

    gsap.set(clone, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: 999,
    });

    clones.push(clone);
    emergeRefs[color].current = clone; // store so Phase 2 can grab it later

    gsap.timeline({
      scrollTrigger: {
        trigger: ".logo-squares",
        start: "top 80%",
        once: true,
      },
      delay: gsap.utils.random(0, 0.4), // randomized stagger per square
    })
    .fromTo(clone,
      { scale: 0.4, opacity: 0, rotate: gsap.utils.random(-25, 25) },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" }
    );
  });
}, []);
```

**Why clones and not the original squares:** the originals stay in the logo
permanently; only the emerged copies travel. This avoids destroying your logo
mark when the user scrolls back up.

---

## 3. Phase 2 — Travel down to the About section (GSAP Flip)

Once each clone has emerged, use `Flip` to animate it from its current
position to the matching stair slot in the About section. Flip records the
"before" state, you move the element in the DOM (or just retarget its
position/size), and it animates the transform for you — this is much more
reliable than hand-calculating translateY across sections of unknown height.

```jsx
import { Flip } from "gsap/Flip";

function sendCloneToStairs(clone, targetSlotEl) {
  const state = Flip.getState(clone);

  // Move the clone into the target slot in the DOM
  targetSlotEl.appendChild(clone);
  clone.classList.add("stair-square"); // switch styling for landed state

  Flip.from(state, {
    duration: 1,
    ease: "power2.inOut",
    scale: true,
    absolute: true,
    onComplete: () => {
      clone.classList.remove("sq-clone");
    },
  });
}
```

Trigger this per-square, ideally staggered slightly (e.g. 0.15s apart) so they
don't all move in perfect unison — call `sendCloneToStairs` for each color
inside a `gsap.delayedCall` with increasing delay, right after that square's
emerge animation finishes (`onComplete` of the Phase 1 tween).

---

## 4. Phase 3 — Stairs layout + images

CSS for the three stair slots, staggered diagonally:

```css
.about-stairs {
  position: relative;
  height: 150vh; /* extra height = scroll room for Phase 4 */
}

.stair-slot {
  position: absolute;
  width: 220px;
  height: 220px;
  overflow: hidden;
  border-radius: 4px;
}

.stair-1 { top: 10%;  left: 10%; }
.stair-2 { top: 35%;  left: 35%; }
.stair-3 { top: 60%;  left: 60%; }
```

Each landed square should contain an `<img>` (or Next `<Image>`) sized to
`100% / 100%` with `object-fit: cover`, so the square acts as a cropped window
onto the photo:

```jsx
<div ref={landingRefs.yellow} className="stair-slot stair-1">
  <img src="/images/step-1.jpg" alt="" />
</div>
```

---

## 5. Phase 4 — Scroll-driven stair movement

Once landed, pin the section and drive each square's position with
`scrub: true`, each on a slightly different scroll-speed multiplier so they
feel like steps you're walking down rather than one flat parallax layer.

```jsx
useGSAP(() => {
  const slots = [landingRefs.yellow, landingRefs.orange, landingRefs.green];

  slots.forEach((ref, i) => {
    gsap.to(ref.current, {
      y: (i + 1) * 120,        // each step moves further than the last
      scrollTrigger: {
        trigger: ".about-stairs",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,        // only set pin:true on ONE of these three calls
      },
    });
  });
}, []);
```

Note: only one `ScrollTrigger` in this section should carry `pin: true` (pin
the section container itself), otherwise create one master ScrollTrigger for
pinning and separate un-pinned tweens for the three `y` movements, driven by
`scrollTrigger.progress` of the master. That's the more robust pattern:

```jsx
ScrollTrigger.create({
  trigger: ".about-stairs",
  start: "top top",
  end: "+=2000",
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    slots.forEach((ref, i) => {
      gsap.set(ref.current, { y: self.progress * (i + 1) * 200 });
    });
    updateActiveStep(self.progress); // Phase 5
  },
});
```

---

## 6. Phase 5 — Counter + paragraph synced to active step

Use the same `onUpdate` callback to derive which "step" is active from scroll
progress (0–1), and store it in React state so the counter and paragraph
re-render:

```jsx
const [activeStep, setActiveStep] = useState(0);

function updateActiveStep(progress) {
  const step = Math.min(2, Math.floor(progress * 3)); // 0, 1, or 2
  setActiveStep((prev) => (prev !== step ? step : prev));
}
```

Counter (bottom-left):

```jsx
<div className="stairs-counter">
  <span className="current">0{activeStep + 1}</span>
  <span className="total"> / 03</span>
</div>
```

Paragraph (top-right), with a simple crossfade on change:

```jsx
const paragraphs = [
  "Text describing step one's image...",
  "Text describing step two's image...",
  "Text describing step three's image...",
];

<div className="stairs-paragraph" key={activeStep}>
  {paragraphs[activeStep]}
</div>
```

Add a CSS fade-in keyed on `activeStep` (React remounts the node when `key`
changes, so a simple `@keyframes fadeIn` on `.stairs-paragraph` is enough —
no extra JS needed):

```css
.stairs-paragraph {
  animation: fadeIn 0.4s ease both;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 7. Cleanup checklist for Claude Code

- Wrap all GSAP logic in `useGSAP()` from `@gsap/react` (not raw `useEffect`) —
  it auto-reverts/cleans up ScrollTriggers on unmount and on React strict-mode
  double-invoke, which plain `useEffect` won't handle correctly.
- Kill/refresh ScrollTrigger on route change if this is a Next.js app with
  client-side navigation (`ScrollTrigger.refresh()` in a route-change effect).
- The Phase 1 "emerge" animation should use `once: true` so it doesn't replay
  every time the user scrolls the hero back into view.
- Test at a few viewport widths — the stair `top`/`left` percentages and the
  Flip travel distance will need `matchMedia` breakpoints for mobile, since
  220px squares and 120–200px scroll multipliers won't scale down gracefully.

---

## Suggested prompt to paste into Claude Code

> Using the attached spec (logo-squares-animation-spec.md), implement the
> LogoSquares, EmergeSquares, and AboutStairsSection components in
> [path to your components folder]. Build and test Phase 1 (emerge) first in
> isolation, then Phase 2 (Flip travel), then Phase 3–5 (stairs + scroll +
> counter + paragraph) once the first phase is confirmed working. Use GSAP
> with @gsap/react's useGSAP hook throughout, not raw useEffect.
