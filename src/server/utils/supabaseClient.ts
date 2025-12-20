import { useRuntimeConfig } from '#imports'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const getSupabaseClient = () => {
  if (!client) {
    const config = useRuntimeConfig()
    const url = config.supabaseUrl || process.env.SUPABASE_URL
    const anonKey = config.supabaseAnonKey || process.env.SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      throw new Error('Supabase env variables are missing')
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[supabase] env loaded', {
        hasProcessUrl: Boolean(process.env.SUPABASE_URL),
        hasProcessAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
        hasRuntimeUrl: Boolean(config.supabaseUrl),
        hasRuntimeAnonKey: Boolean(config.supabaseAnonKey)
      })
    }

    client = createClient(url, anonKey, {
      auth: {
        persistSession: false
      }
    })
  }

  return client
}
