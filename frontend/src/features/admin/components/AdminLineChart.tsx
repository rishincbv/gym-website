import type { AdminChartPoint } from '@/types/admin'

interface AdminLineChartProps {
  title: string
  subtitle?: string
  data: AdminChartPoint[]
  color?: string
}

function formatMonth(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { month: 'short' })
}

export function AdminLineChart({
  title,
  subtitle,
  data,
  color = '#4ae176',
}: AdminLineChartProps) {
  const width = 560
  const height = 220
  const padding = 28
  const values = data.map((point) => point.value)
  const maxValue = Math.max(...values, 1)
  const points = data.map((point, index) => {
    const x =
      padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2)
    const y = height - padding - (point.value / maxValue) * (height - padding * 2)
    return { x, y, label: formatMonth(point.month), value: point.value }
  })

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding} ${height - padding} L ${points[0]?.x ?? padding} ${height - padding} Z`

  return (
    <div className="glass-card rounded-2xl border border-outline-variant/20 p-5">
      <div className="mb-4">
        <h3 className="text-headline-md font-semibold text-on-surface">{title}</h3>
        {subtitle && <p className="text-label-sm text-on-surface-variant">{subtitle}</p>}
      </div>
      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-on-surface-variant">
          No data yet
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
          <defs>
            <linearGradient id={`area-${title}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={padding + line * 40}
              y2={padding + line * 40}
              stroke="rgba(255,255,255,0.06)"
            />
          ))}
          <path d={areaPath} fill={`url(#area-${title})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="4" fill={color} />
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                fill="#8d90a0"
                fontSize="11"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
