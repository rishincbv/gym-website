import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { isStaffRole } from '@/lib/roles'
import { getDefaultRouteForRole } from '@/lib/routing'
import { ProfileMenu } from '@/components/layout/ProfileMenu'

const publicNavItems = [
  { label: 'Programs', href: '#programs', active: true },
  { label: 'Membership', href: '#membership' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Nutrition', href: '#nutrition' },
]

export function EliteNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dashboardPath = user ? getDefaultRouteForRole(user.role) : '/login'

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-surface/60 shadow-2xl backdrop-blur-xl">
      <nav
        className={cn(
          'mx-auto flex w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop',
          scrolled ? 'py-2' : 'py-4',
        )}
      >
        <Link
          to="/"
          className="font-display text-headline-md font-extrabold tracking-tighter text-on-surface"
        >
          ELITE PERFORMANCE
        </Link>

        {!isAuthenticated ? (
          <>
            <ul className="hidden items-center gap-stack-lg md:flex">
              {publicNavItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={cn(
                      'text-label-bold font-semibold transition-colors',
                      item.active
                        ? 'border-b-2 border-primary pb-1 text-primary'
                        : 'text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-stack-md">
              <Link
                to="/login"
                className="hidden text-label-bold font-semibold text-on-surface-variant transition-opacity hover:opacity-80 md:block"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary-container px-6 py-2 text-label-bold font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 transition-transform duration-200 active:scale-95"
              >
                Join Now
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-stack-md">
            {user && isStaffRole(user.role) && (
              <Link
                to="/dashboard"
                className="hidden text-label-bold font-semibold text-on-surface-variant transition-colors hover:text-on-surface md:block"
              >
                Admin
              </Link>
            )}
            <Link
              to={dashboardPath}
              className="hidden text-label-bold font-semibold text-on-surface-variant transition-colors hover:text-on-surface md:block"
            >
              {user && isStaffRole(user.role) ? 'Dashboard' : 'My Account'}
            </Link>
            <ProfileMenu settingsPath={user && isStaffRole(user.role) ? '/settings' : '/settings'} />
          </div>
        )}
      </nav>
    </header>
  )
}
