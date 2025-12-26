<template>
  <section class="wc-shell">
    <div class="wc-container">
      <ContextGameHeader
        :breadcrumbs="breadcrumbs"
        title="Загадать слово"
        :show-counts="false"
        :show-menu="!(isHowToOpen || isTasksOpen)"
        :show-random="true"
        @how-to="openHowTo"
        @tasks="openTasks"
        @random="goRandom"
        @party="goParty"
        @create="goCreate"
        @reset="resetCache"
      />
      <div class="wc-card wc-card-info">
        <h2>Как загадать слово?</h2>
        <p>
          Введи слово и нажми кнопку проверки. Если слово есть в словаре, появится список ближайших слов.
        </p>
        <p>
          Когда список готов, кнопка "Создать игру" станет активной. После создания можно копировать ссылку и отправлять друзьям.
        </p>
      </div>
      <div class="wc-card wc-actions">
        <button class="wc-btn primary" type="button" :disabled="!canCreateGame" @click="createGame">
          Создать игру
        </button>
        <button
          class="wc-btn ghost"
          type="button"
          :disabled="!canCopyLink"
          :class="{ 'wc-btn-copied': copyFeedback }"
          @click="copyLink"
        >
          {{ copyButtonLabel }}
        </button>
        <p v-if="createdGameId" class="wc-status-note">Создана игра #{{ createdGameId }}</p>
        <div class="wc-input-row">
          <input
            id="target-word"
            v-model="targetWord"
            class="wc-input"
            type="text"
            placeholder="Введите слово"
            :disabled="isChecking"
            @keyup.enter="checkWord"
          />
          <button class="wc-btn ghost" type="button" :disabled="!canCheckWord" @click="checkWord">&gt;</button>
        </div>
        <p v-if="statusMessage" class="wc-status-note">{{ statusMessage }}</p>
      </div>

      <ContextGuessList :items="neighborItems" empty-text="Сначала проверь слово" />
    </div>
    <ContextHowToModal v-model="isHowToOpen" />
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>





<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import ContextGameHeader from '~/components/context/ContextGameHeader.vue'
import ContextGuessList from '~/components/context/ContextGuessList.vue'
import ContextHowToModal from '~/components/context/ContextHowToModal.vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий контекст', to: '/games/wolf-context/random' },
  { label: 'Загадать слово' }
]

type NeighborItem = {
  index: number
  lemma: string
  position: number
  similarity: number
  heatScore: number
  zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire' | 'finish'
}

const targetWord = ref('')
const neighbors = ref<NeighborItem[]>([])
const isChecking = ref(false)
const isCreating = ref(false)
const statusMessage = ref('')
const createdGameId = ref<number | null>(null)
const playUrl = ref<string | null>(null)
const isHowToOpen = ref(false)
const isTasksOpen = ref(false)
const lastCheckedWord = ref('')
const copyFeedback = ref(false)
const copyFeedbackTimer = ref<number | null>(null)

const neighborItems = computed(() =>
  neighbors.value.map((item) => ({
    id: item.index,
    lemma: item.lemma,
    position: item.position,
    heatScore: item.heatScore,
    zone: item.zone,
    isHint: false
  }))
)

const canCreateGame = computed(
  () => neighbors.value.length > 0 && !isCreating.value && !isChecking.value && !createdGameId.value
)
const canCopyLink = computed(() => !!playUrl.value)
const canCheckWord = computed(() => !!targetWord.value.trim() && !isChecking.value)
const copyButtonLabel = computed(() =>
  copyFeedback.value ? 'Ссылка скопирована, но можешь еще раз нажать' : 'Скопировать ссылку'
)

const workerRef = ref<Worker | null>(null)
const pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (error: unknown) => void }>()
let requestId = 0

type WorkerErrorResponse = { ok: false; message: string }
type WorkerInitResponse = { ok: true; count: number; dim: number } | WorkerErrorResponse
type WorkerPickResponse =
  | { ok: true; index: number; lemma: string; total: number }
  | WorkerErrorResponse
type WorkerNeighborsResponse =
  | { ok: true; neighbors: Array<{ index: number; lemma: string; position: number; similarity: number }>; total: number }
  | WorkerErrorResponse

function getWorker() {
  if (workerRef.value) return workerRef.value
  const worker = new Worker(new URL('../../../workers/contextAmbient.worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event) => {
    const { requestId: id, ...payload } = event.data ?? {}
    if (payload?.type === 'progress') {
      return
    }
    const pending = pendingRequests.get(id)
    if (!pending) return
    pending.resolve(payload)
    pendingRequests.delete(id)
  }
  worker.onerror = (event) => {
    console.error('Context worker error', event)
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
  const response = await callWorker<WorkerInitResponse>({ type: 'init', baseUrl: '/ambient' })
  if (!response.ok) {
    throw new Error(response.message || 'Ambient init failed')
  }
}

async function checkWord() {
  const word = targetWord.value.trim()
  if (!word) return
  isChecking.value = true
  statusMessage.value = ''
  neighbors.value = []
  createdGameId.value = null
  playUrl.value = null
  lastCheckedWord.value = word
  try {
    await ensureAmbientLoaded()
    const pick = await callWorker<WorkerPickResponse>({ type: 'pickByLemma', lemma: word })
    if (!pick.ok) {
      statusMessage.value = 'Слова нет в словаре'
      return
    }
    await callWorker<WorkerInitResponse>({ type: 'prepareTarget', targetIndex: pick.index })
    const response = await callWorker<WorkerNeighborsResponse>({ type: 'neighbors', limit: 300 })
    if (!response.ok) {
      statusMessage.value = 'Не удалось собрать превью'
      return
    }
    neighbors.value = response.neighbors.map((item) => {
      const percentile = response.total > 1 ? 1 - (item.position - 1) / (response.total - 1) : 1
      const heatScore = Math.max(0, Math.min(1, percentile))
      const zone = zoneFromRank(heatScore, item.position)
      return {
        ...item,
        heatScore,
        zone
      }
    })
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Не удалось создать игру'
  } finally {
    isChecking.value = false
  }
}



watch(
  () => targetWord.value,
  (value) => {
    const trimmed = value.trim()
    if (trimmed && trimmed === lastCheckedWord.value) return
    neighbors.value = []
    createdGameId.value = null
    playUrl.value = null
    statusMessage.value = ''
  }
)

async function createGame() {
  if (!neighbors.value.length) return
  const word = targetWord.value.trim()
  if (!word) return
  isCreating.value = true
  statusMessage.value = ''
  try {
    const response = await $fetch<{ ok: boolean; id?: number; playUrl?: string; message?: string }>(
      '/api/context/create-game',
      {
        method: 'POST',
        body: { targetWord: word, createdByName: '' }
      }
    )
    if (!response.ok || !response.id || !response.playUrl) {
      statusMessage.value = 'Не удалось создать игру'
      return
    }
    createdGameId.value = response.id
    playUrl.value = response.playUrl
    statusMessage.value = ''
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Не удалось создать игру'
  } finally {
    isCreating.value = false
  }
}




async function copyLink() {
  if (!playUrl.value || !process.client) return
  const url = `${window.location.origin}${playUrl.value}`
  await navigator.clipboard.writeText(url)
  copyFeedback.value = true
  if (copyFeedbackTimer.value !== null) {
    window.clearTimeout(copyFeedbackTimer.value)
  }
  copyFeedbackTimer.value = window.setTimeout(() => {
    copyFeedback.value = false
    copyFeedbackTimer.value = null
  }, 2200)
}

const FINISH_RANK = 299

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

function openHowTo() {
  isHowToOpen.value = true
}

function openTasks() {
  isTasksOpen.value = true
}

function goParty() {
  navigateTo('/games/wolf-context/party')
}

function goRandom() {
  navigateTo('/games/wolf-context/random')
}

function goCreate() {
  navigateTo('/games/wolf-context/create')
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
  gap: 16px;
}

.wc-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
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

.wc-btn.ghost.wc-btn-copied {
  border-color: rgba(34, 197, 94, 0.85);
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.25);
  color: #bbf7d0;
}

.wc-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.wc-card {
  display: grid;
  gap: 10px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.82));
  padding: 16px;
}

.wc-actions .wc-btn {
  width: 100%;
}

.wc-card-info {
  gap: 8px;
}

.wc-card-info h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.wc-card-info p {
  margin: 0;
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.5;
}

.wc-status-note {
  margin: 0;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .wc-input-row {
    grid-template-columns: 1fr;
  }
}
</style>
