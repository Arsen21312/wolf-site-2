import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = getSupabaseClient()

  const query = getQuery(event)
  const rawGameId = query.gameId
  const parsedGameId = rawGameId ? Number(rawGameId) : 1
  const gameId = Number.isInteger(parsedGameId) && parsedGameId > 0 ? parsedGameId : null

  if (!gameId) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'gameId must be a positive integer' }
  }

  const { count, error: countError } = await supabase
    .from('context_words')
    .select('id', { count: 'exact', head: true })
    .eq('is_core', true)
    .eq('is_active', true)
    .eq('game_id', gameId)

  if (countError) {
    console.error(countError)
    setResponseStatus(event, 500)
    return { ok: false, error: countError.message }
  }

  if (!count || count < 1) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'No core words found' }
  }

  const offset = Math.floor(Math.random() * count)
  const { data, error } = await supabase
    .from('context_words')
    .select('id, game_id, "Lemma", "R"')
    .eq('is_core', true)
    .eq('is_active', true)
    .eq('game_id', gameId)
    .range(offset, offset)

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  const word = data?.[0]
  if (!word) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'No word found at random offset' }
  }

  const id = typeof word.id === 'string' ? Number(word.id) : word.id
  const resolvedGameId = typeof word.game_id === 'string' ? Number(word.game_id) : gameId
  const rank = typeof word.R === 'string' ? Number(word.R) : word.R

  return {
    ok: true,
    word: {
      id,
      gameId: resolvedGameId,
      lemma: word.Lemma,
      rank
    }
  }
})
