import type { UserRole } from '@/types/user'
import { isStaffRole } from '@/lib/roles'

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  profile: '/profile',
  progress: '/progress',
  dashboard: '/dashboard',
} as const

export function getDefaultRouteForRole(role: UserRole): string {
  if (isStaffRole(role)) {
    return ROUTES.dashboard
  }
  return ROUTES.profile
}

export function getLoginRedirectPath(
  role: UserRole,
  fromPath?: string | null,
): string {
  if (fromPath && fromPath !== ROUTES.login && fromPath !== ROUTES.register) {
    return fromPath
  }
  return getDefaultRouteForRole(role)
}
