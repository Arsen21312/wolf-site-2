import { defineEventHandler } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async () => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('context_games')
    .select('id, type')
    .eq('type', 'user')
    .order('id', { ascending: false })
    .limit(50)

  if (error) {
    console.error(error)
    return { ok: false, message: 'Failed to load user games' }
  }

  const games = (data ?? []).map((row) => ({
    id: row.id,
    title: `Игра #${row.id}`
  }))

  return { ok: true, games }
})
