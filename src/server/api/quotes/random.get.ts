import { defineEventHandler, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = getSupabaseClient()

  const { count, error: countError } = await supabase
    .from('wolf_quotes')
    .select('id', { count: 'exact', head: true })
    .eq('is_public', true)

  if (countError) {
    console.error(countError)
    setResponseStatus(event, 500)
    return { ok: false, error: countError.message }
  }

  if (!count || count < 1) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'No public quotes found' }
  }

  const offset = Math.floor(Math.random() * count)
  const { data, error } = await supabase
    .from('wolf_quotes')
    .select('*')
    .eq('is_public', true)
    .range(offset, offset)

  if (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: error.message }
  }

  return { ok: true, quote: data?.[0] ?? null }
})
