import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { authApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { getLoginRedirectPath } from '@/lib/routing'
import { requestGoogleIdToken } from '@/lib/auth/google'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwOOpstwLTw9vDcNn69kYbFK2YKDbkjoDWaMd5n6xL7iLs8q_MCVRUtgHxeJEvej3N4q0rSSCnSx3omkZaa_o4KcJFn1yXlIRY_CPLJA3isyOiIcl1SX9NyyuhTm4DicGgi8JWTwyJkcEAJvp3VXe1dTAW3qOY18W3LipufFz_q4zXWrbDYdq-qHpMfttx5Z6MpzfjYXINOqSkODFRGj_FdSo0Q3ysha_-gyCMU_PahcPnMRU1R6FE'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

function getGoogleErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message
    if (/popup|closed|cancelled|canceled|blocked/i.test(message)) {
      return message
    }
    return message
  }
  return getApiErrorMessage(error)
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((state) => state.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  const fromPath =
    typeof location.state === 'object' &&
      location.state !== null &&
      'from' in location.state &&
      typeof location.state.from === 'string'
      ? location.state.from
      : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setApiError(null)
    try {
      const session = await authApi.login(values)
      setSession(session.user, session.accessToken)
      navigate(getLoginRedirectPath(session.user.role, fromPath), { replace: true })
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  const handleGoogleLogin = async (): Promise<void> => {
    if (googleLoading || isSubmitting) return

    setApiError(null)
    setGoogleLoading(true)
    try {
      const idToken = await requestGoogleIdToken()
      const session = await authApi.loginWithGoogle(idToken)
      setSession(session.user, session.accessToken)
      navigate(getLoginRedirectPath(session.user.role, fromPath), { replace: true })
    } catch (error) {
      setApiError(getGoogleErrorMessage(error))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-[#0b0b0b]/55" />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80" />

      <header className="relative z-20 flex items-center px-6 py-5 md:px-10">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary-container shadow-lg shadow-primary-container/30 transition-transform group-hover:scale-105">
            <MaterialIcon name="fitness_center" className="text-[18px] text-white" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-white">
            Elite Performance
          </span>
        </Link>
      </header>

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl border border-white/10 bg-[rgba(18,18,22,0.72)] p-8 shadow-2xl backdrop-blur-2xl md:p-10">
            <div className="mb-8">
              <h1 className="font-display text-[28px] font-bold tracking-tight text-white md:text-[32px]">
                Welcome Back
              </h1>
              <p className="mt-2 text-[15px] text-white/55">
                Enter your credentials to continue
              </p>
            </div>

            {apiError && (
              <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {apiError}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/60">
                  Email Address
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="mail"
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[20px] text-white/35"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@premium.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pr-4 pl-11 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-sm text-error">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/60">
                  Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="lock"
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[20px] text-white/35"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pr-12 pl-11 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-white/35 transition-colors hover:text-white/70"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-error">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-0.5">
                <label htmlFor="remember" className="flex cursor-pointer items-center gap-2.5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="size-4 rounded border-white/20 bg-black/40 text-secondary focus:ring-secondary/40"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-white/55">Remember Me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-secondary transition-colors hover:text-secondary-fixed"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="mt-1 flex w-full items-center justify-center rounded-xl bg-secondary py-3.5 text-[15px] font-bold text-on-secondary shadow-[0_0_24px_rgba(74,225,118,0.25)] transition hover:bg-secondary-fixed hover:shadow-[0_0_28px_rgba(74,225,118,0.4)] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <MaterialIcon name="sync" className="animate-spin" />
                ) : (
                  'Login to Dashboard'
                )}
              </motion.button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-semibold tracking-[0.14em] text-white/35 uppercase">
                Secure Login
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={() => void handleGoogleLogin()}
              disabled={googleLoading || isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-[15px] font-medium text-white transition hover:bg-white/10 disabled:opacity-70"
            >
              {googleLoading ? (
                <MaterialIcon name="sync" className="animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  Google Login
                </>
              )}
            </button>

            <p className="mt-7 text-center text-sm text-white/50">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-secondary transition-colors hover:text-secondary-fixed"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.nav
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <a href="#privacy" className="transition-colors hover:text-white/70">
            Privacy Policy
          </a>
          <a href="#terms" className="transition-colors hover:text-white/70">
            Terms of Service
          </a>
          <a href="#support" className="transition-colors hover:text-white/70">
            Support
          </a>
        </motion.nav>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.455 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}
