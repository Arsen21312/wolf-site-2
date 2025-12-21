import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { createClient } from '@supabase/supabase-js'

type EmbeddingRow = {
  word_id: number
  embedding: number[]
}

const TARGET_DIM = 384
const BATCH_SIZE = Number.parseInt(process.env.BATCH_SIZE ?? '500', 10)
const INPUT_CSV = process.env.INPUT_CSV ?? path.join(process.cwd(), 'context-embeddings-384.csv')

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

function parseNumber(value: string): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number value: ${value}`)
  }
  return parsed
}

async function upsertBatch(
  supabase: ReturnType<typeof createClient>,
  rows: EmbeddingRow[],
  processed: number
) {
  if (!rows.length) return
  const { error } = await supabase
    .from('context_word_embeddings')
    .upsert(rows, { onConflict: 'word_id' })

  if (error) {
    throw error
  }

  console.log(`Upserted ${rows.length} rows (total ${processed})`)
}

async function main() {
  loadEnv()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  if (!fs.existsSync(INPUT_CSV)) {
    throw new Error(`CSV file not found: ${INPUT_CSV}`)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })

  const fileStream = fs.createReadStream(INPUT_CSV, { encoding: 'utf8' })
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })

  let headerChecked = false
  let batch: EmbeddingRow[] = []
  let processed = 0

  for await (const line of rl) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (!headerChecked) {
      const columns = trimmed.split(',')
      if (columns.length !== TARGET_DIM + 1 || columns[0] !== 'word_id') {
        throw new Error('CSV header is invalid or does not match expected format')
      }
      headerChecked = true
      continue
    }

    const parts = trimmed.split(',')
    if (parts.length !== TARGET_DIM + 1) {
      throw new Error(`Invalid CSV row length: ${parts.length}`)
    }

    const wordId = parseNumber(parts[0])
    const embedding = parts.slice(1).map(parseNumber)
    if (embedding.length !== TARGET_DIM) {
      throw new Error(`Embedding length mismatch for word_id ${wordId}`)
    }

    batch.push({ word_id: wordId, embedding })
    if (batch.length >= BATCH_SIZE) {
      processed += batch.length
      await upsertBatch(supabase, batch, processed)
      batch = []
    }
  }

  if (batch.length) {
    processed += batch.length
    await upsertBatch(supabase, batch, processed)
  }

  console.log('Import complete')
}

main().catch((error) => {
  console.error('Import embeddings failed', error)
  process.exitCode = 1
})
