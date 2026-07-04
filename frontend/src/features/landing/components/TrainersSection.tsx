import { MaterialIcon } from '@/components/ui/MaterialIcon'

const trainers = [
  {
    name: 'Marcus Thorne',
    role: 'Elite Strength & Conditioning',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQdscJPv1AuwhizbuukTMUh4S9oJZvBY9FN7w4jVSBQhJOl5ewtxJO_gB-eomcR0QmUs9HXpZJePPQn7heZYLy-FEAknPq8eoXVUZjQfdZ-RrzzD2yv_IX97Do_P1e_cQ6M9VDnKfpna0C9elIXmniryKY1lZfRwGi5OSRIj02A-iLGawCGjc2BBrK80Ygl8wYKbd7qnm1QyQRLYgkuUsgszhjYQrgtbeXV-y8Nv-yQRiKF5s9ieOp',
    hover: 'hover:bg-primary',
  },
  {
    name: 'Elena Vance',
    role: 'Performance Yoga & Mobility',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-dzKVv3eHZFrREDQcmL-YHvs1x8Kvxod_63ai68LQGvYHXkID8aULUlqeUDVU3KhLLhMV3mncrhTMsdQ-INZIhMVdazuuBBFWQM1TNQaD3jJVsIfoUfoOIUJxwN7fBr9OAv7GfZElRCawf4eU9LBESjBUmrsjOy9T7WgMvVt1hnp1tAX5pAYXyxaejfO5_N2ogL4EXJrx4n5zSjQJGt9QOovifQcN9nn1pVBMXgZpNDMd4vIHpxDZ',
    hover: 'hover:bg-secondary',
  },
  {
    name: 'Julian Brooks',
    role: 'HIIT & Metabolic Specialist',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-iq5yZgS6oUKIMsErJMOTPny3AxmIhmfKSZrISbDnvVwwvAeksZzHAe7kKFhjZ5dkpCFmoho8vhS_8XBr02F-cpCjsvE6-ckWTK2U9-LpIsR2ZBsmeJ6lzqTHf0MWzl4_u7vnbDWe5nxF3L14mXHqvQH0vNZHG5GgpZTDhCqChimduReHKkdfxzTu031qqfGxzoHPxGGjen4vNu0EV1dPddLFAvFfAWK3-i9GtsxnvG0DUHQWy-_r',
    hover: 'hover:bg-tertiary',
  },
  {
    name: 'Sarah Chen',
    role: 'Functional Training & Rehab',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPewt_otwqJtNAQypxPYG-moNTd60zKNmDvcArLWfpw6hlIDV38LicmmXqr1Nd7ghb9ZDcz4VyvfcmSr2SFLe9tZFR5X5LikSY9hVzkX58Tl0VHPbFdK2R3AxiywLu1rchB5pNLeSItEdVAnN476vaD3JoTNsTTxpB5AD9-jBtowGPO9JL5g30IQ5gR3GqgAMq_naYLCHoqD7xuSpnvp3XTGSs_N3czh581__78axbDtqtyqw77UNn',
    hover: 'hover:bg-primary',
  },
]

export function TrainersSection() {
  return (
    <section id="trainers" className="bg-surface py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-stack-lg text-center">
          Master Coaches
        </h2>
        <div className="grid grid-cols-1 gap-stack-lg sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <div key={trainer.name} className="group">
              <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className={`flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors ${trainer.hover}`}
                  >
                    <MaterialIcon name="person" className="text-white" />
                  </button>
                </div>
              </div>
              <h4 className="text-xl font-semibold">{trainer.name}</h4>
              <p className="text-sm text-on-surface-variant">{trainer.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
