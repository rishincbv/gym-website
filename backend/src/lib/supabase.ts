import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '../config/env.js'

let adminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!env.supabaseUrl) return null

  const key = env.supabaseServiceRoleKey || env.supabaseAnonKey
  if (!key) return null

  if (!adminClient) {
    adminClient = createClient(env.supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return adminClient
}
