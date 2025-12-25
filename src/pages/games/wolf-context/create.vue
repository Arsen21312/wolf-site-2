<template>
  <section class="wc-shell">
    <div class="wc-container">
      <ContextGameHeader
        :breadcrumbs="breadcrumbs"
        title="Загадать слово"
        :show-counts="false"
        @how-to="openHowTo"
        @tasks="openTasks"
        @party="goParty"
        @create="goCreate"
        @reset="resetCache"
      />


      <div class="wc-card wc-card-info">
        <h2>Как загадать слово?</h2>
        <p>
          Вы можете загадать своё слово и создать отдельную игру. Введите слово в поле ниже и нажмите кнопку со стрелкой. Нейросеть подберёт список близких слов, чтобы проверить, подходит ли загадка.
        </p>
        <p>
          Если результат вас устраивает, нажмите «Создать игру». Игра появится в списке пользовательских заданий. Скопируйте ссылку и отправьте друзьям.
        </p>
      </div>

      <div class="wc-form">
        <label class="wc-label" for="target-word">Слово</label>
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
          <button class="wc-btn ghost" type="button" :disabled="!targetWord.trim() || isChecking" @click="checkWord">
            Проверить
          </button>
        </div>
        <label class="wc-label" for="creator-name">Ник (опционально)</label>
        <input
          id="creator-name"
          v-model="creatorName"
          class="wc-input"
          type="text"
          placeholder="Как тебя представить?"
          :disabled="isChecking || isCreating"
        />
        <p v-if="statusMessage" class="wc-status-note">{{ statusMessage }}</p>
      </div>

      <div class="wc-card">
        <div class="wc-card-header">
          <h2>Топ 300 ближайших слов</h2>
          <button
            class="wc-btn primary"
            type="button"
            :disabled="!neighbors.length || isCreating"
            @click="createGame"
          >
            Создать игру
          </button>
        </div>
        <button class="wc-btn ghost" type="button" :disabled="!playUrl" @click="copyLink">Скопировать ссылку</button>
        <p v-if="createdGameId" class="wc-status-note">Игра создана: #{{ createdGameId }}</p>

        <ContextGuessList :items="neighborItems" empty-text="Сначала проверь слово" />
      </div>
    </div>
    <ContextHowToModal v-model="isHowToOpen" />
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import ContextGameHeader from '~/components/context/ContextGameHeader.vue'
import ContextGuessList from '~/components/context/ContextGuessList.vue'
import ContextHowToModal from '~/components/context/ContextHowToModal.vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий Контекст', to: '/games/wolf-context/random' },
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
const creatorName = ref('')
const neighbors = ref<NeighborItem[]>([])
const isChecking = ref(false)
const isCreating = ref(false)
const statusMessage = ref('')
const createdGameId = ref<number | null>(null)
const playUrl = ref<string | null>(null)
const isHowToOpen = ref(false)
const isTasksOpen = ref(false)

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
    statusMessage.value = 'Не удалось проверить слово'
  } finally {
    isChecking.value = false
  }
}

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
        body: { targetWord: word, createdByName: creatorName.value.trim() }
      }
    )
    if (!response.ok || !response.id || !response.playUrl) {
      statusMessage.value = response.message || 'Не удалось создать игру'
      return
    }
    createdGameId.value = response.id
    playUrl.value = response.playUrl
    await copyLink()
    statusMessage.value = 'Игра создана, копирую ссылку...'
    setTimeout(() => {
      navigateTo(`/games/wolf-context/random?mode=user&id=${response.id}`)
    }, 800)
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

.wc-form {
  display: grid;
  gap: 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wc-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  font-weight: 700;
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

.wc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
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
