import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawId = query.id
  const roomId = typeof rawId === 'string' ? rawId : String(rawId ?? '')

  if (!roomId) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'id is required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('context_rooms')
    .select('id, host_name, target_word, is_public, allow_random_target, status, last_active_at')
    .eq('id', roomId)
    .maybeSingle()

  if (error || !data) {
    setResponseStatus(event, 404)
    return { ok: false, message: 'room_not_found' }
  }

  return { ok: true, room: data }
})
