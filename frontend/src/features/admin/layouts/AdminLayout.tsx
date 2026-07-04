import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme-store'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminNavbar } from '@/features/admin/components/AdminNavbar'

export function AdminLayout() {
  const location = useLocation()
  const collapsed = useThemeStore((state) => state.sidebarCollapsed)
  const mobileSidebarOpen = useThemeStore((state) => state.mobileSidebarOpen)
  const setMobileSidebarOpen = useThemeStore((state) => state.setMobileSidebarOpen)

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 z-50 h-full md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main
        className={cn(
          'min-h-screen px-4 py-stack-lg transition-all duration-300 md:px-margin-desktop',
          collapsed ? 'md:ml-20' : 'md:ml-64',
        )}
      >
        <AdminNavbar />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
