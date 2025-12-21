import { defineEventHandler, setResponseStatus } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = getSupabaseClient()
  await supabase.auth.getSession()

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

  const res = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: anonKey as string }
  })

  if (!res.ok) {
    const message = await res.text()
    setResponseStatus(event, 500)
    return {
      ok: false,
      error: message || `Supabase health check failed with ${res.status}`
    }
  }

  return { ok: true }
})
