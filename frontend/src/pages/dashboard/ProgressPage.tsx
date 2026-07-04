import { MaterialIcon } from '@/components/ui/MaterialIcon'

const records = [
  {
    exercise: 'Back Squat',
    icon: 'fitness_center',
    iconClass: 'bg-primary/10 text-primary',
    max: '145 kg',
    previous: '140 kg',
    progression: '+3.5%',
    progressionClass: 'text-secondary font-bold',
    date: 'Oct 12, 2024',
  },
  {
    exercise: 'Deadlift (Conventional)',
    icon: 'straighten',
    iconClass: 'bg-tertiary/10 text-tertiary',
    max: '180 kg',
    previous: '175 kg',
    progression: '+2.8%',
    progressionClass: 'text-secondary font-bold',
    date: 'Oct 08, 2024',
  },
  {
    exercise: 'Bench Press',
    icon: 'format_underlined',
    iconClass: 'bg-secondary/10 text-secondary',
    max: '105 kg',
    previous: '105 kg',
    progression: 'Neutral',
    progressionClass: 'text-on-surface-variant',
    date: 'Sep 24, 2024',
  },
]

export function ProgressPage() {
  return (
    <div>
      <header className="mb-stack-lg flex flex-col justify-between gap-stack-md md:flex-row md:items-end">
        <div>
          <h1 className="text-headline-lg font-bold">Progress & Analytics</h1>
          <p className="mt-2 max-w-2xl text-on-surface-variant">
            Track your physiological evolution with precision metrics and data-driven
            optimization insights.
          </p>
        </div>
        <div className="flex gap-stack-md">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-surface-container px-4 py-2 transition-all hover:bg-surface-container-high"
          >
            <MaterialIcon name="calendar_today" className="text-primary" />
            <span className="text-label-bold font-semibold">Last 30 Days</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary-container/10 px-4 py-2 text-primary transition-all hover:bg-primary-container/20"
          >
            <MaterialIcon name="download" />
            <span className="text-label-bold font-semibold">Export Report</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="glass-panel relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-stack-lg text-center md:col-span-4">
          <span className="mb-stack-sm block font-semibold tracking-[0.2em] text-primary uppercase">
            Monthly Performance
          </span>
          <div className="grade-glow mb-stack-sm text-[120px] leading-none font-extrabold text-secondary">
            A+
          </div>
          <div className="mb-stack-md flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1 text-secondary">
            <MaterialIcon name="trending_up" className="text-[18px]" />
            <span className="font-semibold">+12.4% vs Last Month</span>
          </div>
          <p className="text-on-surface-variant">
            Top 2% of elite performers in your age group. Consistency is at an all-time
            high.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-stack-lg md:col-span-8">
          <div className="mb-stack-lg flex items-center justify-between">
            <h3 className="text-headline-md font-bold">Body Composition</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-primary" />
                <span className="text-sm font-medium">Weight (kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-secondary" />
                <span className="text-sm font-medium">BMI</span>
              </div>
            </div>
          </div>
          <svg className="h-64 w-full" viewBox="0 0 400 160" preserveAspectRatio="none">
            <path
              d="M0,120 L50,110 L100,115 L150,100 L200,90 L250,85 L300,75 L350,70 L400,65"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <path
              d="M0,130 L50,125 L100,128 L150,118 L200,108 L250,102 L300,95 L350,88 L400,82"
              fill="none"
              stroke="#4ae176"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          </svg>
        </div>

        <div className="glass-panel rounded-3xl p-stack-lg md:col-span-12 lg:col-span-7">
          <h3 className="text-headline-md mb-stack-lg font-bold">Workout Consistency</h3>
          <div className="grid grid-cols-[repeat(26,1fr)] gap-2">
            {Array.from({ length: 182 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor: `rgba(74, 225, 118, ${[0.05, 0.3, 0.6, 1][i % 4]})`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="glass-panel flex flex-col rounded-3xl p-stack-lg md:col-span-12 lg:col-span-5">
          <h3 className="text-headline-md mb-stack-md font-bold">Muscle Group Focus</h3>
          <div className="flex grow items-center justify-center">
            <svg viewBox="0 0 200 200" className="h-56 w-56">
              <polygon
                points="100,20 170,70 150,150 50,150 30,70"
                fill="rgba(74,225,118,0.15)"
                stroke="#4ae176"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-3xl md:col-span-12">
          <div className="flex items-center justify-between border-b border-white/5 p-stack-lg">
            <h3 className="text-headline-md font-bold">Personal Records</h3>
            <button type="button" className="font-semibold text-primary hover:underline">
              View All History
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[11px] font-semibold tracking-widest text-on-surface-variant uppercase">
                  <th className="px-gutter py-4">Exercise</th>
                  <th className="px-gutter py-4">Max Weight</th>
                  <th className="px-gutter py-4">Previous Best</th>
                  <th className="px-gutter py-4">Progression</th>
                  <th className="px-gutter py-4">Date achieved</th>
                  <th className="px-gutter py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.exercise}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="flex items-center gap-3 px-gutter py-6 font-bold">
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl ${record.iconClass}`}
                      >
                        <MaterialIcon name={record.icon} />
                      </div>
                      {record.exercise}
                    </td>
                    <td className="px-gutter py-6">{record.max}</td>
                    <td className="px-gutter py-6 text-on-surface-variant">{record.previous}</td>
                    <td className={`px-gutter py-6 ${record.progressionClass}`}>
                      {record.progression}
                    </td>
                    <td className="px-gutter py-6 text-on-surface-variant">{record.date}</td>
                    <td className="px-gutter py-6 text-right">
                      <button
                        type="button"
                        className="rounded-lg bg-surface-container-highest p-2 transition-colors hover:text-primary"
                      >
                        <MaterialIcon name="share" className="text-[20px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
