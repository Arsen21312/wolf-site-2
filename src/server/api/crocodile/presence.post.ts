import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

type PresenceBody = {
  sessionId?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as PresenceBody
  const sessionId = body?.sessionId

  if (!sessionId) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'sessionId is required' }
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase.rpc('crocodile_presence_touch', {
    p_session_id: sessionId
  })

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  return { ok: true }
})
