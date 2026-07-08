import { Navigate, Outlet } from 'react-router'
import type { UserRole } from '@/types/user'
import { useAuthStore } from '@/store/auth-store'
import { hasRole } from '@/lib/roles'
import { getDefaultRouteForRole } from '@/lib/routing'

interface RoleProtectedRouteProps {
  roles: readonly UserRole[]
}

export function RoleProtectedRoute({ roles }: RoleProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasRole(user.role, roles)) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return <Outlet />
}
