import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type NewRoundBody = {
  roomId?: string
  targetWord?: string
  playerName?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as NewRoundBody
  const roomId = typeof body?.roomId === 'string' ? body.roomId.trim() : ''
  const targetWord = typeof body?.targetWord === 'string' ? body.targetWord.trim() : ''
  const playerName = typeof body?.playerName === 'string' ? body.playerName.trim() : ''

  if (!roomId) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'roomId is required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data: room, error: roomError } = await supabase
    .from('context_rooms')
    .select('id, target_word, allow_random_target, is_public, host_name')
    .eq('id', roomId)
    .maybeSingle()

  if (roomError || !room) {
    setResponseStatus(event, 404)
    return { ok: false, message: 'room_not_found' }
  }

  if (!room.is_public) {
    if (!playerName) {
      setResponseStatus(event, 403)
      return { ok: false, message: 'host_only' }
    }
    if (room.host_name && room.host_name !== playerName) {
      setResponseStatus(event, 403)
      return { ok: false, message: 'host_only' }
    }
  }

  let nextTarget = targetWord || room.target_word || ''
  if (room.allow_random_target && !targetWord) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'targetWord is required' }
  }

  if (!nextTarget) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'targetWord is required' }
  }

  const { error: guessesError } = await supabase.from('context_room_guesses').delete().eq('room_id', roomId)
  if (guessesError) {
    setResponseStatus(event, 500)
    return { ok: false, message: guessesError.message }
  }

  const updatePayload: Record<string, unknown> = {
    target_word: nextTarget,
    status: 'active',
    last_active_at: new Date().toISOString()
  }

  if (!room.is_public && !room.host_name && playerName) {
    updatePayload.host_name = playerName
  }

  const { error: updateError } = await supabase
    .from('context_rooms')
    .update(updatePayload)
    .eq('id', roomId)

  if (updateError) {
    setResponseStatus(event, 500)
    return { ok: false, message: updateError.message }
  }

  return { ok: true, targetWord: nextTarget }
})
