# Vercel deployment

This repo has several apps. **Portfolio is not inside the language app** — they are separate folders at the repo root.

| App | Root Directory | Build |
|-----|----------------|-------|
| Portuguese Next.js app (recommended) | `portuguese-lusophone-app` | `npm install` + `npm run build` |
| Portuguese static PWA | `portuguese-lusophone` | No npm — static files only |
| Portfolio | `portfolio` | `npm install` + `gulp build` |
| Hotspot app | `hotspot-app` | Next.js |

## Fix: `portfolio/package.json` ENOENT

That error means Vercel is running a **portfolio** install command while your root directory is the **language app**.

```
npm install --prefix portfolio
→ looks for portuguese-lusophone/portfolio/package.json  ❌
```

### Step 1 — Vercel dashboard (required)

1. Open your project on [vercel.com](https://vercel.com)
2. **Settings → General → Root Directory**
   - For the Next.js language app: `portuguese-lusophone-app`
   - For the static PWA: `portuguese-lusophone`
3. **Settings → Build & Deployment**
   - **Install Command** → toggle **Override** off, or clear the field  
     (remove `npm install --prefix portfolio` if it is there)
   - **Build Command** → toggle **Override** off, or clear the field
   - **Output Directory** → leave default for Next.js, or `.` for static PWA
4. **Redeploy** (Deployments → … → Redeploy)

### Step 2 — Repo change

The repo root `vercel.json` that pointed at portfolio was removed so it no longer conflicts with the language app. Each app uses its own `vercel.json` inside its folder.

## Portuguese Next.js app (translate + speak)

```
Root Directory: portuguese-lusophone-app
Framework: Next.js (auto-detected)
```

Uses `portuguese-lusophone-app/vercel.json`.

## Portuguese static PWA

```
Root Directory: portuguese-lusophone
Install Command: (empty)
Build Command: (empty)
Output Directory: .
```

Uses `portuguese-lusophone/vercel.json`.

## Portfolio (separate Vercel project)

```
Root Directory: portfolio
```

Uses `portfolio/vercel.json` → output `public/`.
