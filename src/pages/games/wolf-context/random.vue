﻿﻿<template>
  <section class="wc-shell">
    <div class="wc-container">
      <ContextGameHeader
        :breadcrumbs="breadcrumbs"
        :attempts="attemptsCount"
        :hints="hintsCount"
        @how-to="openHowTo"
        @tasks="openTasks"
        @party="goParty"
        @create="goCreate"
        @reset="resetCache"
      />

      <div class="wc-form">
        <div class="wc-input-row">
          <input
            id="guess-input"
            ref="guessInputRef"
            v-model="guessInput"
            class="wc-input"
            type="text"
            placeholder="Пиши ассоциацию"
            @keyup.enter="submitGuess"
            :disabled="isWon || isAmbientLoading || isTargetPreparing"
          />
          <button
            class="wc-send"
            type="button"
            @click="submitGuess"
            aria-label="Проверить"
            :disabled="isWon || isGuessing || isHinting || isAmbientLoading || isTargetPreparing"
          >
            <span v-if="isGuessing" class="wc-spinner"></span>
            <span v-else class="wc-arrow">&gt;</span>
          </button>
          <button
            class="wc-btn ghost"
            type="button"
            @click="giveHint"
            :disabled="!canGiveHint || isGuessing || isHinting || isAmbientLoading || isTargetPreparing"
          >
            Подсказка
          </button>
        </div>
        <button v-if="isWon" class="wc-btn primary" type="button" @click="loadRandomGame">Новая игра</button>
      </div>

<ContextGuessList
        :items="attemptsSorted"
        :status="listStatus"
        :current-text="currentRowDisplay"
        :current-type="currentRowDisplayType"
        :current-rank="currentRowRank"
        :current-is-hint="currentRowIsHint"
        empty-text="История пока пуста"
      />

      <div v-if="showRules" class="wc-rules">
        <h2 class="wc-rules-title">Как играть в Волчий контекст</h2>
        <div class="wc-rules-list">
          <div class="wc-rules-item">
            <span class="wc-rules-label">Цель</span>
            <p class="wc-rules-text">
              Есть секретное слово — оно номер 1 в большом списке. Твоя задача — добраться до него, угадывая ассоциации.
            </p>
          </div>
          <div class="wc-rules-item">
            <span class="wc-rules-label">Правила</span>
            <p class="wc-rules-text">
              У тебя неограниченное количество попыток. Пиши любые русские слова. Чем меньше номер, тем ближе слово к ответу. После каждой попытки ты видишь позицию и цвет полоски от льда к огню.
            </p>
          </div>
          <div class="wc-rules-item">
            <span class="wc-rules-label">Как это работает</span>
            <p class="wc-rules-text">
              Это «горячо/холодно» для слов: если ответ «кот», то «кошка» ближе, чем «собака». Алгоритм смотрит, как слова встречаются в текстах, и оценивает их похожесть по контексту.
            </p>
          </div>
          <div class="wc-rules-item">
            <span class="wc-rules-label">Подсказки</span>
            <p class="wc-rules-text">
              Если застрял, жми «Подсказка». Игра предложит слово, которое лучше твоего текущего результата.
            </p>
          </div>
        </div>
      </div>

    </div>
    <ContextHowToModal v-model="isHowToOpen" />
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ContextGameHeader from '~/components/context/ContextGameHeader.vue'
import ContextGuessList from '~/components/context/ContextGuessList.vue'
import ContextHowToModal from '~/components/context/ContextHowToModal.vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'
import { officialGames } from '~/data/wolf-context/officialGames'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий Контекст' }
]

type Guess = {
  id: number
  lemma: string
  position: number
  total: number
  similarity: number
  heatScore: number
  zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire' | 'finish'
  isHint: boolean
  createdAt: number
}

useHead({
  title: 'Волчий Контекст — игра на ассоциации',
  meta: [
    {
      name: 'description',
      content:
        'Угадай секретное слово по контексту. Чем меньше номер, тем ближе к ответу. Подсказки помогают продвигаться к цели.'
    },
    { property: 'og:title', content: 'Волчий Контекст — игра на ассоциации' },
    {
      property: 'og:description',
      content:
        'Угадай секретное слово по контексту. Чем меньше номер, тем ближе к ответу. Подсказки помогают продвигаться к цели.'
    }
  ]
})

const guessInput = ref('')
const guessInputRef = ref<HTMLInputElement | null>(null)
const currentRowText = ref('')
const currentRowType = ref<'guess' | 'error' | 'info'>('info')
const currentRowRank = ref<number | null>(null)
const currentRowIsHint = ref(false)
const targetIndex = ref<number | null>(null)
const targetLemma = ref<string | null>(null)
const guesses = ref<Guess[]>([])
const reactionMessage = ref('Готов к охоте')
const errorMessage = ref('')
const workerError = ref('')
const workerRef = ref<Worker | null>(null)
const ambientTotal = ref<number | null>(null)
const ambientDim = ref<number | null>(null)
const ambientStage = ref('')
const ambientSource = ref<'cache' | 'network' | ''>('')
const isAmbientLoading = ref(false)
const isTargetPreparing = ref(false)
const isWon = ref(false)
const isGuessing = ref(false)
const isHinting = ref(false)
const isHowToOpen = ref(false)
const isTasksOpen = ref(false)
const isCreateEnabled = true
const winMessage = ref('')

const winMessages = [
  'Красава, слово угадано, ты в топ 1',
  'Ауф, добыча взята, это номер 1',
  'Попадание в яблочко, слово найдено',
  'Ты на вершине списка, слово угадано',
  'Изи катка, секретное слово твоё'
]

const listStatus = computed(() => {
  if (isAmbientLoading.value || isTargetPreparing.value) {
    if (ambientStage.value) {
      const sourceLabel = ambientSource.value === 'cache' ? 'кеш' : 'сеть'
      return { type: 'loading' as const, text: `Загружаю ${ambientStage.value} (${sourceLabel})...` }
    }
    return { type: 'loading' as const, text: 'Загружаю контекст...' }
  }
  if (isGuessing.value || isHinting.value) {
    return { type: 'loading' as const, text: 'Думаю...' }
  }
  if (errorMessage.value) {
    return { type: 'error' as const, text: errorMessage.value }
  }
  return null
})


const attemptsCount = computed(() => guesses.value.filter((a) => !a.isHint).length)
const hintsCount = computed(() => guesses.value.filter((a) => a.isHint).length)
const hasAnyGuess = computed(() => guesses.value.length > 0)
const currentRowDisplay = computed(() => {
  if (currentRowText.value) return currentRowText.value
  if (!hasAnyGuess.value) return 'Готов к охоте'
  return ''
})

const currentRowDisplayType = computed<'guess' | 'error' | 'info'>(() => {
  if (currentRowText.value) return currentRowType.value
  if (!hasAnyGuess.value) return 'info'
  return 'guess'
})
const showRules = computed(() => !guesses.value.length && !guessInput.value.trim() && !isGuessing.value && !isHinting.value)

const bestPosition = computed(() => {
  const positions = guesses.value.map((a) => a.position).filter((n) => Number.isFinite(n))
  if (!positions.length) return Number.POSITIVE_INFINITY
  return Math.min(...positions)
})

const attemptsSorted = computed(() => {
  const sorted = [...guesses.value].sort((a, b) => {
    if (a.position === b.position) return a.createdAt - b.createdAt
    return a.position - b.position
  })
  return sorted
})

const canGiveHint = computed(() => {
  if (targetIndex.value === null) return false
  if (isAmbientLoading.value || isTargetPreparing.value) return false
  if (isWon.value) return false
  return true
})

function normalizeWord(value: string): string {
  return value
    .toLowerCase()
    .replace(/\u0451/g, '\u0435')
    .replace(/[^\u0430-\u044f]/gi, '')
    .trim()
}

function zoneFromHeat(heatScore: number) {
  if (heatScore < 0.25) return 'ice'
  if (heatScore < 0.5) return 'cold'
  if (heatScore < 0.75) return 'warm'
  return 'hot'
}

const FINISH_RANK = 299

function zoneFromRank(heatScore: number, position: number) {
  if (Number.isFinite(position) && position <= FINISH_RANK) return 'finish'
  return zoneFromHeat(heatScore)
}

function reactionForZone(zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire' | 'finish') {
  if (zone === 'finish') return 'Ты уже у финиша'
  if (zone === 'fire') return 'Огонь, ты совсем рядом'
  if (zone === 'hot') return 'Горячо, почти нашел'
  if (zone === 'warm') return 'Тепло, уже ближе'
  if (zone === 'cold') return 'Холодно еще, но след есть'
  return 'Ты далеко от цели'
}

async function loadRandomGame() {
  try {
    await ensureAmbientLoaded()
    const response = await callWorker<WorkerPickResponse>({ type: 'pickRandom' })
    if (!response.ok) {
      errorMessage.value = 'Не удалось загрузить словарь'
      return
    }
    await applyTarget(response)
  } catch (error) {
    console.error(error)
  }
}

function openHowTo() {
  isHowToOpen.value = true
}

function openTasks() {
  isTasksOpen.value = true
}

function goParty() {
  navigateTo('/games/wolf-context/party')
}

function goCreate() {
  if (isCreateEnabled) {
    navigateTo('/games/wolf-context/create')
    return
  }
  errorMessage.value = 'Режим в разработке'
}

async function resetCache() {
  if (!process.client || !('indexedDB' in window)) return
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase('wolf-context')
    request.onsuccess = () => resolve()
    request.onerror = () => resolve()
    request.onblocked = () => resolve()
  })
  window.location.reload()
}

async function applyTarget(response: WorkerPickResponseOk) {
  try {
    targetIndex.value = response.index
    targetLemma.value = response.lemma
    guesses.value = []
    reactionMessage.value = 'Готов к охоте'
    errorMessage.value = ''
    guessInput.value = ''
    currentRowText.value = ''
    currentRowType.value = 'info'
    winMessage.value = ''
    isWon.value = false
    await prepareTarget(response.index)
  } catch (e) {
    console.error('Не удалось подготовить слово', e)
    errorMessage.value = 'Не удалось подготовить слово'
  }
}

function resolveOfficialGame(id: number) {
  return officialGames.find((item) => item.id === id) ?? null
}

async function loadOfficialGame(id: number) {
  const task = resolveOfficialGame(id)
  if (!task) {
    errorMessage.value = 'Официальная игра не найдена'
    await loadRandomGame()
    return
  }
  try {
    await loadTargetByLemma(task.target)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось загрузить официальную игру'
    await loadRandomGame()
  }
}

async function loadUserGame(id: number) {
  try {
    const response = await $fetch<{ ok: boolean; game?: { targetWord?: string } }>(`/api/context/game?id=${id}`)
    if (!response.ok || !response.game?.targetWord) {
      errorMessage.value = 'Пользовательская игра не найдена'
      await loadRandomGame()
      return
    }
    await loadTargetByLemma(response.game.targetWord)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось загрузить игру'
    await loadRandomGame()
  }
}

async function loadTargetByIndex(index: number) {
  try {
    await ensureAmbientLoaded()
    const response = await callWorker<WorkerPickResponse>({ type: 'pickByIndex', index })
    if (!response.ok) {
      await loadRandomGame()
      return
    }
    await applyTarget(response)
  } catch (error) {
    console.error(error)
  }
}

async function loadTargetByLemma(lemma: string) {
  try {
    await ensureAmbientLoaded()
    const response = await callWorker<WorkerPickResponse>({ type: 'pickByLemma', lemma })
    if (!response.ok) {
      await loadRandomGame()
      return
    }
    await applyTarget(response)
  } catch (error) {
    console.error(error)
  }
}

async function submitGuess() {
  if (isGuessing.value || isHinting.value) return
  if (targetIndex.value === null || isWon.value || isAmbientLoading.value || isTargetPreparing.value) {
    errorMessage.value = ''
    currentRowText.value = 'Подожди, игра загружается'
    currentRowType.value = 'info'
    currentRowRank.value = null
    currentRowIsHint.value = false
    guessInput.value = ''
    focusInput()
    return
  }
  const rawInput = guessInput.value
  const guess = normalizeWord(rawInput)
  guessInput.value = ''
  errorMessage.value = ''
  if (!guess || guess.length < 3) {
    currentRowText.value = `слово "${rawInput.trim() || 'это'}" не в волчьем словаре`
    currentRowType.value = 'error'
    currentRowRank.value = null
    currentRowIsHint.value = false
    focusInput()
    return
  }

  const alreadyUsed = guesses.value.some((item) => normalizeWord(item.lemma) === guess)
  if (alreadyUsed) {
    currentRowText.value = `слово "${guess}" уже было введено`
    currentRowType.value = 'error'
    currentRowRank.value = null
    currentRowIsHint.value = false
    focusInput()
    return
  }

  currentRowText.value = guess
  currentRowType.value = 'guess'
  currentRowRank.value = null
  currentRowIsHint.value = false
  isGuessing.value = true
  try {
    const response = await callWorker<WorkerGuessResponse>({ type: 'guess', lemma: guess })
    if (!response.ok) {
      if (response.message === 'word_not_found') {
        currentRowText.value = `слово "${guess}" не в волчьем словаре`
        currentRowType.value = 'error'
        currentRowRank.value = null
        currentRowIsHint.value = false
        return
      }
      currentRowText.value = 'Не удалось проверить слово'
      currentRowType.value = 'error'
      currentRowRank.value = null
      currentRowIsHint.value = false
      return
    }

    const position = response.position
    const total = response.total
    const percentile = total > 1 ? 1 - (position - 1) / (total - 1) : 1
    const heatScore = Math.max(0, Math.min(1, percentile))
    const zone = zoneFromRank(heatScore, response.position)
    const reaction = reactionForZone(zone)
      addAttempt({
        id: response.index,
        lemma: response.lemma,
        position,
      total,
      similarity: response.similarity,
      heatScore,
      zone,
      isHint: false
    })
    currentRowRank.value = position
    currentRowIsHint.value = false
    reactionMessage.value = reaction
    errorMessage.value = ''
    if (response.isWin) {
      isWon.value = true
      currentRowText.value = pickWinMessage()
      currentRowType.value = 'info'
      currentRowIsHint.value = false
    }
  } catch (error) {
    console.error(error)
    currentRowText.value = 'Не удалось проверить слово'
    currentRowType.value = 'error'
  } finally {
    isGuessing.value = false
    focusInput()
  }
}

function addAttempt(payload: {
  id: number
  lemma: string
  position: number
  total: number
  similarity: number
  heatScore: number
  zone: Guess['zone']
  isHint: boolean
}) {
  const guessItem: Guess = {
    id: payload.id,
    lemma: payload.lemma,
    position: payload.position,
    total: payload.total,
    similarity: payload.similarity,
    heatScore: payload.heatScore,
    zone: payload.zone,
    isHint: payload.isHint,
    createdAt: Date.now()
  }
  guesses.value.push(guessItem)
}

function pickWinMessage() {
  if (winMessage.value) return winMessage.value
  const index = Math.floor(Math.random() * winMessages.length)
  const text = winMessages[index] || winMessages[0]
  winMessage.value = text
  return text
}

async function giveHint() {
  if (targetIndex.value === null || isWon.value || isAmbientLoading.value || isTargetPreparing.value) return

  const best = Number.isFinite(bestPosition.value) ? bestPosition.value : null

  isHinting.value = true
  try {
    const response = await callWorker<WorkerHintResponse>({
      type: 'hint',
      bestPosition: best,
      usedIndices: guesses.value.map((item) => item.id),
      usedLemmas: guesses.value.map((item) => item.lemma)
    })

    if (!response.ok) {
      if (response.message === 'already_best') {
        errorMessage.value = 'Ты уже на вершине списка, дальше подсказок нет'
        currentRowIsHint.value = false
        return
      }
      errorMessage.value = 'Не удалось получить подсказку'
      currentRowIsHint.value = false
      return
    }

    const position = response.position
    const total = response.total
    const percentile = total > 1 ? 1 - (position - 1) / (total - 1) : 1
    const heatScore = Math.max(0, Math.min(1, percentile))
    const zone = zoneFromRank(heatScore, response.position)
    const reaction = reactionForZone(zone)
    addAttempt({
      id: response.index,
      lemma: response.lemma,
      position,
      total,
      similarity: response.similarity,
      heatScore,
      zone,
        isHint: true
      })
      currentRowText.value = response.lemma
      currentRowType.value = 'guess'
      currentRowRank.value = position
      currentRowIsHint.value = true
      reactionMessage.value = reaction
    errorMessage.value = ''
    if (response.isWin) {
      isWon.value = true
      currentRowText.value = pickWinMessage()
      currentRowType.value = 'info'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось получить подсказку'
  } finally {
    isHinting.value = false
    focusInput()
  }
}

onMounted(() => {
  initFromRoute()
})

const lastRouteKey = ref('')

function buildRouteKey(route: ReturnType<typeof useRoute>) {
  const target = typeof route.query.targetId === 'string' ? route.query.targetId : ''
  const targetLemma = typeof route.query.target === 'string' ? route.query.target : ''
  const mode = typeof route.query.mode === 'string' ? route.query.mode : ''
  const officialId = typeof route.query.id === 'string' ? route.query.id : ''
  return `${target}|${targetLemma}|${mode}|${officialId}`
}

async function initFromRoute() {
  const route = useRoute()
  const routeKey = buildRouteKey(route)
  if (routeKey === lastRouteKey.value) return
  lastRouteKey.value = routeKey

  const queryTargetId = Number(route.query.targetId)
  const targetLemma = typeof route.query.target === 'string' ? route.query.target.trim() : ''
  const mode = typeof route.query.mode === 'string' ? route.query.mode : ''
  const rawModeId = typeof route.query.id === 'string' ? Number(route.query.id) : NaN

  if (Number.isFinite(queryTargetId)) {
    await loadTargetByIndex(queryTargetId)
    return
  }

  if (mode === 'official' && Number.isFinite(rawModeId)) {
    await loadOfficialGame(rawModeId)
    return
  }

  if (mode === 'user' && Number.isFinite(rawModeId)) {
    await loadUserGame(rawModeId)
    return
  }

  if (import.meta.dev && targetLemma) {
    await loadTargetByLemma(targetLemma)
    return
  }

  await loadRandomGame()
}

watch(
  () => useRoute().query,
  () => {
    initFromRoute()
  }
)

const pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (error: unknown) => void }>()
let requestId = 0
let ambientInitPromise: Promise<void> | null = null

type WorkerErrorResponse = { ok: false; message: string }
type WorkerInitResponse = { ok: true; count: number; dim: number } | WorkerErrorResponse
type WorkerPickResponseOk = { ok: true; index: number; lemma: string; total: number }
type WorkerPickResponse = WorkerPickResponseOk | WorkerErrorResponse
type WorkerGuessResponse =
  | { ok: true; index: number; lemma: string; position: number; similarity: number; total: number; isWin: boolean }
  | WorkerErrorResponse
type WorkerHintResponse = WorkerGuessResponse

function getWorker() {
  if (workerError.value) {
    throw new Error(workerError.value)
  }
  if (workerRef.value) return workerRef.value
  const worker = new Worker(new URL('../../../workers/contextAmbient.worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event) => {
    const { requestId: id, ...payload } = event.data ?? {}
    if (payload?.type === 'progress') {
      ambientStage.value = payload.stage || ''
      ambientSource.value = payload.source || ''
      return
    }
    const pending = pendingRequests.get(id)
    if (!pending) return
    pending.resolve(payload)
    pendingRequests.delete(id)
  }
  worker.onerror = (event) => {
    console.error('Context worker error', event)
    workerError.value = 'Ошибка воркера контекста'
    errorMessage.value = 'ambient не загрузился'
    for (const pending of pendingRequests.values()) {
      pending.reject(new Error(workerError.value))
    }
    pendingRequests.clear()
  }
  workerRef.value = worker
  return worker
}

function callWorker<T>(payload: Record<string, unknown>): Promise<T> {
  const worker = getWorker()
  const id = requestId += 1
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject })
    worker.postMessage({ requestId: id, ...payload })
  })
}

async function ensureAmbientLoaded() {
  if (ambientInitPromise) return ambientInitPromise
  isAmbientLoading.value = true
  ambientStage.value = ''
  ambientSource.value = ''
  ambientInitPromise = (async () => {
    const response = await callWorker<WorkerInitResponse>({ type: 'init', baseUrl: '/ambient' })
    if (!response.ok) {
      throw new Error(response.message || 'Ambient init failed')
    }
    ambientTotal.value = response.count
    ambientDim.value = response.dim
  })()
    .catch((error) => {
      ambientInitPromise = null
      console.error(error)
      errorMessage.value = 'ambient не загрузился'
      throw error
    })
    .finally(() => {
      isAmbientLoading.value = false
      ambientStage.value = ''
      ambientSource.value = ''
    })
  return ambientInitPromise
}

async function prepareTarget(index: number) {
  isTargetPreparing.value = true
  try {
    const response = await callWorker<WorkerInitResponse>({ type: 'prepareTarget', targetIndex: index })
    if (!response.ok) {
      throw new Error(response.message || 'Failed to build ranks')
    }
    ambientTotal.value = response.count
    ambientDim.value = response.dim
  } catch (error) {
    console.error(error)
    errorMessage.value = 'ambient не загрузился'
    throw error
  } finally {
    isTargetPreparing.value = false
  }
}

onBeforeUnmount(() => {
  if (!workerRef.value) return
  workerRef.value.terminate()
  workerRef.value = null
  for (const pending of pendingRequests.values()) {
    pending.reject(new Error('Worker terminated'))
  }
  pendingRequests.clear()
})

function focusInput() {
  nextTick(() => {
    const el = guessInputRef.value
    if (!el) return
    el.focus()
    const length = el.value.length
    try {
      el.setSelectionRange(length, length)
    } catch {
      // no-op
    }
  })
}
</script>

<style scoped>
.wc-shell {
  padding: 32px 18px 64px;
  color: #e5e7eb;
}

.wc-container {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

.wc-head {
  display: grid;
  gap: 6px;
  text-align: center;
}

.wc-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
}

.wc-menu {
  position: relative;
  top: 8px;
}

.wc-menu-btn {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.wc-menu-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(59, 130, 246, 0.8);
}

.wc-menu-dropdown {
  position: absolute;
  top: 42px;
  right: 0;
  min-width: 220px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.6);
  padding: 8px;
  display: grid;
  gap: 4px;
  z-index: 20;
}

.wc-menu-item {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #e2e8f0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.wc-menu-item:hover {
  background: rgba(59, 130, 246, 0.18);
}

.wc-menu-item.danger:hover {
  background: rgba(248, 113, 113, 0.2);
  color: #fecaca;
}

.wc-menu-divider {
  height: 1px;
  background: rgba(148, 163, 184, 0.2);
  margin: 4px 2px;
}

.wc-topbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
}

.wc-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.wc-chip {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.wc-chip.active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.8);
  color: #f8fafc;
}

.wc-chip:hover {
  transform: translateY(-1px);
}

.wc-howto {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.35);
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.wc-howto:hover {
  transform: translateY(-1px);
  border-color: rgba(59, 130, 246, 0.8);
}

.wc-title {
  font-size: clamp(52px, 10vw, 80px);
  font-weight: 900;
  letter-spacing: -0.02em;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
}

.wc-status-line {
  margin: 0;
  color: #cbd5e1;
}

.wc-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  margin: 0 auto;
}

.wc-title {
  margin: 4px 0;
}

.wc-form {
  display: grid;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wc-label {
  font-weight: 800;
  color: #cbd5e1;
  text-transform: lowercase;
}

.wc-input-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
}

.wc-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 14px;
}

.wc-send {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  font-weight: 900;
  cursor: pointer;
}

.wc-arrow {
  display: block;
  font-size: 16px;
}

.wc-spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(226, 232, 240, 0.25);
  border-top-color: #e2e8f0;
  animation: wc-spin 0.9s linear infinite;
}

@keyframes wc-spin {
  to {
    transform: rotate(360deg);
  }
}

.wc-rules {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.82));
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.45);
}

.wc-rules-title {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #f1f5f9;
}

.wc-rules-list {
  display: grid;
  gap: 12px;
}

.wc-rules-item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.55);
}

.wc-rules-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c7d2fe;
}

.wc-rules-text {
  margin: 0;
  color: #e2e8f0;
  line-height: 1.55;
}

.wc-history {
  display: grid;
  gap: 10px;
}

.wc-history-list {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.wc-history-item {
  width: 100%;
}

.wc-row {
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.65);
}

.wc-row-hint {
  border-color: rgba(52, 211, 153, 0.6);
}

.wc-row-current {
  border-color: rgba(251, 191, 36, 0.6);
}

.wc-row-status {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(148, 163, 184, 0.4);
}

.wc-row-status-error {
  border-color: rgba(248, 113, 113, 0.6);
  color: #fee2e2;
}

.wc-history-current {
  margin-bottom: 10px;
}

.wc-row-fill {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  opacity: 0.65;
}

.wc-row-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  color: #e5e7eb;
  font-weight: 700;
}

.wc-row-status-content {
  justify-content: center;
}

.wc-status-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  color: #e0e7ff;
}

.wc-word {
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.wc-rank {
  font-weight: 800;
  color: #e5e7eb;
}

.wc-hint-pill {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid rgba(52, 211, 153, 0.6);
  color: #d1fae5;
}

.wc-current-pill {
  border-color: rgba(251, 191, 36, 0.6);
  color: #fde68a;
}

.wc-btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  font-size: 14px;
}

.wc-btn.primary {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0b1220;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.35);
}

.wc-btn.ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wc-ready {
  justify-self: center;
}

.wc-btn:disabled,
.wc-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.wc-btn:not(:disabled):hover,
.wc-send:not(:disabled):hover {
  transform: translateY(-1px);
}

.wc-muted {
  margin: 0;
  color: #94a3b8;
  text-align: center;
}

@media (max-width: 640px) {
  .wc-input-row {
    grid-template-columns: 1fr auto;
  }

  .wc-btn.ghost {
    grid-column: span 2;
    width: 100%;
  }
}
</style>
