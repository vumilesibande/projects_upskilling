# `timelineEvents` Developer Guide

## Purpose

`timelineEvents` is the source array used by `script.js` to render timeline cards.
The app normalizes this data, supports category filtering, formats dates, and marks a current event.

## Event shape

Each event supports the following fields:

```js
{
  id: "public-release",          // optional but recommended, unique string
  date: "Sep 2025",              // required, supports many date inputs
  title: "Public Release",       // required
  category: "Release",           // optional, defaults to "General"
  summary: "Short card summary", // optional fallback applied
  details: "Expanded details",   // optional fallback applied
  image: "https://...",          // optional image URL
  imageAlt: "Alt text",          // optional, falls back to title
  isCurrent: true                 // optional current marker
}
```

## Date handling

The formatter supports:

- Native parsable dates (`2026-09-01`, `Sep 2025`, `September 1, 2025`)
- Quarter strings (`Q1 2026`, `Q4 2027`)
- Invalid/missing dates fall back to `Date TBD` (or raw text if present)

## Filtering behavior

- Category options are generated from unique category values.
- `all` always includes every event.
- If an active/open event is filtered out, its active state resets safely.

## Current and active states

- `isCurrent: true` marks an event as current.
- If no explicit current event exists, the closest dated event to now is used.
- Active state tracks expanded details and is preserved when possible.

## Edge cases handled

- Missing fields are normalized to safe defaults.
- Empty arrays show a user-friendly empty state.
- Invalid categories return zero results without errors.
- Progressive loading/pagination safely handles short arrays.
- Missing template/container nodes fail gracefully (no runtime crash).

## Adding new events

1. Open `script.js`.
2. Add a new object to `timelineEvents`.
3. Include `id`, `title`, `date`, `category` at minimum for best results.
4. Run build/test:

```bash
npm run build
npm test
```
