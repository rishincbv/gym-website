export function AdminSkeletonCard() {
  return (
    <div className="glass-card animate-pulse rounded-2xl border border-outline-variant/20 p-5">
      <div className="mb-4 size-12 rounded-xl bg-surface-container-highest" />
      <div className="mb-2 h-3 w-24 rounded bg-surface-container-highest" />
      <div className="h-8 w-32 rounded bg-surface-container-highest" />
    </div>
  )
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-stack-lg">
      <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <AdminSkeletonCard key={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-stack-lg xl:grid-cols-2">
        <div className="glass-card h-80 animate-pulse rounded-2xl bg-surface-container-high/40" />
        <div className="glass-card h-80 animate-pulse rounded-2xl bg-surface-container-high/40" />
      </div>
    </div>
  )
}
