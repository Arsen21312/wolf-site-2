import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type CreateGameBody = {
  wordId?: number | string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CreateGameBody
  const wordId = body?.wordId ? Number(body.wordId) : null

  if (!wordId || !Number.isFinite(wordId)) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'wordId is required' }
  }

  const supabase = getSupabaseAdminClient()

  const { data: word, error: wordError } = await supabase
    .from('context_words')
    .select('id, "Lemma", is_active')
    .eq('id', wordId)
    .eq('is_active', true)
    .maybeSingle()

  if (wordError || !word) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'word_not_found' }
  }

  const slug = `user-${wordId}-${Date.now()}`
  const { data: game, error: gameError } = await supabase
    .from('context_games')
    .insert({ type: 'user', slug, target_word_id: wordId })
    .select('id')
    .single()

  if (gameError) {
    console.error(gameError)
    setResponseStatus(event, 500)
    return { ok: false, message: gameError.message }
  }

  const gameId = Number(game?.id)
  if (!Number.isFinite(gameId)) {
    setResponseStatus(event, 500)
    return { ok: false, message: 'Failed to resolve game id' }
  }

  return { id: gameId, playUrl: `/context/play/${gameId}` }
})
