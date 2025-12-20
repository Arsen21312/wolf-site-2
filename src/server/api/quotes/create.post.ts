import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

type CreateQuoteBody = {
  text?: string
  isPublic?: boolean
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CreateQuoteBody
  const text = body?.text?.trim()
  const isPublic = body?.isPublic ?? false

  if (!text) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'text is required' }
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('wolf_quotes')
    .insert({ text, source: 'user', is_public: isPublic })

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  return { ok: true }
})
