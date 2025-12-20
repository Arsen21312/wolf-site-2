import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

type WordRow = {
  id: number | string
  Lemma: string
}

type EmbeddingRow = {
  word_id: number | string
  embedding: number[]
}

const PAGE_SIZE = 500
const EMBEDDING_BATCH = 128
const SLEEP_MS = 300

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

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI({ apiKey })


  const { count, error: countError } = await supabase
    .from('context_words')
    .select('id', { count: 'exact', head: true })
    .eq('game_id', 1)
    .eq('is_core', true)
    .eq('is_active', true)

  if (countError) {
    throw countError
  }

  const total = count ?? 0
  console.log(`Total core words: ${total}`)

  let offset = 0
  let processed = 0

  while (true) {
    const { data: words, error } = await supabase
      .from('context_words')
      .select('id, "Lemma"')
      .eq('game_id', 1)
      .eq('is_core', true)
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error('Supabase page error', error)
      break
    }

    if (!words || words.length === 0) {
      break
    }

    const pageWords = words as WordRow[]
    const wordIds = pageWords.map((word) => Number(word.id)).filter((id) => Number.isFinite(id))

    const { data: existing, error: existingError } = await supabase
      .from('context_word_embeddings')
      .select('word_id')
      .in('word_id', wordIds)

    if (existingError) {
      console.error('Supabase existing embeddings error', existingError)
      break
    }

    const existingIds = new Set((existing ?? []).map((row) => Number(row.word_id)))
    const toEmbed = pageWords.filter((word) => {
      const id = Number(word.id)
      if (!Number.isFinite(id)) return false
      return !existingIds.has(id)
    })

    if (toEmbed.length === 0) {
      offset += PAGE_SIZE
      continue
    }

    const batches = chunkArray(toEmbed, EMBEDDING_BATCH)
    for (const batch of batches) {
      const inputs = batch.map((word) => (word.Lemma || '').trim())

      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: inputs,
        encoding_format: 'float'
      })

      const rows: EmbeddingRow[] = batch.map((word, idx) => ({
        word_id: Number(word.id),
        embedding: response.data[idx]?.embedding ?? []
      }))

      const { error: upsertError } = await supabase
        .from('context_word_embeddings')
        .upsert(rows, { onConflict: 'word_id' })

      if (upsertError) {
        console.error('Supabase upsert error', upsertError)
        return
      }

      processed += rows.length
      const lastId = rows[rows.length - 1]?.word_id
      console.log(`Saved ${rows.length} embeddings, processed ${processed}/${total}, last word_id=${lastId}`)
      await sleep(SLEEP_MS)
    }

    offset += PAGE_SIZE
  }

  console.log('Done generating embeddings')
}

main().catch((error) => {
  console.error('Embedding script failed', error)
  process.exitCode = 1
})
