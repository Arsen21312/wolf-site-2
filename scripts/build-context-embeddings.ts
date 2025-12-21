import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { PCA } from 'ml-pca'

type WordRow = {
  id: number | string
  Lemma: string
  is_active?: boolean | null
  is_core?: boolean | null
  game_id?: number | string | null
  [key: string]: unknown
}

const PAGE_SIZE = 1000
const EMBEDDING_BATCH = 128
const SLEEP_MS = 300
const EMBEDDING_DIM = 1536
const TARGET_DIM = 384

const MAX_WORDS = Number.parseInt(process.env.MAX_WORDS ?? '15000', 10)
const MIN_WORDS = Number.parseInt(process.env.MIN_WORDS ?? '11516', 10)
const OUTPUT_CSV = process.env.OUTPUT_CSV ?? path.join(process.cwd(), 'context-embeddings-384.csv')

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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatColumn(column: string) {
  if (!column) return column
  if (/[A-Z]/.test(column) || /[^a-z0-9_]/i.test(column)) {
    return `"${column}"`
  }
  return column
}

function resolveNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

async function fetchWordsWithFreqColumn(
  supabase: ReturnType<typeof createClient>,
  freqColumn: string,
  freqOrder: 'asc' | 'desc'
) {
  const rows: WordRow[] = []
  let from = 0

  while (rows.length < MAX_WORDS) {
    const { data, error } = await supabase
      .from('context_words')
      .select(`id, "Lemma", ${formatColumn(freqColumn)}, is_active, is_core, game_id`)
      .eq('game_id', 1)
      .eq('is_active', true)
      .eq('is_core', true)
      .order(freqColumn, { ascending: freqOrder === 'asc' })
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      return { rows: [], error }
    }

    const chunk = (data ?? []) as WordRow[]
    if (!chunk.length) break
    rows.push(...chunk)
    if (chunk.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return { rows, error: null }
}

async function loadWords(supabase: ReturnType<typeof createClient>) {
  const explicitColumn = Boolean(process.env.FREQ_COLUMN)
  let freqColumn = process.env.FREQ_COLUMN ?? 'r_freq'
  let freqOrder = (process.env.FREQ_ORDER as 'asc' | 'desc' | undefined) ?? (freqColumn === 'R' ? 'asc' : 'desc')

  let { rows, error } = await fetchWordsWithFreqColumn(supabase, freqColumn, freqOrder)

  if (error && !explicitColumn && /column.+r_freq.+does not exist/i.test(error.message ?? '')) {
    freqColumn = 'R'
    freqOrder = 'asc'
    const retry = await fetchWordsWithFreqColumn(supabase, freqColumn, freqOrder)
    rows = retry.rows
    error = retry.error
  }

  if (error) {
    throw error
  }

  const words = rows
    .map((row) => {
      const id = resolveNumber(row.id)
      if (!id) return null
      const lemma = typeof row.Lemma === 'string' ? row.Lemma.trim() : ''
      if (!lemma) return null
      const freqValue = resolveNumber(row[freqColumn])
      if (freqValue === null) return null
      return { id, lemma, freq: freqValue }
    })
    .filter((row): row is { id: number; lemma: string; freq: number } => Boolean(row))

  if (freqOrder === 'asc') {
    words.sort((a, b) => (a.freq - b.freq) || (a.id - b.id))
  } else {
    words.sort((a, b) => (b.freq - a.freq) || (a.id - b.id))
  }

  const limited = words.slice(0, MAX_WORDS)
  return { words: limited, freqColumn, freqOrder }
}

function normalizeVector(vec: number[]): number[] {
  let sum = 0
  for (const value of vec) {
    sum += value * value
  }
  const norm = Math.sqrt(sum)
  if (!norm) return vec
  return vec.map((value) => value / norm)
}

function formatFloat(value: number) {
  if (!Number.isFinite(value)) return '0'
  return value.toFixed(6)
}

async function main() {
  loadEnv()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })
  const openai = new OpenAI({ apiKey })

  const { words, freqColumn, freqOrder } = await loadWords(supabase)
  console.log(`Selected words: ${words.length} (freq ${freqColumn} ${freqOrder})`)

  if (words.length < MIN_WORDS) {
    throw new Error(`Too few words (${words.length}). Expected at least ${MIN_WORDS}.`)
  }

  const embeddings: number[][] = new Array(words.length)
  for (let i = 0; i < words.length; i += EMBEDDING_BATCH) {
    const batch = words.slice(i, i + EMBEDDING_BATCH)
    const inputs = batch.map((word) => word.lemma)
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputs,
      encoding_format: 'float'
    })

    for (let j = 0; j < batch.length; j += 1) {
      const embedding = response.data[j]?.embedding ?? []
      if (embedding.length !== EMBEDDING_DIM) {
        throw new Error(`Unexpected embedding size ${embedding.length} for word_id ${batch[j].id}`)
      }
      embeddings[i + j] = embedding
    }

    if ((i + batch.length) % 1000 === 0 || i + batch.length === words.length) {
      console.log(`Embedded ${i + batch.length}/${words.length}`)
    }

    await sleep(SLEEP_MS)
  }

  console.log('Running PCA...')
  const pca = new PCA(embeddings, { center: true, scale: false })
  const reduced = pca.predict(embeddings, { nComponents: TARGET_DIM }).to2DArray()

  const outputDir = path.dirname(OUTPUT_CSV)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const stream = fs.createWriteStream(OUTPUT_CSV, { encoding: 'utf8' })
  const header = ['word_id', ...Array.from({ length: TARGET_DIM }, (_, idx) => `e${idx}`)].join(',')
  stream.write(`${header}\n`)

  for (let i = 0; i < words.length; i += 1) {
    const normalized = normalizeVector(reduced[i] ?? [])
    if (normalized.length !== TARGET_DIM) {
      throw new Error(`Unexpected PCA size ${normalized.length} for word_id ${words[i].id}`)
    }
    const row = [String(words[i].id), ...normalized.map(formatFloat)].join(',')
    stream.write(`${row}\n`)
  }

  await new Promise((resolve, reject) => {
    stream.end(() => resolve(null))
    stream.on('error', reject)
  })

  console.log(`CSV written to ${OUTPUT_CSV}`)
  console.log('Done.')
}

main().catch((error) => {
  console.error('Build embeddings failed', error)
  process.exitCode = 1
})
