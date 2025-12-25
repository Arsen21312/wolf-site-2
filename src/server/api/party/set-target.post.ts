import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type SetTargetBody = {
  roomId?: string
  targetWord?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as SetTargetBody
  const roomId = typeof body?.roomId === 'string' ? body.roomId.trim() : ''
  const targetWord = typeof body?.targetWord === 'string' ? body.targetWord.trim() : ''

  if (!roomId || !targetWord) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'roomId and targetWord are required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data: room, error: loadError } = await supabase
    .from('context_rooms')
    .select('id, target_word, allow_random_target, status')
    .eq('id', roomId)
    .maybeSingle()

  if (loadError || !room) {
    setResponseStatus(event, 404)
    return { ok: false, message: 'room_not_found' }
  }

  if (room.status !== 'active') {
    setResponseStatus(event, 400)
    return { ok: false, message: 'room_closed' }
  }

  if (room.target_word) {
    return { ok: true, targetWord: room.target_word }
  }

  if (!room.allow_random_target) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'random_target_disabled' }
  }

  const { error: updateError } = await supabase
    .from('context_rooms')
    .update({ target_word: targetWord })
    .eq('id', roomId)

  if (updateError) {
    setResponseStatus(event, 500)
    return { ok: false, message: updateError.message }
  }

  return { ok: true, targetWord }
})
