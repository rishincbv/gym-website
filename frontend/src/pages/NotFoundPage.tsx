import { ButtonLink } from '@/components/ui/ButtonLink'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-muted">Page not found</p>
      <ButtonLink to="/" className="mt-8">
        Back to Home
      </ButtonLink>
    </div>
  )
}
