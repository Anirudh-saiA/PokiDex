# ANIRUDH.EXE — Pixel Portfolio

A single-page portfolio for Ankam Sai Anirudh, styled as a vintage Game Boy–era
Pokémon Red/Blue game. Skills render as Pokédex HP bars, the Tata Steel
internship is a "wild encounter" battle card, projects are flippable trading
cards, and certifications show up as gym badges.

**Live:** https://poki-dex-two.vercel.app

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion (section reveal animations)
- Deployed on Vercel

No backend — the contact section links out via `mailto:`, and the GitHub /
LeetCode trackers fetch directly from public, CORS-enabled third-party APIs
client-side (see [`src/data/content.ts`](src/data/content.ts) for the
`liveTrackers` config and [`src/components/GithubTracker.tsx`](src/components/GithubTracker.tsx)
/ [`src/components/LeetCodeTracker.tsx`](src/components/LeetCodeTracker.tsx)
for the fetch calls).

## Sections

| Section | Game metaphor |
|---|---|
| Hero / About | Overworld tile with an arrow-key-controlled sprite + typewriter bio |
| Skills | Pokédex entries, HP-style bars |
| Experience | Wild Encounter battle box |
| Projects | Flippable trading cards |
| GitHub | Live trainer card, contribution heatmap, recent push/pull log |
| LeetCode | Training record, per-difficulty solve bars |
| Education & Certs | Gym badges |
| Contact | "Save the game?" prompt |

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run preview  # serve the production build locally
```

All content (resume text, skills, projects, badges, tracker usernames) lives
in [`src/data/content.ts`](src/data/content.ts) — edit there rather than in
the components.
