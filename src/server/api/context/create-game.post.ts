import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type CreateGameBody = {
  wordId?: number | string
}

type CreateGameResponse =
  | { ok: true; id: number; playUrl: string }
  | { ok: false; exists: true; id: number; playUrl: string }
  | { ok: false; message: string }

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CreateGameBody
  const wordId = body?.wordId ? Number(body.wordId) : null

  if (!wordId || !Number.isFinite(wordId)) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'wordId is required' } satisfies CreateGameResponse
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
    return { ok: false, message: 'word_not_found' } satisfies CreateGameResponse
  }

  const { data: existingGame, error: existingError } = await supabase
    .from('context_games')
    .select('id')
    .eq('type', 'user')
    .eq('target_word_id', wordId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error(existingError)
  }

  if (existingGame?.id) {
    return {
      ok: false,
      exists: true,
      id: Number(existingGame.id),
      playUrl: `/context/play/${existingGame.id}`
    } satisfies CreateGameResponse
  }

  const slug = `user-${wordId}-${Date.now()}`
  const title = `Игра #${wordId}`
  const { data: game, error: gameError } = await supabase
    .from('context_games')
    .insert({ type: 'user', slug, target_word_id: wordId, title })
    .select('id')
    .single()

  if (gameError) {
    console.error(gameError)
    setResponseStatus(event, 500)
    return { ok: false, message: gameError.message } satisfies CreateGameResponse
  }

  const gameId = Number(game?.id)
  if (!Number.isFinite(gameId)) {
    setResponseStatus(event, 500)
    return { ok: false, message: 'Failed to resolve game id' } satisfies CreateGameResponse
  }

  return { ok: true, id: gameId, playUrl: `/context/play/${gameId}` } satisfies CreateGameResponse
})
