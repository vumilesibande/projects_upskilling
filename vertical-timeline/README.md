# Vertical Timeline Component

A lightweight vertical timeline built with HTML, JavaScript, and SCSS (compiled with npm).

## Files

- `index.html`: Markup and template
- `src/scss/styles.scss`: SCSS source styling
- `styles.css`: Compiled CSS output used by the page
- `script.js`: Timeline app orchestration (rendering, filtering, observers)
- `timeline-core.mjs`: Reusable pure helpers (normalization, dates, filtering)
- `tests/timeline-core.test.mjs`: Node tests for helper logic
- `docs/timelineEvents.md`: Developer guide for event data
- `package.json`: npm scripts for build/watch/serve

## Features

- Vertical timeline line with event markers
- Expand/collapse event details on click
- Optional images per timestamp card
- Keyboard support (`Enter`/`Space`)
- Scroll-in animation for timeline items
- Active/current timeline states
- Category filtering
- Date normalization and formatting helpers
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

## Run tests

```bash
npm test
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
  id: 'your-milestone-id',
  date: 'Feb 2026',
  title: 'Your Milestone',
  category: 'Release',
  summary: 'Short summary',
  image: 'https://picsum.photos/seed/your-seed/900/480',
  imageAlt: 'Describe the timeline image',
  details: 'Longer details shown when expanded.',
  isCurrent: false
}
```

See `docs/timelineEvents.md` for full schema and edge-case behavior.

## Potential bugs and edge cases reviewed

- **Invalid dates:** Normalized with safe fallback display (`Date TBD` or raw date text).
- **Missing fields:** Title/summary/details/category get defaults to avoid render crashes.
- **Filter empties list:** Empty-state message is shown instead of blank UI.
- **Active item filtered out:** Active state resets to prevent stale references.
- **Very short arrays:** Pagination safely stops and removes sentinel.
- **Missing DOM nodes/template:** App exits early without throwing runtime errors.
