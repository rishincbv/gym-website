import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ override: true })

const databaseUrl = process.env.DATABASE_URL ?? ''
const directUrl = process.env.DIRECT_URL ?? ''

function maskUrl(url: string): string {
  return url.replace(/:([^:@/]+)@/, ':***@')
}

async function main(): Promise<void> {
  console.log('Checking database configuration...\n')

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is missing in backend/.env')
    process.exit(1)
  }

  if (
    databaseUrl.includes('YOUR_PASSWORD') ||
    databaseUrl.includes('[YOUR-PASSWORD]') ||
    directUrl.includes('YOUR_PASSWORD') ||
    directUrl.includes('[YOUR-PASSWORD]')
  ) {
    console.error('❌ DATABASE_URL still contains a password placeholder')
    console.error('')
    console.error('Fix:')
    console.error('  1. Supabase Dashboard → Project Settings → Database → Reset password (if needed)')
    console.error('  2. Edit backend/.env — replace [YOUR-PASSWORD] with your real password in both URLs:')
    console.error('     postgresql://postgres:YOUR_PASSWORD@db.sjkxsdfhppqfvhhvzzlp.supabase.co:5432/postgres')
    process.exit(1)
  }

  console.log(`DATABASE_URL: ${maskUrl(databaseUrl)}`)
  if (directUrl) {
    console.log(`DIRECT_URL:   ${maskUrl(directUrl)}`)
  }
  console.log('')

  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connected successfully')

    try {
      const userCount = await prisma.user.count()
      console.log(`   Users in database: ${userCount}`)
      if (userCount === 0) {
        console.log('')
        console.log('Next step: npm run db:seed')
      }
    } catch (countError) {
      const countMessage = countError instanceof Error ? countError.message : String(countError)
      if (countMessage.includes('does not exist')) {
        console.log('   Schema not applied yet — run: npm run db:push')
      } else {
        throw countError
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('❌ Database connection failed\n')
    console.error(message)
    console.error('')
    if (message.includes("Can't reach database server")) {
      console.error('Tip: Use the Supabase pooler connection string, not the direct db.*.supabase.co host.')
      console.error('     Supabase Dashboard → Connect → Session pooler (5432) for DIRECT_URL')
      console.error('     Supabase Dashboard → Connect → Transaction pooler (6543) for DATABASE_URL')
    }
    if (message.includes('authentication failed')) {
      console.error('Tip: Your database password is wrong. Reset it in Supabase → Database → Reset password.')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

void main()
