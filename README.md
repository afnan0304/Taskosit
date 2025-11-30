# Taskosit — Smart Task Manager

A polished full‑stack task manager built with the MERN stack (MongoDB, Express, React, Node.js). Includes authentication, advanced task workflows, analytics, and a modern UI powered by Tailwind.

## Features

- Authentication with JWT (access + refresh)
- Task CRUD, status and priority, bulk ops, archive
- Dashboard with progress and achievements
- Analytics: productivity, completion trends, priority breakdown
- Profile management with Security and Preferences tabs
- Input validation, rate limiting, and CORS

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Frontend: React + Vite, React Router, Tailwind CSS, Axios

## Monorepo Structure

```
Task-Manager/
├─ back/              # Express API
│  ├─ config/         # DB config
│  ├─ controllers/    # Route handlers
│  ├─ Middlewares/    # Auth, validators, error handler
│  ├─ models/         # Mongoose models
│  ├─ Router/         # API routes
│  ├─ scripts/        # Dev utilities (DB inspect/wipe)
│  ├─ .env.example
│  └─ server.js
├─ front/             # React app
│  ├─ public/         # Static assets (logo)
│  ├─ src/            # Pages, components, api
│  ├─ .env.example
│  └─ vite.config.js
├─ .gitattributes
├─ .gitignore
├─ LICENSE
└─ README.md
```

## Quick Start

Prerequisites:
- Node.js 18+
- pnpm (recommended) or npm/yarn
- MongoDB (local or Atlas)

Install deps (root scripts wire up both apps):

```bash
pnpm install
```

Configure environments:

- Backend: copy and edit `back/.env.example` → `back/.env`
- Frontend (optional for split origins): copy `front/.env.example` → `front/.env` and set `VITE_API_BASE`

Run dev (both servers):

```bash
pnpm dev
```

Or run separately:

```bash
pnpm dev:back
pnpm dev:front
```

Build and run:

```bash
pnpm build   # builds frontend
pnpm start   # starts backend
```

Default URLs:
- API: http://localhost:5000
- App: http://localhost:5173

## Environment Variables

Backend (`back/.env`):

```
MONGO_URI=mongodb://127.0.0.1:27017/taskly
JWT_SECRET=change_me_access_secret
REFRESH_SECRET=change_me_refresh_secret
REFRESH_TOKEN_HASH_SECRET=change_me_hash_secret
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Frontend (`front/.env` – optional):

```
VITE_API_BASE=http://localhost:5000/api
```

If not set, the frontend uses Vite’s dev proxy to `/api`.

## API Summary

Auth (`/api/auth`): register, login, refresh-token, logout

Tasks (`/api/task`): list, create, update status, delete, stats, analytics

User (`/api/user`): get profile, update profile, change password

## Security

- Password hashing with bcrypt
- JWT access/refresh tokens with rotation
- Rate limiting on sensitive routes
- Validation and sanitization
- CORS configured via `FRONTEND_URL`

## Contributing

PRs welcome! Please open an issue to discuss major changes.

1. Fork the repo
2. Create a branch: `git checkout -b feat/awesome`
3. Commit: `git commit -m "feat: add awesome"`
4. Push: `git push origin feat/awesome`
5. Open a PR

## License

MIT © 2025 [afnan0304](https://github.com/afnan0304)

If this project helps you, please ⭐ it!

