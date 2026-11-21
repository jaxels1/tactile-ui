# Anti-Slop Layout, Chrome & Copy Reference

AI models converge on statistical averages ("AI slop"): `Inter`, purple-to-blue
gradients, 3-column rounded card grids, warm-cream + terracotta defaults, and
hollow corporate copy. Use these hard rules to break out of those defaults.

---

## 1. Layout & Structural Anti-Slop

- **Ban the 3-column identical card grid**: Vary data display with asymmetrical
  splits (e.g., 8-column feature + 4-column dense list), staggered rows, or
  editorial single-column storytelling.
- **Kill card-on-card shadow stacks**: Avoid nesting rounded white cards on
  grey backgrounds with uniform `shadow-sm` / `shadow-xl`. Prefer flat layouts
  with strong typographic hierarchy and clean 1px structural borders
  (`border-b`, `border-r`).
- **Break uniform padding**: Contrast intentional density (tight metadata
  lists, compact data tickers) against generous breathing room around hero
  headlines.
- **One section per screen**: Keep the hero alone on the first screen with no
  second section heading peeking in. Maintain equal left and right content
  edges, and never repeat the same section structure back-to-back.
- **Match medium to subject**:
  - **Places & physical goods** (cafes, shops, furniture): Lead with real
    photographs and flat surfaces—never shader/WebGL backgrounds.
  - **Software & dev tools**: Show live interactive HTML UI (e.g., an actual
    red/green diff with an Accept button), not generic abstract dashboards.
  - **Tech / gaming / hardware**: Reserve shader effects and WebGL scenes
    strictly for technical subjects, and limit to one hero/focal effect.
- **No decorative `01 / 02 / 03` numbering**: Only number items when they
  represent a genuine sequence or timeline.
- **No captions under visuals**: Let photography and UI frames speak for
  themselves; put any required attribution in one quiet footer line.

---

## 2. Color & Template Chrome Anti-Slop

- **Ban both AI palette clichés**:
  1. **Purple/indigo-to-cyan gradients** on hero backgrounds or CTAs.
  2. **Warm cream (`#F4F1EA`) + terracotta (`#D97757`) / sage-green**
     editorial defaults.
- **3-color ceiling**: Commit to one dominant background, one primary text
  color, and **one** intentional accent reserved for active/conversion states.
- **Ban "template chrome" tells**:
  - Tracked-out `ALL-CAPS` eyebrow labels above every heading.
  - Middle-dot meta strings (`A · B · C`) and `WORD — fragment` em-dash labels.
  - Accenting a single word in a headline with italics or a different color.
  - Appending `→` to every link and button label.
  - Repeating fade-and-slide-up scroll animations on every single card/section.

---

## 3. Copy & Microcopy Anti-Slop

- **Ban the AI buzzword list**: Delete *"Elevate," "Seamless," "Empower,"
  "Robust," "Unleash," "Supercharge,"* and *"Welcome to the future of X."*
- **Apply the "So What?" test**: Replace vague value props (*"Optimized
  workflows for modern teams"*) with concrete plain-English outcomes (*"Stop
  copy-pasting CSVs into Jira"*).
- **Use active, consistent verbs**:
  - CTAs state the exact action (*"Save changes"*, not *"Submit"*).
  - Match button verbs to confirmation toasts (`Publish` → `Published`).
  - Speak in user terms (*"Notifications"*, not *"Webhook config"*).
- **Direct error & empty states**: Never apologize or stay vague. State what
  happened and how to fix it; treat empty states as clear invitations to act.
- **Readable line length**: Keep prose under 80 characters per line.

---

## 4. Two-Pass Design Process & Chanel Rule

1. **Plan & audit before coding**: Draft a compact token plan (4–6 hexes,
   1–2 typefaces, ASCII layout wireframe). Check every axis against the AI tells
   above; revise anything that looks like a generic template before writing
   code.
2. **Spend boldness in one place**: Let one element be the memorable focal point
   and keep everything around it disciplined and quiet.
3. **Chanel rule**: Before shipping, inspect the rendered UI and remove one
   unnecessary border, badge, shadow, or animation.
