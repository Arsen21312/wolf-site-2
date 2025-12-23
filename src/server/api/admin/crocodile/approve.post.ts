import { defineEventHandler, getHeader, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type ApproveBody = {
  id?: string
}

export default defineEventHandler(async (event) => {
  const expectedToken = process.env.ADMIN_TOKEN
  const token = getHeader(event, 'x-admin-token')
  const body = (await readBody(event)) as ApproveBody

  if (!expectedToken) {
    setResponseStatus(event, 500)
    return { ok: false, error: 'ADMIN_TOKEN is not configured in env' }
  }

  if (!token || token !== expectedToken) {
    setResponseStatus(event, 401)
    return { ok: false, error: 'Unauthorized' }
  }

  if (!body?.id) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'id is required' }
  }

  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing' }
  }
  const { error } = await supabase
    .from('crocodile_items')
    .update({ status: 'approved' })
    .eq('id', body.id)

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  return { ok: true }
})
