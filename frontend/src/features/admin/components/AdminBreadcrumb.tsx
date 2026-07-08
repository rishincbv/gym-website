import { useLocation } from 'react-router'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { adminNavSections } from '@/features/admin/config/nav'

function titleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function AdminBreadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const labels = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    const navItem = adminNavSections
      .flatMap((section) => section.items)
      .find((item) => item.to === path)
    return navItem?.label ?? titleCase(segment)
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm">
      <MaterialIcon name="home" className="text-outline" />
      {labels.map((label, index) => (
        <span key={`${label}-${index}`} className="flex items-center gap-2">
          <MaterialIcon name="chevron_right" className="text-outline-variant text-[16px]" />
          <span
            className={
              index === labels.length - 1
                ? 'font-semibold text-on-surface'
                : 'text-on-surface-variant'
            }
          >
            {label}
          </span>
        </span>
      ))}
    </nav>
  )
}
