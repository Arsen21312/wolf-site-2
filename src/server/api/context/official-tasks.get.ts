import { defineEventHandler } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'
import { contextOfficialTasks } from '~/data/contextOfficialTasks'

type ContextOfficialTaskApi = {
  slug: string
  title: string
  description: string
  lemma: string
  wordId: number
  position: number | null
}

export default defineEventHandler(async () => {
  const supabase = getSupabaseClient()
  const results: ContextOfficialTaskApi[] = []

  for (const task of contextOfficialTasks) {
    if (results.length >= 30) break
    try {
      const { data, error } = await supabase
        .from('context_words')
        .select('id, "Lemma", "R"')
        .eq('game_id', 1)
        .eq('is_core', true)
        .eq('is_active', true)
        .ilike('Lemma', task.lemma)
        .limit(1)
        .maybeSingle()

      if (error || !data) {
        console.warn('OFFICIAL TASK MISSING', { lemma: task.lemma, error: error?.message || error })
        continue
      }

      const wordId = typeof data.id === 'string' ? Number(data.id) : data.id
      const position = typeof data.R === 'string' ? Number(data.R) : data.R

      if (!Number.isFinite(wordId)) {
        console.warn('OFFICIAL TASK INVALID ID', { lemma: task.lemma, rawId: data.id })
        continue
      }

      results.push({
        slug: task.slug,
        title: task.title,
        description: task.description,
        lemma: task.lemma,
        wordId,
        position: Number.isFinite(position) ? position : null
      })
    } catch (error) {
      console.warn('OFFICIAL TASK ERROR', { lemma: task.lemma, error })
    }
  }

  return { tasks: results }
})
