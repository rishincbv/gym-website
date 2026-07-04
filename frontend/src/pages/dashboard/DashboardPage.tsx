import { MaterialIcon } from '@/components/ui/MaterialIcon'

const workouts = [
  {
    title: 'Barbell Back Squat',
    tag: 'Legs',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5Nwfhu6EOqIa5DtqZCDrOqug1cBa2hHfKLUmPLOnnNjaYxbVaOGGdpQF6Hl4sQlyZq_q_LA38ePNQ-SY6-0EPAylpgdqyYhKsEsxvdOvJ_Fk9kzR7Y6cVg1joBjXdLLJN0S7qNKK_mlDWG0dGo52DoOXYfyxxus2R6DQF1RQIdawQfiFe7sNWwO2ex-sLrX_LcLMO9ZuH4Hn1gTHD_F4_dYGSlyJVGmam6A7HUFcxR0GUn1IGTa_',
    sets: '4 Sets',
    reps: '8-10 Reps',
    rest: '90s Rest',
  },
  {
    title: 'Dumbbell Walking Lunges',
    tag: 'Legs',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTI75QHMoxduMIWSBOIq-_ijUR14et-vvfV2w7ltJyA3kW7yHGIoFiW_SgjqAhiXwM2jifpis-A4bwqbKd7UVqY2ktbAoph7R0GTqkoBuOYyv52msp3lHOweGgsDqV9rrMsWt00RTwSLxIObmfLH4ftf1I9m3DGgwXlBnWyNSb9WJgB6YJtn8QCOZ9hka5xnCa9AqqoQ6oxSKuJXSEb77j-WSEVsFLEb53ZekzSOThMHJlmbnG-68',
    sets: '3 Sets',
    reps: '20 Steps',
    rest: '60s Rest',
  },
]

export function DashboardPage() {
  return (
    <div>
      <section className="relative mb-stack-lg flex h-[240px] items-center overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="relative z-10 max-w-2xl px-stack-lg">
          <h2 className="text-headline-lg mb-2 font-bold">Welcome back, Alex.</h2>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-secondary-container/30 bg-secondary-container/20 px-3 py-1 text-secondary">
              <MaterialIcon name="local_fire_department" filled className="text-[18px]" />
              <span className="text-label-bold font-semibold">14 DAY STREAK</span>
            </div>
            <p className="text-on-surface-variant">
              You&apos;re in the top 5% of athletes this week.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-primary-container px-8 py-3 font-semibold text-on-primary-container shadow-xl shadow-primary-container/20 transition-all hover:scale-105 active:scale-95"
          >
            Start Today&apos;s Session
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-stack-lg lg:grid-cols-3">
        <div className="space-y-stack-lg lg:col-span-2">
          <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-3">
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-stack-md text-center">
              <div className="relative mb-3 size-24">
                <svg className="size-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-surface-container-highest"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    strokeLinecap="round"
                    className="text-secondary"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-headline-md font-semibold">
                  75%
                </div>
              </div>
              <span className="text-label-bold font-semibold">WORKOUT</span>
              <span className="text-label-sm text-on-surface-variant">45/60 min complete</span>
            </div>

            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-stack-md text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                <MaterialIcon name="bolt" className="text-[32px]" />
              </div>
              <div className="text-headline-md font-semibold">1,840</div>
              <span className="text-label-bold font-semibold uppercase">Calories</span>
              <span className="text-label-sm text-on-surface-variant">Target: 2,400</span>
            </div>

            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-stack-md text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <MaterialIcon name="water_drop" className="text-[32px]" />
              </div>
              <div className="text-headline-md font-semibold">2.4L</div>
              <span className="text-label-bold font-semibold uppercase">Water</span>
              <span className="text-label-sm text-on-surface-variant">Target: 3.5L</span>
            </div>
          </div>

          <div>
            <div className="mb-stack-md flex items-center justify-between">
              <h3 className="text-headline-md font-semibold">Today&apos;s Workout</h3>
              <a href="#" className="font-semibold text-primary hover:underline">
                View Routine
              </a>
            </div>
            <div className="space-y-stack-md">
              {workouts.map((workout) => (
                <div
                  key={workout.title}
                  className="glass-card group flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition-all hover:bg-surface-container-high"
                >
                  <img
                    src={workout.image}
                    alt={workout.title}
                    className="size-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="grow">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-surface-container-highest px-2 py-0.5 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        {workout.tag}
                      </span>
                      <h4 className="text-body-lg font-semibold">{workout.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="repeat" className="text-[16px]" />
                        {workout.sets}
                      </span>
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="fitness_center" className="text-[16px]" />
                        {workout.reps}
                      </span>
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="timer" className="text-[16px]" />
                        {workout.rest}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full border border-outline-variant transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary"
                  >
                    <MaterialIcon name="play_arrow" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card relative overflow-hidden rounded-3xl p-stack-lg">
            <div className="relative z-10 mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-headline-md font-semibold">Weight Tracking</h3>
                <p className="text-label-sm text-on-surface-variant">Past 30 days progress</p>
              </div>
              <div className="text-right">
                <div className="text-headline-md text-secondary">-2.4kg</div>
                <div className="text-label-sm text-on-surface-variant">Since August</div>
              </div>
            </div>
            <svg className="relative z-10 h-48 w-full" preserveAspectRatio="none" viewBox="0 0 400 100">
              <defs>
                <linearGradient id="weightGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 Q50,70 100,75 T200,60 T300,50 T400,45 L400,100 L0,100 Z"
                fill="url(#weightGrad)"
              />
              <path
                d="M0,80 Q50,70 100,75 T200,60 T300,50 T400,45"
                fill="transparent"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative z-10 mt-4 flex justify-between px-2 text-label-sm text-on-surface-variant">
              <span>WK 1</span>
              <span>WK 2</span>
              <span>WK 3</span>
              <span>WK 4</span>
            </div>
          </div>
        </div>

        <div className="space-y-stack-lg">
          <div className="glass-card rounded-2xl p-stack-md">
            <h3 className="mb-stack-md font-semibold tracking-wider text-on-surface uppercase">
              Recent Achievements
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: 'emoji_events', className: 'bg-secondary-container/10 border-secondary-container/30 text-secondary' },
                { icon: 'military_tech', className: 'bg-primary-container/10 border-primary-container/30 text-primary' },
                { icon: 'stars', className: 'bg-tertiary-container/10 border-tertiary-container/30 text-tertiary' },
                { icon: 'lock', className: 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant' },
              ].map((item) => (
                <div
                  key={item.icon}
                  className={`flex aspect-square items-center justify-center rounded-full border ${item.className}`}
                >
                  <MaterialIcon name={item.icon} filled={item.icon !== 'lock'} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-stack-md">
            <h3 className="mb-stack-md font-semibold tracking-wider text-on-surface uppercase">
              Activity History
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-secondary" />
                <div>
                  <div className="font-semibold">Full Body Power</div>
                  <div className="text-[12px] text-on-surface-variant">Yesterday • 1h 12m</div>
                  <span className="mt-2 inline-block rounded bg-secondary-container/20 px-2 py-0.5 text-[10px] text-secondary">
                    PR RECORDED
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="font-semibold">Upper Body Focus</div>
                  <div className="text-[12px] text-on-surface-variant">Tuesday • 55m</div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-outline-variant py-3 font-semibold transition-all hover:bg-surface-container-high"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
