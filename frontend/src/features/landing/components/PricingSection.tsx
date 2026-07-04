import { MaterialIcon } from '@/components/ui/MaterialIcon'

const plans = [
  {
    name: 'Starter',
    price: 49,
    featured: false,
    features: [
      'Access to Basic Programs',
      'Standard App Features',
      'Community Forum',
    ],
    cta: 'Get Started',
    ctaClass:
      'w-full rounded-xl border border-outline-variant py-3 font-bold transition-all hover:bg-white/5',
  },
  {
    name: 'Pro Performance',
    price: 89,
    featured: true,
    features: [
      'AI-Adaptive Training',
      'Full Nutrition Engine',
      '1 Monthly Trainer Sync',
      'Smart Wearable Integration',
    ],
    cta: 'Go Pro Now',
    ctaClass:
      'w-full rounded-2xl bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-95',
  },
  {
    name: 'Elite Coaching',
    price: 199,
    featured: false,
    nameClass: 'text-tertiary',
    features: [
      '24/7 Coach WhatsApp',
      'Monthly Biometric Review',
      'Custom Competition Prep',
    ],
    cta: 'Inquire Now',
    ctaClass:
      'w-full rounded-xl border border-outline-variant py-3 font-bold transition-all hover:bg-white/5',
  },
]

export function PricingSection() {
  return (
    <section id="membership" className="bg-surface-container-lowest py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-16 text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-4">
            Choose Your Tier
          </h2>
          <p className="text-on-surface-variant">
            Membership options designed for your commitment level.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.featured
                  ? 'relative flex h-fit flex-col items-center rounded-3xl border border-primary bg-gradient-to-br from-surface-container to-primary/5 p-stack-lg text-center shadow-2xl shadow-primary/10 md:p-12'
                  : 'glass-card flex h-fit flex-col items-center rounded-2xl p-stack-lg text-center'
              }
            >
              {plan.featured && (
                <div className="absolute -top-4 rounded-full bg-primary px-4 py-1 text-xs font-bold tracking-widest text-on-primary uppercase">
                  Recommended
                </div>
              )}
              <h3
                className={`mb-2 text-xl font-bold ${plan.featured ? 'text-2xl text-primary' : plan.nameClass ?? ''}`}
              >
                {plan.name}
              </h3>
              <div className={`mb-6 font-extrabold ${plan.featured ? 'text-5xl' : 'text-4xl'}`}>
                ${plan.price}
                <span className="text-sm font-normal text-on-surface-variant">/mo</span>
              </div>
              <ul
                className={`mb-8 w-full space-y-4 text-left text-sm text-on-surface-variant ${plan.featured ? 'mb-10' : ''}`}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-2 ${plan.featured ? 'font-medium text-on-surface' : ''}`}
                  >
                    <MaterialIcon name="check_circle" className="text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button type="button" className={plan.ctaClass}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
