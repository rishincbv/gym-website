import { useNavigate } from 'react-router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/lib/routing'

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return async (): Promise<void> => {
    try {
      await authApi.logout()
    } finally {
      logout()
      navigate(ROUTES.login, { replace: true })
    }
  }
}
