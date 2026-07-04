export type UserRole =
  | 'USER'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'TRAINER'
  | 'SUPPORT'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status?: UserStatus
  avatarUrl?: string | null
}
