import { defineEventHandler } from 'h3'
import { contextOfficialTasks } from '~/data/contextOfficialTasks'
import { getContextEmbeddingsCache } from '~/server/utils/contextEmbeddings'

type ContextOfficialTaskApi = {
  slug: string
  title: string
  description: string
  lemma: string
  wordId: number
  position: number | null
}

export default defineEventHandler(async () => {
  const cache = await getContextEmbeddingsCache(1)
  const lemmaMap = new Map<string, { id: number; R: number | null }>()
  for (const word of cache.words) {
    const key = word.Lemma.toLowerCase().replace(/ё/g, 'е')
    if (!lemmaMap.has(key)) {
      lemmaMap.set(key, { id: word.id, R: word.R })
    }
  }
  const results: ContextOfficialTaskApi[] = []

  for (const task of contextOfficialTasks) {
    if (results.length >= 30) break
    const key = task.lemma.toLowerCase().replace(/ё/g, 'е')
    const word = lemmaMap.get(key)
    if (!word) {
      console.warn('OFFICIAL TASK MISSING', { lemma: task.lemma })
      continue
    }

    results.push({
      slug: task.slug,
      title: task.title,
      description: task.description,
      lemma: task.lemma,
      wordId: word.id,
      position: Number.isFinite(word.R ?? NaN) ? word.R : null
    })
  }

  return { tasks: results }
})
