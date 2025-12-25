import { defineEventHandler } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async () => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('context_games')
    .select('id, title, created_by_name')
    .eq('type', 'user')
    .eq('is_public', true)
    .order('id', { ascending: false })
    .limit(50)

  if (error) {
    console.error(error)
    return { ok: false, message: 'Failed to load user games' }
  }

  const games = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title || `Игра #${row.id}`,
    createdByName: row.created_by_name ?? null
  }))

  return { ok: true, games }
})
