import { Link } from 'react-router'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { useAuthStore } from '@/store/auth-store'
import { isStaffRole } from '@/lib/roles'
import { useLogout } from '@/hooks/useLogout'

interface ProfileMenuProps {
  settingsPath?: string
}

export function ProfileMenu({ settingsPath = '/settings' }: ProfileMenuProps) {
  const user = useAuthStore((state) => state.user)
  const handleLogout = useLogout()

  const initials = `${user?.firstName?.[0] ?? 'U'}${user?.lastName?.[0] ?? 'S'}`
  const showStaffLink = user && isStaffRole(user.role)

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-high px-3 py-2 transition-colors hover:bg-surface-container-highest"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
            {initials}
          </div>
        )}
        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-on-surface">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-label-sm text-on-surface-variant">{user?.role}</p>
        </div>
        <MaterialIcon name="expand_more" className="hidden text-outline md:block" />
      </button>

      <div className="invisible absolute top-full right-0 z-50 mt-3 w-56 translate-y-2 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <Link
          to={settingsPath}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <MaterialIcon name="settings" />
          Settings
        </Link>
        {showStaffLink && (
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <MaterialIcon name="dashboard" />
            Admin Dashboard
          </Link>
        )}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
        >
          <MaterialIcon name="logout" />
          Sign out
        </button>
      </div>
    </div>
  )
}
