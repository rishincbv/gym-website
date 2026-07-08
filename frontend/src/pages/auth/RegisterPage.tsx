import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/auth-store'
import { getLoginRedirectPath } from '@/lib/routing'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setApiError(null)
    try {
      const session = await authApi.register(values)
      setSession(session.user, session.accessToken)
      navigate(getLoginRedirectPath(session.user.role), { replace: true })
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="glass-panel rounded-24 p-8 md:p-10">
          <div className="mb-8 text-center">
            <span className="text-headline-md font-extrabold tracking-tighter text-on-surface">
              ELITE PERFORMANCE
            </span>
            <h1 className="font-display text-headline-lg-mobile mt-6 mb-2">Create Account</h1>
            <p className="text-on-surface-variant">
              Join the elite performance ecosystem today.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {apiError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  placeholder="First name"
                  className="custom-input w-full rounded-xl px-4 py-3"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Last name"
                  className="custom-input w-full rounded-xl px-4 py-3"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="custom-input w-full rounded-xl px-4 py-3"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="custom-input w-full rounded-xl px-4 py-3"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-error">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-container py-4 font-semibold text-on-primary-container transition-all active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
