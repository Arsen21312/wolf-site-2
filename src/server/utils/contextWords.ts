export type ContextWord = {
  id: number
  game_id: number
  Lemma: string
  R: number | null
  is_core: boolean
}

type CacheEntry = {
  words: ContextWord[]
  total: number
}

const deprecatedError = new Error('deprecated, moved to local ambient')

export async function getContextWordsCache(): Promise<CacheEntry> {
  throw deprecatedError
}

export function clearContextWordsCache() {
  throw deprecatedError
}
