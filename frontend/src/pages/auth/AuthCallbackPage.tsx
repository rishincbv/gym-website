import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { createClient } from '@/lib/supabase/client'
import { authApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { getLoginRedirectPath, ROUTES } from '@/lib/routing'
import { PageLoader } from '@/components/ui/PageLoader'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const completeSignIn = async (): Promise<void> => {
      try {
        const supabase = createClient()
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const oauthError = params.get('error_description') ?? params.get('error')

        if (oauthError) {
          throw new Error(oauthError)
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            throw exchangeError
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (!session?.access_token) {
          throw new Error('Google sign-in did not return a valid session')
        }

        const appSession = await authApi.loginWithGoogle(session.access_token)
        await supabase.auth.signOut()

        if (cancelled) {
          return
        }

        setSession(appSession.user, appSession.accessToken)
        navigate(getLoginRedirectPath(appSession.user.role), { replace: true })
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err))
        }
      }
    }

    void completeSignIn()

    return () => {
      cancelled = true
    }
  }, [navigate, setSession])

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-dim px-4">
        <div className="glass-panel w-full max-w-md rounded-24 p-8 text-center">
          <MaterialIcon name="error" className="mx-auto mb-4 text-4xl text-error" />
          <h1 className="font-display text-headline-lg-mobile mb-2 text-on-surface">
            Google sign-in failed
          </h1>
          <p className="mb-6 text-on-surface-variant">{error}</p>
          <Link
            to={ROUTES.login}
            className="inline-flex rounded-xl bg-primary-container px-5 py-3 font-semibold text-on-primary-container"
          >
            Back to login
          </Link>
        </div>
      </main>
    )
  }

  return <PageLoader />
}
