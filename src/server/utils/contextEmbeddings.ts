import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type ContextWord = {
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

const PAGE_SIZE = 1000
const EMBEDDING_DIM = 384

const cacheByGame = new Map<number, CacheEntry>()
const loadingByGame = new Map<number, Promise<CacheEntry>>()

function parseEmbedding(value: unknown): number[] | null {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'number' && Number.isFinite(item)) ? value : null
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null
    try {
      const parsed = JSON.parse(trimmed)
      return Array.isArray(parsed) ? parsed.map((item) => Number(item)) : null
    } catch (error) {
      return null
    }
  }
  return null
}

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

async function loadEmbeddings(wordIds: number[]): Promise<Map<number, number[]>> {
  const supabase = getSupabaseAdminClient()
  const map = new Map<number, number[]>()

  for (let i = 0; i < wordIds.length; i += PAGE_SIZE) {
    const batch = wordIds.slice(i, i + PAGE_SIZE)
    const { data, error } = await supabase
      .from('context_word_embeddings')
      .select('word_id, embedding')
      .in('word_id', batch)

    if (error) {
      console.error('CONTEXT EMBEDDINGS LOAD ERROR', { error })
      break
    }

    for (const row of (data ?? []) as Array<{ word_id: number | string; embedding: unknown }>) {
      const id = Number(row.word_id)
      const embedding = parseEmbedding(row.embedding)
      if (!Number.isFinite(id) || !embedding || embedding.length !== EMBEDDING_DIM) continue
      map.set(id, embedding)
    }
  }

  return map
}

async function buildCache(gameId: number): Promise<CacheEntry> {
  const words = await loadWords(gameId)
  const wordIds = words.map((word) => word.id)
  const embeddingsById = await loadEmbeddings(wordIds)
  const wordsWithEmbeddings = words.filter((word) => embeddingsById.has(word.id))

  return {
    words,
    wordsWithEmbeddings,
    embeddingsById,
    total: words.length
  }
}

export async function getContextEmbeddingsCache(gameId: number): Promise<CacheEntry> {
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

export function clearContextEmbeddingsCache(gameId?: number) {
  if (typeof gameId === 'number') {
    cacheByGame.delete(gameId)
    loadingByGame.delete(gameId)
    return
  }
  cacheByGame.clear()
  loadingByGame.clear()
}
