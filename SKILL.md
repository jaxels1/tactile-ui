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
| **Micro-interactions & state** (buttons, shakes, icon swaps, small accordions) | **CSS** (`transform`, `opacity`; `interpolate-size` for discrete `height: auto`) | Zero JS overhead, `<300ms`; keep frequent UI `transform`/`opacity`-only (`interpolate-size` animates layout) |
| **Gesture-driven UI** (drags, sheets, carousels, flicks) | **Springs + Pointer Events** (`motion` / `requestAnimationFrame`) | Interruptible mid-flight, preserves release velocity |
| **Route, shared-element & list transitions** (React 19.3+ / Next.js) | **`<ViewTransition>` + `addTransitionType`** | Native browser snapshots, graceful fallback |

## Core Workflow

1. **Let the existing design system lead** — When working in an existing
   product, preserve its tokens, typography, grid, and palette. Only apply the
   greenfield anti-slop typography, palette, and layout rules when starting from
   a blank page or explicitly asked to redesign. See
   [Anti-Slop Layout & Copy](./references/anti-slop-layout-and-copy.md) and
   [CSS & Typography](./references/css-and-typography.md).
2. **Make motion physical & interruptible** — Respond on `pointerdown`, track
   1:1 with `setPointerCapture`, animate from the live presentation value, hand
   off release velocity to a **physics-based** spring (`stiffness`/`damping`/`mass`,
   targeting damping ratio `1.0` by default or `~0.8` for momentum flicks), and
   rubber-band boundaries. See
   [Fluid Physics & Gestures](./references/fluid-physics-and-gestures.md).
3. **Wire structural transitions with `<ViewTransition>`** — For every transition,
   ask: **"What does this motion help the user understand?"** Add shared elements,
   directional slides, Suspense reveals, or list identity only when they
   communicate spatial continuity or state change. See
   [React View Transitions](./references/react-view-transitions.md).
4. **Respect accessibility, UX laws & restraint** — Support
   `prefers-reduced-motion`, `prefers-reduced-transparency`, and
   `prefers-contrast`; enforce Fitts, Hick, Miller, Doherty (`<400ms`), Postel,
   and Jakob; remove any motion that doesn't earn its place.

## Pre-Ship Verification Checklist

- [ ] **Interruptible mid-flight**: A sheet, drawer, or carousel can be re-grabbed mid-spring from its live on-screen position without snapping or locking input.
- [ ] **Safe drag cancel**: Canceling a drag (releasing early or dragging back past the threshold) snaps cleanly and leaves the component interactive.
- [ ] **Velocity handoff works**: Flick springs use physics parameters (`stiffness`, `damping`, `mass`, `velocity`) rather than `duration`/`bounce` (which ignore `velocity` in Motion).
- [ ] **Reduced motion works in the actual CSS**: `@media (prefers-reduced-motion: reduce)` is wired into the shipped recipes so slides/springs degrade to short opacity cross-fades.
- [ ] **Compositor-friendly**: High-frequency animations touch only `transform` and `opacity` (never `top`/`left`); entrances start at `scale: 0.97` + `opacity: 0` (never `scale: 0`); `interpolate-size` is reserved for discrete `height: auto` reveals.
- [ ] **Spatial consistency**: Panels exit the same way they entered; popovers scale from their trigger (`transform-origin`).
- [ ] **Existing system respected** *(or greenfield audit passed)*: Existing product tokens/fonts are preserved unless starting from scratch or redesigning.

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
