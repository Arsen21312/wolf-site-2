<template>
  <section class="wc-shell">
    <div class="wc-container">
      <ContextGameHeader
        :breadcrumbs="breadcrumbs"
        title="Вечеринка"
        :show-counts="false"
        @how-to="openHowTo"
        @tasks="openTasks"
        @party="goParty"
        @create="goCreate"
        @reset="resetCache"
      />

      <div class="wc-card wc-card-info">
        <h2>Вечеринка</h2>
        <p>
          В режиме вечеринки вы угадываете слова вместе с другими игроками в реальном времени. Все участники пишут ассоциации и видят ходы друг друга.
        </p>
        <p>
          Вы можете создать новую комнату или присоединиться к открытым комнатам через Задания → Комнаты. После победы можно начать новый раунд в той же комнате.
        </p>
      </div>

      <div class="wc-card">
        <div class="wc-card-row">
          <div class="wc-card-text">
            <h2>Открытая комната</h2>
            <p>Публичные комнаты видны в списке заданий.</p>
          </div>
          <button class="wc-toggle" type="button" :aria-pressed="isPublic" @click="isPublic = !isPublic">
            <span class="wc-toggle-dot" :class="{ on: isPublic }"></span>
            <span>{{ isPublic ? 'Да' : 'Нет' }}</span>
          </button>
        </div>

        <div class="wc-card-row">
          <div class="wc-card-text">
            <h2>Случайное слово</h2>
            <p>Если выключить, можно загадать своё слово.</p>
          </div>
          <button
            class="wc-toggle"
            type="button"
            :aria-pressed="allowRandomTarget"
            @click="allowRandomTarget = !allowRandomTarget"
          >
            <span class="wc-toggle-dot" :class="{ on: allowRandomTarget }"></span>
            <span>{{ allowRandomTarget ? 'Да' : 'Нет' }}</span>
          </button>
        </div>

        <div v-if="!allowRandomTarget" class="wc-form">
          <label class="wc-label" for="target-word">Загаданное слово</label>
          <div class="wc-input-row">
            <input
              id="target-word"
              v-model="targetWord"
              class="wc-input"
              type="text"
              placeholder="Введите слово"
              :disabled="isChecking || isCreating"
              @keyup.enter="checkWord"
            />
            <button class="wc-btn ghost" type="button" :disabled="!targetWord.trim() || isChecking" @click="checkWord">
              Проверить
            </button>
          </div>
          <p v-if="statusMessage" class="wc-status-note">{{ statusMessage }}</p>
        </div>

        <button class="wc-btn primary" type="button" :disabled="isCreating" @click="createRoom">
          Создать комнату
        </button>
      </div>
    </div>
    <ContextHowToModal v-model="isHowToOpen" />
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import ContextGameHeader from '~/components/context/ContextGameHeader.vue'
import ContextHowToModal from '~/components/context/ContextHowToModal.vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий Контекст', to: '/games/wolf-context/random' },
  { label: 'Вечеринка' }
]

const isPublic = ref(true)
const allowRandomTarget = ref(true)
const targetWord = ref('')
const statusMessage = ref('')
const isChecking = ref(false)
const isCreating = ref(false)
const isTargetValid = ref(false)
const isHowToOpen = ref(false)
const isTasksOpen = ref(false)

const workerRef = ref<Worker | null>(null)
const pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (error: unknown) => void }>()
let requestId = 0

type WorkerErrorResponse = { ok: false; message: string }
type WorkerInitResponse = { ok: true; count: number; dim: number } | WorkerErrorResponse
type WorkerPickResponse =
  | { ok: true; index: number; lemma: string; total: number }
  | WorkerErrorResponse

function getWorker() {
  if (workerRef.value) return workerRef.value
  const worker = new Worker(new URL('../../../workers/contextAmbient.worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event) => {
    const { requestId: id, ...payload } = event.data ?? {}
    if (payload?.type === 'progress') return
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

function normalizeWord(value: string): string {
  return value
    .toLowerCase()
    .replace(/\u0451/g, '\u0435')
    .replace(/[^\u0430-\u044f]/gi, '')
    .trim()
}

async function checkWord() {
  const word = normalizeWord(targetWord.value)
  if (!word || word.length < 3) {
    statusMessage.value = 'Введите русское слово длиной от 3 букв'
    isTargetValid.value = false
    return
  }
  isChecking.value = true
  statusMessage.value = ''
  try {
    await ensureAmbientLoaded()
    const pick = await callWorker<WorkerPickResponse>({ type: 'pickByLemma', lemma: word })
    if (!pick.ok) {
      statusMessage.value = 'Слова нет в словаре'
      isTargetValid.value = false
      return
    }
    statusMessage.value = `Ок, слово найдено: ${pick.lemma}`
    isTargetValid.value = true
    targetWord.value = pick.lemma
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Не удалось проверить слово'
    isTargetValid.value = false
  } finally {
    isChecking.value = false
  }
}

async function createRoom() {
  if (isCreating.value) return
  let normalized = ''
  if (!allowRandomTarget.value) {
    normalized = normalizeWord(targetWord.value)
    if (!normalized || normalized.length < 3) {
      statusMessage.value = 'Введите слово для комнаты'
      return
    }
    if (!isTargetValid.value || normalized !== normalizeWord(targetWord.value)) {
      await checkWord()
      if (!isTargetValid.value) return
      normalized = normalizeWord(targetWord.value)
    }
  }

  isCreating.value = true
  statusMessage.value = ''
  try {
    const response = await $fetch<{ ok: boolean; id?: string; message?: string }>('/api/party/create-room', {
      method: 'POST',
      body: {
        isPublic: isPublic.value,
        allowRandomTarget: allowRandomTarget.value,
        targetWord: allowRandomTarget.value ? undefined : normalized
      }
    })
    if (!response.ok || !response.id) {
      statusMessage.value = response.message || 'Не удалось создать комнату'
      return
    }
    navigateTo(`/games/wolf-context/room/${response.id}`)
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Не удалось создать комнату'
  } finally {
    isCreating.value = false
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

watch(allowRandomTarget, () => {
  statusMessage.value = ''
  isTargetValid.value = false
})

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
  overflow-x: hidden;
}

.wc-container {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  width: 100%;
}

.wc-card {
  display: grid;
  gap: 14px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.82));
  padding: 16px;
  width: 100%;
  max-width: 100%;
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

.wc-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.wc-card-text h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}

.wc-card-text p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.wc-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  padding: 6px 12px;
  font-weight: 800;
  cursor: pointer;
}

.wc-toggle-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.5);
}

.wc-toggle-dot.on {
  background: #38bdf8;
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
