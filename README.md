# Syook sales CRM — mobile prototype

A clickable prototype for the Syook PM take-home challenge. Simulates a mobile intelligence/UX layer on top of an existing internal CRM used by field sales associates. All data is fake and hardcoded — no backend, no database, no auth.

See `Syook_Prototype_Build_Spec.md` in this repo for the full product spec (persona, screens, feature logic, design mandate) — that file is the source of truth for what this app should do and why.

## Tech stack

- Vite + React
- Tailwind CSS
- No backend, no database, no environment variables — everything is client-side, in-memory fake data

This stack is chosen because it deploys to Vercel or Cloudflare Pages with zero configuration.

## Running locally

```
npm install
npm run dev
```

Opens at `http://localhost:5173` by default.

## Building for production

```
npm run build
```

Outputs a static build to `dist/`.

## Deploying

### Vercel
1. Push this repo to GitHub.
2. Go to vercel.com → New Project → import the GitHub repo.
3. Framework preset: Vite. No environment variables needed.
4. Deploy. Vercel gives you a public URL immediately — no login required to view it.

### Cloudflare Pages
1. Push this repo to GitHub.
2. Go to the Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`. Build output directory: `dist`.
4. Deploy. Cloudflare gives you a public `*.pages.dev` URL.

Either option works — pick whichever you're more comfortable with. Both produce a public link reviewers can open with no login.

## Project structure

```
/src
  /components   reusable UI pieces (deal card, status chip, sentiment tag, buttons)
  /screens      Home, MyDeals, DealDetail
  /data         fake deal data, notes, documents
  App.jsx       routing between the three screens
  main.jsx      entry point
index.html
tailwind.config.js
vite.config.js
package.json
```

## Notes for reviewers

- This is a mobile-first design. On desktop, the app renders centered at mobile width inside the browser window — that's intentional, not a broken layout.
- All AI-sounding features (deal brief, sentiment tags, priority scores) are rule-based logic and pre-written fake content, not live model calls. See the build spec for the exact logic behind the priority score and sentiment tagging.
