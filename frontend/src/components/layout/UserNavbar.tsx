import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { NotificationCenter } from '@/features/admin/components/NotificationCenter'
import { ProfileMenu } from '@/components/layout/ProfileMenu'

export function UserNavbar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest/80 px-4 py-4 backdrop-blur-xl md:px-margin-desktop">
      <div>
        <p className="text-label-sm font-semibold tracking-widest text-primary uppercase">
          Member Portal
        </p>
        <h2 className="text-headline-md font-bold text-on-surface">Your Performance Hub</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
          aria-label="Workout progress"
        >
          <MaterialIcon name="monitoring" />
        </button>
        <NotificationCenter />
        <ProfileMenu settingsPath="/settings" />
      </div>
    </header>
  )
}
