import { MaterialIcon } from '@/components/ui/MaterialIcon'

const notifications = [
  {
    id: '1',
    title: 'New member registration',
    message: 'A new user signed up today.',
    time: '2m ago',
  },
  {
    id: '2',
    title: 'Membership renewed',
    message: 'Pro Performance plan renewed.',
    time: '1h ago',
  },
  {
    id: '3',
    title: 'Support message',
    message: 'New contact form submission.',
    time: '3h ago',
  },
]

export function NotificationCenter() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="relative flex size-11 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-on-surface transition-colors hover:bg-surface-container-highest"
        aria-label="Notifications"
      >
        <MaterialIcon name="notifications" />
        <span className="absolute top-2 right-2 size-2 rounded-full bg-secondary" />
      </button>

      <div className="invisible absolute top-full right-0 z-50 mt-3 w-80 translate-y-2 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-label-bold font-semibold text-on-surface">Notifications</p>
          <span className="text-label-sm text-primary">Mark all read</span>
        </div>
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-high/60 p-3"
            >
              <p className="text-sm font-semibold text-on-surface">{item.title}</p>
              <p className="text-label-sm text-on-surface-variant">{item.message}</p>
              <p className="mt-1 text-xs text-outline">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
