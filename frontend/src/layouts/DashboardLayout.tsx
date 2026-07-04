import { Outlet } from 'react-router'
import { EliteSidebar } from '@/components/layout/EliteSidebar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <EliteSidebar />
      <main className="min-h-screen px-4 py-stack-lg md:ml-64 md:px-margin-desktop">
        <Outlet />
      </main>
    </div>
  )
}
