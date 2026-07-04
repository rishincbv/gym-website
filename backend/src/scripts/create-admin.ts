/**
 * Create or promote a staff admin user.
 *
 * Usage (from backend/):
 *   ADMIN_EMAIL=you@company.com ADMIN_PASSWORD='SecurePass1' npm run admin:create
 *
 * PowerShell:
 *   $env:ADMIN_EMAIL="you@company.com"; $env:ADMIN_PASSWORD="SecurePass1"; npm run admin:create
 */
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { PrismaClient, Role, UserStatus } from '@prisma/client'

dotenv.config({ override: true })

const prisma = new PrismaClient()

const STAFF_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.MANAGER,
  Role.TRAINER,
  Role.SUPPORT,
]

async function main(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@gym.com').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD ?? 'Password123!'
  const roleName = (process.env.ADMIN_ROLE ?? 'SUPER_ADMIN').toUpperCase() as Role
  const firstName = process.env.ADMIN_FIRST_NAME ?? 'Admin'
  const lastName = process.env.ADMIN_LAST_NAME ?? 'User'

  if (!email.includes('@')) {
    throw new Error('ADMIN_EMAIL must be a valid email address')
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters')
  }

  if (!STAFF_ROLES.includes(roleName)) {
    throw new Error(`ADMIN_ROLE must be one of: ${STAFF_ROLES.join(', ')}`)
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName,
      lastName,
      role: roleName,
      status: UserStatus.ACTIVE,
      isVerified: true,
      deletedAt: null,
    },
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: roleName,
      status: UserStatus.ACTIVE,
      isVerified: true,
      profile: { create: {} },
      settings: { create: {} },
    },
  })

  console.log('')
  console.log('✅ Admin user ready')
  console.log('──────────────────────────────')
  console.log(`  Email:    ${email}`)
  console.log(`  Password: ${password}`)
  console.log(`  Role:     ${roleName}`)
  console.log(`  User ID:  ${user.id}`)
  console.log('')
  console.log('  Login:    http://localhost:5173/admin/login')
  console.log('')
}

main()
  .catch((error: unknown) => {
    console.error('❌ Failed to create admin user')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
