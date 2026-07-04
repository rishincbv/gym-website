# Supabase Setup Guide

This project uses **Supabase Free Tier** for PostgreSQL and Storage. We do **not** use Supabase Auth — authentication is custom JWT via Express.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Choose an organization, name (e.g. `elite-fitness`), database password, and region.
4. Wait for the project to finish provisioning.

## 2. Get Database Connection Strings

In **Project Settings → Database → Connection string**:

| Variable | Connection type | Port | Used by |
|----------|-----------------|------|---------|
| `DATABASE_URL` | **Transaction pooler** (PgBouncer) | `6543` | Express app at runtime |
| `DIRECT_URL` | **Direct** or **Session pooler** | `5432` | Prisma migrations |

Add `?pgbouncer=true` to the pooler URL for Prisma.

**Example `.env`:**

```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

## 3. Configure Backend Environment

```bash
cp backend/.env.example backend/.env
```

Fill in `DATABASE_URL`, `DIRECT_URL`, and JWT secrets.

## 4. Run Migrations & Seed

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 5. Supabase Storage Buckets

In **Storage → New bucket**, create:

| Bucket | Public | Purpose |
|--------|--------|---------|
| `avatars` | Yes | Profile pictures |
| `exercises` | Yes | Exercise images |
| `trainers` | Yes | Trainer photos |
| `gallery` | Yes | Gallery images |
| `documents` | No | Membership documents |

Add to `backend/.env`:

```env
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Keys are in **Project Settings → API**.

## 6. Storage Policies (RLS)

For public buckets, allow read for everyone and write for authenticated service role only (handled server-side with `SUPABASE_SERVICE_ROLE_KEY`).

Example policy for `avatars` (read):

```sql
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

Upload/delete APIs will use the service role key from the backend — never expose it to the frontend.

## 7. Verify Connection

```bash
cd backend
npx prisma db pull   # optional: introspect
npx prisma studio    # browse data
```

Start the API:

```bash
npm run dev
curl http://localhost:5000/api/health
```

## Production Notes

- Set `COOKIE_SECURE=true` when deployed over HTTPS.
- Use strong random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- On Render/Railway, set all env vars from this guide.
- Prisma migrations should run in CI/CD before deploy (`npx prisma migrate deploy`).
