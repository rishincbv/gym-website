import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  CreditCard,
  Bell,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/nutrition', label: 'Nutrition', icon: Apple },
  { to: '/membership', label: 'Membership', icon: CreditCard },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/30 p-4 lg:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted hover:bg-glass hover:text-foreground',
              )
            }
          >
            <link.icon className="size-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
