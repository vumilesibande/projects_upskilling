# Vumile Sibande — Portfolio

Single-page portfolio aligned with `Vumile Sibande CV-gis.docx` in the repo root.

## View locally

From the `portfolio` folder (not `projects_upskilling`):

```bash
cd /Users/vumule.sibande/projects_upskilling/portfolio
./preview.sh
```

Open [http://localhost:8765](http://localhost:8765).

Or:

```bash
python3 -m http.server 8765
```

**If you still see the Portuguese learning app:** you may have opened port `8080` from the wrong folder, or a service worker from `portuguese-lusophone` is cached for `localhost:8080`. Use port `8765` above, or in Chrome DevTools → Application → Service Workers → Unregister for `localhost:8080`, then hard-refresh.

Or open `index.html` directly in a browser.

## Contents

- Hero, about, skills, experience (from CV)
- Upskilling projects: `hotspot-app`, `react-ui-library` (per CV)
- GIS-oriented frontend focus
- Enterprise highlights (African Parks, KitKat)
- Education and certifications
- Contact links

## Styles (SCSS + Gulp)

Source styles are in `scss/`. Gulp compiles `scss/main.scss` to `dist/styles.css` (linked from `index.html`).

```bash
cd /Users/vumule.sibande/projects_upskilling/portfolio
npm install
npm run build:css
```

While editing:

```bash
npm run watch
```

Or run Gulp directly: `npx gulp styles`, `npx gulp watch`.

## Customize

Edit `index.html` for copy. Edit `scss/**/*.scss`, then run `npm run build:css` before commit (or `npm run watch` locally).

## Deploy on GitHub Pages

This repo (`vumilesibande/projects_upskilling`) includes a workflow that publishes the `portfolio/` folder on every push to `main`.

1. Commit and push `portfolio/` and `.github/workflows/portfolio-pages.yml`.
2. On GitHub: **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
3. After the workflow runs, the site is live at  
   `https://vumilesibande.github.io/projects_upskilling/`

Profile link on the site: [github.com/vumilesibande](https://github.com/vumilesibande).

For a root URL like `https://vumilesibande.github.io`, use a separate repo named `vumilesibande.github.io` with these files at the repository root.

## Deploy on Vercel

**Root Directory:** `portfolio` (recommended).

`npm run build` copies static files into `public/` and compiles CSS to `public/dist/styles.css`.  
`vercel.json` sets `outputDirectory` to `public`.

Framework Preset: **Other** (not Next.js). Build command: `npm run build`.

Local preview still uses `npm run build:css` → `dist/styles.css` at the project root.

## Other hosts

Upload the `portfolio` folder to Netlify, S3, or any static host.
