import type { AdminDistributionPoint } from '@/types/admin'

interface AdminPieChartProps {
  title: string
  data: AdminDistributionPoint[]
}

const COLORS = ['#2563eb', '#4ae176', '#ffb596', '#b4c5ff', '#bc4800']

export function AdminPieChart({ title, data }: AdminPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cursor = 0

  const slices = data.map((item, index) => {
    const value = total === 0 ? 0 : item.value / total
    const start = cursor
    cursor += value
    return { ...item, start, end: cursor, color: COLORS[index % COLORS.length] }
  })

  function arcPath(start: number, end: number): string {
    const startAngle = start * Math.PI * 2 - Math.PI / 2
    const endAngle = end * Math.PI * 2 - Math.PI / 2
    const largeArc = end - start > 0.5 ? 1 : 0
    const x1 = 100 + Math.cos(startAngle) * 70
    const y1 = 100 + Math.sin(startAngle) * 70
    const x2 = 100 + Math.cos(endAngle) * 70
    const y2 = 100 + Math.sin(endAngle) * 70
    return `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="glass-card rounded-2xl border border-outline-variant/20 p-5">
      <h3 className="text-headline-md mb-4 font-semibold text-on-surface">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-on-surface-variant">
          No data yet
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48">
            {slices.map((slice) => (
              <path
                key={slice.label}
                d={arcPath(slice.start, slice.end)}
                fill={slice.color}
                opacity="0.9"
              />
            ))}
            <circle cx="100" cy="100" r="38" fill="#11131b" />
            <text x="100" y="104" textAnchor="middle" fill="#e1e2ed" fontSize="14" fontWeight="700">
              {total}
            </text>
          </svg>
          <div className="space-y-3">
            {slices.map((slice) => (
              <div key={slice.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-sm text-on-surface">{slice.label}</span>
                </div>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {slice.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
