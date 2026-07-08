import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { authApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
    if (!token) {
      setApiError('Reset token is missing or invalid.')
      return
    }

    setApiError(null)
    try {
      await authApi.resetPassword({ token, password: values.password })
      navigate('/login', {
        replace: true,
        state: { message: 'Password reset successful. Please sign in.' },
      })
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim p-6">
      <div className="glass-panel w-full max-w-md rounded-24 p-8 md:p-10">
        <div className="mb-8 text-center">
          <span className="text-headline-md font-extrabold tracking-tighter text-on-surface">
            ELITE PERFORMANCE
          </span>
          <h1 className="font-display text-headline-lg-mobile mt-6 mb-2">Reset Password</h1>
          <p className="text-on-surface-variant">Choose a new password for your account.</p>
        </div>

        {!token && (
          <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            Reset token is missing. Please use the link from your email.
          </div>
        )}

        {apiError && (
          <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {apiError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="password"
              placeholder="New password"
              className="custom-input w-full rounded-xl px-4 py-3"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-error">{errors.password.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm new password"
              className="custom-input w-full rounded-xl px-4 py-3"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-4 font-semibold text-on-primary-container transition-all active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? <MaterialIcon name="sync" className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          <Link to="/login" className="font-bold text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
