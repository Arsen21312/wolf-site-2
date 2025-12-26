
<template>
  <section class="wc-shell">
    <div class="wc-container">
      <ContextGameHeader
        :breadcrumbs="breadcrumbs"
        title="Комната"
        :attempts="attemptsCount"
        :hints="hintsCount"
        :show-menu="!(isHowToOpen || isTasksOpen)"
        @how-to="openHowTo"
        @tasks="openTasks"
        @party="goParty"
        @create="goCreate"
        @reset="resetCache"
      />
      <ContextControlRow
        ref="controlRowRef"
        v-if="isRoomReady"
        v-model="guessInput"
        :disabled-input="isInputDisabled"
        :disabled-submit="isSubmitDisabled"
        :disabled-hint="!canGiveHint"
        :is-sending="isGuessing"
        :show-new-game="isWon"
        :new-game-disabled="isNewRoundLoading"
        @submit="submitGuess"
        @hint="giveHint"
        @new-game="startNewRound"
      />


      <ContextGuessList
        v-if="isRoomReady"
        :items="attemptsSorted"
        :status="listStatus"
        :current-text="currentRowDisplay"
        :current-type="currentRowDisplayType"
        :current-rank="currentRowRank"
        :current-player-name="currentRowPlayerName"
        :current-is-hint="currentRowIsHint"
        empty-text="История пока пуста"
        show-player
      />

      <div v-if="isRoomReady && showRules" class="wc-rules">
        <h2 class="wc-rules-title">Как играть в Волчий контекст</h2>
        <div class="wc-rules-list">
          <div class="wc-rules-item">
            <span class="wc-rules-label">Цель</span>
            <p class="wc-rules-text">
              Есть секретное слово - оно номер 1 в большом списке. Твоя задача - добраться до него, угадывая
              ассоциации.
            </p>
          </div>
          <div class="wc-rules-item">
            <span class="wc-rules-label">Правила</span>
            <p class="wc-rules-text">
              У тебя неограниченное количество попыток. Пиши любые русские слова. Чем меньше номер, тем ближе слово
              к ответу. После каждой попытки ты видишь позицию и цвет полоски от льда к огню.
            </p>
          </div>
          <div class="wc-rules-item">
            <span class="wc-rules-label">Как это работает</span>
            <p class="wc-rules-text">
              Это &lt;горячо/холодно&gt; для слов: если ответ &lt;кот&gt;, то &lt;кошка&gt; ближе, чем &lt;собака&gt;.
              Алгоритм смотрит, как слова встречаются в текстах, и оценивает их похожесть по контексту.
            </p>
          </div>
          <div class="wc-rules-item">
            <span class="wc-rules-label">Подсказки</span>
            <p class="wc-rules-text">
              Если застрял, жми &lt;Подсказка&gt;. Игра предложит слово, которое лучше твоего текущего результата.
            </p>
          </div>
        </div>
      </div>
    </div>

    <ContextHowToModal v-model="isHowToOpen" />
    <ContextTasksModal v-model="isTasksOpen" />

    <div v-if="isNameModalOpen" class="wc-modal">
      <div class="wc-modal-backdrop"></div>
      <div class="wc-modal-card" role="dialog" aria-modal="true" aria-labelledby="wc-name-title">
        <h2 id="wc-name-title" class="wc-modal-title">Как тебя зовут?</h2>
        <p class="wc-modal-text">Имя видно в истории комнаты и сохранится на этом устройстве.</p>
        <input
          v-model="nameInput"
          class="wc-input"
          type="text"
          placeholder="Например, Лиса"
          @keyup.enter="confirmName"
        />
        <div class="wc-modal-actions">
          <button class="wc-btn primary" type="button" :disabled="!nameInput.trim()" @click="confirmName">
            Войти
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ContextGameHeader from '~/components/context/ContextGameHeader.vue'
import ContextControlRow from '~/components/context/ContextControlRow.vue'
import ContextGuessList from '~/components/context/ContextGuessList.vue'
import ContextHowToModal from '~/components/context/ContextHowToModal.vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'

type RoomResponse = {
  id: string
  host_name: string | null
  target_word: string | null
  is_public: boolean
  allow_random_target: boolean
  status: string
  last_active_at: string | null
}

type GuessRow = {
  id: number
  room_id: string
  created_at: string
  player_name: string | null
  guess_word: string
  rank: number
  score: number | null
}

type Guess = {
  id: number | string
  lemma: string
  position: number
  total: number
  similarity: number
  heatScore: number
  zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire' | 'finish'
  isHint: boolean
  createdAt: number
  playerName: string | null
}

type WorkerErrorResponse = { ok: false; message: string }
type WorkerInitResponse = { ok: true; count: number; dim: number } | WorkerErrorResponse
type WorkerPickResponseOk = { ok: true; index: number; lemma: string; total: number }
type WorkerPickResponse = WorkerPickResponseOk | WorkerErrorResponse
type WorkerGuessResponse =
  | { ok: true; index: number; lemma: string; position: number; similarity: number; total: number; isWin: boolean }
  | WorkerErrorResponse
type WorkerHintResponse = WorkerGuessResponse

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий Контекст', to: '/games/wolf-context/random' },
  { label: 'Комната' }
]

useHead({
  title: 'Волчий Контекст - Комната',
  meta: [
    {
      name: 'description',
      content: 'Комнатный режим Волчьего Контекста: играйте вместе и угадывайте слово по ассоциациям.'
    }
  ]
})

const route = useRoute()
const roomId = computed(() => (typeof route.params.id === 'string' ? route.params.id : String(route.params.id ?? '')))

const room = ref<RoomResponse | null>(null)
const errorMessage = ref('')
const isRoomLoading = ref(false)
const isGuessesLoading = ref(false)

const guessInput = ref('')
const controlRowRef = ref<InstanceType<typeof ContextControlRow> | null>(null)
const currentRowText = ref('')
const currentRowType = ref<'guess' | 'error' | 'info'>('info')
const currentRowRank = ref<number | null>(null)
const currentRowIsHint = ref(false)
const currentRowPlayerName = ref<string | null>(null)

const guesses = ref<Guess[]>([])
const isGuessing = ref(false)
const isHinting = ref(false)
const isNewRoundLoading = ref(false)
const isHowToOpen = ref(false)
const isTasksOpen = ref(false)

const ambientTotal = ref<number | null>(null)
const ambientDim = ref<number | null>(null)
const ambientStage = ref('')
const ambientSource = ref<'cache' | 'network' | ''>('')
const isAmbientLoading = ref(false)
const isTargetPreparing = ref(false)
const targetIndex = ref<number | null>(null)
const targetLemma = ref<string | null>(null)

const isNameModalOpen = ref(false)
const nameInput = ref('')
const playerName = ref('')

const FINISH_RANK = 299

const winMessages = [
  'Красава, слово угадано, ты в топ 1',
  'Ауф, добыча взята, это номер 1',
  'Попадание в яблочко, слово найдено',
  'Ты на вершине списка, слово угадано',
  'Изи катка, секретное слово твоё'
]

const listStatus = computed(() => {
  if (isRoomLoading.value || isGuessesLoading.value) {
    return { type: 'loading' as const, text: 'Загружаю комнату...' }
  }
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
const showRules = computed(
  () => !guesses.value.length && !guessInput.value.trim() && !isGuessing.value && !isHinting.value
)
const isRoomReady = computed(() => !!playerName.value)

const bestPosition = computed(() => {
  const positions = guesses.value.map((a) => a.position).filter((n) => Number.isFinite(n))
  if (!positions.length) return Number.POSITIVE_INFINITY
  return Math.min(...positions)
})

const isWon = computed(() => bestPosition.value <= 1)

const attemptsSorted = computed(() => {
  const sorted = [...guesses.value].sort((a, b) => {
    if (a.position === b.position) return a.createdAt - b.createdAt
    return a.position - b.position
  })
  return sorted
})

const isInputDisabled = computed(() => {
  return (
    !playerName.value ||
    isRoomLoading.value ||
    isAmbientLoading.value ||
    isTargetPreparing.value ||
    isGuessing.value ||
    isHinting.value ||
    isNewRoundLoading.value ||
    isWon.value
  )
})

const isSubmitDisabled = computed(() => {
  return (
    isInputDisabled.value ||
    !guessInput.value.trim() ||
    isGuessing.value ||
    isHinting.value
  )
})

const canGiveHint = computed(() => {
  if (!playerName.value) return false
  if (targetIndex.value === null) return false
  if (isAmbientLoading.value || isTargetPreparing.value) return false
  if (isWon.value) return false
  if (isGuessing.value || isHinting.value) return false
  return true
})

const pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (error: unknown) => void }>()
let requestId = 0
let ambientInitPromise: Promise<void> | null = null
const workerRef = ref<Worker | null>(null)

function getWorker() {
  if (workerRef.value) return workerRef.value
  const worker = new Worker(new URL('../../../../workers/contextAmbient.worker.ts', import.meta.url), { type: 'module' })
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
    errorMessage.value = 'Ошибка воркера контекста'
    for (const pending of pendingRequests.values()) {
      pending.reject(new Error('worker_failed'))
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

function zoneFromRank(heatScore: number, position: number) {
  if (Number.isFinite(position) && position <= FINISH_RANK) return 'finish'
  return zoneFromHeat(heatScore)
}

function computeHeatScore(position: number, total: number | null) {
  if (!total || total <= 1 || !Number.isFinite(position)) return 0
  const percentile = 1 - (position - 1) / (total - 1)
  return Math.max(0, Math.min(1, percentile))
}

function addAttempt(payload: {
  id: number | string
  lemma: string
  position: number
  similarity: number
  total: number
  isHint: boolean
  playerName: string | null
  createdAt?: number
}) {
  const heatScore = computeHeatScore(payload.position, payload.total)
  const zone = zoneFromRank(heatScore, payload.position)
  guesses.value.push({
    id: payload.id,
    lemma: payload.lemma,
    position: payload.position,
    total: payload.total,
    similarity: payload.similarity,
    heatScore,
    zone,
    isHint: payload.isHint,
    createdAt: payload.createdAt ?? Date.now(),
    playerName: payload.playerName
  })
}

function pickWinMessage() {
  const index = Math.floor(Math.random() * winMessages.length)
  return winMessages[index] || winMessages[0]
}

async function loadRoom() {
  const id = roomId.value.trim()
  if (!id) {
    errorMessage.value = 'Комната не найдена'
    return
  }
  isRoomLoading.value = true
  errorMessage.value = ''
  try {
    const response = await $fetch<{ ok: boolean; room?: RoomResponse; message?: string }>(`/api/party/room?id=${id}`)
    if (!response.ok || !response.room) {
      errorMessage.value = response.message || 'Не удалось загрузить комнату'
      return
    }
    room.value = response.room
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось загрузить комнату'
  } finally {
    isRoomLoading.value = false
  }
}

async function ensureTargetReady() {
  if (!room.value) return
  await ensureAmbientLoaded()
  const existingTarget = room.value.target_word?.trim() || ''
  if (existingTarget) {
    const pick = await callWorker<WorkerPickResponse>({ type: 'pickByLemma', lemma: existingTarget })
    if (!pick.ok) {
      errorMessage.value = 'Не удалось подготовить слово комнаты'
      return
    }
    targetIndex.value = pick.index
    targetLemma.value = pick.lemma
    await prepareTarget(pick.index)
    return
  }

  if (!room.value.allow_random_target) {
    errorMessage.value = 'В комнате нет целевого слова'
    return
  }

  const pick = await callWorker<WorkerPickResponse>({ type: 'pickRandom' })
  if (!pick.ok) {
    errorMessage.value = 'Не удалось выбрать случайное слово'
    return
  }

  try {
    const response = await $fetch<{ ok: boolean; targetWord?: string; message?: string }>('/api/party/set-target', {
      method: 'POST',
      body: { roomId: roomId.value, targetWord: pick.lemma }
    })
    if (!response.ok) {
      errorMessage.value = response.message || 'Не удалось установить слово комнаты'
      return
    }
    room.value.target_word = response.targetWord || pick.lemma
    targetIndex.value = pick.index
    targetLemma.value = pick.lemma
    await prepareTarget(pick.index)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось установить слово комнаты'
  }
}

async function loadGuesses() {
  const id = roomId.value.trim()
  if (!id) return
  isGuessesLoading.value = true
  errorMessage.value = ''
  try {
    const response = await $fetch<{ ok: boolean; guesses?: GuessRow[]; message?: string }>(
      `/api/party/room-guesses?roomId=${id}`
    )
    if (!response.ok || !response.guesses) {
      errorMessage.value = response.message || 'Не удалось загрузить историю'
      return
    }
    const total = ambientTotal.value
    guesses.value = response.guesses.map((item) => {
      const heatScore = computeHeatScore(item.rank, total)
      return {
        id: item.id,
        lemma: item.guess_word,
        position: item.rank,
        total: total ?? 0,
        similarity: item.score ?? 0,
        heatScore,
        zone: zoneFromRank(heatScore, item.rank),
        isHint: false,
        createdAt: Date.parse(item.created_at) || Date.now(),
        playerName: item.player_name
      }
    })
    if (isWon.value && !currentRowText.value) {
      currentRowText.value = 'Слово уже найдено'
      currentRowType.value = 'info'
      currentRowIsHint.value = false
      currentRowRank.value = 1
      currentRowPlayerName.value = null
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось загрузить историю'
  } finally {
    isGuessesLoading.value = false
  }
}

async function submitGuess() {
  if (isGuessing.value || isHinting.value) return
  if (!playerName.value) {
    openNameModal()
    return
  }
  if (targetIndex.value === null || isWon.value || isAmbientLoading.value || isTargetPreparing.value) {
    currentRowText.value = 'Подожди, игра загружается'
    currentRowType.value = 'info'
    currentRowRank.value = null
    currentRowIsHint.value = false
    currentRowPlayerName.value = null
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
    currentRowPlayerName.value = null
    focusInput()
    return
  }

  const alreadyUsed = guesses.value.some((item) => normalizeWord(item.lemma) === guess)
  if (alreadyUsed) {
    currentRowText.value = `слово "${guess}" уже было введено`
    currentRowType.value = 'error'
    currentRowRank.value = null
    currentRowIsHint.value = false
    currentRowPlayerName.value = null
    focusInput()
    return
  }

  currentRowText.value = guess
  currentRowType.value = 'guess'
  currentRowRank.value = null
  currentRowIsHint.value = false
  currentRowPlayerName.value = playerName.value
  isGuessing.value = true

  try {
    const response = await callWorker<WorkerGuessResponse>({ type: 'guess', lemma: guess })
    if (!response.ok) {
      if (response.message === 'word_not_found') {
        currentRowText.value = `слово "${guess}" не в волчьем словаре`
        currentRowType.value = 'error'
        currentRowRank.value = null
        currentRowIsHint.value = false
        currentRowPlayerName.value = null
        return
      }
      currentRowText.value = 'Не удалось проверить слово'
      currentRowType.value = 'error'
      currentRowRank.value = null
      currentRowIsHint.value = false
      currentRowPlayerName.value = null
      return
    }

    const saveResponse = await $fetch<{ ok: boolean; message?: string }>('/api/party/guess', {
      method: 'POST',
      body: {
        roomId: roomId.value,
        playerName: playerName.value,
        guessWord: response.lemma,
        rank: response.position,
        score: response.similarity,
        isWin: response.isWin
      }
    })

    if (!saveResponse.ok) {
      currentRowText.value = saveResponse.message || 'Не удалось сохранить ход'
      currentRowType.value = 'error'
      currentRowRank.value = null
      currentRowIsHint.value = false
      currentRowPlayerName.value = null
      return
    }

    addAttempt({
      id: response.index,
      lemma: response.lemma,
      position: response.position,
      similarity: response.similarity,
      total: response.total,
      isHint: false,
      playerName: playerName.value
    })
    currentRowRank.value = response.position
    currentRowIsHint.value = false
    currentRowPlayerName.value = playerName.value
    errorMessage.value = ''
    if (response.isWin) {
      currentRowText.value = pickWinMessage()
      currentRowType.value = 'info'
      currentRowIsHint.value = false
      currentRowPlayerName.value = null
    }
  } catch (error) {
    console.error(error)
    currentRowText.value = 'Не удалось проверить слово'
    currentRowType.value = 'error'
    currentRowIsHint.value = false
    currentRowPlayerName.value = null
  } finally {
    isGuessing.value = false
    focusInput()
  }
}

async function giveHint() {
  if (!playerName.value) {
    openNameModal()
    return
  }
  if (targetIndex.value === null || isWon.value || isAmbientLoading.value || isTargetPreparing.value) return

  const best = Number.isFinite(bestPosition.value) ? bestPosition.value : null
  isHinting.value = true

  try {
    const response = await callWorker<WorkerHintResponse>({
      type: 'hint',
      bestPosition: best,
      usedIndices: guesses.value.map((item) => Number(item.id)).filter((id) => Number.isFinite(id)),
      usedLemmas: guesses.value.map((item) => item.lemma)
    })

    if (!response.ok) {
      if (response.message === 'already_best') {
        errorMessage.value = 'Ты уже на вершине списка, дальше подсказок нет'
        return
      }
      errorMessage.value = 'Не удалось получить подсказку'
      return
    }

    const saveResponse = await $fetch<{ ok: boolean; message?: string }>('/api/party/guess', {
      method: 'POST',
      body: {
        roomId: roomId.value,
        playerName: playerName.value,
        guessWord: response.lemma,
        rank: response.position,
        score: response.similarity,
        isWin: response.isWin
      }
    })

    if (!saveResponse.ok) {
      errorMessage.value = saveResponse.message || 'Не удалось сохранить ход'
      return
    }

    addAttempt({
      id: response.index,
      lemma: response.lemma,
      position: response.position,
      similarity: response.similarity,
      total: response.total,
      isHint: true,
      playerName: playerName.value
    })
    currentRowText.value = response.lemma
    currentRowType.value = 'guess'
    currentRowRank.value = response.position
    currentRowIsHint.value = true
    currentRowPlayerName.value = playerName.value
    errorMessage.value = ''
    if (response.isWin) {
      currentRowText.value = pickWinMessage()
      currentRowType.value = 'info'
      currentRowIsHint.value = false
      currentRowPlayerName.value = null
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось получить подсказку'
  } finally {
    isHinting.value = false
    focusInput()
  }
}

async function startNewRound() {
  if (isNewRoundLoading.value || !room.value) return
  if (!playerName.value) {
    openNameModal()
    return
  }
  isNewRoundLoading.value = true
  errorMessage.value = ''
  try {
    await ensureAmbientLoaded()
    let nextTarget = room.value.target_word?.trim() || ''
    let nextIndex = targetIndex.value

    if (room.value.allow_random_target) {
      const pick = await callWorker<WorkerPickResponse>({ type: 'pickRandom' })
      if (!pick.ok) {
        errorMessage.value = 'Не удалось выбрать случайное слово'
        return
      }
      nextTarget = pick.lemma
      nextIndex = pick.index
    }

    const response = await $fetch<{ ok: boolean; targetWord?: string; message?: string }>('/api/party/new-round', {
      method: 'POST',
      body: {
        roomId: roomId.value,
        targetWord: nextTarget,
        playerName: playerName.value
      }
    })

    if (!response.ok) {
      errorMessage.value = response.message || 'Не удалось начать новый раунд'
      return
    }

    room.value.target_word = response.targetWord || nextTarget
    guesses.value = []
    currentRowText.value = ''
    currentRowType.value = 'info'
    currentRowRank.value = null
    currentRowIsHint.value = false
    currentRowPlayerName.value = null
    guessInput.value = ''

    if (nextIndex === null && room.value.target_word) {
      const pick = await callWorker<WorkerPickResponse>({
        type: 'pickByLemma',
        lemma: room.value.target_word
      })
      if (pick.ok) {
        nextIndex = pick.index
      }
    }

    if (nextIndex !== null) {
      targetIndex.value = nextIndex
      targetLemma.value = room.value.target_word
      await prepareTarget(nextIndex)
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось начать новый раунд'
  } finally {
    isNewRoundLoading.value = false
    focusInput()
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
  navigateTo('/games/wolf-context/create')
}

function openNameModal() {
  nameInput.value = playerName.value || ''
  isNameModalOpen.value = true
  nextTick(() => {
    const el = document.querySelector<HTMLInputElement>('.wc-modal-card input')
    el?.focus()
  })
}

function confirmName() {
  const name = nameInput.value.trim()
  if (!name) return
  playerName.value = name
  isNameModalOpen.value = false
  focusInput()
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

function focusInput() {
  nextTick(() => {
    controlRowRef.value?.focusInput()
  })
}

async function initRoom() {
  await loadRoom()
  if (!room.value) return
  await ensureTargetReady()
  await loadGuesses()
}

onMounted(() => {
  isNameModalOpen.value = true
  initRoom()
})

watch(
  () => roomId.value,
  () => {
    guesses.value = []
    currentRowText.value = ''
    currentRowType.value = 'info'
    currentRowRank.value = null
    currentRowIsHint.value = false
    currentRowPlayerName.value = null
    initRoom()
  }
)

onBeforeUnmount(() => {
  if (!workerRef.value) return
  workerRef.value.terminate()
  workerRef.value = null
  for (const pending of pendingRequests.values()) {
    pending.reject(new Error('Worker terminated'))
  }
  pendingRequests.clear()
})
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










.wc-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 14px;
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

.wc-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 16px;
}

.wc-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(6px);
}

.wc-modal-card {
  position: relative;
  z-index: 1;
  width: min(420px, 100%);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.9));
  padding: 18px;
  display: grid;
  gap: 12px;
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.55);
}

.wc-modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
}

.wc-modal-text {
  margin: 0;
  color: #cbd5e1;
  font-size: 14px;
}

.wc-modal-actions {
  display: flex;
  justify-content: flex-end;
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
