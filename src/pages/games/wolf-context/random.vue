<template>
  <section class="wc-shell">
    <div class="wc-container">
      <div class="wc-head">
        <div class="wc-topbar">
          <div class="wc-chips">
            <button
              type="button"
              class="wc-chip"
              :class="{ active: activeMode === 'random' }"
              @click="setMode('random')"
            >
              Случайная
            </button>
            <button
              type="button"
              class="wc-chip"
              :class="{ active: activeMode === 'tasks' }"
              @click="setMode('tasks')"
            >
              Задания
            </button>
            <button
              type="button"
              class="wc-chip"
              :class="{ active: activeMode === 'create' }"
              @click="setMode('create')"
            >
              Загадай слово
            </button>
            <button
              type="button"
              class="wc-chip"
              :class="{ active: activeMode === 'party' }"
              @click="setMode('party')"
            >
              Вечеринка
            </button>
          </div>
          <button class="wc-howto" type="button" @click="isHowToOpen = true">Как играть</button>
        </div>
        <h1 class="section-title wc-title">Волчий Контекст</h1>
        <p class="wc-status-line">Попыток: {{ attemptsCount }} · Подсказок: {{ hintsCount }}</p>
      </div>

      <div class="wc-form">
        <div class="wc-input-row">
          <input
            id="guess-input"
            v-model="guessInput"
            class="wc-input"
            type="text"
            placeholder="Пиши ассоциацию"
            @keyup.enter="submitGuess"
            :disabled="isWon"
          />
          <button
            class="wc-send"
            type="button"
            @click="submitGuess"
            aria-label="Проверить"
            :disabled="isWon || isGuessing || isHinting"
          >
            <span class="wc-arrow">&gt;</span>
          </button>
          <button
            class="wc-btn ghost"
            type="button"
            @click="giveHint"
            :disabled="!canGiveHint || isGuessing || isHinting"
          >
            Подсказка
          </button>
        </div>
        <button v-if="isWon" class="wc-btn primary" type="button" @click="loadRandomGame">Новая игра</button>
      </div>

      <div class="wc-history-current">
        <div
          v-if="panelState.type !== 'guess'"
          :class="['wc-row', 'wc-row-status', panelState.type === 'error' ? 'wc-row-status-error' : '']"
        >
          <div class="wc-row-content wc-row-status-content">
            <span class="wc-status-text">
              <span v-if="panelState.type === 'loading'" class="wc-spinner"></span>
              {{ panelState.text }}
            </span>
          </div>
        </div>
        <div v-else :class="['wc-row', lastGuess?.isHint ? 'wc-row-hint' : 'wc-row-current']">
          <div
            class="wc-row-fill"
            :style="{ width: `${5 + 95 * (lastGuess?.heatScore ?? 0)}%`, background: getZoneColor(lastGuess?.zone || 'ice') }"
          ></div>
          <div class="wc-row-content">
            <span class="wc-word">
              {{ lastGuess?.lemma }}
              <span v-if="lastGuess?.isHint" class="wc-hint-pill">подсказка</span>
              <span v-else class="wc-hint-pill wc-current-pill">текущий ход</span>
            </span>
            <span class="wc-rank">{{ lastGuess?.position }}</span>
          </div>
        </div>
      </div>

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

      <div class="wc-history">
        <ul v-if="attemptsSorted.length" class="wc-history-list">
          <li v-for="item in attemptsSorted" :key="`${item.id}-${item.position}-${item.createdAt}`" class="wc-history-item">
            <div :class="['wc-row', item.isHint ? 'wc-row-hint' : '']">
              <div
                class="wc-row-fill"
                :style="{ width: `${5 + 95 * (item.heatScore ?? 0)}%`, background: getZoneColor(item.zone) }"
              ></div>
              <div class="wc-row-content">
                <span class="wc-word">
                  {{ item.lemma }}
                  <span v-if="item.isHint" class="wc-hint-pill">подсказка</span>
                </span>
                <span class="wc-rank">{{ item.position }}</span>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="wc-muted">История пока пуста</p>
      </div>
    </div>
    <ContextHowToModal v-model="isHowToOpen" />
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ContextHowToModal from '~/components/context/ContextHowToModal.vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'
import { contextOfficialTasks } from '~/data/contextOfficialTasks'

type Guess = {
  id: number
  lemma: string
  position: number
  total: number
  similarity: number
  heatScore: number
  zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire'
  isHint: boolean
  createdAt: number
}

type RandomWordResponse = {
  ok: boolean
  word?: { lemma?: string; gameId?: number; id?: number; rank?: number } & Record<string, unknown>
  error?: string
}

type GuessResponse =
  | {
      ok: false
      exists: false
      message: string
    }
  | {
      ok: true
      exists: true
      isHint?: boolean
      position: number
      total: number
      percentile: number
      zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire'
      isWin?: boolean
      target: { id: number; lemma: string; rank: number | null }
      guess: {
        id: number
        lemma: string
        rank: number | null
        position: number
        total: number
        similarity: number
        heatScore: number
        zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire'
      }
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
const targetId = ref<number | null>(null)
const targetGameId = ref<number | null>(null)
const targetLemma = ref<string | null>(null)
const targetRank = ref<number | null>(null)
const guesses = ref<Guess[]>([])
const lastGuess = ref<Guess | null>(null)
const reactionMessage = ref('Готов к охоте')
const errorMessage = ref('')
const isWon = ref(false)
const isGuessing = ref(false)
const isHinting = ref(false)
const activeMode = ref<'random' | 'create' | 'party' | 'tasks'>('random')
const isHowToOpen = ref(false)
const isTasksOpen = ref(false)

const panelState = computed(() => {
  if (isGuessing.value || isHinting.value) {
    return { type: 'loading' as const, text: 'Думаю...' }
  }
  if (errorMessage.value) {
    return { type: 'error' as const, text: errorMessage.value }
  }
  if (lastGuess.value) {
    return { type: 'guess' as const, text: '' }
  }
  return { type: 'info' as const, text: reactionMessage.value }
})

const attemptsCount = computed(() => guesses.value.filter((a) => !a.isHint).length)
const hintsCount = computed(() => guesses.value.filter((a) => a.isHint).length)
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

function getZoneColor(zone: Guess['zone']) {
  switch (zone) {
    case 'fire':
      return 'linear-gradient(90deg, #fb923c, #facc15)'
    case 'hot':
      return '#fb923c'
    case 'warm':
      return '#f59e0b'
    case 'cold':
      return '#3b82f6'
    default:
      return '#1f2937'
  }
}

const canGiveHint = computed(() => {
  if (!targetId.value || !targetGameId.value) return false
  if (isWon.value) return false
  return true
})

function normalizeWord(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

function zoneFromHeat(heatScore: number) {
  if (heatScore < 0.25) return 'ice'
  if (heatScore < 0.5) return 'cold'
  if (heatScore < 0.75) return 'warm'
  return 'hot'
}

function reactionForZone(zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire') {
  if (zone === 'fire') return 'Огонь, ты совсем рядом'
  if (zone === 'hot') return 'Горячо, почти нашел'
  if (zone === 'warm') return 'Тепло, уже ближе'
  if (zone === 'cold') return 'Холодно еще, но след есть'
  return 'Ты далеко от цели'
}

function setMode(mode: 'random' | 'create' | 'party' | 'tasks') {
  activeMode.value = mode
  if (mode === 'create') {
    navigateTo('/context/create')
    return
  }
  if (mode === 'party') {
    navigateTo('/context/party')
    return
  }
  if (mode === 'tasks') {
    isTasksOpen.value = true
  }
}

async function loadRandomGame() {
  await loadGameFromApi('/api/context/random-word?gameId=1')
}

async function loadGameFromApi(url: string) {
  try {
    const response = await $fetch<RandomWordResponse>(url)
    if (!response?.ok) {
      throw new Error(response?.error || 'Failed to load a random word')
    }
    const lemma = typeof response.word?.lemma === 'string' ? response.word.lemma : ''
    if (!lemma) {
      throw new Error('Supabase word has no Lemma')
    }
    const rawId = response.word?.id
    const rawGameId = response.word?.gameId
    const rawRank = response.word?.rank
    const resolvedId = typeof rawId === 'number' ? rawId : Number(rawId)
    const resolvedGameId = typeof rawGameId === 'number' ? rawGameId : Number(rawGameId)
    const resolvedRank = typeof rawRank === 'number' ? rawRank : Number(rawRank)

    if (!Number.isFinite(resolvedId) || !Number.isFinite(resolvedGameId)) {
      throw new Error('Supabase word has invalid ids')
    }

    targetId.value = resolvedId
    targetGameId.value = resolvedGameId
    targetLemma.value = lemma
    targetRank.value = Number.isFinite(resolvedRank) ? resolvedRank : null
    guesses.value = []
    lastGuess.value = null
    reactionMessage.value = 'Готов к охоте'
    errorMessage.value = ''
    guessInput.value = ''
    isWon.value = false
  } catch (e) {
    console.error('Не удалось получить слово из Supabase', e)
    errorMessage.value = 'Не удалось получить слово из Supabase'
  }
}

function resolveOfficialTask(official: string) {
  const numeric = Number(official)
  if (Number.isFinite(numeric) && numeric > 0 && numeric <= contextOfficialTasks.length) {
    return contextOfficialTasks[numeric - 1]
  }
  return contextOfficialTasks.find((item) => item.slug === official)
}

async function loadOfficialGame(official: string) {
  const task = resolveOfficialTask(official)
  if (!task) {
    console.warn('Unknown official task', official)
    await loadRandomGame()
    return
  }
  const url = `/api/context/random-word?gameId=1&lemma=${encodeURIComponent(task.lemma)}`
  await loadGameFromApi(url)
}

function submitGuess() {
  if (!targetId.value || !targetGameId.value || isWon.value) {
    if (!targetId.value || !targetGameId.value) {
      errorMessage.value = 'Подожди, игра загружается'
    }
    return
  }
  const guess = normalizeWord(guessInput.value)
  if (!guess) return

  guessInput.value = ''
  errorMessage.value = ''

  const alreadyUsed = guesses.value.some((item) => item.lemma.toLowerCase() === guess)
  if (alreadyUsed) {
    errorMessage.value = `Слово "${guess}" уже было введено`
    return
  }

  const payload = {
    gameId: targetGameId.value ?? 1,
    targetId: targetId.value,
    guess,
    mode: 'guess'
  }

  isGuessing.value = true
  $fetch<GuessResponse>('/api/context/guess', {
    method: 'POST',
    body: payload
  })
    .then((response) => {
      if (!response.ok) {
        errorMessage.value = 'message' in response ? response.message : 'Не удалось проверить слово'
        return
      }

      if (response.ok && response.exists) {
        const heatScore = Number.isFinite(response.guess.heatScore) ? response.guess.heatScore : 0
        const zone = zoneFromHeat(heatScore)
        const reaction = reactionForZone(zone)
        addAttempt({
          id: response.guess.id,
          lemma: response.guess.lemma,
          position: response.guess.position,
          total: response.total,
          similarity: response.guess.similarity,
          heatScore,
          zone,
          isHint: Boolean(response.isHint)
        })
        reactionMessage.value = reaction
        errorMessage.value = ''
        const win = response.isWin === true
        if (win) isWon.value = true
        return
      }

      errorMessage.value = 'Не удалось проверить слово'
    })
    .catch((error) => {
      console.error(error)
      errorMessage.value = 'Не удалось проверить слово'
    })
    .finally(() => {
      isGuessing.value = false
    })
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
  lastGuess.value = guessItem
}

function giveHint() {
  if (!targetId.value || !targetGameId.value || isWon.value) return

  const best = Number.isFinite(bestPosition.value) ? bestPosition.value : null

  const payload = {
    gameId: targetGameId.value ?? 1,
    targetId: targetId.value,
    hint: true,
    bestPosition: best,
    mode: 'hint',
    usedIds: guesses.value.map((item) => item.id),
    usedLemmas: guesses.value.map((item) => item.lemma)
  }

  isHinting.value = true
  $fetch<GuessResponse>('/api/context/guess', {
    method: 'POST',
    body: payload
  })
    .then((response) => {
      if (response.ok && response.exists) {
        const heatScore = Number.isFinite(response.guess.heatScore) ? response.guess.heatScore : 0
        const zone = zoneFromHeat(heatScore)
        const reaction = reactionForZone(zone)
        addAttempt({
          id: response.guess.id,
          lemma: response.guess.lemma,
          position: response.guess.position,
          total: response.total,
          similarity: response.guess.similarity,
          heatScore,
          zone,
          isHint: true
        })
        reactionMessage.value = reaction
        errorMessage.value = ''
        const win = response.isWin === true
        if (win) isWon.value = true
        return
      }

      if (!response.ok) {
        errorMessage.value = 'message' in response ? response.message : 'Не удалось получить подсказку'
        return
      }

      errorMessage.value = 'Не удалось получить подсказку'
    })
    .catch((error) => {
      console.error(error)
      errorMessage.value = 'Не удалось получить подсказку'
    })
    .finally(() => {
      isHinting.value = false
    })
}

onMounted(() => {
  initFromRoute()
})

const lastRouteKey = ref('')

function buildRouteKey(route: ReturnType<typeof useRoute>) {
  const target = typeof route.query.targetId === 'string' ? route.query.targetId : ''
  const game = typeof route.query.gameId === 'string' ? route.query.gameId : ''
  const official = typeof route.query.official === 'string' ? route.query.official : ''
  return `${target}|${game}|${official}`
}

function initFromRoute() {
  const route = useRoute()
  const routeKey = buildRouteKey(route)
  if (routeKey === lastRouteKey.value) return
  lastRouteKey.value = routeKey

  const queryTargetId = Number(route.query.targetId)
  const queryGameId = Number(route.query.gameId ?? 1)
  const officialSlug = typeof route.query.official === 'string' ? route.query.official : ''

  if (Number.isFinite(queryTargetId)) {
    targetId.value = queryTargetId
    targetGameId.value = Number.isFinite(queryGameId) ? queryGameId : 1
    guesses.value = []
    lastGuess.value = null
    reactionMessage.value = 'Готов к охоте'
    errorMessage.value = ''
    guessInput.value = ''
    isWon.value = false
    return
  }

  if (officialSlug) {
    loadOfficialGame(officialSlug)
    return
  }

  loadRandomGame()
}

watch(
  () => useRoute().query,
  () => {
    initFromRoute()
  }
)
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
