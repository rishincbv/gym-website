import type { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

interface GoogleAuthProviderProps {
  children: ReactNode
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

  if (!clientId) {
    return <>{children}</>
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}
