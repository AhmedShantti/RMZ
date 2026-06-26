# Animation Task: Intro Block Sequence

## Overview
Refactor the existing intro animation into a **3-phase choreographed sequence** using three colored squares (green, orange, yellow) on a black background.

---

## Color Definitions
| Block | Color (approximate) |
|-------|-------------------|
| Green | `#7DC242` |
| Orange | `#E8451A` |
| Yellow | `#F9C020` |

All squares are **equal in size** (referred to as `S` below). Use the square's side length as the unit of spacing.

---

## Phase 1 — Initial State (All Three Together)

- All three squares are **horizontally centered** on the page (centered on both X and Y axes as a group)
- Order left to right: **Green → Orange → Yellow**
- Spacing between squares: `S * 0.25` (quarter-square gap)
- This is the **entry state** — squares can fade in or scale in together

```
         [Green]  [Orange]  [Yellow]
              ← centered on page →
```

---

## Phase 2 — Split / Scatter

Triggered after Phase 1 settles. All three squares move **simultaneously** to their new positions:

### Green Square
- Moves **left** along the horizontal axis
- Remains on the **vertical center** of the page (same Y as Phase 1 center)
- X position: roughly `25%` from the left edge of the viewport

### Yellow Square
- Moves **up and to the right**
- Final X position: roughly `70%` from the left edge
- Final Y position: its **bottom edge aligns with the horizontal center line** of the page (i.e., it sits just above center)

### Orange Square
- Moves to the **same X position as Yellow**
- Positioned **below Yellow** with a vertical gap equal to `S` (one full square height)
- So: `orange.top = yellow.bottom + S`

```
                        [Yellow]   ← bottom on center Y
    [Green]             ──────
    (center Y)          [Orange]   ← gap = S below yellow
```

---

## Phase 3 — Final / Hold State

- Squares stay in their Phase 2 positions
- Optional: text or brand content fades in (see Image 3 reference)
- The layout should feel **intentionally asymmetric but balanced**

---

## Timing Guidance

| Phase | Duration | Easing |
|-------|----------|--------|
| Phase 1 entry | 600ms | `ease-out` |
| Hold on Phase 1 | 800ms | — |
| Phase 2 transition | 900ms | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| Phase 3 hold / content fade | 600ms | `ease-in-out` |

---

## Constraints
- Animation must be **interruptible** (respect `prefers-reduced-motion`)
- Positions must be **viewport-relative** (use `vw`/`vh` or percentages, not fixed `px`)
- Square size `S` should be responsive: `min(12vw, 120px)`
- Background is **solid black** (`#000000`)
