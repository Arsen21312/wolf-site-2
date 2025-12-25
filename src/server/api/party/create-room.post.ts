import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type CreateRoomBody = {
  isPublic?: boolean
  allowRandomTarget?: boolean
  targetWord?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CreateRoomBody
  const isPublic = Boolean(body?.isPublic)
  const allowRandomTarget = Boolean(body?.allowRandomTarget)
  const targetWord = typeof body?.targetWord === 'string' ? body.targetWord.trim() : ''

  if (!allowRandomTarget && !targetWord) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'targetWord is required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('context_rooms')
    .insert({
      host_name: null,
      is_public: isPublic,
      allow_random_target: allowRandomTarget,
      target_word: allowRandomTarget ? null : targetWord,
      status: 'active',
      last_active_at: new Date().toISOString()
    })
    .select('id')
    .single()

  if (error || !data?.id) {
    setResponseStatus(event, 500)
    return { ok: false, message: error?.message || 'Failed to create room' }
  }

  return { ok: true, id: data.id }
})
