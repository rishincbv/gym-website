import { useThemeStore, type ThemeMode } from '@/store/theme-store'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { cn } from '@/lib/utils'

export function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const options: { value: ThemeMode; icon: string; label: string }[] = [
    { value: 'dark', icon: 'dark_mode', label: 'Dark' },
    { value: 'light', icon: 'light_mode', label: 'Light' },
  ]

  return (
    <div className="flex items-center rounded-xl border border-outline-variant/30 bg-surface-container-high p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={cn(
            'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-label-sm transition-all',
            theme === option.value
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
          aria-label={`Switch to ${option.label} theme`}
        >
          <MaterialIcon name={option.icon} className="text-[18px]" />
        </button>
      ))}
    </div>
  )
}
