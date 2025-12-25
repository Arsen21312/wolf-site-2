import { defineEventHandler } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

export default defineEventHandler(async () => {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('context_rooms')
    .select('id, host_name, last_active_at, allow_random_target, status')
    .eq('is_public', true)
    .eq('status', 'active')
    .order('last_active_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error(error)
    return { ok: false, message: 'Failed to load rooms' }
  }

  return { ok: true, rooms: data ?? [] }
})
