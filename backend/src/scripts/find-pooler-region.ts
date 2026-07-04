import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: new URL('../../.env', import.meta.url), override: true })

const match = process.env.DATABASE_URL?.match(/postgres(?:\.[^:]*)?:(?<pwd>[^@]+)@/)
const password = match?.groups?.pwd ?? ''

if (!password || password.includes('YOUR')) {
  console.error('Set a real password in backend/.env first')
  process.exit(1)
}

const regions = [
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-central-2',
  'eu-north-1',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-east-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'sa-east-1',
]

for (const region of regions) {
  const url = `postgresql://postgres.sjkxsdfhppqfvhhvzzlp:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`
  const prisma = new PrismaClient({ datasources: { db: { url } } })

  try {
    await prisma.$queryRaw`SELECT 1`
    console.log(`✅ Connected via pooler region: ${region}`)
    console.log('')
    console.log('Use in backend/.env:')
    console.log(
      `DATABASE_URL="postgresql://postgres.sjkxsdfhppqfvhhvzzlp:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true"`,
    )
    console.log(
      `DIRECT_URL="postgresql://postgres.sjkxsdfhppqfvhhvzzlp:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres"`,
    )
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(`${region}: ${message.slice(0, 100)}`)
    await prisma.$disconnect()
  }
}

console.error('❌ No working pooler region found — verify your database password in Supabase')
