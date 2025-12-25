export type ContextWord = {
  id: number
  game_id: number
  Lemma: string
  R: number | null
  is_core: boolean
}

type CacheEntry = {
  words: ContextWord[]
  wordsWithEmbeddings: ContextWord[]
  embeddingsById: Map<number, number[]>
  total: number
}

const deprecatedError = new Error('deprecated, moved to local ambient')

export async function getContextEmbeddingsCache(): Promise<CacheEntry> {
  throw deprecatedError
}

export function clearContextEmbeddingsCache() {
  throw deprecatedError
}
