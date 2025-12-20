import { defineEventHandler, setResponseStatus } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = getSupabaseClient()
  await supabase.auth.getSession()

  const config = useRuntimeConfig()
  const url = config.supabaseUrl || process.env.SUPABASE_URL
  const anonKey = config.supabaseAnonKey || process.env.SUPABASE_ANON_KEY

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
