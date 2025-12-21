<template>
  <section class="context-page">
    <div class="context-container">
      <div class="context-header">
        <div class="context-topbar">
          <div class="context-chips">
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'random' }"
              @click="setMode('random')"
            >
              Случайная
            </button>
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'tasks' }"
              @click="setMode('tasks')"
            >
              Задания
            </button>
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'create' }"
              @click="setMode('create')"
            >
              Загадай слово
            </button>
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'party' }"
              @click="setMode('party')"
            >
              Вечеринка
            </button>
          </div>
        </div>
        <h1 class="context-title">Загадай слово</h1>
        <p class="context-subtitle">Введи слово и посмотри ближайших соседей. Скоро подключим комнаты.</p>
      </div>

      <div class="context-card context-howto">
        <h2>Как загадать слово?</h2>
        <p>
          Введите слово, которое хотите загадать, в поле ввода и нажмите кнопку со стрелочкой. Нужно немного
          подождать, пока список слов появится.
        </p>
        <p>
          Вы увидите список близких слов. Если список вас устраивает, нажмите кнопку «Создать игру».
        </p>
        <p>
          Ваше слово появится в пользовательском списке игр. У него будет порядковый номер, он высветится при создании
          игры. Копируйте ссылку и отправляйте друзьям.
        </p>
      </div>

      <div class="context-card">
        <label class="context-label" for="target-word">Введите слово</label>
        <div class="context-input-row">
          <input id="target-word" v-model="targetWord" class="context-input" type="text" />
          <button
            class="context-btn"
            type="button"
            :disabled="!targetWord.trim() || isGenerating"
            @click="generateNeighbors"
          >
            Посчитать соседей
          </button>
        </div>
        <p v-if="isGenerating" class="context-note">Считаю соседей...</p>
      </div>

      <div class="context-card">
        <div class="context-card-header">
          <h2>Ближайшие 300 слов</h2>
          <button
            class="context-btn ghost"
            type="button"
            :disabled="!neighbors.length || isGenerating"
            @click="createGame"
          >
            Создать игру
          </button>
        </div>
        <button class="context-btn copy" type="button" :disabled="!createdGameId" @click="copyLink">
          Скопировать ссылку
        </button>
        <p v-if="createdGameId" class="context-note">Создана игра #{{ createdGameId }}</p>
        <p v-if="sourceLabel" class="context-note">{{ sourceLabel }}</p>
        <div class="context-list">
          <div v-for="item in neighbors" :key="item.id" class="context-row">
            <div
              class="context-row-fill"
              :style="{
                width: `${5 + 95 * (item.heatScore ?? 0)}%`,
                background: getHeatColor(item.heatScore ?? 0)
              }"
            ></div>
            <div class="context-row-content">
              <span class="context-row-word">{{ item.lemma }}</span>
              <span class="context-row-rank">{{ item.rank }}</span>
            </div>
          </div>
        </div>
        <p v-if="statusMessage" class="context-note">{{ statusMessage }}</p>
      </div>
    </div>
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'

type NeighborItem = {
  id: number
  lemma: string
  rank: number
  similarity: number
  distance: number
  heatScore: number
}

type DefineResponse = {
  target: { id: number; lemma: string }
  neighbors: NeighborItem[]
  source: 'neighbors' | 'embeddings'
}

const targetWord = ref('')
const statusMessage = ref('')
const neighbors = ref<NeighborItem[]>([])
const activeMode = ref<'random' | 'create' | 'party' | 'tasks'>('create')
const isTasksOpen = ref(false)
const isGenerating = ref(false)
const createdGameId = ref<number | null>(null)
const playUrl = ref<string | null>(null)
const sourceLabel = ref('')
const targetWordId = ref<number | null>(null)

async function generateNeighbors() {
  const word = targetWord.value.trim()
  if (!word) return
  statusMessage.value = ''
  createdGameId.value = null
  playUrl.value = null
  sourceLabel.value = ''
  targetWordId.value = null
  isGenerating.value = true

  try {
    const response = await $fetch<DefineResponse>('/api/context/define', {
      method: 'POST',
      body: { lemma: word }
    })
    neighbors.value = response.neighbors ?? []
    targetWordId.value = response.target?.id ?? null
    sourceLabel.value = response.source === 'embeddings' ? 'Игра по новому слову, мы только что посчитали соседей' : ''
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Не удалось посчитать соседей'
  } finally {
    isGenerating.value = false
  }
}

function createGame() {
  if (!neighbors.value.length || !targetWordId.value) return
  $fetch<{ ok: boolean; id?: number; playUrl?: string; exists?: boolean; message?: string }>('/api/context/create-game', {
    method: 'POST',
    body: { wordId: targetWordId.value }
  })
    .then((response) => {
      if (!response.ok && response.exists && response.id && response.playUrl) {
        createdGameId.value = response.id
        playUrl.value = response.playUrl
        statusMessage.value = 'Такая игра уже есть. Ссылка ниже.'
        return
      }
      if (response.ok && response.id && response.playUrl) {
        createdGameId.value = response.id
        playUrl.value = response.playUrl
        statusMessage.value = 'Игра создана, скоро подключим комнаты'
        return
      }
      statusMessage.value = response.message || 'Не удалось создать игру'
    })
    .catch((error) => {
      console.error(error)
      statusMessage.value = 'Не удалось создать игру'
    })
}

async function copyLink() {
  if (!playUrl.value) return
  const url = `${window.location.origin}${playUrl.value}`
  await navigator.clipboard.writeText(url)
  statusMessage.value = 'Ссылка скопирована'
}

function setMode(mode: 'random' | 'create' | 'party' | 'tasks') {
  activeMode.value = mode
  if (mode === 'random') {
    navigateTo('/games/wolf-context/random')
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

function getHeatColor(heatScore: number) {
  if (heatScore < 0.25) return '#1f2937'
  if (heatScore < 0.5) return '#3b82f6'
  if (heatScore < 0.75) return '#f59e0b'
  return '#fb923c'
}
</script>

<style scoped>
.context-page {
  padding: 32px 18px 64px;
  color: #e5e7eb;
}

.context-container {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.context-header {
  display: grid;
  gap: 6px;
  text-align: center;
}

.context-topbar {
  display: flex;
  justify-content: center;
}

.context-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.context-chip {
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

.context-chip.active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.8);
  color: #f8fafc;
}

.context-chip:hover {
  transform: translateY(-1px);
}

.context-title {
  font-size: clamp(44px, 8vw, 64px);
  font-weight: 900;
  letter-spacing: -0.02em;
}

.context-subtitle {
  margin: 0;
  color: #cbd5e1;
}

.context-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.context-howto h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.context-howto p {
  margin: 0;
  line-height: 1.6;
  color: #e2e8f0;
}

.context-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.context-card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.context-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  font-weight: 700;
}

.context-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.context-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
}

.context-btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0b1220;
}

.context-btn.ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.context-btn.copy {
  background: #d97706;
  color: #0b1220;
}

.context-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.context-list {
  display: grid;
  gap: 10px;
}

.context-row {
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
}

.context-row-fill {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  opacity: 0.65;
}

.context-row-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  font-weight: 700;
}

.context-row-word {
  font-weight: 800;
}

.context-row-rank {
  color: #e2e8f0;
  font-weight: 800;
}

.context-note {
  margin: 0;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .context-input-row {
    grid-template-columns: 1fr;
  }
}
</style>
