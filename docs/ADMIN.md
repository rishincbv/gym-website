# Admin Panel — Module 1

Enterprise admin foundation for the Elite Performance gym platform.

## Module 1 Delivered

- Secure admin login at `/admin/login`
- Staff-only route protection (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `TRAINER`, `SUPPORT`)
- Admin shell: sidebar, navbar, breadcrumbs, search, notifications, profile menu, theme switcher
- Responsive drawer + collapsible sidebar
- Dashboard overview with live metrics from PostgreSQL
- RBAC schema: permissions, role permissions, audit logs, login history, system settings
- Auth hardening: remember me, account status checks, login auditing, token refresh logging

## Access

1. Run migrations and seed:

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

2. Start the app from project root:

```bash
npm run dev
```

3. Open:

- Admin login: http://localhost:5173/admin/login
- Admin dashboard: http://localhost:5173/admin

**Demo admin:** `admin@gym.com` / `Password123!`

## API

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/admin/dashboard/overview` | `dashboard.read` | Dashboard metrics & charts |

All `/api/admin/*` routes require:

1. Valid JWT (`Authorization: Bearer`)
2. Staff role
3. Module permission (except `SUPER_ADMIN`, which bypasses permission checks)

## Frontend Structure

```
frontend/src/features/admin/
├── components/     # Shell UI (sidebar, navbar, charts, stat cards)
├── config/nav.ts   # Admin navigation map
├── hooks/          # TanStack Query hooks
├── layouts/        # AdminLayout
└── pages/          # Login, dashboard, coming-soon placeholders
```

## Next Modules (planned)

1. User Management
2. Membership Management
3. Workout Management
4. Nutrition Management
5. Trainer Management
6. Gallery / Testimonials / Contact
7. Notifications / Reports / Settings / Roles UI

## Security Notes

- Refresh tokens remain httpOnly cookies on `/api/auth`
- Admin actions are written to `audit_logs`
- Logins are stored in `login_history` with IP and device metadata
- Suspended, banned, and inactive accounts cannot authenticate
