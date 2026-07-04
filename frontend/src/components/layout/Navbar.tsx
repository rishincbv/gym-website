import { Link, NavLink } from 'react-router'
import { motion } from 'framer-motion'
import { Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/ButtonLink'

const navLinks = [
  { to: '/#programs', label: 'Programs' },
  { to: '/#trainers', label: 'Trainers' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/#contact', label: 'Contact' },
]

export function Navbar() {
  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Dumbbell className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">IronPulse</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm text-muted transition-colors hover:text-foreground',
                  isActive && 'text-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink to="/login" variant="ghost">
            Log in
          </ButtonLink>
          <ButtonLink to="/register">Join Now</ButtonLink>
        </div>
      </div>
    </motion.header>
  )
}
