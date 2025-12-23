import { defineEventHandler, getHeader, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type ActionBody = {
  targetId?: number | string
  wordId?: number | string
  action?: 'ban' | 'pin' | 'set_rank' | null
  rank?: number | string | null
  note?: string | null
  updatedBy?: string | null
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export default defineEventHandler(async (event) => {
  const expectedToken = process.env.ADMIN_TOKEN
  const token = getHeader(event, 'x-admin-token')

  if (!expectedToken) {
    setResponseStatus(event, 500)
    return { ok: false, error: 'ADMIN_TOKEN is not configured in env' }
  }

  if (!token || token !== expectedToken) {
    setResponseStatus(event, 401)
    return { ok: false, error: 'Unauthorized' }
  }

  const body = (await readBody(event)) as ActionBody
  const targetId = toNumber(body?.targetId)
  const wordId = toNumber(body?.wordId)
  const action = body?.action ?? null
  const rank = toNumber(body?.rank)
  const note = typeof body?.note === 'string' ? body?.note : null
  const updatedBy = typeof body?.updatedBy === 'string' ? body?.updatedBy : null

  if (!targetId || !wordId) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'targetId and wordId are required' }
  }

  if (action && action !== 'ban' && action !== 'pin' && action !== 'set_rank') {
    setResponseStatus(event, 400)
    return { ok: false, error: 'invalid_action' }
  }

  if (action === 'set_rank' && !rank) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'rank is required for set_rank' }
  }

  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing' }
  }

  let query = supabase
    .from('context_edges')
    .select('id')
    .eq('target_word_id', targetId)
    .eq('to_word_id', wordId)
    .eq('kind', 'target_guess')
    .is('from_word_id', null)

  const { data: existing, error: existingError } = await query.maybeSingle()
  if (existingError) {
    console.error(existingError)
    setResponseStatus(event, 500)
    return { ok: false, error: existingError.message }
  }

  const updatePayload = {
    admin_action: action,
    admin_rank: action === 'set_rank' ? rank : null,
    admin_note: note,
    updated_by: updatedBy
  }

  if (existing?.id) {
    const { error: updateError } = await supabase.from('context_edges').update(updatePayload).eq('id', existing.id)
    if (updateError) {
      console.error(updateError)
      setResponseStatus(event, 500)
      return { ok: false, error: updateError.message }
    }
    return { ok: true }
  }

  const { error: insertError } = await supabase.from('context_edges').insert({
    target_word_id: targetId,
    from_word_id: null,
    to_word_id: wordId,
    kind: 'target_guess',
    ...updatePayload
  })

  if (insertError) {
    console.error(insertError)
    setResponseStatus(event, 500)
    return { ok: false, error: insertError.message }
  }

  return { ok: true }
})
