import { Link } from 'react-router'
import { Dumbbell } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Dumbbell className="size-4" />
          </span>
          <span className="font-semibold">IronPulse Gym</span>
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} IronPulse. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted">
          <Link to="/login" className="hover:text-foreground">
            Member Login
          </Link>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
