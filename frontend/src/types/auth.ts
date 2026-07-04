export interface LoginInput {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}
