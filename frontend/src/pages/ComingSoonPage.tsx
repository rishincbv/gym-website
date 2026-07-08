import { useLocation } from 'react-router'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { adminNavSections } from '@/features/admin/config/nav'
import { userNavLinks } from '@/config/user-nav'

interface ComingSoonPageProps {
  audience?: 'admin' | 'user'
}

export function ComingSoonPage({ audience = 'user' }: ComingSoonPageProps) {
  const location = useLocation()

  const navItem =
    audience === 'admin'
      ? adminNavSections
          .flatMap((section) => section.items)
          .find((item) => item.to === location.pathname)
      : userNavLinks.find((item) => item.to === location.pathname)

  const title = navItem?.label ?? 'Module'

  return (
    <div className="glass-card flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-outline-variant/20 p-10 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary-container/20 text-primary">
        <MaterialIcon name="construction" className="text-4xl" />
      </div>
      <h2 className="text-headline-lg mb-3 font-bold text-on-surface">{title}</h2>
      <p className="max-w-lg text-body-md text-on-surface-variant">
        This module is queued for the next development phase. Authentication, routing, and role-based
        access are already in place.
      </p>
    </div>
  )
}
