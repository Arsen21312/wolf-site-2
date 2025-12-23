import { defineEventHandler, getHeader, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type UpdateBody = {
  id?: string
  text?: string
  type?: string
  difficulty?: number
  is_adult?: boolean
}

export default defineEventHandler(async (event) => {
  const expectedToken = process.env.ADMIN_TOKEN
  const token = getHeader(event, 'x-admin-token')
  const body = (await readBody(event)) as UpdateBody

  if (!expectedToken) {
    setResponseStatus(event, 500)
    return { ok: false, error: 'ADMIN_TOKEN is not configured in env' }
  }

  if (!token || token !== expectedToken) {
    setResponseStatus(event, 401)
    return { ok: false, error: 'Unauthorized' }
  }

  if (!body?.id || !body?.type || !body?.difficulty || body?.is_adult === undefined) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'id, type, difficulty, is_adult are required' }
  }

  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing' }
  }

  const updatePayload: {
    type: string
    difficulty: number
    is_adult: boolean
    status: string
    text?: string
  } = {
    type: body.type,
    difficulty: body.difficulty,
    is_adult: body.is_adult,
    status: 'approved'
  }

  if (body.text !== undefined) {
    updatePayload.text = body.text
  }

  const { error } = await supabase
    .from('crocodile_items')
    .update(updatePayload)
    .eq('id', body.id)
    .eq('status', 'pending')

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  return { ok: true }
})
