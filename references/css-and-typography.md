# CSS & Typography Reference

## 10 UI & CSS Design Rules

1. **Nested rounded corners**: `innerRadius = outerRadius - padding`.
2. **Alpha borders**: Use `rgb(0 0 0 / 0.12)` (or `rgb(255 255 255 / 0.12)` on
   dark surfaces) instead of solid hex so borders blend into any background.
3. **OKLCH palettes with sRGB fallback**: Define an sRGB hex fallback first (or
   wrap in `@supports (color: oklch(0 0 0))`) so color steps render in all engines:
   ```css
   .accent-surface {
     background: #2563eb;
     background: oklch(0.55 0.22 260);
   }
   ```
4. **OKLCH gradients with fallback**: Pair a standard gradient before `in oklch`
   interpolation to prevent broken gradients on older browsers:
   ```css
   .banner {
     background: linear-gradient(90deg, #2563eb, #f97316);
     background: linear-gradient(90deg in oklch, blue, orange);
   }
   ```
5. **Icon stroke matching**: Match icon stroke width to adjacent text weight.
6. **Carousel edge fades**:
   ```css
   mask: linear-gradient(90deg, transparent, black 15% 85%, transparent);
   ```
7. **Icon swap transitions**: Blur the outgoing icon as it fades out
   (`filter: blur(4px)`).
8. **Dark mode depth**: Express elevation with lighter surfaces rather than
   heavy shadows.
9. **Full-height sections**: Pair `100vh` fallback with `100dvh` (`min-height: 100vh; min-height: 100dvh;`) to avoid mobile Safari viewport bugs.
10. **Product shots on white**: Use `mix-blend-mode: multiply` to knock out
    white backgrounds cleanly.

---

## 10 CSS Typography Rules

1. **Bold tabs without layout shift**:
   ```css
   .tab { display: inline-grid; }
   .tab > *, .tab::after { grid-area: 1 / 1; }
   .tab::after {
     content: attr(data-text);
     font-weight: 700;
     visibility: hidden;
     pointer-events: none;
   }
   ```
2. **Optical centering (guarded)**:
   ```css
   .pill-label {
     padding-block: 0.45em;
   }
   @supports (text-box-trim: trim-both) {
     .pill-label {
       text-box-trim: trim-both;
       text-box-edge: cap alphabetic;
     }
   }
   ```
3. **Clean underlines**: `text-underline-offset: 0.2em;` to clear descenders.
4. **Evenly spaced superscripts**:
   ```css
   sup {
     line-height: 0;
     position: relative;
     vertical-align: baseline;
     top: -0.5em;
   }
   ```
5. **Fluid headlines**: `font-size: clamp(2rem, 1rem + 5vw, 4rem);`
6. **Acronyms**: `font-variant-caps: all-small-caps;` instead of raw all-caps.
7. **Curly punctuation**: Always use `“ ” ‘ ’`, never straight `" '`.
8. **Middle truncation for filenames**:
   ```css
   .file-row { display: flex; }
   .file-row .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
   .file-row .ext { flex-shrink: 0; }
   ```
9. **Narrow columns**: `hyphens: auto;` with `lang="en"` on `<html>`.
10. **Card title clamping**:
    ```css
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    ```

---

## Optical Sizing, Tracking & Leading

- **Tracking is size-specific**: Tighten large display text (`-0.02em`), leave
  body near `0`, and slightly open small captions.
- **Leading tracks size inversely**: Tight on display (`1.05`), looser on body
  (`1.5`).
- **Build hierarchy from weight + size + leading together**, not size alone.
- **Scale layout with text**: Use `rem`/`em` spacing so user text-size
  preferences never break layouts.

```css
:root { font: 100%/1.5 system-ui, sans-serif; }
.display {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-optical-sizing: auto;
}
```

---

## Fonts That Don't Look AI-Made

### Skip These Overused Defaults
- **Serifs / Display**: `Instrument Serif`, `Fraunces`, `Playfair Display`
- **Sans**: `Inter`, `Roboto`, `Arial`, `Geist`, `Space Grotesk`, `Bricolage Grotesque`, `Instrument Sans`
- **Mono**: `JetBrains Mono`, `Space Mono`

### Curated Alternatives

| Category | Recommended Typefaces |
| :--- | :--- |
| **Vintage Serif** | Editorial New, ABC Arizona, ABC Marist, Concrette, GT Super, Blazeface |
| **Modern Serif** | Tiempos Fine, Reckless, Signifier, Canela, Luperca, Domaine Display |
| **Soft Serif** | EB Garamond, Exposure, GT Alpina, Mioya, Tiempos Text, Lyon Text |
| **Fun Display** | Gautreaux, Hobeaux, Obviously, Absans, GT Maru, 5by7 |
| **Clean Swiss Sans** | ABC Diatype, TWK Lausanne, Switzer, Saans, Areal, Strichpunkt Sans |
| **Friendly Sans** | Studio Feixen Sans, PP Mori, Aeonik, Degular, GT Walsheim, Circular |
| **Personality Sans** | Apfel Grotezk, Aktiv Grotesk, ABC Favorit, Familjen Grotesk, ABC Monument Grotesk, ABC Oracle |
| **Techy Mono** | ABC Diatype Mono, Söhne Mono, GT America Mono, IBM Plex Mono, Commit Mono, Departure Mono |
