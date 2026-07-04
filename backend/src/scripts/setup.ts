import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import dotenv from 'dotenv'

dotenv.config({ override: true })

type Step = {
  label: string
  command: string
  optional?: boolean
}

const prismaClientDir = join(process.cwd(), 'node_modules', '.prisma', 'client')
const prismaEnginePath = join(prismaClientDir, 'query_engine-windows.dll.node')
const prismaClientExists =
  existsSync(join(prismaClientDir, 'index.js')) || existsSync(prismaEnginePath)

function getExecOutput(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return String(error)
  }

  const execError = error as { message?: string; stderr?: string | Buffer; stdout?: string | Buffer }
  const stderr = execError.stderr?.toString() ?? ''
  const stdout = execError.stdout?.toString() ?? ''
  return `${execError.message ?? ''}\n${stdout}\n${stderr}`
}

function runStep(step: Step): void {
  console.log(`\n▶ ${step.label}...`)
  try {
    execSync(step.command, { stdio: 'inherit', cwd: process.cwd() })
  } catch (error) {
    const output = getExecOutput(error)
    const isPrismaLockError =
      output.includes('EPERM') || output.includes('query_engine-windows.dll.node')

    if (step.command.includes('db:generate') && (isPrismaLockError || step.optional)) {
      console.warn('\n⚠ Skipped Prisma generate (engine file locked or dev server running).')
      console.warn('  Using existing Prisma client — stop `npm run dev` to regenerate later.')
      return
    }

    if (step.optional) {
      console.warn(`\n⚠ Skipped optional step: ${step.label}`)
      return
    }

    throw error
  }
}

async function main(): Promise<void> {
  console.log('Elite Performance — Supabase setup')
  console.log('==================================')

  const databaseUrl = process.env.DATABASE_URL ?? ''
  if (
    databaseUrl.includes('YOUR_PASSWORD') ||
    databaseUrl.includes('[YOUR-PASSWORD]')
  ) {
    console.error('\n❌ Configure backend/.env — replace [YOUR-PASSWORD] with your Supabase database password.')
    console.error('   See docs/E2E_SETUP.md')
    process.exit(1)
  }

  const forceGenerate = process.argv.includes('--generate')
  const steps: Step[] = []

  if (forceGenerate || !prismaClientExists) {
    steps.push({
      label: 'Generate Prisma client',
      command: 'npm run db:generate',
      optional: true,
    })
  } else {
    console.log('\n✓ Prisma client already exists — skipping generate')
    console.log('  (Use `npm run db:setup -- --generate` to force regenerate)')
  }

  steps.push(
    { label: 'Verify database connection', command: 'npm run db:check' },
    { label: 'Push schema to Supabase', command: 'npm run db:push' },
    { label: 'Disable RLS on all tables', command: 'npm run db:disable-rls' },
    { label: 'Seed demo + admin data', command: 'npm run db:seed' },
    { label: 'Final connection check', command: 'npm run db:check' },
  )

  for (const step of steps) {
    runStep(step)
  }

  console.log('\n✅ Setup complete')
  console.log('')
  console.log('  Admin login:  http://localhost:5173/admin/login')
  console.log('  Credentials:  admin@gym.com / Password123!')
  console.log('')
  console.log('  Start app:    npm run dev   (from project root)')
  console.log('')
}

void main()
