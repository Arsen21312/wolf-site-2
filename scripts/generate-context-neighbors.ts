import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

type WordRow = {
  id: number
  Lemma: string
}

type EmbeddingRow = {
  word_id: number | string
  embedding: number[] | null
}

type WordVector = {
  id: number
  lemma: string
  embedding: number[]
}

const PAGE_SIZE = 1000
const NEIGHBOR_LIMIT = 5000
const UPSERT_BATCH = 500
const SLEEP_MS = 200
const EMBEDDING_DIM = 384

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if (!key || process.env[key]) continue
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function loadEnv() {
  const cwd = process.cwd()
  loadEnvFile(path.join(cwd, '.env'))
  loadEnvFile(path.join(cwd, '.env.local'))
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

async function getAllActiveWords(supabase: ReturnType<typeof createClient>): Promise<WordRow[]> {
  const rows: WordRow[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('context_words')
      .select('id, "Lemma"')
      .eq('game_id', 1)
      .eq('is_core', true)
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error('WORDS PAGE ERROR', { from, error })
      break
    }

    const chunk = (data ?? []) as WordRow[]
    if (!chunk.length) break
    rows.push(...chunk)
    if (chunk.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return rows
}

async function getEmbeddingsMap(
  supabase: ReturnType<typeof createClient>,
  wordIds: number[]
): Promise<Map<number, number[]>> {
  const map = new Map<number, number[]>()
  const batches = chunkArray(wordIds, PAGE_SIZE)

  for (const batch of batches) {
    const { data, error } = await supabase
      .from('context_word_embeddings')
      .select('word_id, embedding')
      .in('word_id', batch)

    if (error) {
      console.error('EMBEDDINGS PAGE ERROR', { error })
      break
    }

    for (const row of (data ?? []) as EmbeddingRow[]) {
      const id = Number(row.word_id)
      const embedding = parseEmbedding(row.embedding)
      if (!Number.isFinite(id) || !embedding || embedding.length !== EMBEDDING_DIM) continue
      map.set(id, embedding)
    }
  }

  return map
}

async function main() {
  loadEnv()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })

  const words = await getAllActiveWords(supabase)
  const wordIds = words.map((word) => word.id)
  const embeddings = await getEmbeddingsMap(supabase, wordIds)

  const vectors: WordVector[] = words
    .map((word) => {
      const embedding = embeddings.get(word.id)
      if (!embedding) return null
      return {
        id: word.id,
        lemma: word.Lemma,
        embedding
      }
    })
    .filter((word): word is WordVector => Boolean(word))

  console.log(`Active words: ${words.length}, with embeddings: ${vectors.length}`)

  for (let i = 0; i < vectors.length; i += 1) {
    const target = vectors[i]
    const scored = vectors.map((word) => ({
      word,
      similarity: cosineSimilarity(target.embedding, word.embedding)
    }))

    scored.sort((a, b) => b.similarity - a.similarity)
    const top = scored.slice(0, NEIGHBOR_LIMIT)
    const total = top.length

    const rows = top.map((entry, index) => {
      const rank = index + 1
      const percentile = total > 1 ? 1 - (rank - 1) / (total - 1) : 1
      const heatScore = Math.max(0, Math.min(1, percentile))
      const similarity = entry.similarity
      const distance = 1 - similarity
      return {
        target_word_id: target.id,
        neighbor_word_id: entry.word.id,
        rank,
        distance,
        similarity,
        heat_score: heatScore
      }
    })

    for (const batch of chunkArray(rows, UPSERT_BATCH)) {
      const { error } = await supabase
        .from('context_neighbors')
        .upsert(batch, { onConflict: 'target_word_id,neighbor_word_id' })

      if (error) {
        console.error('NEIGHBORS UPSERT ERROR', { targetId: target.id, error })
        return
      }
    }

    if ((i + 1) % 10 === 0 || i === vectors.length - 1) {
      console.log(`Processed ${i + 1}/${vectors.length} targets`)
    }

    await sleep(SLEEP_MS)
  }

  console.log('Neighbors generation done')
}

main().catch((error) => {
  console.error('Neighbors script failed', error)
  process.exitCode = 1
})
