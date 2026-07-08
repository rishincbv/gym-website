import { NavLink } from 'react-router'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { cn } from '@/lib/utils'
import { userNavLinks } from '@/config/user-nav'
import { useAuthStore } from '@/store/auth-store'
import { useLogout } from '@/hooks/useLogout'

export function EliteSidebar() {
  const user = useAuthStore((state) => state.user)
  const handleLogout = useLogout()

  const initials = `${user?.firstName?.[0] ?? 'U'}${user?.lastName?.[0] ?? 'S'}`

  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-full w-64 flex-col border-r border-outline-variant/20 bg-surface-container-lowest px-stack-md py-stack-lg md:flex">
      <div className="mb-10 px-stack-sm">
        <h1 className="text-headline-md font-extrabold tracking-tighter text-on-surface">
          ELITE PERFORMANCE
        </h1>
      </div>

      <nav className="grow space-y-2">
        {userNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-stack-sm py-3 font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
              )
            }
          >
            <MaterialIcon name={link.icon} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="glass-card mt-auto rounded-2xl p-4">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
              {initials}
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-label-bold font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-label-sm text-on-surface-variant">Member</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <MaterialIcon name="logout" className="text-base" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
