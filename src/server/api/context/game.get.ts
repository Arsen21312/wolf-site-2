import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawId = query.id
  const gameId = typeof rawId === 'string' ? Number(rawId) : Number(rawId)

  if (!Number.isFinite(gameId)) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'id is required' }
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('context_games')
    .select('id, target_word, type')
    .eq('id', gameId)
    .maybeSingle()

  if (error || !data) {
    setResponseStatus(event, 404)
    return { ok: false, message: 'game_not_found' }
  }

  const row = data as { target_word?: string | null }
  const targetWord = typeof row.target_word === 'string' ? row.target_word.trim() : ''
  if (!targetWord) {
    setResponseStatus(event, 404)
    return { ok: false, message: 'target_not_found' }
  }

  return {
    ok: true,
    game: {
      id: data.id,
      targetWord
    }
  }
})
