export interface UserNavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

export const userNavLinks: UserNavItem[] = [
  { to: '/profile', label: 'Profile', icon: 'person', end: true },
  { to: '/workouts', label: 'Workout Plans', icon: 'fitness_center' },
  { to: '/nutrition', label: 'Nutrition', icon: 'restaurant' },
  { to: '/progress', label: 'Progress', icon: 'monitoring' },
  { to: '/membership', label: 'Membership', icon: 'card_membership' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]
