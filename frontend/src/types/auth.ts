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

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
}

export interface GoogleLoginInput {
  accessToken: string
}
