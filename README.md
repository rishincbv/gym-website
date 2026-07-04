# Elite Performance — Gym Management Platform

Production-ready gym management platform built with React 19, Express, Supabase PostgreSQL, and Prisma.

## Architecture

```
gymwebsite/
├── frontend/          # React 19 + Vite + Tailwind v4
├── backend/           # Express + Prisma + JWT auth
├── design/stitch/     # Stitch HTML/screenshots for pixel-perfect UI
├── docs/              # Setup guides (Supabase, deployment)
└── scripts/           # Design fetch utilities
```

### Request flow

```
Browser → React (TanStack Query) → Axios → Express API
                                              ↓
                                         Service Layer
                                              ↓
                                         Repository (Prisma)
                                              ↓
                                         PostgreSQL
```

### Authentication

- **Access token**: short-lived JWT (15 min), Authorization header
- **Refresh token**: httpOnly secure cookie, rotated on refresh
- **Passwords**: bcrypt (cost 12)
- Custom auth — **not** Supabase Auth

## Prerequisites

- Node.js 20+
- [Supabase](https://supabase.com) free-tier project
- npm 10+

## Quick Start

### 1. Install dependencies

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Configure Supabase & environment

See **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for full instructions.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env with your Supabase DATABASE_URL and DIRECT_URL
```

### 3. Database setup

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Run development servers

```bash
# From project root
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

## Stitch Design Integration

Your designs: [Stitch Project](https://stitch.withgoogle.com/projects/8510852350685465056)

| Screen | Node ID | Route |
|--------|---------|-------|
| Landing | `97e5c0729ebb43f0842f970b3a4c0902` | `/` |
| Login | `36864ab64f58474ba57088f4a252c13a` | `/login` |
| Register | `05326edcbd724c549ed96facff4ad757` | `/register` |
| Dashboard | `f36a199ac3f444538ea8f9f47da2bab1` | `/dashboard` |
| Screen 5 | `84dca088a2414cdd8ca102c721b2dc85` | TBD |

### Option A: API fetch (recommended)

1. Get `STITCH_API_KEY` from [Google Stitch](https://stitch.withgoogle.com)
2. Add to `.env`: `STITCH_API_KEY=your-key`
3. Run: `npm run fetch:stitch`

### Option B: Manual export

In Stitch: right-click screen → **More** → **Export** → download ZIP or copy code to `design/stitch/raw/`.

## Development Workflow

Features are built one at a time:

1. Analyze Stitch design
2. Build pixel-perfect React UI
3. Backend API + Prisma models
4. Connect frontend ↔ backend
5. Animations, loading states, error handling
6. Responsive polish

**Current status**:

| Phase | Status |
|-------|--------|
| Stitch landing UI | ✅ Hero, programs, pricing, trainers, footer |
| Auth (register/login/refresh) | ✅ Backend + frontend wired |
| Supabase PostgreSQL schema | ✅ 18 tables, UUID PKs, migrations ready |
| Dashboard / Progress UI | 🔄 Stitch screens scaffolded |
| Forgot/reset password | ⏳ Next auth feature |
| Workout / Nutrition APIs | ⏳ Planned |
| Supabase Storage uploads | ⏳ Planned |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user (protected) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm run fetch:stitch` | Download Stitch design assets |
| `npm run db:migrate` | Run Prisma migrations (in backend/) |
| `npm run db:seed` | Seed sample data (in backend/) |

## Security

- Helmet, CORS, rate limiting, compression
- Zod validation on all inputs
- Prisma parameterized queries (SQL injection safe)
- bcrypt password hashing
- httpOnly cookies for refresh tokens (auth feature)

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway / Render |
| Database | Supabase PostgreSQL |

Production build:

```bash
npm run build --prefix frontend
npm run build --prefix backend
```
