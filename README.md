# Index — Reading Metrics Dashboard

A personal reading analytics dashboard with a calm, dark "Forest Night" design (see `Instructions/DESIGN.md`). Tracks books, visualises reading habits, and deploys as a fully static site with no backend required on the live version.

---

## Screenshots

**Dashboard:** headline totals, top author, featured book, genre and author breakdowns, book length and rating spread.

![Booked dashboard overview](docs/screenshots/dashboard.png)

**Library:** searchable, filterable table of every book, with a Books / Authors toggle.

![Booked library, book view](docs/screenshots/library.png)

---

## How it works

There are two modes:

| Mode | When | How data is served |
|------|------|--------------------|
| **Local / Dev** | Running on your machine | React app fetches from the Express + SQLite backend |
| **Live / Production** | Deployed to Vercel, Netlify, etc. | React app reads pre-exported static JSON files — no backend needed |

The workflow is: manage books locally → export to JSON → build → deploy.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Query, Recharts, React Hook Form
- **Backend (local only):** Node.js, Express, TypeScript
- **Database (local only):** SQLite via Prisma ORM
- **Book APIs:** Open Library (primary), Google Books (fallback)

---

## Local Setup

### 1. Install dependencies

Run these once after cloning:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Set up the database

```bash
cd server
npx prisma migrate dev
```

This creates the SQLite database at `server/prisma/dev.db`.

### 3. Create the server environment file

Create `server/.env` with the following content — this file is never committed to git:

```
DATABASE_URL="file:./dev.db"
PORT=3002
CLIENT_URL=http://localhost:5174
```

### 4. Seed with sample data (optional)

```bash
cd server
npx ts-node-dev --transpile-only src/prisma/seed.ts
```

Populates the database with 20 sample books so the dashboard looks complete immediately.

### 5. Run the dev servers

From the project root, run both at once:

```bash
npm run dev
```

(Backend on port 3002, frontend on port 5174.) If you'd rather run them separately in two terminals, use `npm run dev:server` and `npm run dev:client`.

Then open [http://localhost:5174](http://localhost:5174).

Note: the backend must be running for local dev even though the live site doesn't need it — the dev client always calls the live API, not the static JSON export.

---

## Adding Books (Admin Mode)

1. Go to [http://localhost:5174/admin](http://localhost:5174/admin)
2. Search for a book by title — pulls results from Open Library and Google Books
3. Select the correct result, review and edit the metadata
4. Click **Save to Library**

Admin only works locally. The live site is read-only.

---

## Deploying to a Static Host

### Step 1 — Export your data

With your local server running, run from the project root:

```bash
npm run export
```

This reads your SQLite database and writes two files:
- `client/public/data/books.json`
- `client/public/data/stats.json`

**Commit these files.** They are what the live site reads.

### Step 2 — Build the frontend

```bash
npm run build
```

The production build has `VITE_STATIC_MODE=true` baked in (via `client/.env.production`), so it reads from the JSON files instead of calling any backend.

### Step 3 — Deploy

Deploy the `client/dist/` folder to any static host:

- **Vercel:** connect the repo, set root directory to `client`, build command `npm run build`, output directory `dist`
- **Netlify:** same — root `client`, build `npm run build`, publish `dist`
- **GitHub Pages:** push `client/dist/` contents to the `gh-pages` branch

No server process is needed on the live site.

---

## Typical workflow after initial setup

```bash
# 1. Start local servers (two terminals)
npm run dev:server
npm run dev:client

# 2. Add or edit books at http://localhost:5174/admin

# 3. Export updated data to JSON
npm run export

# 4. Commit the updated JSON files
git add client/public/data/
git commit -m "Update reading data"

# 5. Build and deploy
npm run build
# then deploy client/dist/ to your host
```

---

## Project Structure

```
reading-metrics/
├── docs/screenshots/        README images
├── client/                  React frontend
│   ├── public/data/         Exported JSON (committed — live site reads from here)
│   ├── src/features/        Dashboard, books, admin, charts
│   ├── src/components/ui/   Shared UI components
│   ├── src/lib/             API client, React Query config
│   └── .env.production      Sets VITE_STATIC_MODE=true for live builds
├── server/                  Local-only backend
│   ├── src/routes/          Express API routes
│   ├── src/services/        Stats computation, book search
│   ├── src/scripts/         export.ts — generates the static JSON files
│   ├── src/prisma/          Prisma client singleton + seed data
│   └── prisma/              Schema and migrations
└── shared/                  Zod schemas and TypeScript types used by both
```
