import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { authApi } from '@/api/auth'
import { getApiErrorMessage } from '@/api/client'

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
    setApiError(null)
    setSuccessMessage(null)
    try {
      const message = await authApi.forgotPassword(values.email)
      setSuccessMessage(message)
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
          <h1 className="font-display text-headline-lg-mobile mt-6 mb-2">Forgot Password</h1>
          <p className="text-on-surface-variant">
            Enter your email and we&apos;ll send reset instructions if an account exists.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-on-surface">
            {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-4 font-semibold text-on-primary-container transition-all active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? <MaterialIcon name="sync" className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
