import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type GuessBody = {
  roomId?: string
  playerName?: string
  guessWord?: string
  rank?: number
  score?: number
  isWin?: boolean
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as GuessBody
  const roomId = typeof body?.roomId === 'string' ? body.roomId.trim() : ''
  const playerName = typeof body?.playerName === 'string' ? body.playerName.trim() : ''
  const guessWord = typeof body?.guessWord === 'string' ? body.guessWord.trim() : ''
  const rank = Number(body?.rank)
  const score = Number(body?.score)
  const isWin = Boolean(body?.isWin)

  if (!roomId || !playerName || !guessWord || !Number.isFinite(rank)) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'invalid_guess' }
  }

  const supabase = getSupabaseAdminClient()
  const { data: inserted, error: insertError } = await supabase
    .from('context_room_guesses')
    .insert({
      room_id: roomId,
      player_name: playerName,
      guess_word: guessWord,
      rank,
      score: Number.isFinite(score) ? score : null
    })
    .select('id, room_id, created_at, player_name, guess_word, rank, score')
    .single()

  if (insertError || !inserted) {
    setResponseStatus(event, 500)
    return { ok: false, message: insertError?.message || 'Failed to save guess' }
  }

  const updates: Record<string, unknown> = { last_active_at: new Date().toISOString() }
  if (isWin) {
    updates.status = 'finished'
  }

  const { error: updateError } = await supabase.from('context_rooms').update(updates).eq('id', roomId)
  if (updateError) {
    console.warn('Failed to update room', updateError)
  }

  return { ok: true, guess: inserted }
})
