import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ override: true })

type TableRlsStatus = {
  table_name: string
  rls_enabled: boolean
}

async function main(): Promise<void> {
  console.log('Disabling RLS on all public tables...\n')

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()

    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE r RECORD;
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
    `)

    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE r RECORD;
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
    `)

    const rows = await prisma.$queryRaw<TableRlsStatus[]>`
      SELECT
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
      ORDER BY c.relname
    `

    const stillEnabled = rows.filter((row) => row.rls_enabled)

    console.log(`✅ RLS disabled on ${rows.length} public table(s)`)

    if (stillEnabled.length > 0) {
      console.warn(
        `⚠ RLS still enabled on: ${stillEnabled.map((row) => row.table_name).join(', ')}`,
      )
      process.exit(1)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('❌ Failed to disable RLS\n')
    console.error(message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

void main()
