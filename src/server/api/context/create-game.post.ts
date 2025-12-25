import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type CreateGameBody = {
  targetWord?: string
  createdByName?: string
}

type CreateGameResponse =
  | { ok: true; id: number; playUrl: string }
  | { ok: false; message: string }

function buildSlug() {
  return `user-${Date.now()}`
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CreateGameBody
  const targetWord = typeof body?.targetWord === 'string' ? body.targetWord.trim() : ''
  const createdByName = typeof body?.createdByName === 'string' ? body.createdByName.trim() : ''

  if (!targetWord) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'targetWord is required' } satisfies CreateGameResponse
  }

  const supabase = getSupabaseAdminClient()
  const slug = buildSlug()
  const title = 'Игра'
  const payload = {
    type: 'user',
    slug,
    title,
    target_word: targetWord,
    is_public: true,
    created_by_name: createdByName || null
  }

  let game
  let gameError
  const insert = await supabase.from('context_games').insert(payload).select('id').single()
  game = insert.data
  gameError = insert.error

  if (gameError && /target_word|created_by_name|is_public|column/i.test(gameError.message)) {
    const fallbackInsert = await supabase
      .from('context_games')
      .insert({ type: 'user', slug, title })
      .select('id')
      .single()
    game = fallbackInsert.data
    gameError = fallbackInsert.error
  }

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

  const updatedTitle = `Игра #${gameId}`
  const { error: updateError } = await supabase
    .from('context_games')
    .update({ title: updatedTitle })
    .eq('id', gameId)
  if (updateError) {
    console.warn('Failed to update context game title', updateError)
  }

  return {
    ok: true,
    id: gameId,
    playUrl: `/games/wolf-context/random?mode=user&id=${gameId}`
  } satisfies CreateGameResponse
})
