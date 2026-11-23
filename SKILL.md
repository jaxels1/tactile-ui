---
name: tactile-ui
description: >-
  Visual design, defensive CSS layout engineering, fluid pointer/spring motion,
  and React ViewTransition rules. Use ONLY when designing, styling, animating,
  or visually auditing web interfaces, components, gestures, forms, or
  design systems—do NOT load for API wiring, backend/data logic, pure state
  refactors, or non-visual bug fixes.
---

# Tactile UI

Enforce concrete visual, CSS, and motion rules on every frontend UI change.

## Step 0: Surface Triage (Motion Restraint Gate)

Classify the target surface before adding any animation or transition:

| Surface Type | Examples | Default Motion Policy |
| :--- | :--- | :--- |
| **Utilitarian / High-Frequency** | Admin panels, data tables, dense forms, settings, command palettes, keyboard-driven tools | **Zero motion or instant CSS** (`<=120ms`, `opacity`/`transform` only). Never add spring physics, bounce, or `<ViewTransition>` route morphs unless explicitly requested. |
| **Expressive / Consumer** | Marketing pages, onboarding, media galleries, mobile-style bottom sheets, drawers, carousels | Use 1:1 pointer tracking, interruptible physics springs, and spatial `<ViewTransition>` choreography where it clarifies continuity. |

Rule of frequency: the more often an action is repeated, the less it should animate.

## Step 1: Environment & Compatibility Check

Before importing libraries or using modern CSS primitives:

1. **Inspect `package.json`**:
   - **React version**: Only import `<ViewTransition>` or `addTransitionType` from `react` on React `>=19.3` (or canary/Next.js with `experimental.viewTransition`). On React `18` or `19.0–19.2`, use CSS transitions or feature-detected `document.startViewTransition?.(...)`.
   - **Motion library**: Only import `motion` / `motion/react` if already installed in `package.json` (or approved); otherwise use CSS or `requestAnimationFrame`.
   - **Existing design system**: Preserve the project's existing tokens, fonts, and palette unless building from scratch or explicitly redesigning.
2. **Guard modern CSS with `@supports` or fallback declarations**:
   - Wrap `text-box-trim` in `@supports (text-box-trim: trim-both)`.
   - Wrap `interpolate-size: allow-keywords` in `@supports (interpolate-size: allow-keywords)` with a `grid-template-rows: 0fr -> 1fr` fallback.
   - Pair `oklch(...)` and `in oklch` colors/gradients with an earlier sRGB/hex fallback declaration (or `@supports (color: oklch(0 0 0))`).
   - Pair `100dvh` with `100vh`; guard `field-sizing: content`, `calc-size()`, and CSS Anchor Positioning cleanly.

## Choosing the Right Motion Primitive

| Use Case | Tool / Primitive | Why |
| :--- | :--- | :--- |
| **Utilitarian UI & dense controls** | **None or instant CSS** (`<=120ms`, `transform`/`opacity`) | Zero latency penalty on repeat actions |
| **Micro-interactions & reveals** | **CSS** (`transform`, `opacity`; `grid-template-rows` or guarded `interpolate-size` for height) | Zero JS overhead, `<300ms`, compositor-friendly |
| **Gesture-driven UI** (drags, sheets, carousels, flicks) | **Physics Springs + Pointer Events** (`motion` / `rAF`) | Interruptible mid-flight, preserves release velocity |
| **Route, shared-element & list transitions** (React `19.3+`) | **`<ViewTransition>` + `addTransitionType`** | Native snapshots with `document` / CSS fallback |

## Core Workflow

1. **Triage surface & check environment** (Steps 0 and 1 above).
2. **Build layout & CSS defensively** — Keep high-frequency animations on `transform` and `opacity` (never `top`/`left`/`width`/`height`/`margin`/`padding`), start entrances at `scale(0.97)` + `opacity: 0` (never `scale(0)` / `scale: 0`), use `minmax(0, 1fr)`, `overflow: clip`, `overscroll-behavior: contain`, and `@supports` fallbacks.
3. **Make expressive gestures physical & interruptible** — Respond on `pointerdown`, track 1:1 with `setPointerCapture`, clean up on `pointercancel` and `lostpointercapture`, animate from the live presentation value, pass release velocity into physics springs (`stiffness`/`damping`/`mass`, never `duration`/`bounce` alongside `velocity`), target damping ratio `1.0` (`~0.8` only for momentum flicks), and rubber-band boundaries.
4. **Enforce reduced motion & spatial consistency** — Include `@media (prefers-reduced-motion: reduce)` (or `useReducedMotion` / `<MotionConfig reducedMotion="user">`), exit panels along their entry vector, and set `transform-origin` on trigger-anchored popovers.

## Pre-Ship Verification Gate

1. **Run the automated audit script (mandatory before finishing)** on modified UI files or the active git working tree:
   ```bash
   node <skill-dir>/scripts/audit-ui.mjs --changed
   # or target specific paths:
   node <skill-dir>/scripts/audit-ui.mjs path/to/Component.tsx path/to/styles.css
   ```
   Fix every `error` (`layout-animation`, `missing-reduced-motion`, `motion-velocity-ignored`, `scale-zero-entrance`) before reporting completion. Review `unguarded-bleeding-edge-css` warnings and add `@supports` or sRGB fallbacks where non-Chromium targets matter.
2. **Verify runtime behavior that static analysis cannot inspect**:
   - **Interruptible mid-flight**: Sheets, drawers, and carousels re-grab mid-spring from their live on-screen position without snapping or locking input.
   - **Safe drag cancel**: `pointercancel` / `lostpointercapture` resets drag state cleanly without wedging subsequent drags.
   - **Existing system preserved**: Existing product tokens and fonts remain intact unless redesigning or starting greenfield.

## Reference Index (Conditional Loading)

Load **only the 1–2 reference files** needed for the task at hand. Do not load all six files for a targeted CSS, button, or form change.

| Load ONLY when the task involves... | Reference |
| :--- | :--- |
| Greenfield layout structure, card grids, visual hierarchy, AI-cliché audits, or UI microcopy | [Anti-Slop Layout & Copy](./references/anti-slop-layout-and-copy.md) |
| CSS Grid/Flex traps, `subgrid`, `overflow: clip`, `@container`, `:has()`, `PropFLIP`, or viewport resilience | [Defensive CSS & Engineering Craft](./references/defensive-css-and-craft.md) |
| `OKLCH` scales/gradients, `text-box-trim`, type scale, optical tracking/leading, or font selection | [CSS & Typography](./references/css-and-typography.md) |
| Drag gestures, bottom sheets, carousels, physics springs, velocity projection, rubber-banding, or glass chrome | [Fluid Physics & Gestures](./references/fluid-physics-and-gestures.md) |
| React `19.3+` `<ViewTransition>`, `addTransitionType`, route/shared-element choreography, or VT CSS recipes | [React View Transitions](./references/react-view-transitions.md) |
| Accent/theme palette creation, password/form validation UX, or product/App Store screenshots | [Color, Forms & Product](./references/color-forms-and-product.md) |
