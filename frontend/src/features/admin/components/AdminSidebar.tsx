import { NavLink } from 'react-router'
import { motion } from 'framer-motion'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme-store'
import { adminNavSections } from '@/features/admin/config/nav'

export function AdminSidebar() {
  const collapsed = useThemeStore((state) => state.sidebarCollapsed)
  const setMobileSidebarOpen = useThemeStore((state) => state.setMobileSidebarOpen)

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-50 flex h-full flex-col border-r border-outline-variant/20 bg-surface-container-lowest py-stack-lg transition-all duration-300',
        collapsed ? 'w-20 px-3' : 'w-64 px-stack-md',
      )}
    >
      <div className={cn('mb-8 px-stack-sm', collapsed && 'px-0 text-center')}>
        <p className="text-label-sm font-semibold tracking-[0.2em] text-primary uppercase">
          {collapsed ? 'EP' : 'Elite Admin'}
        </p>
        {!collapsed && (
          <h1 className="text-headline-md font-extrabold tracking-tighter text-on-surface">
            CONTROL CENTER
          </h1>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        {adminNavSections.map((section) => (
          <div key={section.title ?? 'root'}>
            {section.title && !collapsed && (
              <p className="mb-2 px-stack-sm text-label-sm font-semibold tracking-widest text-outline uppercase">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-stack-sm py-3 font-semibold transition-all duration-200',
                      collapsed && 'justify-center px-0',
                      isActive
                        ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <MaterialIcon
                        name={item.icon}
                        filled={isActive}
                        className="shrink-0"
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <motion.div
        layout
        className={cn(
          'glass-card mt-4 rounded-2xl p-3',
          collapsed && 'flex justify-center p-2',
        )}
      >
        <MaterialIcon name="verified_user" className="text-primary" />
        {!collapsed && (
          <p className="mt-2 text-label-sm text-on-surface-variant">
            Enterprise admin mode
          </p>
        )}
      </motion.div>
    </aside>
  )
}
