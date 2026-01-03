# odoo-GlobeTrotter

Travel planner with React/Vite frontend and Express/MySQL backend. This README covers local setup and the DB bootstrap workflow.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Express (ESM), MySQL via mysql2
- Auth: JWT

## Prerequisites
- Node.js v18+
- MySQL v8+

## Setup
1) Install deps
```bash
npm install
```

2) Configure `.env` (repo root)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=globetrotter
JWT_SECRET=your-secret-key-change-in-production
```

3) Initialize DB (creates DB, tables, seeds states/cities, creates admin)
```bash
./scripts/init-db.sh

# override creds if needed
DB_USER=myuser DB_PASSWORD=mypass DB_NAME=globetrotter ./scripts/init-db.sh
```
You can also run init without starting the API: `INIT_DB_ONLY=1 node server.js`.

## Run
- Backend only: `npm run server`
- Frontend only: `npm run dev`
- Both together: `npm run dev-all`

Default admin: admin@globetrotter.com / admin

## Project notes
- DB initializer populates Indian states/cities.
- Trips and itineraries are stored in MySQL; frontend has localStorage-only mock for non-auth flows.
