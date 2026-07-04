import { NavLink } from 'react-router'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { cn } from '@/lib/utils'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', filled: true },
  { to: '/workouts', label: 'Workout Plans', icon: 'fitness_center' },
  { to: '/nutrition', label: 'Nutrition', icon: 'restaurant' },
  { to: '/progress', label: 'Progress', icon: 'monitoring' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAFz1AMu7Nmwy-ad3PUY1cLLhkmDn4Fgr8Mzb2Pt52d9TGY73KGybU0bwXNvZlGK3XrX41DYsIQrOM1kQFCj_NHrYSRgEvPm9J4D-0z6TUCSw6jf69_W9zHGWip6VA_Y5mrSnNmdjLhlSRganbq95HPQghFgYJGgVAaY5QUVe4M-KB0xCFlJwCSCM8gc1ibANCaf4nID6pwANu9AiHkVqQxup4qSYx039igaSWTpg9DMp1oeHeCIND'

export function EliteSidebar() {
  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-full w-64 flex-col border-r border-outline-variant/20 bg-surface-container-lowest px-stack-md py-stack-lg md:flex">
      <div className="mb-10 px-stack-sm">
        <h1 className="text-headline-md font-extrabold tracking-tighter text-on-surface">
          ELITE PERFORMANCE
        </h1>
      </div>

      <nav className="grow space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-stack-sm py-3 font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
              )
            }
          >
            <MaterialIcon name={link.icon} filled={link.filled} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="glass-card mt-auto flex items-center gap-3 rounded-2xl p-4">
        <img src={AVATAR_URL} alt="Alex Rivers" className="size-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="text-label-bold font-semibold">Alex Rivers</span>
          <span className="text-label-sm text-on-surface-variant">Pro Athlete</span>
        </div>
      </div>
    </aside>
  )
}
