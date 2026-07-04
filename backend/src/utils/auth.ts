import { randomBytes } from 'node:crypto'

export function generateRefreshToken(): string {
  return randomBytes(48).toString('hex')
}

import type { Role, UserStatus } from '@prisma/client'

export function toPublicUser(user: {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status?: UserStatus
  profile?: { avatarUrl: string | null } | null
}) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status ?? 'ACTIVE',
    avatarUrl: user.profile?.avatarUrl ?? null,
  }
}
