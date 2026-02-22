# @fransiscushermanto/ui

A curated, accessible, and highly customizable UI component library for React, built with Tailwind CSS.

## Getting Started

### Installation

```bash
npm install @fransiscushermanto/ui
# or
yarn add @fransiscushermanto/ui
# or
pnpm add @fransiscushermanto/ui
```

### Setup Styles

To properly display the components, you need to import the CSS file provided by the library.

**For standard setups or if you are not using CSS frameworks with `@layer`:**

Import the CSS directly at the entry-point of your application (e.g., `main.tsx`, `App.tsx`, or `_app.tsx`):

```tsx
import "@fransiscushermanto/ui/style.css";
```

**For projects using PandaCSS, Tailwind CSS (v4+), or standard CSS files manipulating `@layer`s:**

Import the CSS into your global styles file (e.g. `global.css` or `index.css`), specifying the `utilities` layer to avoid specificity issues:

```css
@import "@fransiscushermanto/ui/style.css" layer(utilities);
```

## Components

Below is the list of available components in this library:

- **[Select](./src/components/select/README.md)**

---

_More components coming soon!_
