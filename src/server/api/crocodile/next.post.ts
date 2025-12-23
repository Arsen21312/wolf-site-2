import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

type NextBody = {
  difficulty?: number
  type?: string
  adultAllowed?: boolean
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as NextBody
  const difficulty = Number(body?.difficulty || 2)
  const type = body?.type || 'all'
  const adultAllowed = Boolean(body?.adultAllowed)

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('crocodile_get_next', {
    p_difficulty: difficulty,
    p_type: type,
    p_adult_allowed: adultAllowed
  })

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  if (!data) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'Нет подходящих заданий' }
  }

  return { ok: true, item: data }
})
