# Portuguese for newcomers — Mozambique

Practical Portuguese for **people who have moved to Mozambique**. Next.js 16, TypeScript, Tailwind.

## Who it is for

- Expats, volunteers, and workers settling in Maputo or elsewhere
- Daily life: transport (chapa), markets, rent, utilities, health, emergencies
- Pronunciation guides + listen buttons (browser speech, pt-PT)

## Features

- **Start here** — quick tips for your first week
- **Translate** — type English sentences and get Portuguese (phrasebook first, then pt-PT translation)
- **Daily life** — phrases by situation
- **Guides** — short lessons for newcomers
- **Words** — essential vocabulary
- **Sounds** — pronunciation basics
- **Practice** — flashcards and quiz

## Requirements

- Node.js **20.9+** (Next.js 16 will not run on Node 16)

If you use [nvm](https://github.com/nvm-sh/nvm), the project includes `.nvmrc`:

```bash
cd portuguese-lusophone-app
nvm use          # switches to Node 20
node -v          # should show v20.x
npm install
npm run dev
```

If `npm run dev` still says Node 16, your terminal is not using nvm’s Node — run `nvm use` in the same terminal first.

Open http://localhost:3000

## Production

```bash
npm run build
npm run start
```
