import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'
import { getContextEmbeddingsCache } from '~/server/utils/contextEmbeddings'

type DefineBody = {
  lemma?: string
}

const NEIGHBOR_LIMIT = 300
const EMBEDDING_DIM = 384

function normalizeLemma(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, 'е')
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


export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as DefineBody
  const lemmaRaw = typeof body?.lemma === 'string' ? body.lemma : ''
  const lemma = normalizeLemma(lemmaRaw)

  if (!lemma) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'lemma is required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data: existing, error: existingError } = await supabase
    .from('context_words')
    .select('id, "Lemma", "R", is_core, is_active')
    .eq('game_id', 1)
    .ilike('Lemma', lemma)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error(existingError)
    setResponseStatus(event, 500)
    return { ok: false, message: 'Failed to read context_words' }
  }

  let targetId: number
  let targetLemma: string

  if (existing && existing.is_active) {
    targetId = Number(existing.id)
    targetLemma = existing.Lemma
  } else if (existing && !existing.is_active) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'word_inactive' }
  } else {
    const { data: maxRow } = await supabase
      .from('context_words')
      .select('"R"')
      .eq('game_id', 1)
      .order('R', { ascending: false })
      .limit(1)
      .maybeSingle()

    const maxRank = maxRow?.R ? Number(maxRow.R) : 0
    const { data: inserted, error: insertError } = await supabase
      .from('context_words')
      .insert({
        game_id: 1,
        Lemma: lemma,
        is_core: false,
        is_active: true,
        R: maxRank + 1
      })
      .select('id, "Lemma"')
      .single()

    if (insertError || !inserted) {
      console.error(insertError)
      setResponseStatus(event, 500)
      return { ok: false, message: 'Failed to insert word' }
    }

    targetId = Number(inserted.id)
    targetLemma = inserted.Lemma
  }

  const cache = await getContextEmbeddingsCache(1)
  const targetEmbedding = cache.embeddingsById.get(targetId)

  if (!targetEmbedding || targetEmbedding.length !== EMBEDDING_DIM) {
    setResponseStatus(event, 500)
    return { ok: false, message: 'embeddings_unavailable' }
  }

  const embeddingsMap = cache.embeddingsById
  const candidates = cache.wordsWithEmbeddings

  if (candidates.length < 100) {
    setResponseStatus(event, 500)
    return { ok: false, message: 'embeddings_unavailable' }
  }

  const scored = candidates.map((word) => {
    const embedding = embeddingsMap.get(word.id) ?? []
    const similarity = cosineSimilarity(targetEmbedding as number[], embedding)
    return {
      id: word.id,
      lemma: word.Lemma,
      rank: word.R,
      similarity
    }
  })

  scored.sort((a, b) => b.similarity - a.similarity)
  const top = scored.slice(0, NEIGHBOR_LIMIT)

  const neighbors = top.map((entry, index) => {
    const heatScore = (entry.similarity + 1) / 2
    return {
      id: entry.id,
      lemma: entry.lemma,
      rank: index + 1,
      similarity: entry.similarity,
      distance: 1 - entry.similarity,
      heatScore
    }
  })

  return {
    target: { id: targetId, lemma: targetLemma },
    neighbors,
    source: 'embeddings'
  }
})
