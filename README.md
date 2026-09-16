# Cricket Scoring App

Multi-club junior cricket scoring. One app, club-specific branding via URL path.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Club URLs

- `/` — club picker
- `/cornwall` — Cornwall Cricket Club
- `/aucc` — Auckland University Cricket Club (sample second club)

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## Features

- Per-club branding, teams, and draw config
- Year 3 / Year 4 grade selection at match start
- Batting and bowling scoring modes
- Autosave + resume scoped per club
- Live summaries, innings review, and a full match scorecard
- Match report CSV export with email address prompt

## Adding a club

1. Create `src/clubs/<slug>.js` with name, colours, teams, draw, year levels
2. Register it in `src/clubs/index.js`
3. Club is available at `/<slug>`
