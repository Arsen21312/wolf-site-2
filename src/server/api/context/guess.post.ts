import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getContextEmbeddingsCache } from '~/server/utils/contextEmbeddings'

type GuessBody = {
  gameId?: number | string
  targetId?: number | string
  guess?: string
  mode?: string
  hint?: boolean
  bestPosition?: number | string
  usedIds?: Array<number | string>
  usedLemmas?: string[]
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
const EMBEDDING_MIN_WORDS = 100
const NEIGHBOR_LIMIT = 1000
const wordIndexCache = new Map<number, { byId: Map<number, ContextWord>; byLemma: Map<string, ContextWord> }>()

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

type RankedWordWithSim = RankedWord & {
  similarity: number
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

async function getContextIndex(gameId: number) {
  const cache = await getContextEmbeddingsCache(gameId)
  let index = wordIndexCache.get(gameId)
  if (!index) {
    const byId = new Map<number, ContextWord>()
    const byLemma = new Map<string, ContextWord>()
    for (const word of cache.words) {
      byId.set(word.id, word)
      const lemmaLower = normalizeLemma(word.Lemma)
      if (lemmaLower) {
        byLemma.set(lemmaLower, word)
      }
    }
    index = { byId, byLemma }
    wordIndexCache.set(gameId, index)
  }
  return { cache, index }
}

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

function mapRankToPosition(rank: number, totalWords: number | null): number {
  const total = totalWords && totalWords > 0 ? totalWords : NEIGHBOR_LIMIT
  if (total <= 1) return 1
  if (total <= NEIGHBOR_LIMIT) return Math.max(1, Math.min(total, rank))
  const clampedRank = Math.max(1, Math.min(NEIGHBOR_LIMIT, rank))
  const pos = Math.round(((clampedRank - 1) / (NEIGHBOR_LIMIT - 1)) * (total - 1) + 1)
  return Math.max(1, Math.min(total, pos))
}

function mapPositionToRank(position: number, totalWords: number | null): number {
  const total = totalWords && totalWords > 0 ? totalWords : NEIGHBOR_LIMIT
  if (total <= 1) return 1
  if (total <= NEIGHBOR_LIMIT) return Math.max(1, Math.min(total, position))
  const clampedPos = Math.max(1, Math.min(total, position))
  const rank = Math.round(((clampedPos - 1) / (total - 1)) * (NEIGHBOR_LIMIT - 1) + 1)
  return Math.max(1, Math.min(NEIGHBOR_LIMIT, rank))
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

  const { cache } = await getContextIndex(gameId)
  const words = cache.words
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

  const embeddingsMap = cache.embeddingsById
  const wordsWithEmbeddings = cache.wordsWithEmbeddings
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

async function getWordById(gameId: number, wordId: number): Promise<ContextWord | null> {
  const { index } = await getContextIndex(gameId)
  return index.byId.get(wordId) ?? null
}

async function getWordByLemma(gameId: number, lemma: string): Promise<ContextWord | null> {
  const { index } = await getContextIndex(gameId)
  return index.byLemma.get(lemma) ?? null
}

async function getTotalActiveWords(gameId: number): Promise<number | null> {
  const { cache } = await getContextIndex(gameId)
  return cache.total
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as GuessBody | null
    const {
      gameId: gameIdRaw,
      targetId: targetIdRaw,
      guess: rawGuess,
      hint,
      bestPosition,
      mode,
      usedIds,
      usedLemmas
    } = body || {}

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

    const targetWord = await getWordById(gameId, targetId)
    const totalActiveWords = await getTotalActiveWords(gameId)

    if (!targetWord) {
      console.error('CONTEXT GUESS NO TARGET', { gameId, targetId })
      return { ok: false, exists: false, message: 'target_not_found' }
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
      if (currentBest <= 1) return 1
      return Math.max(1, Math.ceil(currentBest / 2))
    }

    const usedIdSet = new Set((usedIds ?? []).map((id) => Number(id)).filter((id) => Number.isFinite(id)))
    const usedLemmaSet = new Set(
      (usedLemmas ?? []).map((lemma) => (typeof lemma === 'string' ? normalizeLemma(lemma) : '')).filter(Boolean)
    )
    const hintPos = getHintTargetPosition(bestValue, total)
    let resolvedIndex = Math.max(0, Math.min(total - 1, hintPos - 1))
    let hintWord = ranked[resolvedIndex]
    let attempts = 0
    const maxAttempts = 50

    while (hintWord && attempts < maxAttempts) {
      if (usedIdSet.has(hintWord.id)) {
        resolvedIndex += 1
        hintWord = ranked[resolvedIndex]
        attempts += 1
        continue
      }
      const normalizedLemma = normalizeLemma(hintWord.Lemma)
      if (usedLemmaSet.has(normalizedLemma)) {
        resolvedIndex += 1
        hintWord = ranked[resolvedIndex]
        attempts += 1
        continue
      }
      break
    }
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

