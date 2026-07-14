import { Link } from 'react-router'
import { ROUTES } from '@/lib/routing'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

/**
 * Legacy OAuth redirect landing page.
 * Google Login now uses the GIS popup + ID token flow on /login.
 */
export function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-dim px-4">
      <div className="glass-panel w-full max-w-md rounded-24 p-8 text-center">
        <MaterialIcon name="login" className="mx-auto mb-4 text-4xl text-primary-container" />
        <h1 className="font-display text-headline-lg-mobile mb-2 text-on-surface">
          Continue on the login page
        </h1>
        <p className="mb-6 text-on-surface-variant">
          Google sign-in uses a secure popup. Return to login and choose Google Login.
        </p>
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
