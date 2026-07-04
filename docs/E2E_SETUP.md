# End-to-End Setup — Supabase + Admin User

Complete workflow to connect Supabase, create tables, seed admin credentials, and run the app.

---

## Architecture (clean layers)

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)                                    │
│  /admin/login  →  Axios  →  /api/auth/login                 │
│  /admin        →  Axios  →  /api/admin/dashboard/overview   │
└───────────────────────────┬─────────────────────────────────┘
                            │ JWT + httpOnly refresh cookie
┌───────────────────────────▼─────────────────────────────────┐
│  BACKEND (Express)                                          │
│  Routes → Controllers → Services → Repositories → Prisma    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  SUPABASE PostgreSQL                                        │
│  users · permissions · audit_logs · workouts · memberships  │
└─────────────────────────────────────────────────────────────┘
```

**Auth is custom JWT** (not Supabase Auth). Supabase provides PostgreSQL + Storage only.

---

## Step 1 — Supabase project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Project ref: `sjkxsdfhppqfvhhvzzlp`
3. **Project Settings → Database → Reset database password** (save it somewhere safe)

---

## Step 2 — Connection strings

1. Click **Connect** (top bar of project)
2. Copy **Transaction pooler** (port `6543`) → `DATABASE_URL`
3. Copy **Session pooler** (port `5432`) → `DIRECT_URL`

Edit **`backend/.env`**:

```env
DATABASE_URL="postgresql://postgres.sjkxsdfhppqfvhhvzzlp:YOUR_REAL_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.sjkxsdfhppqfvhhvzzlp:YOUR_REAL_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"

SUPABASE_URL="https://sjkxsdfhppqfvhhvzzlp.supabase.co"
SUPABASE_ANON_KEY="your-anon-or-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Edit **`frontend/.env.local`**:

```env
VITE_API_URL=/api
VITE_SUPABASE_URL=https://sjkxsdfhppqfvhhvzzlp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

> URL-encode special characters in passwords (`@` → `%40`, `#` → `%23`).

---

## Step 3 — Install dependencies

From project root:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

---

## Step 4 — One-command setup (recommended)

**Stop the dev server first** (Ctrl+C in any terminal running `npm run dev`).  
On Windows, Prisma cannot regenerate while the backend holds the query engine DLL.

From project root:

```bash
npm run db:setup
```

This runs in order:

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `db:generate` | Generate Prisma client from schema |
| 2 | `db:check` | Test Supabase connection |
| 3 | `db:push` | Create/update all tables in PostgreSQL |
| 4 | `db:seed` | Seed admin, demo user, permissions, sample data |
| 5 | `db:check` | Confirm connection + user count |

### Manual commands (same result)

```bash
cd backend
npm run db:generate
npm run db:check
npx prisma db push
npm run db:seed
npm run db:check
```

---

## Step 5 — Default admin credentials (from seed)

| Field | Value |
|-------|--------|
| **Email** | `admin@gym.com` |
| **Password** | `Password123!` |
| **Role** | `SUPER_ADMIN` |
| **Login URL** | http://localhost:5173/admin/login |

### Demo member (optional)

| Email | Password | Role |
|-------|----------|------|
| `demo@gym.com` | `Password123!` | `USER` |

---

## Step 6 — Create your own admin user

**Bash / Git Bash:**

```bash
ADMIN_EMAIL=you@company.com ADMIN_PASSWORD='YourSecure1' npm run admin:create
```

**PowerShell:**

```powershell
$env:ADMIN_EMAIL="you@company.com"
$env:ADMIN_PASSWORD="YourSecure1"
$env:ADMIN_ROLE="SUPER_ADMIN"
npm run admin:create
```

Optional env vars:

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_EMAIL` | `admin@gym.com` | Admin email |
| `ADMIN_PASSWORD` | `Password123!` | Plain password (hashed with bcrypt) |
| `ADMIN_ROLE` | `SUPER_ADMIN` | `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `TRAINER`, `SUPPORT` |
| `ADMIN_FIRST_NAME` | `Admin` | Display name |
| `ADMIN_LAST_NAME` | `User` | Display name |

---

## Step 7 — Verify in Supabase SQL Editor

Open **Supabase → SQL Editor**, paste from:

`backend/scripts/sql/verify-setup.sql`

Key query — list admin users:

```sql
SELECT email, role, status, is_verified, created_at
FROM users
WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER', 'SUPPORT')
  AND deleted_at IS NULL;
```

Promote existing user to admin:

```sql
UPDATE users
SET role = 'SUPER_ADMIN', status = 'ACTIVE', is_verified = true
WHERE email = 'your@email.com';
```

---

## Step 8 — Run the app

From project root:

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Admin login | http://localhost:5173/admin/login |
| Admin dashboard | http://localhost:5173/admin |
| API health | http://localhost:5000/api/health |
| Prisma Studio | `cd backend && npm run db:studio` |

---

## Step 9 — End-to-end test checklist

```bash
# 1. Health + DB
curl http://localhost:5000/api/health

# 2. Admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gym.com\",\"password\":\"Password123!\"}" \
  -c cookies.txt

# 3. Admin dashboard (replace TOKEN)
curl http://localhost:5000/api/admin/dashboard/overview \
  -H "Authorization: Bearer TOKEN"
```

In browser:

1. Go to `/admin/login`
2. Sign in with `admin@gym.com` / `Password123!`
3. Dashboard should load live stats

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `EPERM` on `query_engine-windows.dll.node` | Stop `npm run dev`, then rerun setup. Or: `Get-Process node \| Stop-Process -Force` |
| `YOUR_PASSWORD` in error | Set real password in `backend/.env` |
| `Can't reach database server` | Use **pooler** URLs from Supabase Connect, not `db.*.supabase.co` |
| `authentication failed` | Wrong password — reset in Supabase → Database |
| `This account does not have admin access` | User role is `USER` — run `npm run admin:create` or SQL UPDATE |
| `Database tables are missing` | Run `npm run db:push` |
| Login works but dashboard 403 | Run `npm run db:seed` (seeds permissions) |

Diagnostic:

```bash
npm run db:check
```

---

## NPM scripts reference

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run db:setup` | root | Full Supabase + seed workflow |
| `npm run db:check` | root | Test DB connection |
| `npm run db:push` | root | Sync Prisma schema → PostgreSQL |
| `npm run db:seed` | root | Seed admin + demo data |
| `npm run admin:create` | root | Create/promote admin user |
| `npm run dev` | root | Start frontend + backend |

---

## Security notes (production)

- Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to long random strings
- Never commit `backend/.env` or expose `SUPABASE_SERVICE_ROLE_KEY` to frontend
- Set `COOKIE_SECURE=true` when deployed over HTTPS
- Use strong admin passwords (8+ chars, uppercase + number minimum)
