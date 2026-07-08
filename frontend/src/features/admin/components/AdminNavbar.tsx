import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { AdminBreadcrumb } from '@/features/admin/components/AdminBreadcrumb'
import { AdminSearchBar } from '@/features/admin/components/AdminSearchBar'
import { NotificationCenter } from '@/features/admin/components/NotificationCenter'
import { ProfileMenu } from '@/components/layout/ProfileMenu'
import { ThemeSwitcher } from '@/features/admin/components/ThemeSwitcher'
import { useThemeStore } from '@/store/theme-store'

export function AdminNavbar() {
  const toggleSidebarCollapsed = useThemeStore((state) => state.toggleSidebarCollapsed)
  const toggleMobileSidebar = useThemeStore((state) => state.toggleMobileSidebar)

  return (
    <header className="sticky top-0 z-40 mb-stack-lg rounded-2xl border border-outline-variant/20 bg-surface/70 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="flex size-11 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-on-surface md:hidden"
            aria-label="Open navigation"
          >
            <MaterialIcon name="menu" />
          </button>
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            className="hidden size-11 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-on-surface md:flex"
            aria-label="Collapse sidebar"
          >
            <MaterialIcon name="dock_to_right" />
          </button>
          <div>
            <AdminBreadcrumb />
            <p className="mt-1 text-label-sm text-on-surface-variant">
              Enterprise operations overview
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <AdminSearchBar />
          <ThemeSwitcher />
          <NotificationCenter />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
