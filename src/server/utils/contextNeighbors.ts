import { getContextEmbeddingsCache } from '~/server/utils/contextEmbeddings'

export type NeighborBase = {
  id: number
  lemma: string
  rank: number
  similarity: number
  distance: number
  heatScore: number
  autoRank: number
}

const EMBEDDING_DIM = 384

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

export async function getAutoNeighbors(gameId: number, targetId: number, limit: number) {
  const cache = await getContextEmbeddingsCache(gameId)
  const targetEmbedding = cache.embeddingsById.get(targetId)

  if (!targetEmbedding || targetEmbedding.length !== EMBEDDING_DIM) {
    return { ok: false as const, message: 'embeddings_unavailable' }
  }

  const candidates = cache.wordsWithEmbeddings
  if (candidates.length < 100) {
    return { ok: false as const, message: 'embeddings_unavailable' }
  }

  const embeddingsMap = cache.embeddingsById
  const scored = candidates.map((word) => {
    const embedding = embeddingsMap.get(word.id) ?? []
    const similarity = cosineSimilarity(targetEmbedding as number[], embedding)
    return {
      id: word.id,
      lemma: word.Lemma,
      similarity,
      rank: word.R
    }
  })

  scored.sort((a, b) => b.similarity - a.similarity)
  const top = scored.slice(0, limit)
  const neighbors = top.map((entry, index) => {
    const heatScore = (entry.similarity + 1) / 2
    return {
      id: entry.id,
      lemma: entry.lemma,
      rank: index + 1,
      autoRank: index + 1,
      similarity: entry.similarity,
      distance: 1 - entry.similarity,
      heatScore
    }
  })

  return { ok: true as const, neighbors, source: 'embeddings' as const }
}
