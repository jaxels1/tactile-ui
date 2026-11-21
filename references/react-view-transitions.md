# React View Transitions Reference

Animate between UI states using `document.startViewTransition` via React's
`<ViewTransition>` component (React 19.3+ or Next.js App Router). Unsupported
browsers skip animations gracefully.

## Priority Order

Implement **all** applicable patterns in this order:

| Priority | Pattern | What it communicates |
| :---: | :--- | :--- |
| 1 | **Shared element** (`name`) | "Same thing — going deeper" |
| 2 | **Suspense reveal** | "Data loaded" |
| 3 | **List identity** (per-item `key`) | "Same items, new arrangement" |
| 4 | **State change** (`enter` / `exit`) | "Something appeared/disappeared" |
| 5 | **Route change** (page-level) | "Going to a new place" |

## Core Rules

1. **Triggering**: Only `startTransition`, `useDeferredValue`, or `Suspense`
   activate `<ViewTransition>`. Plain `setState` does not animate.
2. **Placement**: `<ViewTransition>` only activates `enter`/`exit` if it
   appears **before any DOM nodes**:
   ```jsx
   // Works
   <ViewTransition enter="auto" exit="auto">
     <div>Content</div>
   </ViewTransition>

   // Broken — div wraps VT
   <div>
     <ViewTransition enter="auto" exit="auto">
       <div>Content</div>
     </ViewTransition>
   </div>
   ```
3. **Directional slides vs lateral fades**: Reserve directional slides
   (`nav-forward` / `nav-back`) for hierarchical navigation (list → detail) and
   ordered sequences (prev/next). Use bare `<ViewTransition>` (fade) or
   `default="none"` for lateral tabs.
4. **`router.back()` caveat**: Browser back/forward and `router.back()` carry no
   transition types, so type-keyed slides resolve to `default` (untyped shared
   elements still morph).

## Transition Types (`addTransitionType`)

```jsx
import { ViewTransition, startTransition, addTransitionType } from 'react';

startTransition(() => {
  addTransitionType('nav-forward');
  router.push('/detail/1');
});
```

```jsx
<ViewTransition
  enter={{ 'nav-forward': 'slide-from-right', 'nav-back': 'slide-from-left', default: 'none' }}
  exit={{ 'nav-forward': 'slide-to-left', 'nav-back': 'slide-to-right', default: 'none' }}
  share={{ 'nav-forward': 'morph-forward', 'nav-back': 'morph-back', default: 'morph' }}
  default="none"
>
  <Page />
</ViewTransition>
```

## Copy-Paste CSS Recipes

```css
:root {
  --duration-exit: 150ms;
  --duration-enter: 210ms;
  --duration-move: 400ms;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide {
  from { translate: var(--slide-offset); }
  to { translate: 0; }
}

/* Fade */
::view-transition-old(.fade-out) {
  animation: var(--duration-exit) ease-in fade reverse;
}
::view-transition-new(.fade-in) {
  animation: var(--duration-enter) ease-out var(--duration-exit) both fade;
}

/* Directional Navigation */
::view-transition-new(.slide-from-right) {
  --slide-offset: 60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both fade,
    var(--duration-move) ease-in-out both slide;
}
::view-transition-old(.slide-to-left) {
  --slide-offset: -60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}
::view-transition-new(.slide-from-left) {
  --slide-offset: -60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both fade,
    var(--duration-move) ease-in-out both slide;
}
::view-transition-old(.slide-to-right) {
  --slide-offset: 60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}
```
