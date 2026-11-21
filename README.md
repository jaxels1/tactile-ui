<p align="left">
  <img src="./assets/logo.svg" alt="jaxels-animate logo" width="64" height="64" />
</p>

# Jaxel's Animate

Combines multiple UI, motion, and anti-slop skills plus 130+ design-engineering articles into one unified agent skill.

![jaxels-animate beat-drop & draggable spring sheet demo](./assets/demo.gif)

## Quick Install

```bash
git clone https://github.com/jaxels1/jaxels-animate.git ~/.gemini/config/skills/jaxels-animate
```
*(Or clone into `.agents/skills/jaxels-animate` inside any project.)*

## What's Inside

- **Anti-Slop Layout, Copy & Chrome** — Breaking 3-column card grids, banning AI palette/chrome clichés, plain-English copy, Two-Pass audit, and the Chanel rule.
- **CSS & Typography Craft** — Nested radii, `OKLCH` palettes & gradients, `inline-grid` shift-free tabs, `text-box-trim`, `text-wrap: balance/pretty`, `1lh`/`1cap` alignment, and non-AI typeface lists.
- **Defensive CSS** — `minmax(0, 1fr)`, `subgrid`, `overflow: clip`, `overscroll-behavior: contain`, container & `:has()` quantity queries, `@layer`, and `PropFLIP`.
- **Fluid Physical Motion** — 1:1 pointer tracking, interruptible springs, velocity handoff, exponential momentum projection, rubber-banding, translucent materials, and reduced-motion accessibility.
- **React `<ViewTransition>`** — Shared-element morphs, directional navigation (`addTransitionType`), Suspense reveals, list identity, and CSS recipes.
- **Color, Form UX & Product Presentation** — Color-wheel temperature contrast, password/form UX patterns, and App Store screenshot psychology.

## Structure

```text
jaxels-animate/
├── SKILL.md
├── README.md
└── references/
    ├── anti-slop-layout-and-copy.md
    ├── defensive-css-and-craft.md
    ├── css-and-typography.md
    ├── fluid-physics-and-gestures.md
    ├── react-view-transitions.md
    └── color-forms-and-product.md
```

## Installation

Copy this folder into your agent's skills directory (e.g. `.agents/skills/jaxels-animate` in a project, or `~/.gemini/config/skills/jaxels-animate` globally).

## Credits & Sources

This skill synthesizes and builds on public work from:
- **[@charles.unemployed](https://www.instagram.com/charles.unemployed/)** (Charles Liu) — "Unslopping AI Designs" CSS, typography, color wheel, animation, form UX, and App Store psychology tips (who also credits Raphael Salaja's `userinterface.wiki`, Emil Kowalski, Jon Yablonski's *Laws of UX*, and Disney's *The Illusion of Life*).
- **Apple WWDC Design Talks** — *Designing Fluid Interfaces*, *The Details of UI Typography*, *Designing Audio-Haptic Experiences*, and *Principles of Great Design* (distilled in `apple-design`).
- **Vercel** — [`react-view-transitions`](https://github.com/vercel-labs/agent-skills) (MIT License).
- **Anti-Slop Frontend Guides** — `design-taste-frontend` and `frontend-design`.
- **Design & Engineering Articles (132 read)** — Josh W. Comeau (`joshwcomeau.com`), Ahmad Shadeed (`ishadeed.com`), ModernCSS (`moderncss.dev`), Piccalilli (`piccalil.li`), Nerdy.dev (`nerdy.dev`), Nielsen Norman Group (`nngroup.com`), `web.dev`, Jon Yablonski (`lawsofux.com`), and `uxdesign.cc`.
