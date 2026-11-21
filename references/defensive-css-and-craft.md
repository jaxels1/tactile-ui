# Defensive CSS & Engineering Craft Reference

Distilled from **132 design, CSS, animation, and UX articles** (Josh W. Comeau,
Ahmad Shadeed, ModernCSS, Piccalilli, NN/g, web.dev, Laws of UX, Nerdy.dev).

---

## 1. Layout & Grid Traps (Defensive CSS)

- **Prevent Grid blowout**: Always use `minmax(0, 1fr)` instead of `1fr` on
  columns containing text or scrollable children.
- **Sticky inside CSS Grid**: Set `align-self: start` on sticky sidebar
  children; otherwise Grid's default `stretch` makes them full-height and
  breaks stickiness.
- **Wrap flex containers by default**: Declare `flex-wrap: wrap` (or
  `flex-wrap: balance` to prevent single-item orphan wraps) unless horizontal
  scrolling is intentional.
- **Stack with Grid, not `position: absolute`**: Overlap hero backgrounds,
  gradients, and content by placing them in the same grid cell
  (`grid-column: 1 / 2; grid-row: 1 / 2`).
- **Use `subgrid` for nested alignment**: Keep card headers, avatars, and
  actions aligned across columns with `grid-template-rows: subgrid`.
- **Use `width: auto` with horizontal margins**: Never set `width: 100%` on
  elements with horizontal margin, padding, or borders—`auto` bounds cleanly.
- **Single-axis clipping**: Use `overflow: clip` (instead of `overflow: hidden`)
  to clip one axis without forcing the other axis to `auto`.
- **Beware the `transform` containing-block trap**: Applying `transform`,
  `filter`, or `perspective` on an ancestor traps `position: fixed` descendants
  inside that ancestor instead of the viewport.
- **Scope transitions to active states**: Never put `transition` globally on
  layout containers; scope it to interactive states to prevent resize flicker.
- **CSS Cascade Layers**: Declare `@layer base, components, utilities;` to
  eliminate specificity wars and `!important` hacks.

---

## 2. Modern Responsive & Component Primitives

- **Container Queries over viewport queries**: Use `container-type: inline-size`
  and `@container` so components adapt to their parent slot, not the window.
- **Quantity queries with `:has()`**: Adapt grids dynamically by item count
  (`.section:has(.card:nth-last-child(n + 4))`).
- **Level 4 media query ranges**: Write `@media (width <= 300px)` and
  `@media (width > 300px)` to avoid exact-pixel boundary collisions.
- **Logical properties for RTL/LTR**: Use `margin-inline`, `padding-block`,
  and `start`/`end` naming; add `dir="auto"` on user-generated text.
- **CSS Anchor Positioning**: Tether badges/tooltips with `position-anchor` and
  `anchor(top)` instead of fragile pixel offsets.
- **Dynamic `calc-size()` & `round()`**: Snap container heights to repeating
  pattern tile heights without clipping.

---

## 3. Typography, Alignment & Visual Polish

- **Prevent orphan words**: Apply `text-wrap: balance` on headings, modals, and
  tooltips; `text-wrap: pretty` on body copy.
- **Icon-to-text alignment with `lh`**: Center icons against multi-line text via
  `transform: translateY(calc((1lh - var(--icon-size)) / 2))`.
- **Cap-height spacing**: Use the `cap` unit (`1cap`) for optical alignment.
- **Native image cropping & CLS safety**: Always set `width` and `height`
  attributes on `<img>` (plus `alt=""` for decorative images); use
  `object-view-box` + `object-fit: cover` instead of wrapper hacks.
- **SVG masks for cutouts & avatars**: Carve overlapping badge cutouts with
  SVG `<mask>` and add subtle inset strokes (`rgba(0,0,0,0.1)`) so light
  avatars stay legible.
- **Avoid pure `#000` / `#fff` in dark mode**: Use muted dark surfaces (e.g.
  `#121212` or darkened brand tones) to reduce halation and eye strain.
- **Relative color syntax**: Derive hover/border states dynamically with
  `rgb(from var(--brand) r g b / 0.5)` or `OKLCH`.

---

## 4. UX, Forms & Real-World Viewport Resilience

- **Stop scroll chaining**: Set `overscroll-behavior: contain` on modals,
  drawers, and dropdowns.
- **Auto-sizing inputs**: Use `field-sizing: content; max-width: 100%;` on
  `<select>` and `<input>` elements.
- **Hit targets on the interactive node**: Put padding on `<a>` / `<button>`
  (not `<li>`), and enforce `min-width` so short localized labels ("OK") don't
  collapse below 44px touch targets.
- **Test non-standard viewports**: Verify layouts against docked DevTools,
  mobile virtual keyboards, split-screen tabs, and short heights
  (`@media (height < 700px)`).
- **Interruptible CSS FLIP (`PropFLIP`)**: Register `@property --tx`, `--ty`,
  `--sx`, `--sy` (`syntax: "<number>"`) to animate FLIP layout changes with
  separate per-axis timing curves.
