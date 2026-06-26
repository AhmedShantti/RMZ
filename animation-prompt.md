# Prompt: Refactor Intro Animation

---

## Context

I have an existing intro animation involving three colored squares on a black background. I need you to **refactor it** into a new 3-phase choreographed sequence. Read `animation-task.md` and `animation-skills.md` in the project root before making any changes.

---

## Your Task

Refactor the existing intro animation code to implement the following sequence exactly:

---

### The Three Squares

| Name | Color |
|------|-------|
| Green | `#7DC242` |
| Orange | `#E8451A` |
| Yellow | `#F9C020` |

All squares are the **same size** (`S`). Define `S` as a CSS variable: `--S: clamp(80px, 10vw, 120px)`.

---

### Phase 1 — Entry (All Together)

- All three squares appear **horizontally side by side**, centered on both axes of the page
- Order left to right: Green → Orange → Yellow
- Gap between squares: `S * 0.25`
- Entry: fade or scale in together, or stagger with 150ms delay between each
- Hold for **800ms** after entry completes

---

### Phase 2 — Scatter (Simultaneous Movement)

All three squares move **at the same time** to their new positions. Do not stagger this phase.

**Green square:**
- Moves to the **left side** of the viewport
- Stays at the **same vertical center** (Y = 50vh)
- Target X: `~22vw` from left edge (left edge of square at this X)

**Yellow square:**
- Moves **up and to the right**
- Target X: `~68vw` from left edge
- Target Y: its **bottom edge sits exactly on the vertical midpoint** of the page (bottom of square = 50vh)

**Orange square:**
- Same X as Yellow (`~68vw`)
- Positioned **below Yellow** with a vertical gap equal to `S`
- Formula: `orange top = yellow bottom + S = 50vh + S`

**Transition:** `900ms` with easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

### Phase 3 — Final / Hold

- Squares stay in Phase 2 positions
- Any additional content (text, brand elements) may fade in at this point

---

## Implementation Requirements

1. **Use `transform: translate()` for all animation** — never animate `left`, `top`, `margin`, or `width/height`
2. **Use CSS custom properties** for all positions and sizes so they're easy to adjust
3. **Use `data-phase` on the wrapper element** to toggle between phases via CSS class selectors
4. **Sequence phases with `setTimeout`** (or `transitionend` if you prefer):
   - Phase 1 entry: 600ms
   - Hold: 800ms
   - Phase 2 scatter: 900ms
   - Phase 3: 600ms
5. **Wrap all motion in `prefers-reduced-motion` check** — if user prefers reduced motion, skip directly to final state with no animation
6. **Positions must be viewport-relative** — no hardcoded pixel positions for layout

---

## Code Structure Expected

```
[wrapper element with data-phase="initial"|"scatter"|"final"]
  [.block.block-green]
  [.block.block-orange]
  [.block.block-yellow]
```

CSS should handle all visual states based on `[data-phase]` selectors. JS should only handle timing and toggling `data-phase`.

---

## What NOT to Change

- The black background
- The square sizes (keep responsive with `clamp`)
- Any existing content that appears after the intro animation ends
- The color values of the squares

---

## Verification Steps

After implementing, confirm:
- [ ] Phase 1: all three squares are horizontally centered together on screen
- [ ] Phase 2: green is left-center, yellow is upper-right with bottom on Y midpoint, orange is directly below yellow with gap = S
- [ ] Phase 3: layout holds cleanly
- [ ] No layout shift or jank during transitions
- [ ] Works on mobile (test at 375px width)
- [ ] Reduced motion: jumps to final state immediately
