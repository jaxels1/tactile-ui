<p align="left">
  <img src="./assets/logo.svg" alt="tactile-ui logo" width="64" height="64" />
</p>

# Tactile UI — UI Design, Fluid Motion & Anti-Slop Agent Skill

**Tactile UI (`tactile-ui`)** is an open-source UI/UX design and frontend engineering skill for AI coding agents (Claude Code, OpenAI Codex, Cursor, Antigravity, and Gemini CLI). It replaces generic "AI slop" templates with crafted typography, `OKLCH` color systems, defensive CSS layout rules, Apple-style interruptible spring physics, and React `<ViewTransition>` animations—synthesizing `@charles.unemployed`'s UI/UX rules, Apple's *Designing Fluid Interfaces*, Vercel's `react-view-transitions`, and 130+ frontend engineering articles.

![tactile-ui skill demo](./assets/demo.gif)

## Quick Install

Install via the open agent skills CLI (`skills.sh`):

```bash
npx skills add jaxels1/tactile-ui
```

Or clone directly into your agent's skills directory:

```bash
# Global (Antigravity / Gemini)
git clone https://github.com/jaxels1/tactile-ui.git ~/.gemini/config/skills/tactile-ui

# Project-local (Claude Code / Codex / Cursor / universal .agents)
git clone https://github.com/jaxels1/tactile-ui.git .agents/skills/tactile-ui
```

## What's Inside

- **Step 0 Surface Triage & Environment Gate** — Separates high-frequency utilitarian tools (`<=120ms` or zero motion) from expressive consumer surfaces, inspects `package.json` React/Motion versions before recommending APIs, and wraps modern CSS in `@supports` / sRGB fallbacks.
- **Deterministic Pre-Ship Scanner (`scripts/audit-ui.mjs`)** — Zero-dependency Node script checking `.css`, `.scss`, `.jsx`, `.tsx`, `.ts`, `.js`, and `.html` files for layout-animating properties, missing `prefers-reduced-motion` rules, ignored Motion `velocity` (`duration`/`bounce`), `scale(0)` entrances, and unguarded bleeding-edge CSS.
- **Anti-Slop Layout, Copy & Chrome** — Breaking 3-column card grids, banning AI palette/chrome clichés, plain-English copy, Two-Pass audit, and the Chanel rule.
- **CSS & Typography Craft** — Nested radii, `OKLCH` palettes & gradients with sRGB fallbacks, `inline-grid` shift-free tabs, guarded `text-box-trim`, `text-wrap: balance/pretty`, `1lh`/`1cap` alignment, and non-AI typeface lists.
- **Defensive CSS** — `minmax(0, 1fr)`, `subgrid`, `overflow: clip`, `overscroll-behavior: contain`, container & `:has()` quantity queries, `@layer`, and `PropFLIP`.
- **Fluid Physical Motion** — 1:1 pointer tracking, interruptible springs, velocity handoff, exponential momentum projection, rubber-banding, translucent materials, and reduced-motion accessibility.
- **React `<ViewTransition>`** — Shared-element morphs, directional navigation (`addTransitionType`), Suspense reveals, React 18/19.0–19.2 fallbacks, and CSS recipes.
- **Color, Form UX & Product Presentation** — Color-wheel temperature contrast, password/form UX patterns, and App Store screenshot psychology.

## Pre-Ship Automated Audit (`scripts/audit-ui.mjs`)

Instead of relying solely on checklist self-review, run the zero-dependency static auditor before finishing UI edits:

```bash
# Audit modified & untracked UI files in the current git workspace
node scripts/audit-ui.mjs --changed

# Audit specific files or directories (add --strict to fail on @supports warnings too)
node scripts/audit-ui.mjs src/components src/styles/app.css --json
```

Rules enforced:
- **`layout-animation`**: Flags `@keyframes`, `transition`, and Motion props animating layout properties (`top`, `left`, `width`, `height`, `margin`, `padding`) instead of `transform` and `opacity`.
- **`missing-reduced-motion`**: Verifies CSS files and React motion components define `@media (prefers-reduced-motion: reduce)`, `useReducedMotion`, or `<MotionConfig reducedMotion="user">`.
- **`motion-velocity-ignored`**: Catches Motion spring objects combining `velocity` with `duration`, `visualDuration`, or `bounce` (which silently ignores initial `velocity`).
- **`scale-zero-entrance`**: Flags `scale(0)`, `scale: 0`, and Tailwind `scale-0` entrance states instead of `scale(0.97)`.
- **`unguarded-bleeding-edge-css`**: Warns when `text-box-trim`, `interpolate-size`, or `oklch` lack `@supports` wrappers or prior sRGB fallback declarations.

## Structure

```text
tactile-ui/
├── SKILL.md
├── README.md
├── scripts/
│   └── audit-ui.mjs
└── references/
    ├── anti-slop-layout-and-copy.md
    ├── defensive-css-and-craft.md
    ├── css-and-typography.md
    ├── fluid-physics-and-gestures.md
    ├── react-view-transitions.md
    └── color-forms-and-product.md
```

## Manual Installation

Copy this folder into your agent's skills directory (e.g. `.agents/skills/tactile-ui` in a project, or `~/.gemini/config/skills/tactile-ui` globally).

## FAQ

### What makes `tactile-ui` a good UI design skill for AI coding agents?
`tactile-ui` gives coding agents concrete, verifiable rules instead of vague aesthetic adjectives—covering anti-slop layout audits, `OKLCH` perceptual contrast, defensive CSS (`minmax(0, 1fr)`, `subgrid`, `overflow: clip`), interruptible pointer-driven springs, and native React `<ViewTransition>` choreography.

### Which AI coding agents and frameworks does `tactile-ui` support?
`tactile-ui` follows the open `SKILL.md` standard and works with Claude Code, OpenAI Codex, Cursor, Antigravity, and Gemini CLI across React, Next.js, TypeScript, Tailwind CSS, and vanilla CSS/DOM projects.

### Does `tactile-ui` work on existing apps or only greenfield sites?
It preserves existing design systems by default—keeping your product's tokens, type scale, and palette intact—while only applying greenfield anti-slop typography and palette rules when starting from scratch or explicitly redesigning.

## Credits & Sources

This skill synthesizes and builds on public work from:
- **[@charles.unemployed](https://www.instagram.com/charles.unemployed/)** (Charles Liu) — "Unslopping AI Designs" CSS, typography, color wheel, animation, form UX, and App Store psychology tips (who also credits Raphael Salaja's `userinterface.wiki`, Emil Kowalski, Jon Yablonski's *Laws of UX*, and Disney's *The Illusion of Life*).
- **Apple WWDC Design Talks** — *Designing Fluid Interfaces*, *The Details of UI Typography*, *Designing Audio-Haptic Experiences*, and *Principles of Great Design* (distilled in `apple-design`).
- **Vercel** — [`react-view-transitions`](https://github.com/vercel-labs/agent-skills) (MIT License).
- **Anti-Slop Frontend Guides** — `design-taste-frontend` and `frontend-design`.
- **Design & Engineering Articles (132 read)** — Josh W. Comeau (`joshwcomeau.com`), Ahmad Shadeed (`ishadeed.com`), ModernCSS (`moderncss.dev`), Piccalilli (`piccalil.li`), Nerdy.dev (`nerdy.dev`), Nielsen Norman Group (`nngroup.com`), `web.dev`, Jon Yablonski (`lawsofux.com`), and `uxdesign.cc`.
