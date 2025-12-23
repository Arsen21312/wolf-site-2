import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

type SubmitBody = {
  text?: string
  type?: string
  isAdult?: boolean
  createdBy?: string | null
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as SubmitBody
  const text = body?.text?.trim()
  const type = body?.type

  if (!text || !type) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'text and type are required' }
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('crocodile_submit', {
    p_text: text,
    p_type: type,
    p_is_adult: Boolean(body?.isAdult),
    p_created_by: body?.createdBy || null
  })

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  return { ok: true, id: data }
})
