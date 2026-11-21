# Fluid Physics, Gestures & UX Laws

## Part 1: 10 UI Animation Rules (`@charles.unemployed`)

1. **Entrances**: Start from `scale: 0.97` + `opacity: 0`, never `scale: 0`.
2. **Tactile buttons**:
   ```css
   button { transition: scale 150ms ease-out; }
   button:active { scale: 0.97; }
   ```
3. **Wrong password / error shake**: Shake horizontally
   (`translateX`: `0, -10px, 10px, -6px, 6px, -3px, 0`) over `360ms` and turn
   the field red.
4. **Steppers**: Slide the next step in from the navigation direction instead of
   crossfading.
5. **Accordions**: `:root { interpolate-size: allow-keywords; }` so
   `height: auto` animates smoothly.
6. **GPU positioning**: Animate `transform`, never `top`/`left`, to avoid
   per-frame repaints.
7. **Theme switches**: Disable transitions mid-switch:
   ```css
   .theme-switching * { transition: none !important; }
   ```
8. **Tooltips**: Delay only the first tooltip; once one is open, show
   subsequent tooltips immediately.
9. **Flicks & drags**: Hand off release velocity to a spring instead of a fixed
   duration:
   ```ts
   animate(y, 0, { type: "spring", duration: 0.5, bounce: 0, velocity });
   ```
10. **Carousels**: Add growing pull resistance past either end, then spring back.

---

## Part 2: Fluid Physical Motion (Apple *Designing Fluid Interfaces*)

### 1. Kill Latency & Track 1:1
- **Respond on `pointerdown`**, not on `click`/release.
- **Use Pointer Events + `setPointerCapture`** so tracking continues outside
  element bounds, and preserve the **grab offset** (`e.clientY - rect.top`).
- **Record a short position + timestamp history** on `pointermove` so you have
  accurate velocity on release.

### 2. Interruptibility (Most Important Principle)
- **Never lock out input during a transition.**
- **Animate from the live presentation value**, never the logical target.
- **Avoid CSS transitions / `@keyframes` for gesture-driven UI**—springs
  re-target smoothly from current position and velocity without a "brick wall".
- **Decompose 2D motion** into independent X and Y springs.

### 3. Springs: Damping & Response
- **Default UI spring**: Critically damped (`damping: 1.0`, `bounce: 0`,
  `response/duration: 0.3–0.4s`).
- **Momentum / flick spring**: Slight overshoot (`damping: 0.8`, `bounce: 0.2`,
  `response/duration: 0.3–0.4s`)—only when a physical flick preceded it.

### 4. Velocity Handoff & Momentum Projection
Pass release velocity into the spring (`relativeVelocity = gestureVelocity / (target - current)` if normalized, or raw `px/s` for Motion). Project where a flick is going before snapping:

```js
// decelerationRate ≈ 0.998 (normal scroll) or 0.99 (snappier)
function project(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projected = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projected);
animateSpringTo(target, { velocity: releaseVelocity });
```

### 5. Rubber-Banding Soft Boundaries
```js
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

### 6. Spatial Consistency & Translucent Materials
- **Symmetric paths**: Enter and exit along the same path; anchor popovers to
  their trigger via `transform-origin`; mirror easing curves on reversible
  transitions.
- **Translucent chrome**: Use `backdrop-filter: blur(20px) saturate(180%)` with
  a bright top edge (`border-top: 1px solid rgba(255, 255, 255, 0.4)`). Never
  stack two light translucent surfaces; dim behind modals, offset without a
  scrim for parallel panels.

### 7. Multimodal Feedback & Reduced Motion
- **Causality, Harmony, Utility**: Trigger visual + audio + haptics on the exact
  same frame, and reserve haptics/sound for meaningful commits/errors.
- **Accessibility media queries**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .sheet { transition: opacity 200ms ease; transform: none !important; }
  }
  @media (prefers-reduced-transparency: reduce) {
    .toolbar { background: white; backdrop-filter: none; }
  }
  ```

---

## Part 3: 20 Animation & UX Laws (`@charles.unemployed`)

### Disney's 12 Principles Applied to UI
1. **Squash & stretch** — Subtle volume-preserving flex on press/impact.
2. **Anticipation** — Small wind-up before a major state change.
3. **Staging** — Direct attention cleanly to the active focus.
4. **Pose to pose** — Design key start/end states explicitly.
5. **Follow through** — Secondary elements settle slightly after the main container.
6. **Slow in & slow out** — Natural easing; never linear for UI motion.
7. **Arcs** — Move along subtle curves rather than robotic straight lines.
8. **Secondary action** — Supporting micro-feedback reinforcing the primary action.
9. **Snappy timing** — Keep UI animations `<300ms`.
10. **Exaggerated feedback** — Make critical confirmations/errors unmistakable.
11. **Solid drawing** — Maintain consistent spatial depth and 3D perspective.
12. **Appeal** — Cohesive personality that feels intentional, not noisy.

### 8 Core UX Laws
1. **Fitts's law** — Bigger, closer targets for primary actions.
2. **Generous hit areas** — Expand clickable hitboxes beyond visual bounds.
3. **Hick's law** — Fewer simultaneous choices = faster decisions.
4. **Miller's law** — Chunk information into ~7 items or fewer.
5. **Doherty threshold** — Respond in `<400ms` so UI feels instantaneous.
6. **Postel's law** — Accept messy input gracefully; return clean output.
7. **Jakob's law** — Match familiar conventions from everyday apps.
8. **Frequency of use** — The more often an action is used, the *less* it should animate.
