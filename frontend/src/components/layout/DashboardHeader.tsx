import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 px-6 lg:px-8">
      <div className="relative hidden w-full max-w-md sm:block">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search workouts, meals..."
          className="w-full rounded-lg border border-border bg-glass py-2 pr-4 pl-10 text-sm outline-none focus:border-primary/50"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-glass hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/20" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
