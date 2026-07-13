import { createClient } from '@/lib/supabase/client'

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient()
  const redirectTo = `${window.location.origin}/auth/callback`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  })

  if (error) {
    throw error
  }
}
