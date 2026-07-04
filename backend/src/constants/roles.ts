import { Role } from '@prisma/client'

export const STAFF_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.MANAGER,
  Role.TRAINER,
  Role.SUPPORT,
]

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role)
}
