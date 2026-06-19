# Vercel deployment

This repo has several **separate apps** in their own folders. Portfolio is **not** inside the language app.

| App | Root Directory | Notes |
|-----|----------------|-------|
| **Portuguese language app** | `portuguese-lusophone` | Next.js — Translate, practice, etc. |
| **Portfolio** | `portfolio` | Static CV site (Gulp) |
| **Hotspot app** | `hotspot-app` | Next.js |

## Language app on Vercel

1. **Settings → General → Root Directory:** `portuguese-lusophone`
2. **Settings → Build & Deployment:**
   - Install Command: **Override off** (or `npm install`)
   - Build Command: **Override off** (or `npm run build`)
   - Do **not** use `npm install --prefix portfolio`
3. Framework: **Next.js** (auto-detected)
4. Redeploy

## Portfolio on Vercel (separate project)

1. Root Directory: `portfolio`
2. Uses `portfolio/vercel.json` → output `public/`

## Why separate folders?

- **Portfolio** = your CV / work showcase (different site, different deploy)
- **portuguese-lusophone** = language learning app (Next.js)

One Vercel project = one root folder. Use two Vercel projects from the same GitHub repo if you want both live.
