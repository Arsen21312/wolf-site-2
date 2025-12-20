import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

type GuessBody = {
  gameId?: number | string
  targetId?: number | string
  guess?: string
  mode?: string
  hint?: boolean
  bestPosition?: number | string
}

type ContextWord = {
  id: number
  game_id: number
  Lemma: string
  R: number | null
  is_core: boolean
}

type RankedWord = ContextWord & {
  distance: number
  lemmaLower: string
  similarity: number
}

const rankedCache: Record<string, RankedWord[]> = {}
const PAGE_SIZE = 1000
const EMBEDDING_MIN_WORDS = 100

function normalizeLemma(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е').trim()
}

function toNumber(value: number | string | undefined | null): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length

  const aLen = a.length
  const bLen = b.length
  const prev = new Array<number>(bLen + 1)
  const curr = new Array<number>(bLen + 1)

  for (let j = 0; j <= bLen; j += 1) {
    prev[j] = j
  }

  for (let i = 1; i <= aLen; i += 1) {
    curr[0] = i
    const aChar = a.charCodeAt(i - 1)
    for (let j = 1; j <= bLen; j += 1) {
      const cost = aChar === b.charCodeAt(j - 1) ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= bLen; j += 1) {
      prev[j] = curr[j]
    }
  }

  return prev[bLen]
}

function getZoneByPosition(position: number, total: number) {
  const fireMax = total * 0.01
  const hotMax = total * 0.05
  const warmMax = total * 0.2
  const coldMax = total * 0.5

  if (position <= fireMax) return 'fire'
  if (position <= hotMax) return 'hot'
  if (position <= warmMax) return 'warm'
  if (position <= coldMax) return 'cold'
  return 'ice'
}

function rankedKey(gameId: number, targetId: number) {
  return `${gameId}:${targetId}`
}

type RankedResult = {
  ranked: RankedWord[]
  target: RankedWord | null
  total: number
  embeddingsUsed: boolean
}

type RawWordRow = {
  id: number | string
  game_id: number | string
  Lemma: string
  R: number | string | null
  is_core: boolean | null
}

type EmbeddingRow = {
  word_id: number | string
  embedding: number[] | null
}

type RankedWordWithSim = RankedWord & {
  similarity: number
}

type NeighborRow = {
  neighbor_word_id: number | string
  rank: number | string
  distance: number | string
  similarity: number | string
  heat_score: number | string
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i += 1) {
    const x = a[i] ?? 0
    const y = b[i] ?? 0
    dot += x * y
    na += x * x
    nb += y * y
  }
  if (!na || !nb) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

async function getAllCoreWordsForGame(gameId: number): Promise<ContextWord[]> {
  const supabase = getSupabaseClient()
  const rows: RawWordRow[] = []
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
      console.error('SUPABASE PAGE ERROR', { gameId, from, error })
      return []
    }

    const chunk = (data ?? []) as RawWordRow[]
    rows.push(...chunk)
    if (chunk.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  const normalized = rows
    .map((row) => {
      const id = Number(row.id)
      const resolvedGameId = Number(row.game_id)
      if (!Number.isFinite(id) || !Number.isFinite(resolvedGameId)) return null
      return {
        id,
        game_id: resolvedGameId,
        Lemma: row.Lemma,
        R: row.R,
        is_core: Boolean(row.is_core)
      }
    })
    .filter((row): row is ContextWord => Boolean(row))

  return normalized
}

async function getEmbeddingsMap(wordIds: number[]): Promise<Map<number, number[]>> {
  const supabase = getSupabaseClient()
  const map = new Map<number, number[]>()
  const batches = chunkArray(wordIds, PAGE_SIZE)

  for (const batch of batches) {
    const { data, error } = await supabase
      .from('context_word_embeddings')
      .select('word_id, embedding')
      .in('word_id', batch)

    if (error) {
      console.error('SUPABASE EMBEDDINGS ERROR', { error })
      return map
    }

    for (const row of (data ?? []) as EmbeddingRow[]) {
      const wordId = Number(row.word_id)
      if (!Number.isFinite(wordId) || !Array.isArray(row.embedding)) continue
      map.set(wordId, row.embedding)
    }
  }

  return map
}

function buildLevenshteinRanked(words: ContextWord[], target: ContextWord): RankedResult {
  const targetLemmaLower = normalizeLemma(target.Lemma)
  const ranked: RankedWord[] = words.map((row) => {
    const lemmaLower = normalizeLemma(row.Lemma)
    return {
      ...row,
      lemmaLower,
      distance: levenshtein(lemmaLower, targetLemmaLower),
      similarity: 0
    }
  })

  ranked.sort((a, b) => (a.distance - b.distance) || (a.id - b.id))
  const targetRanked = ranked.find((word) => word.id === target.id) ?? null
  return { ranked, target: targetRanked, total: ranked.length, embeddingsUsed: false }
}

async function getRankedWordsForTarget(gameId: number, targetId: number): Promise<RankedResult> {
  const key = rankedKey(gameId, targetId)
  if (rankedCache[key]) {
    const cached = rankedCache[key]
    const target = cached.find((word) => word.id === targetId) ?? null
    return { ranked: cached, target, total: cached.length, embeddingsUsed: true }
  }

  const words = await getAllCoreWordsForGame(gameId)
  if (!words.length) {
    return { ranked: [], target: null, total: 0, embeddingsUsed: false }
  }

  const target = words.find((row) => row.id === targetId) ?? null

  console.log('RANKED CACHE BUILD', {
    gameId,
    targetId,
    wordsCount: words.length,
    hasTarget: Boolean(target)
  })

  if (!target) {
    return { ranked: [], target: null, total: words.length, embeddingsUsed: false }
  }

  const wordIds = words.map((word) => word.id)
  const embeddingsMap = await getEmbeddingsMap(wordIds)
  const wordsWithEmbeddings = words.filter((word) => embeddingsMap.has(word.id))
  const hasTargetEmbedding = embeddingsMap.has(target.id)

  if (!hasTargetEmbedding || wordsWithEmbeddings.length < EMBEDDING_MIN_WORDS) {
    console.log('EMBEDDINGS_DISABLED', {
      gameId,
      targetId,
      wordsWithEmbeddings: wordsWithEmbeddings.length,
      hasTargetEmbedding
    })
    const fallback = buildLevenshteinRanked(words, target)
    rankedCache[key] = fallback.ranked
    return fallback
  }

  const targetEmbedding = embeddingsMap.get(target.id)
  if (!targetEmbedding) {
    const fallback = buildLevenshteinRanked(words, target)
    rankedCache[key] = fallback.ranked
    return fallback
  }

  const rankedWithSim: RankedWordWithSim[] = wordsWithEmbeddings.map((row) => {
    const lemmaLower = normalizeLemma(row.Lemma)
    const embedding = embeddingsMap.get(row.id) ?? []
    const similarity = cosineSimilarity(targetEmbedding, embedding)
    return {
      ...row,
      lemmaLower,
      distance: 1 - similarity,
      similarity
    }
  })

  rankedWithSim.sort((a, b) => (b.similarity - a.similarity) || (a.id - b.id))
  const ranked = rankedWithSim.map((row) => ({
    ...row,
    similarity: row.similarity
  }))

  const targetRanked = ranked.find((word) => word.id === targetId) ?? null
  rankedCache[key] = ranked
  return { ranked, target: targetRanked, total: ranked.length, embeddingsUsed: true }
}

async function getNeighborsForTarget(targetId: number): Promise<NeighborRow[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('context_neighbors')
    .select('neighbor_word_id, rank, distance, similarity, heat_score')
    .eq('target_word_id', targetId)
    .order('rank', { ascending: true })

  if (error) {
    console.error('NEIGHBORS LOAD ERROR', error)
    return []
  }

  return (data ?? []) as NeighborRow[]
}

async function getWordById(gameId: number, wordId: number): Promise<ContextWord | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('context_words')
    .select('id, game_id, "Lemma", "R", is_core')
    .eq('game_id', gameId)
    .eq('is_core', true)
    .eq('is_active', true)
    .eq('id', wordId)
    .maybeSingle()

  if (error || !data) return null

  const id = Number(data.id)
  const resolvedGameId = Number(data.game_id)
  if (!Number.isFinite(id) || !Number.isFinite(resolvedGameId)) return null

  return {
    id,
    game_id: resolvedGameId,
    Lemma: data.Lemma,
    R: data.R,
    is_core: Boolean(data.is_core)
  }
}

async function getWordByLemma(gameId: number, lemma: string): Promise<ContextWord | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('context_words')
    .select('id, game_id, "Lemma", "R", is_core')
    .eq('game_id', gameId)
    .eq('is_core', true)
    .eq('is_active', true)
    .ilike('Lemma', lemma)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  const id = Number(data.id)
  const resolvedGameId = Number(data.game_id)
  if (!Number.isFinite(id) || !Number.isFinite(resolvedGameId)) return null

  return {
    id,
    game_id: resolvedGameId,
    Lemma: data.Lemma,
    R: data.R,
    is_core: Boolean(data.is_core)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as GuessBody | null
    const { gameId: gameIdRaw, targetId: targetIdRaw, guess: rawGuess, hint, bestPosition, mode } = body || {}

    const gameId = toNumber(gameIdRaw)
    const targetId = toNumber(targetIdRaw)
    const isHint = mode === 'hint' || Boolean(hint)
    const guessInput = typeof rawGuess === 'string' ? rawGuess.trim() : ''
    const guess = !isHint && guessInput ? normalizeLemma(guessInput) : ''

    if (!gameId || !targetId) {
      setResponseStatus(event, 400)
      return { ok: false, message: 'gameId and targetId are required' }
    }

    if (!isHint && !guess) {
      setResponseStatus(event, 400)
      return { ok: false, message: 'guess is required' }
    }

    const neighbors = await getNeighborsForTarget(targetId)
    const targetWord = await getWordById(gameId, targetId)

    if (!targetWord) {
      console.error('CONTEXT GUESS NO TARGET', { gameId, targetId })
      return { ok: false, exists: false, message: 'target_not_found' }
    }

    console.log('RANK SOURCE', {
      targetId,
      fromNeighbors: neighbors.length > 0,
      neighborsCount: neighbors.length
    })

    if (neighbors.length) {
      const total = neighbors.length
      const byNeighborId = new Map<number, NeighborRow>()
      for (const row of neighbors) {
        const neighborId = Number(row.neighbor_word_id)
        if (!Number.isFinite(neighborId)) continue
        byNeighborId.set(neighborId, row)
      }

      if (!isHint) {
        const guessWord = await getWordByLemma(gameId, guess)
        if (!guessWord) {
          return { ok: false, exists: false, message: `Слова ${guessInput || 'это'} нет в волчьем словаре` }
        }

        const neighbor = byNeighborId.get(guessWord.id)
        const position = neighbor ? Number(neighbor.rank) : total
        const percentile = total > 1 ? 1 - (position - 1) / (total - 1) : 1
        const heatScore = Math.max(0, Math.min(1, percentile))
        const zone = getZoneByPosition(position, total)
        const similarity = neighbor ? Number(neighbor.similarity) : 0
        const isWin = guessWord.id === targetId

        return {
          ok: true,
          exists: true,
          isHint: false,
          position,
          total,
          percentile,
          zone,
          target: {
            id: targetWord.id,
            lemma: targetWord.Lemma,
            rank: targetWord.R
          },
          guess: {
            id: guessWord.id,
            lemma: guessWord.Lemma,
            rank: guessWord.R,
            position,
            total,
            similarity,
            heatScore,
            zone
          },
          isWin
        }
      }

      const bestValueRaw = toNumber(bestPosition)
      const bestValue = bestValueRaw ?? total + 1

      if (bestValue <= 1) {
        return { ok: false, exists: true, isHint: false, message: 'Ты уже на вершине списка, дальше подсказок нет' }
      }

      const getHintTargetPosition = (currentBest: number, totalCount: number) => {
        if (currentBest > 2000) return Math.max(1, currentBest - 200)
        if (currentBest > 1000) return Math.max(1, currentBest - 100)
        if (currentBest > 500) return Math.max(1, currentBest - 50)
        if (currentBest > 300) return Math.max(1, currentBest - 10)
        if (currentBest > 50) return Math.max(1, currentBest - 5)
        if (currentBest > 1) return Math.max(1, currentBest - 1)
        return 1
      }

      const hintPos = getHintTargetPosition(bestValue, total)
      const resolvedIndex = Math.max(0, Math.min(total - 1, hintPos - 1))
      const neighbor = neighbors[resolvedIndex]
      if (!neighbor) {
        return { ok: false, message: 'Failed to build a hint' }
      }

      const hintWordId = Number(neighbor.neighbor_word_id)
      const hintWord = Number.isFinite(hintWordId) ? await getWordById(gameId, hintWordId) : null
      if (!hintWord) {
        return { ok: false, message: 'Hint word not found' }
      }

      const position = Number(neighbor.rank)
      const percentile = total > 1 ? 1 - (position - 1) / (total - 1) : 1
      const heatScore = Math.max(0, Math.min(1, percentile))
      const zone = getZoneByPosition(position, total)
      const similarity = Number(neighbor.similarity) || 0
      const isWin = hintWord.id === targetId

      return {
        ok: true,
        exists: true,
        isHint: true,
        position,
        total,
        percentile,
        zone,
        target: {
          id: targetWord.id,
          lemma: targetWord.Lemma,
          rank: targetWord.R
        },
        guess: {
          id: hintWord.id,
          lemma: hintWord.Lemma,
          rank: hintWord.R,
          position,
          total,
          similarity,
          heatScore,
          zone
        },
        isWin
      }
    }

    const { ranked, target, total } = await getRankedWordsForTarget(gameId, targetId)

    if (!target || !total) {
      return { ok: false, exists: false, message: 'target_not_found' }
    }

    if (!isHint) {
      const guessWord = ranked.find((word) => word.lemmaLower === guess)
      if (!guessWord) {
        return { ok: false, exists: false, message: `Слова ${guessInput || 'это'} нет в волчьем словаре` }
      }

      const position = ranked.findIndex((word) => word.id === guessWord.id) + 1
      const percentile = total > 1 ? 1 - (position - 1) / (total - 1) : 1
      const heatScore = Math.max(0, Math.min(1, percentile))
      const zone = getZoneByPosition(position, total)
      const isWin = guessWord.id === target.id
      const similarity = Number.isFinite(guessWord.similarity) ? guessWord.similarity : 0

      return {
        ok: true,
        exists: true,
        isHint: false,
        position,
        total,
        percentile,
        zone,
        target: {
          id: target.id,
          lemma: target.Lemma,
          rank: target.R
        },
        guess: {
          id: guessWord.id,
          lemma: guessWord.Lemma,
          rank: guessWord.R,
          position,
          total,
          similarity,
          heatScore,
          zone
        },
        isWin
      }
    }

    const bestValueRaw = toNumber(bestPosition)
    const bestValue = bestValueRaw ?? total + 1

    if (bestValue <= 1) {
      return { ok: false, exists: true, isHint: false, message: 'Ты уже на вершине списка, дальше подсказок нет' }
    }

    const getHintTargetPosition = (currentBest: number, totalCount: number) => {
      if (currentBest > 2000) return Math.max(1, currentBest - 200)
      if (currentBest > 1000) return Math.max(1, currentBest - 100)
      if (currentBest > 500) return Math.max(1, currentBest - 50)
      if (currentBest > 300) return Math.max(1, currentBest - 10)
      if (currentBest > 50) return Math.max(1, currentBest - 5)
      if (currentBest > 1) return Math.max(1, currentBest - 1)
      return 1
    }

    const hintPos = getHintTargetPosition(bestValue, total)
    const resolvedIndex = Math.max(0, Math.min(total - 1, hintPos - 1))
    const hintWord = ranked[resolvedIndex]
    if (!hintWord) {
      return { ok: false, message: 'Failed to build a hint' }
    }
    const position = resolvedIndex + 1
    const percentile = total > 1 ? 1 - (position - 1) / (total - 1) : 1
    const heatScore = Math.max(0, Math.min(1, percentile))
    const zone = getZoneByPosition(position, total)
    const isWin = hintWord.id === target.id
    const similarity = Number.isFinite(hintWord.similarity) ? hintWord.similarity : 0

    return {
      ok: true,
      exists: true,
      isHint: true,
      position,
      total,
      percentile,
      zone,
      target: {
        id: target.id,
        lemma: target.Lemma,
        rank: target.R
      },
      guess: {
        id: hintWord.id,
        lemma: hintWord.Lemma,
        rank: hintWord.R,
        position,
        total,
        similarity,
        heatScore,
        zone
      },
      isWin
    }
  } catch (error) {
    console.error('CONTEXT GUESS ERROR', error)
    return { ok: false, message: 'guess_failed' }
  }
})

