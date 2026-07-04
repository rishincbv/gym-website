import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { authApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwOOpstwLTw9vDcNn69kYbFK2YKDbkjoDWaMd5n6xL7iLs8q_MCVRUtgHxeJEvej3N4q0rSSCnSx3omkZaa_o4KcJFn1yXlIRY_CPLJA3isyOiIcl1SX9NyyuhTm4DicGgi8JWTwyJkcEAJvp3VXe1dTAW3qOY18W3LipufFz_q4zXWrbDYdq-qHpMfttx5Z6MpzfjYXINOqSkODFRGj_FdSo0Q3ysha_-gyCMU_PahcPnMRU1R6FE'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

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
      navigate('/dashboard')
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col bg-surface-dim md:flex-row">
      <section className="relative hidden h-full w-1/2 items-center justify-center overflow-hidden md:flex">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="glow-overlay absolute inset-0 z-20" />
        <motion.div
          className="relative z-30 max-w-2xl px-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display-hero text-display-hero mb-6 text-white uppercase">
            Elite
            <br />
            Starts Here.
          </h1>
          <p className="text-body-lg border-l-4 border-primary py-2 pl-6 text-on-surface-variant italic">
            &quot;The only limit to your impact is your imagination and commitment.&quot;
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div className="h-1 w-12 bg-primary" />
            <span className="text-label-bold font-semibold tracking-widest uppercase">
              Performance Ecosystem
            </span>
          </div>
        </motion.div>
      </section>

      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-surface-dim p-6 md:w-1/2 md:p-12">
        <div className="relative z-40 w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <span className="text-headline-md font-extrabold tracking-tighter text-on-surface">
              ELITE PERFORMANCE
            </span>
          </div>

          <div className="glass-panel rounded-24 p-8 shadow-2xl md:p-10">
            <div className="mb-8">
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-2 text-on-surface">
                Welcome Back
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Enter your credentials to access your performance dashboard.
              </p>
            </div>

            {apiError && (
              <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {apiError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-label-bold font-semibold text-on-surface-variant uppercase"
                >
                  Email Address
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="mail"
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-outline"
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    className="custom-input text-body-md w-full rounded-xl py-4 pr-4 pl-12 text-on-surface placeholder:text-outline-variant"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-error">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-label-bold font-semibold text-on-surface-variant uppercase"
                  >
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-label-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <MaterialIcon
                    name="lock"
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-outline"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="custom-input text-body-md w-full rounded-xl py-4 pr-12 pl-12 text-on-surface placeholder:text-outline-variant"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                  >
                    <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-error">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="size-5 rounded border-outline-variant bg-surface-container-high text-primary-container focus:ring-primary-container"
                  {...register('rememberMe')}
                />
                <label
                  htmlFor="remember"
                  className="text-body-md ml-3 cursor-pointer text-on-surface-variant"
                >
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-glow w-full rounded-xl bg-primary-container py-4 font-semibold text-on-primary-container transition-all duration-300 active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <MaterialIcon name="sync" className="animate-spin" />
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-label-sm">
                <span className="bg-transparent px-4 font-semibold tracking-widest text-outline-variant uppercase backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-high py-4 font-semibold text-on-surface transition-all duration-200 hover:bg-surface-container-highest"
            >
              Google Login
            </button>

            <div className="mt-8 text-center">
              <p className="text-body-md text-on-surface-variant">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="ml-1 font-bold text-primary hover:underline">
                  Create Account
                </Link>
              </p>
              <p className="mt-4 text-xs text-on-surface-variant">
                Demo login: demo@gym.com / Password123!
                <br />
                Or create an account — password needs 8+ chars, 1 uppercase &amp; 1 number.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
