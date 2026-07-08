import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/routing'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
