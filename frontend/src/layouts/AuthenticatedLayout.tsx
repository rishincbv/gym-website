import { Outlet } from 'react-router'

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Outlet />
    </div>
  )
}
