import { Outlet } from 'react-router'
import { EliteSidebar } from '@/components/layout/EliteSidebar'
import { UserNavbar } from '@/components/layout/UserNavbar'

export function UserLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <EliteSidebar />
      <div className="min-h-screen md:ml-64">
        <UserNavbar />
        <main className="px-4 py-stack-lg md:px-margin-desktop">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
