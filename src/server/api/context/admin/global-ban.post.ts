import { defineEventHandler, getHeader, readBody, setResponseStatus } from 'h3'
import { clearContextEmbeddingsCache } from '~/server/utils/contextEmbeddings'
import { clearContextWordsCache } from '~/server/utils/contextWords'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type GlobalBanBody = {
  wordId?: number | string
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

  const body = (await readBody(event)) as GlobalBanBody
  const wordId = toNumber(body?.wordId)

  if (!wordId) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'wordId is required' }
  }

  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing' }
  }

  const { data, error } = await supabase
    .from('context_words')
    .update({ is_active: false })
    .eq('id', wordId)
    .select('id, game_id, is_active')
    .maybeSingle()

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  if (!data?.id) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'word_not_found' }
  }

  if (Number.isFinite(data.game_id)) {
    clearContextEmbeddingsCache(Number(data.game_id))
    clearContextWordsCache(Number(data.game_id))
  } else {
    clearContextEmbeddingsCache()
    clearContextWordsCache()
  }

  return { ok: true }
})
