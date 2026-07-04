import { MaterialIcon } from '@/components/ui/MaterialIcon'

export function AdminSearchBar() {
  return (
    <label className="relative hidden w-full max-w-md lg:block">
      <MaterialIcon
        name="search"
        className="absolute top-1/2 left-4 -translate-y-1/2 text-outline"
      />
      <input
        type="search"
        placeholder="Search users, workouts, memberships..."
        className="custom-input w-full rounded-xl py-3 pr-4 pl-12 text-body-md text-on-surface placeholder:text-outline-variant"
      />
    </label>
  )
}
