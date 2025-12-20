import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getOpenAIClient } from '~/server/utils/openai'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type DefineBody = {
  lemma?: string
}

type NeighborRow = {
  neighbor_word_id: number | string
  rank: number | string
  distance: number | string
  similarity: number | string
  heat_score: number | string
}

type WordRow = {
  id: number | string
  Lemma: string
  R: number | string | null
  is_core: boolean
  is_active: boolean
}

const PAGE_SIZE = 1000
const NEIGHBOR_LIMIT = 300

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

function chunkArray<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

async function getAllActiveCoreWords() {
  const supabase = getSupabaseAdminClient()
  const rows: Array<{ id: number; Lemma: string; R: number | null }> = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('context_words')
      .select('id, "Lemma", "R"')
      .eq('game_id', 1)
      .eq('is_core', true)
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error('DEFINE WORDS PAGE ERROR', error)
      break
    }

    const chunk = (data ?? []) as Array<{ id: number | string; Lemma: string; R: number | string | null }>
    if (!chunk.length) break
    for (const row of chunk) {
      const id = Number(row.id)
      if (!Number.isFinite(id)) continue
      rows.push({
        id,
        Lemma: row.Lemma,
        R: row.R === null ? null : Number(row.R)
      })
    }
    if (chunk.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return rows
}

async function getEmbeddingsMap(wordIds: number[]) {
  const supabase = getSupabaseAdminClient()
  const map = new Map<number, number[]>()
  const batches = chunkArray(wordIds, PAGE_SIZE)

  for (const batch of batches) {
    const { data, error } = await supabase
      .from('context_word_embeddings')
      .select('word_id, embedding')
      .in('word_id', batch)

    if (error) {
      console.error('DEFINE EMBEDDINGS ERROR', error)
      break
    }

    for (const row of (data ?? []) as Array<{ word_id: number | string; embedding: number[] | null }>) {
      const id = Number(row.word_id)
      if (!Number.isFinite(id) || !Array.isArray(row.embedding)) continue
      map.set(id, row.embedding)
    }
  }

  return map
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
  const openai = getOpenAIClient()

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

  const { data: neighborRows, error: neighborsError } = await supabase
    .from('context_neighbors')
    .select('neighbor_word_id, rank, distance, similarity, heat_score')
    .eq('target_word_id', targetId)
    .order('rank', { ascending: true })
    .limit(NEIGHBOR_LIMIT)

  if (neighborsError) {
    console.error(neighborsError)
  }

  if (neighborRows && neighborRows.length) {
    const neighborIds = neighborRows.map((row) => Number(row.neighbor_word_id)).filter((id) => Number.isFinite(id))
    const { data: words } = await supabase
      .from('context_words')
      .select('id, "Lemma", "R"')
      .eq('is_active', true)
      .in('id', neighborIds)

    const wordMap = new Map<number, { lemma: string; rank: number | null }>()
    for (const row of (words ?? []) as Array<{ id: number | string; Lemma: string; R: number | string | null }>) {
      const id = Number(row.id)
      if (!Number.isFinite(id)) continue
      wordMap.set(id, { lemma: row.Lemma, rank: row.R === null ? null : Number(row.R) })
    }

    const neighbors = (neighborRows as NeighborRow[]).map((row) => {
      const id = Number(row.neighbor_word_id)
      const info = wordMap.get(id)
      return {
        id,
        lemma: info?.lemma ?? '',
        rank: Number(row.rank),
        similarity: Number(row.similarity),
        distance: Number(row.distance),
        heatScore: Number(row.heat_score)
      }
    })

    return {
      target: { id: targetId, lemma: targetLemma },
      neighbors,
      source: 'neighbors'
    }
  }

  const { data: existingEmbedding } = await supabase
    .from('context_word_embeddings')
    .select('word_id, embedding')
    .eq('word_id', targetId)
    .maybeSingle()

  let targetEmbedding = Array.isArray(existingEmbedding?.embedding) ? existingEmbedding?.embedding : null

  if (!targetEmbedding) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: [targetLemma],
      encoding_format: 'float'
    })
    targetEmbedding = response.data[0]?.embedding ?? null

    if (!targetEmbedding) {
      setResponseStatus(event, 500)
      return { ok: false, message: 'Failed to compute embedding' }
    }

    const { error: insertEmbeddingError } = await supabase
      .from('context_word_embeddings')
      .upsert([{ word_id: targetId, embedding: targetEmbedding }], { onConflict: 'word_id' })

    if (insertEmbeddingError) {
      console.error(insertEmbeddingError)
      setResponseStatus(event, 500)
      return { ok: false, message: 'Failed to save embedding' }
    }
  }

  const words = await getAllActiveCoreWords()
  const wordIds = words.map((word) => word.id)
  const embeddingsMap = await getEmbeddingsMap(wordIds)
  const candidates = words.filter((word) => embeddingsMap.has(word.id))

  if (candidates.length < 100) {
    setResponseStatus(event, 500)
    return { ok: false, message: 'embeddings_unavailable' }
  }

  if (!embeddingsMap.has(targetId)) {
    candidates.push({
      id: targetId,
      Lemma: targetLemma,
      R: null
    })
    embeddingsMap.set(targetId, targetEmbedding)
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

  const upsertRows = neighbors.map((row) => ({
    target_word_id: targetId,
    neighbor_word_id: row.id,
    rank: row.rank,
    distance: row.distance,
    similarity: row.similarity,
    heat_score: row.heatScore
  }))

  const { error: neighborSaveError } = await supabase
    .from('context_neighbors')
    .upsert(upsertRows, { onConflict: 'target_word_id,neighbor_word_id' })

  if (neighborSaveError) {
    console.error(neighborSaveError)
  }

  return {
    target: { id: targetId, lemma: targetLemma },
    neighbors,
    source: 'embeddings'
  }
})
