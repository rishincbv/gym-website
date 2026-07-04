import { MaterialIcon } from '@/components/ui/MaterialIcon'

const features = [
  {
    icon: 'smart_toy',
    title: 'AI Workout Plans',
    description:
      'Personalized routines that adapt in real-time to your recovery, performance, and goals.',
    hoverBorder: 'hover:border-primary',
    iconBg: 'bg-primary-container/10 text-primary group-hover:bg-primary-container group-hover:text-on-primary-container',
  },
  {
    icon: 'nutrition',
    title: 'Nutrition Guidance',
    description:
      'Custom macro-balanced meal plans and supplement recommendations based on your unique biology.',
    hoverBorder: 'hover:border-secondary',
    iconBg:
      'bg-secondary-container/10 text-secondary group-hover:bg-secondary-container group-hover:text-on-secondary-container',
  },
  {
    icon: 'query_stats',
    title: 'Advanced Analytics',
    description:
      'Track every rep, set, and heartbeat with deep-dive performance metrics and visual progress maps.',
    hoverBorder: 'hover:border-tertiary',
    iconBg:
      'bg-tertiary-container/10 text-tertiary group-hover:bg-tertiary-container group-hover:text-on-tertiary-container',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-surface py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-stack-lg text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-4">
            Engineered for Excellence
          </h2>
          <p className="mx-auto max-w-2xl text-on-surface-variant">
            We combine advanced data science with professional athletic coaching to
            deliver results that were previously impossible.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-stack-lg md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-2xl border border-outline-variant bg-surface-container p-stack-lg transition-colors ${feature.hoverBorder}`}
            >
              <div
                className={`mb-stack-md flex size-14 items-center justify-center rounded-xl transition-all ${feature.iconBg}`}
              >
                <MaterialIcon name={feature.icon} className="text-3xl" />
              </div>
              <h3 className="text-headline-md mb-2 font-semibold">{feature.title}</h3>
              <p className="text-on-surface-variant">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
