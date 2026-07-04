import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ShaderCanvas } from '@/components/effects/ShaderCanvas'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

const floatingStats = [
  {
    icon: 'groups',
    label: 'Members Joined',
    value: '12,402+',
    iconClass: 'bg-primary/20 text-primary',
    position: 'top-0 right-0',
    delay: '0s',
  },
  {
    icon: 'local_fire_department',
    label: 'Calories Burned Today',
    value: '1.2M+',
    iconClass: 'bg-secondary/20 text-secondary',
    position: 'top-1/2 left-0 -translate-y-1/2',
    delay: '1.5s',
  },
  {
    icon: 'fitness_center',
    label: 'Workouts Completed',
    value: '850K+',
    iconClass: 'bg-tertiary/20 text-tertiary',
    position: 'bottom-0 right-10',
    delay: '0.8s',
  },
] as const

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <ShaderCanvas />
      <div className="hero-gradient-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-container-max flex-col items-center justify-between gap-stack-lg px-margin-mobile md:flex-row md:px-margin-desktop">
        <motion.div
          className="max-w-2xl text-center md:text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero mb-stack-md text-on-surface">
            Transform Your Body.
            <br />
            <span className="text-secondary">Transform Your Life.</span>
          </h1>
          <p className="text-body-lg mb-stack-lg max-w-lg text-on-surface-variant">
            Elite coaching, AI-driven programming, and a world-class community designed
            to push you beyond your limits.
          </p>
          <div className="flex flex-col justify-center gap-stack-md sm:flex-row md:justify-start">
            <Link
              to="/register"
              className="rounded-full bg-primary-container px-8 py-4 text-lg font-semibold text-on-primary-container transition-all hover:shadow-primary-container/40 active:scale-95"
            >
              Join Now
            </Link>
            <a
              href="#programs"
              className="rounded-full border border-outline-variant px-8 py-4 text-lg font-semibold text-on-surface transition-all hover:bg-white/5 active:scale-95"
            >
              Explore Programs
            </a>
          </div>
        </motion.div>

        <div className="relative h-64 w-full md:h-[400px] md:w-1/3">
          {floatingStats.map((stat) => (
            <div
              key={stat.label}
              className={`glass-card animate-float absolute rounded-xl p-4 ${stat.position}`}
              style={{ animationDelay: stat.delay }}
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full ${stat.iconClass}`}>
                  <MaterialIcon name={stat.icon} />
                </div>
                <div>
                  <div className="text-xs font-medium text-on-surface-variant">
                    {stat.label}
                  </div>
                  <div className="text-xl font-bold">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
