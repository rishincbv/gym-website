import type { UserRole } from '@/types/user'

export const STAFF_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'TRAINER',
  'SUPPORT',
] as const

export const MEMBER_ROLES: readonly UserRole[] = ['USER'] as const

export const ALL_ROLES: readonly UserRole[] = [
  ...MEMBER_ROLES,
  ...STAFF_ROLES,
] as const

export function isStaffRole(role: UserRole): boolean {
  return (STAFF_ROLES as readonly string[]).includes(role)
}

export function isMemberRole(role: UserRole): boolean {
  return role === 'USER'
}

export function hasRole(userRole: UserRole, allowedRoles: readonly UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}
