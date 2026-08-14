# Vertical Timeline Component

A lightweight vertical timeline built with HTML, JavaScript, and SCSS (compiled with npm).

## Files

- `index.html`: Markup and template
- `src/scss/styles.scss`: SCSS source styling
- `styles.css`: Compiled CSS output used by the page
- `script.js`: Rendering logic and interactions
- `package.json`: npm scripts for build/watch/serve

## Features

- Vertical timeline line with event markers
- Expand/collapse event details on click
- Optional images per timestamp card
- Keyboard support (`Enter`/`Space`)
- Scroll-in animation for timeline items
- Easy event editing via `timelineEvents` array in `script.js`

## Install

```bash
cd /Users/vumule.sibande/projects_upskilling/vertical-timeline
npm install
```

## Build SCSS

Compile `src/scss/styles.scss` into `styles.css` and run Autoprefixer:

```bash
npm run build
```

`npm run build` executes:

- `build:css` → Sass compile
- `prefix:css` → PostCSS Autoprefixer pass on `styles.css`

Watch for SCSS changes while you work:

```bash
npm run watch
```

## Run locally

Serve the component locally:

```bash
npm run serve
```

Then open: `http://localhost:8080`

## Customize

Edit `timelineEvents` in `script.js`:

```js
{
  date: 'Feb 2026',
  title: 'Your Milestone',
  summary: 'Short summary',
  image: 'https://picsum.photos/seed/your-seed/900/480',
  imageAlt: 'Describe the timeline image',
  details: 'Longer details shown when expanded.'
}
```
