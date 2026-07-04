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
    items: [{ to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true }],
  },
  {
    title: 'Management',
    items: [
      { to: '/admin/users', label: 'Users', icon: 'group', module: 'users' },
      {
        to: '/admin/memberships',
        label: 'Memberships',
        icon: 'card_membership',
        module: 'memberships',
      },
      {
        to: '/admin/workouts',
        label: 'Workouts',
        icon: 'fitness_center',
        module: 'workouts',
      },
      {
        to: '/admin/nutrition',
        label: 'Nutrition',
        icon: 'restaurant',
        module: 'nutrition',
      },
      {
        to: '/admin/trainers',
        label: 'Trainers',
        icon: 'sports',
        module: 'trainers',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/gallery', label: 'Gallery', icon: 'photo_library', module: 'gallery' },
      {
        to: '/admin/testimonials',
        label: 'Testimonials',
        icon: 'reviews',
        module: 'testimonials',
      },
      { to: '/admin/contact', label: 'Contact', icon: 'mail', module: 'contact' },
    ],
  },
  {
    title: 'System',
    items: [
      {
        to: '/admin/notifications',
        label: 'Notifications',
        icon: 'notifications',
        module: 'notifications',
      },
      { to: '/admin/reports', label: 'Reports', icon: 'analytics', module: 'reports' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings', module: 'settings' },
      {
        to: '/admin/roles',
        label: 'Roles & Permissions',
        icon: 'admin_panel_settings',
        module: 'roles',
      },
    ],
  },
]
