import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

type WordRow = {
  id: number | string
  Lemma: string
}

const PAGE_SIZE = 1000
const BATCH_SIZE = 100
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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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

function buildPrompt(words: string[]) {
  return `Ты помогаешь чистить словарь русских слов для игры, где нужно угадывать секретное слово.
На вход тебе даётся список слов, по одному в строку.

Твоя задача:
- Оставить только хорошие слова, которые приятно видеть как цель или догадку.
- Для каждой «семьи» однотипных слов оставить одну базовую форму, а остальные выкинуть.

Правила отбора:
1) Оставь базовую словарную форму:
   - существительные в форме именительного падежа единственного числа, если это естественно
   - глаголы в инфинитиве
   - прилагательные в мужском роде, единственном числе
   - наречия, если они нормальные и самостоятельные
2) Убери формы, которые являются только склонениями или спряжениями других слов из списка:
   примеры, которые нужно выкинуть:
   "вершины, вершине, вершину", если есть "вершина"
   "вернул, верни, верила, верит, верили", если есть "вернуть" или "вера"
   "неудачная, неудачно, неудачные", если есть "неудача" или "неудачный"
3) Убери странные и мусорные варианты:
   - повторяющиеся части типа "не-не-не"
   - междометия, обрывки, звуки речи
   - слишком технические токены, если они выглядят как мусор в игре
4) Не переусердствуй: если слово нормальное и звучит как отдельное понятие, его лучше оставить.

Формат ответа строго такой:
для каждого входного слова одна строка вида

СЛОВО<TAB>KEEP
или
СЛОВО<TAB>DROP

Никаких комментариев, пояснений и пустых строк.

Список слов:

${words.join('\n')}

Теперь верни разметку для каждого слова.`
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

  const { count, error: countError } = await supabase
    .from('context_words')
    .select('id', { count: 'exact', head: true })
    .eq('game_id', 1)
    .eq('is_core', true)

  if (countError) {
    throw countError
  }

  const total = count ?? 0
  console.log(`Total core words: ${total}`)

  let offset = 0
  let processed = 0

  while (true) {
    const { data, error } = await supabase
      .from('context_words')
      .select('id, "Lemma"')
      .eq('game_id', 1)
      .eq('is_core', true)
      .order('id', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error('Supabase page error', error)
      break
    }

    const page = (data ?? []) as WordRow[]
    if (page.length === 0) break

    const batches = chunkArray(page, BATCH_SIZE)
    for (const batch of batches) {
      const lemmas = batch.map((row) => (row.Lemma || '').trim())

      const prompt = buildPrompt(lemmas)
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0
      })

      const content = response.choices[0]?.message?.content ?? ''
      const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)

      const dropSet = new Set<string>()

      for (const line of lines) {
        const [word, label] = line.split('\t')
        if (!word || !label) continue
        if (label.trim().toUpperCase() === 'DROP') {
          dropSet.add(word.trim())
        }
      }

      const dropList = Array.from(dropSet)
      if (dropList.length) {
        const { error: updateError } = await supabase
          .from('context_words')
          .update({ is_active: false })
          .eq('game_id', 1)
          .in('Lemma', dropList)

        if (updateError) {
          console.error('Supabase update error', updateError)
          return
        }
      }

      processed += batch.length
      console.log(
        `Batch processed: ${batch.length}, DROP: ${dropList.length}, progress ${processed}/${total}`
      )
      await sleep(SLEEP_MS)
    }

    offset += PAGE_SIZE
  }

  console.log('Cleanup done')
}

main().catch((error) => {
  console.error('Cleanup script failed', error)
  process.exitCode = 1
})
