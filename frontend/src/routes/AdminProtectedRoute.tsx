import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/auth-store'
import { isStaffRole } from '@/lib/roles'

export function AdminProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!user || !isStaffRole(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
