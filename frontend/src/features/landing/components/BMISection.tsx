import { useMemo, useState } from 'react'

export function BMISection() {
  const [height, setHeight] = useState(180)
  const [weight, setWeight] = useState(75)

  const { bmi, offset, healthy } = useMemo(() => {
    const h = height / 100
    const value = Number((weight / (h * h)).toFixed(1))
    const minBmi = 15
    const maxBmi = 40
    const percentage = Math.min(Math.max((value - minBmi) / (maxBmi - minBmi), 0), 1)
    const circumference = 552.92
  return {
      bmi: value,
      offset: circumference - percentage * circumference,
      healthy: value >= 18.5 && value <= 30,
    }
  }, [height, weight])

  return (
    <section className="py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container md:flex-row">
          <div className="p-stack-lg md:w-1/2 md:p-16">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-6">
              Know Your Numbers
            </h2>
            <p className="mb-stack-lg text-on-surface-variant">
              Use our precision calculator to understand your starting point and track
              your transformation benchmarks.
            </p>
            <div className="space-y-stack-md">
              <div>
                <label className="mb-2 block text-sm font-medium text-on-surface">
                  Height (cm)
                </label>
                <input
                  type="range"
                  min={120}
                  max={220}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-highest"
                />
                <div className="mt-2 text-xs text-on-surface-variant">{height} cm</div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-on-surface">
                  Weight (kg)
                </label>
                <input
                  type="range"
                  min={40}
                  max={150}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-highest"
                />
                <div className="mt-2 text-xs text-on-surface-variant">{weight} kg</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-surface-container-highest p-stack-lg text-center md:w-1/2 md:p-16">
            <div className="relative mb-6 size-48">
              <svg className="size-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-surface-dim"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="552.92"
                  strokeDashoffset={offset}
                  className={healthy ? 'text-secondary' : 'text-error'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold">{bmi}</span>
                <span className={`text-sm font-bold ${healthy ? 'text-secondary' : 'text-error'}`}>
                  {healthy ? 'Healthy' : 'Review'}
                </span>
              </div>
            </div>
            <p className="max-w-xs text-sm text-on-surface-variant">
              Your Body Mass Index (BMI) indicates a healthy weight range for your height.
              Let&apos;s keep it that way!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
