import { defineEventHandler, getQuery } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawId = query.roomId
  const roomId = typeof rawId === 'string' ? rawId : String(rawId ?? '')

  if (!roomId) {
    return { ok: false, message: 'roomId is required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('context_room_guesses')
    .select('id, room_id, created_at, player_name, guess_word, rank, score')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(300)

  if (error) {
    console.error(error)
    return { ok: false, message: 'Failed to load guesses' }
  }

  return { ok: true, guesses: data ?? [] }
})
