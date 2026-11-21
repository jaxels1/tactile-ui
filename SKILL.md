---
name: jaxels-animate
description: >-
  Comprehensive UI animation, fluid motion, and anti-slop interface craft mega
  skill combining @charles.unemployed's design/UX rules, Apple's Designing Fluid
  Interfaces physics, and React's native View Transition API. Use when building,
  animating, styling, or auditing web apps, gesture-driven UI, page/route
  transitions, forms, design systems, or product screenshots.
---

# Jaxel's Animate

A unified mega skill for **crafted UI, physical motion, and zero-slop frontend
engineering**—combining:
- **Anti-Slop UI & UX Craft** (`@charles.unemployed`) — CSS rules, non-AI
  typography, color-wheel accents, 10 animation rules, 20 animation & UX laws,
  form UX, and product presentation.
- **Fluid Physical Motion** (Apple *Designing Fluid Interfaces*) — 1:1 pointer
  tracking, interruptible springs, velocity handoff, momentum projection,
  rubber-banding, translucent materials, and reduced-motion accessibility.
- **Native React Transitions** (React `<ViewTransition>`) — Shared element
  morphs, directional route transitions, Suspense reveals, and list identity.

## Choosing the Right Motion Primitive

| Use Case | Tool / Primitive | Why |
| :--- | :--- | :--- |
| **Micro-interactions & state** (buttons, shakes, accordions, icon swaps) | **CSS** (`transform`, `opacity`, `interpolate-size`) | Zero JS overhead, `<300ms`, compositor-only |
| **Gesture-driven UI** (drags, sheets, carousels, flicks) | **Springs + Pointer Events** (`motion` / `requestAnimationFrame`) | Interruptible mid-flight, preserves release velocity |
| **Route, shared-element & list transitions** (React 19.3+ / Next.js) | **`<ViewTransition>` + `addTransitionType`** | Native browser snapshots, graceful fallback |

## Core Workflow

1. **Audit your plan before coding (Two-Pass Rule)** — Sketch a compact token
   plan (4–6 hexes, 1–2 typefaces, ASCII layout). Purge AI tells before writing
   code: no 3-column rounded-card grids, no purple-to-cyan gradients, no
   warm-cream + terracotta defaults, no tracked-out `ALL-CAPS` eyebrows, and no
   buzzword copy. See [Anti-Slop Layout & Copy](./references/anti-slop-layout-and-copy.md).
2. **Set typography & color temperature first** — Replace overused AI defaults
   (`Inter`, `Geist`, `Space Grotesk`, `Playfair Display`) and lock a single
   temperature-contrasting accent (`warm page = cool accent`,
   `cool page = warm accent`), 3 colors max. See [CSS & Typography](./references/css-and-typography.md)
   and [Color, Forms & Product](./references/color-forms-and-product.md).
3. **Build with CSS craft & optical polish** — Nested radii
   (`inner = outer - padding`), `OKLCH` palettes/gradients (`in oklch`), alpha
   borders (`rgb(0 0 0 / 0.12)`), `100dvh`, `text-box-trim`, and shift-free
   `inline-grid` bold tabs.
4. **Make motion physical & interruptible** — Respond on `pointerdown`, track
   1:1 with `setPointerCapture`, animate from the live presentation value, hand
   off release velocity to springs (`damping: 1.0` default; `0.8` for
   momentum), and rubber-band boundaries. See
   [Fluid Physics & Gestures](./references/fluid-physics-and-gestures.md).
5. **Wire structural transitions with `<ViewTransition>`** — Implement in
   priority order: shared element (`name`) → Suspense reveal → list identity
   (`key`) → state enter/exit → route change. See
   [React View Transitions](./references/react-view-transitions.md).
6. **Respect accessibility, UX laws & the Chanel Rule** — Support
   `prefers-reduced-motion`, `prefers-reduced-transparency`, and
   `prefers-contrast`; enforce Fitts, Hick, Miller, Doherty (`<400ms`), Postel,
   and Jakob; before shipping, remove one unnecessary border, badge, or effect.

## Pre-Ship Verification Checklist

- [ ] **No AI-default fonts or template chrome** (`Inter`, `Geist`, `Space Grotesk`, `Playfair Display`, `ALL-CAPS` eyebrows, `→` on every link, `01/02/03` non-sequence numbers).
- [ ] **No AI palette/layout clichés** (no purple-blue gradients, no 3-column identical card stacks, no buzzwords like *"Elevate"* / *"Seamless"*).
- [ ] **Nested radii & `OKLCH`**: `innerRadius = outerRadius - padding`; gradients use `in oklch`.
- [ ] **Compositor-only motion**: Only `transform` and `opacity` animated (never `top`/`left`); entrances start at `scale: 0.97` + `opacity: 0` (never `scale: 0`).
- [ ] **Interruptible gestures**: Drags/sheets use springs with velocity handoff, not fixed-duration CSS transitions.
- [ ] **Spatial consistency**: Panels exit the same way they entered; popovers scale from their trigger (`transform-origin`).
- [ ] **Reduced motion**: `@media (prefers-reduced-motion: reduce)` swaps slides/springs for short opacity cross-fades.

## Reference Index

- [Anti-Slop Layout & Copy](./references/anti-slop-layout-and-copy.md) —
  Breaking 3-column card grids, banning AI palettes/chrome/buzzwords, subject-to-medium
  matching, and the Two-Pass + Chanel rules.
- [Defensive CSS & Engineering Craft](./references/defensive-css-and-craft.md) —
  Battle-tested CSS layout traps (`minmax(0, 1fr)`, `subgrid`, `overflow: clip`,
  `overscroll-behavior`, `lh`/`cap`, container queries, `PropFLIP`) distilled
  from 132 design & engineering articles.
- [CSS & Typography](./references/css-and-typography.md) — 10 CSS design
  rules, 10 CSS typography hacks, Apple optical sizing/tracking/leading, and
  curated non-AI font lists.
- [Fluid Physics & Gestures](./references/fluid-physics-and-gestures.md) —
  Apple's 17 fluid interface rules (springs, velocity handoff, projection,
  rubber-banding, materials, haptics, accessibility) + `@charles.unemployed`'s
  10 animation rules and 20 animation/UX laws.
- [React View Transitions](./references/react-view-transitions.md) —
  `<ViewTransition>`, `addTransitionType`, placement rules, and CSS recipes.
- [Color, Forms & Product](./references/color-forms-and-product.md) — Color
  wheel & accent system, 8 password/form UX patterns, App Store screenshot
  psychology, and vibecoding libraries.
