import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

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

const PAGE_SIZE = 1000
const cacheByGame = new Map<number, CacheEntry>()
const loadingByGame = new Map<number, Promise<CacheEntry>>()

async function loadWords(gameId: number): Promise<ContextWord[]> {
  const supabase = getSupabaseAdminClient()
  const rows: Array<ContextWord> = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('context_words')
      .select('id, game_id, "Lemma", "R", is_core')
      .eq('game_id', gameId)
      .eq('is_core', true)
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error('CONTEXT WORDS LOAD ERROR', { gameId, from, error })
      break
    }

    const chunk = (data ?? []) as Array<{
      id: number | string
      game_id: number | string
      Lemma: string
      R: number | string | null
      is_core: boolean | null
    }>
    if (!chunk.length) break

    for (const row of chunk) {
      const id = Number(row.id)
      const resolvedGameId = Number(row.game_id)
      if (!Number.isFinite(id) || !Number.isFinite(resolvedGameId)) continue
      rows.push({
        id,
        game_id: resolvedGameId,
        Lemma: row.Lemma,
        R: row.R === null ? null : Number(row.R),
        is_core: Boolean(row.is_core)
      })
    }

    if (chunk.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return rows
}

async function buildCache(gameId: number): Promise<CacheEntry> {
  const words = await loadWords(gameId)
  return {
    words,
    total: words.length
  }
}

export async function getContextWordsCache(gameId: number): Promise<CacheEntry> {
  const cached = cacheByGame.get(gameId)
  if (cached) return cached

  const loading = loadingByGame.get(gameId)
  if (loading) return loading

  const promise = buildCache(gameId).finally(() => {
    loadingByGame.delete(gameId)
  })
  loadingByGame.set(gameId, promise)
  const cache = await promise
  cacheByGame.set(gameId, cache)
  return cache
}

export function clearContextWordsCache(gameId?: number) {
  if (typeof gameId === 'number') {
    cacheByGame.delete(gameId)
    loadingByGame.delete(gameId)
    return
  }
  cacheByGame.clear()
  loadingByGame.clear()
}
