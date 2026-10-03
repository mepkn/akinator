# Guess the Animal

An Akinator-style game: think of an animal, answer yes/no questions, and the robot
guesses it. When it's wrong, it asks you for the animal and a question that tells the
two apart, and learns it for next time.

Live: https://akinator.pknspace.com

## Features

- Starts with 50 animals in a hand-written decision tree.
- Learns new animals from players and remembers them in the browser (`localStorage`).
- "Forget everything" resets to the starting animals.
- Rejects offensive words in names and questions (English and Hindi/Hinglish blocklist).
- Animations and confetti on a correct guess.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Framer Motion · Vitest. No backend.

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run build` | Typecheck and production build into `dist/` |
| `npm run typecheck` | TypeScript check (`tsc -b`) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | Typecheck, lint and tests |
| `npm run deploy` | Checks, builds and uploads to the VPS |
| `npm run deploy:dry` | Same, but only previews the upload |

## Deployment

The site is static: `npm run build` writes `dist/`, which is synced to a VPS where
Caddy serves it directly (no restart needed).

1. One-time setup: copy `.env.example` to `.env.prod.local` (git-ignored) and fill in
   `DEPLOY_HOST`, `DEPLOY_PORT` and `DEPLOY_DIR`. You also need SSH key access to the server.
2. Deploy:
   ```bash
   npm run deploy:dry   # preview what would change
   npm run deploy       # checks, build, upload
   ```

## How it works

- The knowledge is a binary tree (`src/data/animals.ts`): question nodes have `yes`/`no`
  children, leaves are animals. A game walks from the root to a leaf.
- On a wrong guess, `insertAnimal` (`src/utils/tree.ts`) replaces that leaf with the
  player's question, putting the new and old animals on its two branches. The tree is
  immutable, so each update produces a new tree that gets saved.
- `validateTree` checks the tree is well-formed (no duplicates, no missing branches).
  `npm test` runs it against the starting tree, so edits to `animals.ts` are verified.
