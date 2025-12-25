type VectorArray = Float32Array | { [index: number]: number; length: number }

type AmbientMeta = {
  count: number
  dim: number
  version?: string
  model?: string
}

type InitMessage = {
  requestId: number
  type: 'init'
  baseUrl: string
}

type PrepareTargetMessage = {
  requestId: number
  type: 'prepareTarget'
  targetIndex: number
}

type GuessMessage = {
  requestId: number
  type: 'guess'
  lemma: string
}

type HintMessage = {
  requestId: number
  type: 'hint'
  bestPosition: number | null
  usedIndices: number[]
  usedLemmas: string[]
}

type NeighborsMessage = {
  requestId: number
  type: 'neighbors'
  limit: number
}

type PickRandomMessage = {
  requestId: number
  type: 'pickRandom'
}

type PickByLemmaMessage = {
  requestId: number
  type: 'pickByLemma'
  lemma: string
}

type PickByIndexMessage = {
  requestId: number
  type: 'pickByIndex'
  index: number
}

type RequestMessage =
  | InitMessage
  | PrepareTargetMessage
  | GuessMessage
  | HintMessage
  | NeighborsMessage
  | PickRandomMessage
  | PickByLemmaMessage
  | PickByIndexMessage

type ResponsePayload =
  | { ok: true; count: number; dim: number }
  | { ok: true; index: number; lemma: string; total: number }
  | { ok: true; index: number; lemma: string; position: number; similarity: number; total: number; isWin: boolean }
  | { ok: true; neighbors: Array<{ index: number; lemma: string; position: number; similarity: number }>; total: number }
  | { ok: false; message: string }

let words: string[] = []
let wordToIndex = new Map<string, number>()
let vectors: VectorArray | null = null
let meta: AmbientMeta | null = null

let targetIndex: number | null = null
let simsToTarget: Float32Array | null = null
let rankByIndex: Int32Array | null = null
let rankOrder: number[] | null = null

let loadPromise: Promise<void> | null = null
let dbReady = true

const DB_NAME = 'wolf-context'
const STORE_NAME = 'ambient'

type ProgressStage = 'meta' | 'words' | 'vectors'

function reportProgress(stage: ProgressStage, source: 'cache' | 'network') {
  self.postMessage({ type: 'progress', stage, source })
}

function openDb(): Promise<IDBDatabase> {
  if (!('indexedDB' in self)) {
    dbReady = false
    return Promise.reject(new Error('indexeddb_unavailable'))
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('indexeddb_open_failed'))
  })
}

function idbGet(db: IDBDatabase, key: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('indexeddb_get_failed'))
  })
}

function idbSet(db: IDBDatabase, key: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(value, key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('indexeddb_set_failed'))
  })
}

function resolveMetaVersion(metaJson: AmbientMeta): string {
  if (typeof metaJson.version === 'string' && metaJson.version.trim()) {
    return metaJson.version.trim()
  }
  const suffix = typeof metaJson.model === 'string' && metaJson.model ? metaJson.model : 'ambient'
  return `${metaJson.count}x${metaJson.dim}:${suffix}`
}

function normalizeLemma(value: string): string {
  return value
    .toLowerCase()
    .replace(/\u0451/g, '\u0435')
    .replace(/[^\u0430-\u044f]/gi, '')
    .trim()
}

function float16ToFloat32(input: number): number {
  const sign = (input & 0x8000) >> 15
  const exponent = (input & 0x7c00) >> 10
  const fraction = input & 0x03ff

  if (exponent === 0) {
    if (fraction === 0) return sign ? -0 : 0
    return (sign ? -1 : 1) * Math.pow(2, -14) * (fraction / 0x400)
  }

  if (exponent === 0x1f) {
    return fraction ? NaN : sign ? -Infinity : Infinity
  }

  return (sign ? -1 : 1) * Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
}

async function loadAmbient(baseUrl: string) {
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    let cachedMeta: AmbientMeta | null = null
    let cachedWords: string[] | null = null
    let cachedVectors: ArrayBuffer | null = null
    let cachedVersion = ''
    let networkVersion = ''

    if (dbReady) {
      try {
        const db = await openDb()
        const metaRaw = (await idbGet(db, 'meta')) as AmbientMeta | undefined
        const wordsRaw = (await idbGet(db, 'words')) as string[] | undefined
        const vectorsRaw = (await idbGet(db, 'vectors')) as ArrayBuffer | undefined
        const versionRaw = (await idbGet(db, 'version')) as string | undefined
        db.close()

        cachedMeta = metaRaw ?? null
        cachedWords = Array.isArray(wordsRaw) ? wordsRaw : null
        cachedVectors = vectorsRaw ?? null
        cachedVersion = typeof versionRaw === 'string' ? versionRaw : ''
      } catch (error) {
        dbReady = false
      }
    }

    let metaJson: AmbientMeta | null = null
    let wordsJson: string[] | null = null
    let buffer: ArrayBuffer | null = null
    let version = ''

    reportProgress('meta', 'network')
    const metaResponse = await fetch(`${baseUrl}/meta.json`, { cache: 'no-store' })
    if (!metaResponse.ok) throw new Error('Failed to load ambient meta')
    const metaPayload = (await metaResponse.json()) as AmbientMeta
    const resolvedVersion = resolveMetaVersion(metaPayload)
    metaPayload.version = resolvedVersion
    networkVersion = resolvedVersion

    if (cachedMeta && cachedWords && cachedVectors && cachedVersion && cachedVersion === networkVersion) {
      const expectedBytes = cachedMeta.count * cachedMeta.dim * 2
      if (cachedVectors.byteLength === expectedBytes && cachedWords.length === cachedMeta.count) {
        reportProgress('meta', 'cache')
        reportProgress('words', 'cache')
        reportProgress('vectors', 'cache')
        metaJson = cachedMeta
        wordsJson = cachedWords
        buffer = cachedVectors
        version = cachedVersion
      }
    }

    if (!metaJson || !wordsJson || !buffer) {
      metaJson = metaPayload
      version = networkVersion

      reportProgress('words', 'network')
      const wordsResponse = await fetch(`${baseUrl}/words.json`)
      if (!wordsResponse.ok) throw new Error('Failed to load ambient words')
      wordsJson = (await wordsResponse.json()) as string[]

      reportProgress('vectors', 'network')
      const vectorsResponse = await fetch(`${baseUrl}/vectors.f16`)
      if (!vectorsResponse.ok) throw new Error('Failed to load ambient vectors')
      buffer = await vectorsResponse.arrayBuffer()

      if (dbReady) {
        try {
          const db = await openDb()
          await idbSet(db, 'meta', metaJson)
          await idbSet(db, 'words', wordsJson)
          await idbSet(db, 'vectors', buffer)
          await idbSet(db, 'version', version)
          db.close()
        } catch (error) {
          dbReady = false
        }
      }
    }

    if (!metaJson || !wordsJson || !buffer) {
      throw new Error('Ambient cache missing')
    }

    if (!Number.isFinite(metaJson.count) || !Number.isFinite(metaJson.dim)) {
      throw new Error('Ambient meta is invalid')
    }

    if (!Array.isArray(wordsJson) || wordsJson.length !== metaJson.count) {
      throw new Error('Ambient words length mismatch')
    }

    const expectedBytes = metaJson.count * metaJson.dim * 2
    if (buffer.byteLength !== expectedBytes) {
      throw new Error('Ambient vectors size mismatch')
    }

    const float16Ctor = (globalThis as any).Float16Array as
      | (new (buffer: ArrayBufferLike) => { [index: number]: number; length: number })
      | undefined

    let vectorsArray: VectorArray
    if (float16Ctor) {
      vectorsArray = new float16Ctor(buffer)
    } else {
      const raw = new Uint16Array(buffer)
      const converted = new Float32Array(raw.length)
      for (let i = 0; i < raw.length; i += 1) {
        converted[i] = float16ToFloat32(raw[i] ?? 0)
      }
      vectorsArray = converted
    }

    const map = new Map<string, number>()
    for (let i = 0; i < wordsJson.length; i += 1) {
      const normalized = normalizeLemma(wordsJson[i] ?? '')
      if (!normalized) continue
      if (!map.has(normalized)) {
        map.set(normalized, i)
      }
    }

    words = wordsJson
    wordToIndex = map
    vectors = vectorsArray
    meta = { count: metaJson.count, dim: metaJson.dim, version }
  })()

  await loadPromise
}

function dotAt(aOffset: number, bOffset: number, dim: number): number {
  if (!vectors) return 0
  let dot = 0
  for (let i = 0; i < dim; i += 1) {
    const av = vectors[aOffset + i] ?? 0
    const bv = vectors[bOffset + i] ?? 0
    dot += av * bv
  }
  return dot
}

function buildRanks(nextTargetIndex: number) {
  if (!meta || !vectors) throw new Error('Ambient not loaded')
  const count = meta.count
  const dim = meta.dim
  const sims = new Float32Array(count)

  const targetOffset = nextTargetIndex * dim
  for (let i = 0; i < count; i += 1) {
    const offset = i * dim
    sims[i] = dotAt(targetOffset, offset, dim)
  }

  const order = Array.from({ length: count }, (_, i) => i)
  order.sort((a, b) => {
    const diff = (sims[b] ?? 0) - (sims[a] ?? 0)
    if (diff !== 0) return diff
    return a - b
  })

  const ranks = new Int32Array(count)
  for (let i = 0; i < order.length; i += 1) {
    ranks[order[i]] = i + 1
  }

  targetIndex = nextTargetIndex
  simsToTarget = sims
  rankByIndex = ranks
  rankOrder = order
}

function ensureTargetReady() {
  if (targetIndex === null || !simsToTarget || !rankByIndex || !rankOrder) {
    throw new Error('Target ranking not prepared')
  }
}

function getWordByIndex(index: number) {
  if (!meta || !words.length) throw new Error('Ambient not loaded')
  if (!Number.isInteger(index) || index < 0 || index >= meta.count) {
    throw new Error('Target index out of range')
  }
  return { index, lemma: words[index], total: meta.count }
}

function getWordByLemma(lemma: string) {
  const normalized = normalizeLemma(lemma)
  if (!normalized) return null
  const index = wordToIndex.get(normalized)
  if (index === undefined) return null
  return { index, lemma: words[index], total: meta?.count ?? 0 }
}

function resolveGuess(lemma: string) {
  ensureTargetReady()
  const resolved = getWordByLemma(lemma)
  if (!resolved) {
    return { ok: false as const, message: 'word_not_found' }
  }
  const similarity = simsToTarget?.[resolved.index] ?? 0
  const position = rankByIndex?.[resolved.index] ?? 0
  const isWin = resolved.index === targetIndex
  return {
    ok: true as const,
    index: resolved.index,
    lemma: resolved.lemma,
    position,
    similarity,
    total: meta?.count ?? 0,
    isWin
  }
}

function resolveHint(bestPosition: number | null, usedIndices: number[], usedLemmas: string[]) {
  ensureTargetReady()
  const total = meta?.count ?? 0
  const resolvedBest = Number.isFinite(bestPosition) && bestPosition && bestPosition > 0 ? bestPosition : total + 1
  if (resolvedBest <= 1) {
    return { ok: false as const, message: 'already_best' }
  }

  const targetPos = Math.max(1, Math.ceil(resolvedBest / 2))
  let resolvedIndex = Math.max(0, Math.min(total - 1, targetPos - 1))

  const usedIdSet = new Set(usedIndices.map((id) => Number(id)).filter((id) => Number.isFinite(id)))
  const usedLemmaSet = new Set(
    usedLemmas.map((lemma) => normalizeLemma(lemma)).filter((lemma) => lemma.length > 0)
  )

  let attempts = 0
  const maxAttempts = 50
  let candidate = rankOrder?.[resolvedIndex]

  while (candidate !== undefined && attempts < maxAttempts) {
    if (usedIdSet.has(candidate)) {
      resolvedIndex += 1
      candidate = rankOrder?.[resolvedIndex]
      attempts += 1
      continue
    }
    const candidateLemma = words[candidate] ?? ''
    if (usedLemmaSet.has(normalizeLemma(candidateLemma))) {
      resolvedIndex += 1
      candidate = rankOrder?.[resolvedIndex]
      attempts += 1
      continue
    }
    break
  }

  if (candidate === undefined) {
    return { ok: false as const, message: 'hint_failed' }
  }

  const similarity = simsToTarget?.[candidate] ?? 0
  const position = rankByIndex?.[candidate] ?? 0
  const isWin = candidate === targetIndex
  return {
    ok: true as const,
    index: candidate,
    lemma: words[candidate],
    position,
    similarity,
    total,
    isWin
  }
}

function resolveNeighbors(limit: number) {
  ensureTargetReady()
  const total = meta?.count ?? 0
  const capped = Math.max(1, Math.min(total, Math.floor(limit)))
  const list: Array<{ index: number; lemma: string; position: number; similarity: number }> = []
  for (let i = 0; i < capped; i += 1) {
    const index = rankOrder?.[i]
    if (index === undefined) break
    list.push({
      index,
      lemma: words[index],
      position: i + 1,
      similarity: simsToTarget?.[index] ?? 0
    })
  }
  return { ok: true as const, neighbors: list, total }
}

function respond(requestId: number, payload: ResponsePayload) {
  self.postMessage({ requestId, ...payload })
}

self.onmessage = async (event: MessageEvent<RequestMessage>) => {
  const message = event.data

  try {
    switch (message.type) {
      case 'init': {
        await loadAmbient(message.baseUrl)
        if (!meta) throw new Error('Ambient meta missing')
        respond(message.requestId, { ok: true, count: meta.count, dim: meta.dim })
        break
      }
      case 'prepareTarget': {
        if (!meta) throw new Error('Ambient not loaded')
        buildRanks(message.targetIndex)
        respond(message.requestId, { ok: true, count: meta.count, dim: meta.dim })
        break
      }
      case 'guess': {
        const payload = resolveGuess(message.lemma)
        respond(message.requestId, payload)
        break
      }
      case 'hint': {
        const payload = resolveHint(message.bestPosition, message.usedIndices, message.usedLemmas)
        respond(message.requestId, payload)
        break
      }
      case 'neighbors': {
        const payload = resolveNeighbors(message.limit)
        respond(message.requestId, payload)
        break
      }
      case 'pickRandom': {
        if (!meta) throw new Error('Ambient not loaded')
        const index = Math.floor(Math.random() * meta.count)
        respond(message.requestId, { ok: true, index, lemma: words[index], total: meta.count })
        break
      }
      case 'pickByLemma': {
        const resolved = getWordByLemma(message.lemma)
        if (!resolved) {
          respond(message.requestId, { ok: false, message: 'target_not_found' })
          break
        }
        respond(message.requestId, { ok: true, index: resolved.index, lemma: resolved.lemma, total: resolved.total })
        break
      }
      case 'pickByIndex': {
        const resolved = getWordByIndex(message.index)
        respond(message.requestId, { ok: true, index: resolved.index, lemma: resolved.lemma, total: resolved.total })
        break
      }
      default:
        respond(message.requestId, { ok: false, message: 'unsupported_request' })
    }
  } catch (error) {
    console.error('AMBIENT WORKER ERROR', error)
    const messageText = (error as Error).message || 'ambient_load_failed'
    respond(message.requestId, { ok: false, message: messageText })
  }
}
