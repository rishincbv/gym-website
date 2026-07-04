-- Disable Row Level Security on all public tables.
-- Run in Supabase Dashboard → SQL Editor, or via: npm run db:disable-rls
--
-- This project uses Express + Prisma with custom JWT auth (not Supabase Auth).
-- RLS is not needed on app tables and can block Supabase REST/Realtime access.

-- 1) Drop existing RLS policies on public tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      r.policyname,
      r.schemaname,
      r.tablename
    );
  END LOOP;
END $$;

-- 2) Disable RLS on every public table
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format(
      'ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY',
      r.tablename
    );
  END LOOP;
END $$;

-- 3) Verify — should return zero rows with rls_enabled = true
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY c.relname;
