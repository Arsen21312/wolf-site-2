import { useRuntimeConfig } from '#imports'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const getSupabaseClient = () => {
  if (!client) {
    const config = useRuntimeConfig()
    const publicConfig = config.public || {}
    const url =
      process.env.SUPABASE_URL ||
      process.env.NUXT_PUBLIC_SUPABASE_URL ||
      publicConfig.supabaseUrl ||
      config.supabaseUrl
    const anonKey =
      process.env.SUPABASE_ANON_KEY ||
      process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
      publicConfig.supabaseAnonKey ||
      config.supabaseAnonKey

    if (!url || !anonKey) {
      throw new Error('Supabase env variables are missing')
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[supabase] env loaded', {
        hasProcessUrl: Boolean(process.env.SUPABASE_URL),
        hasProcessAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
        hasNuxtPublicUrl: Boolean(process.env.NUXT_PUBLIC_SUPABASE_URL),
        hasNuxtPublicAnonKey: Boolean(process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY),
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
