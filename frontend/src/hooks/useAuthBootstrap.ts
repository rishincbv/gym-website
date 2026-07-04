import { useEffect } from 'react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth-store'

export function useAuthBootstrap(): void {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setSession = useAuthStore((state) => state.setSession)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (!isAuthenticated) return

    authApi
      .refresh()
      .then((session) => setSession(session.user, session.accessToken))
      .catch(() => logout())
  }, [isAuthenticated, logout, setSession])
}
