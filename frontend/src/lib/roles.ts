import type { UserRole } from '@/types/user'

const STAFF_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'TRAINER',
  'SUPPORT',
]

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role)
}
