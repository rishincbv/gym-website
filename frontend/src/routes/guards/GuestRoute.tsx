import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/auth-store'
import { getLoginRedirectPath } from '@/lib/routing'

export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (isAuthenticated && user) {
    const from =
      typeof location.state === 'object' &&
      location.state !== null &&
      'from' in location.state &&
      typeof location.state.from === 'string'
        ? location.state.from
        : null

    return <Navigate to={getLoginRedirectPath(user.role, from)} replace />
  }

  return <Outlet />
}
