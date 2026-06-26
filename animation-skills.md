# Animation Skills: CSS & JS Choreography Principles

## Core Skill: Choreographed Multi-Element Sequences

### What This Covers
How to plan, structure, and implement **multi-phase, multi-element animations** where distinct objects move independently to tell a visual story.

---

## Skill 1 — Think in Phases, Not Keyframes

Break complex animations into **named phases** before writing any code. Each phase has:
- A clear **trigger** (time-based, scroll-based, or event-based)
- A **start state** and **end state** per element
- A **duration** and **easing curve**

Bad approach: writing one long `@keyframes` block for everything.  
Good approach: each element gets its own transition class toggled by a phase controller.

```js
// Phase controller pattern
const phases = ['initial', 'scatter', 'final']
let currentPhase = 0

function nextPhase() {
  document.body.dataset.phase = phases[++currentPhase]
}
```

---

## Skill 2 — Use CSS Custom Properties for Position

Never hardcode pixel positions for animated layouts. Use CSS variables so positions stay responsive and are easy to tweak:

```css
:root {
  --S: clamp(80px, 10vw, 120px);        /* square size */
  --green-scatter-x: 22vw;
  --yellow-scatter-x: 68vw;
  --yellow-scatter-y: calc(50vh - var(--S));
  --orange-scatter-x: 68vw;
  --orange-scatter-y: calc(50vh + var(--S));
}
```

---

## Skill 3 — Position Elements with `transform: translate` not `left/top`

Always animate with `transform` for GPU-accelerated, jank-free motion. Set elements to `position: absolute` with a known base position, then shift with transform.

```css
.block {
  position: absolute;
  width: var(--S);
  height: var(--S);
  /* Base: horizontally centered group, vertically centered */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## Skill 4 — Phase-Based Class Toggling

Use `data-phase` on a parent element to switch states. This keeps animation logic in CSS and JS clean:

```css
/* Phase 1: all blocks side by side */
[data-phase="initial"] .block-green  { transform: translate(calc(-50% - var(--S) * 1.25), -50%); }
[data-phase="initial"] .block-orange { transform: translate(-50%, -50%); }
[data-phase="initial"] .block-yellow { transform: translate(calc(-50% + var(--S) * 1.25), -50%); }

/* Phase 2: scatter */
[data-phase="scatter"] .block-green  { transform: translate(calc(var(--green-scatter-x) - 50vw), -50%); }
[data-phase="scatter"] .block-yellow { transform: translate(calc(var(--yellow-scatter-x) - 50vw), calc(var(--yellow-scatter-y) - 50vh)); }
[data-phase="scatter"] .block-orange { transform: translate(calc(var(--orange-scatter-x) - 50vw), calc(var(--orange-scatter-y) - 50vh)); }
```

---

## Skill 5 — Stagger vs Simultaneous

- **Simultaneous movement** (all blocks move at once): creates energy, feels dynamic — good for the scatter phase
- **Staggered entry** (blocks appear one after another): creates rhythm, feels editorial — good for Phase 1 entry

```css
/* Stagger entry with animation-delay */
.block-green  { animation-delay: 0ms; }
.block-orange { animation-delay: 150ms; }
.block-yellow { animation-delay: 300ms; }
```

---

## Skill 6 — Respect `prefers-reduced-motion`

Always wrap motion in a media query check:

```css
@media (prefers-reduced-motion: reduce) {
  .block {
    transition: none;
    animation: none;
  }
}
```

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const duration = prefersReduced ? 0 : 900
```

---

## Skill 7 — Sequencing with `transitionend` or `setTimeout`

Chain phases using `transitionend` (most reliable) or `setTimeout` (simpler):

```js
// setTimeout approach
async function runIntroSequence() {
  setPhase('initial')
  await wait(600)   // entry settles
  await wait(800)   // hold
  setPhase('scatter')
  await wait(900)   // scatter completes
  setPhase('final')
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const setPhase = phase => document.querySelector('.intro').dataset.phase = phase
```

---

## Skill 8 — Debugging Layout Before Animating

Before adding any transitions, set all phases to their **end states** and verify the layout looks correct. Only add `transition` properties once positions are confirmed:

```js
// Temporarily skip to final layout
document.querySelector('.intro').dataset.phase = 'scatter'
// Visually verify, then add transition CSS back
```

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Using `left`/`top` for animation | Use `transform: translate()` |
| Hardcoding pixel positions | Use `vw`/`vh` + CSS variables |
| Animating `width`/`height` | Animate `transform: scale()` instead |
| Phase timing in one giant keyframe | Use class-toggle + `transition` per phase |
| Forgetting `will-change` on heavy animations | Add `will-change: transform` to animated blocks |
