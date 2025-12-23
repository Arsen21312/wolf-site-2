import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

type VoteBody = {
  itemId?: string
  sessionId?: string
  voteType?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as VoteBody
  const itemId = body?.itemId
  const sessionId = body?.sessionId
  const voteType = body?.voteType

  if (!itemId || !sessionId || !voteType) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'itemId, sessionId, voteType are required' }
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('crocodile_vote', {
    p_item_id: itemId,
    p_session_id: sessionId,
    p_vote_type: voteType
  })

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  if (!data) {
    setResponseStatus(event, 409)
    return { ok: false, error: 'Голос уже учтён' }
  }

  return { ok: true }
})
