export interface AdminNavItem {
  to: string
  label: string
  icon: string
  end?: boolean
  module?: string
}

export interface AdminNavSection {
  title?: string
  items: AdminNavItem[]
}

export const adminNavSections: AdminNavSection[] = [
  {
    items: [{ to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true }],
  },
  {
    title: 'Management',
    items: [
      { to: '/users', label: 'Users', icon: 'group', module: 'users' },
      { to: '/memberships', label: 'Memberships', icon: 'card_membership', module: 'memberships' },
      { to: '/workouts', label: 'Workouts', icon: 'fitness_center', module: 'workouts' },
      { to: '/nutrition', label: 'Nutrition', icon: 'restaurant', module: 'nutrition' },
      { to: '/trainers', label: 'Trainers', icon: 'sports', module: 'trainers' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/gallery', label: 'Gallery', icon: 'photo_library', module: 'gallery' },
      { to: '/testimonials', label: 'Testimonials', icon: 'reviews', module: 'testimonials' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/notifications', label: 'Notifications', icon: 'notifications', module: 'notifications' },
      { to: '/reports', label: 'Reports', icon: 'analytics', module: 'reports' },
      { to: '/settings', label: 'Settings', icon: 'settings', module: 'settings' },
      { to: '/roles', label: 'Roles & Permissions', icon: 'admin_panel_settings', module: 'roles' },
    ],
  },
]
