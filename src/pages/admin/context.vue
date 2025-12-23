<template>
  <div class="admin-page">
    <div class="admin-card">
      <header class="admin-header">
        <div>
          <p class="eyebrow">Контекст</p>
          <h1>Админка контекста</h1>
        </div>
        <button v-if="token" class="ghost" type="button" @click="logout">Выйти</button>
      </header>

      <div v-if="!token" class="token-form">
        <p>Введите ADMIN_TOKEN, чтобы работать с контекстом.</p>
        <div class="token-row">
          <input v-model.trim="tokenInput" type="password" placeholder="ADMIN_TOKEN" />
          <button class="primary" type="button" @click="saveToken">Войти</button>
        </div>
      </div>

      <div v-else class="admin-body">
        <div class="filters">
          <div class="field">
            <label>Целевое слово</label>
            <input v-model.trim="targetInput" type="text" placeholder="Введите слово" />
          </div>
          <label class="check-row">
            <input v-model="useStats" type="checkbox" />
            <span>Использовать бонус по статистике</span>
          </label>
          <button class="primary" type="button" :disabled="loading" @click="fetchNeighbors">
            {{ loading ? 'Считаю...' : 'Посчитать соседей' }}
          </button>
          <span v-if="target" class="muted">ID: {{ target.id }} · {{ target.lemma }}</span>
          <span v-if="successMessage" class="success">{{ successMessage }}</span>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div v-if="neighbors.length" class="list-header">
          <span>Перетаскивай для set_rank</span>
          <span class="muted">Всего: {{ neighbors.length }}</span>
        </div>

        <ul v-if="neighbors.length" class="neighbors-list">
          <li
            v-for="(item, index) in neighbors"
            :key="item.id"
            class="neighbor-item"
            :class="item.adminAction ? `action-${item.adminAction}` : ''"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
          >
            <div class="neighbor-left">
              <span class="rank">#{{ item.rank }}</span>
              <div class="word">
                <span class="lemma">{{ item.lemma }}</span>
                <span class="meta">sim {{ formatSimilarity(item.similarity) }}</span>
              </div>
              <div class="stats">
                <span>plays {{ item.playsCount ?? 0 }}</span>
                <span>avg {{ formatSimilarity(item.avgSim ?? 0) }}</span>
              </div>
            </div>
            <div class="neighbor-actions">
              <button class="pill" type="button" @click="applyAction(item, 'pin')">pin</button>
              <button class="pill danger" type="button" @click="applyAction(item, 'ban')">ban</button>
              <button class="pill danger" type="button" @click="applyGlobalBan(item)">Удалить</button>
              <div class="rank-set">
                <input v-model="manualRanks[item.id]" type="number" min="1" :max="neighbors.length" placeholder="#" />
                <button class="pill" type="button" @click="applyManualRank(item)">set</button>
              </div>
            </div>
          </li>
        </ul>

        <p v-else class="empty">Список пуст. Введите слово и нажмите "Посчитать соседей".</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type NeighborItem = {
  id: number
  lemma: string
  rank: number
  similarity: number
  adminAction?: 'ban' | 'pin' | 'set_rank' | null
  adminRank?: number | null
  playsCount?: number
  avgSim?: number
}

type PreviewResponse =
  | { ok: false; error: string }
  | { ok: true; target: { id: number; lemma: string; rank: number | null }; neighbors: NeighborItem[] }

const STORAGE_TOKEN_KEY = 'context_admin_token'

const token = ref('')
const tokenInput = ref('')
const targetInput = ref('')
const useStats = ref(false)
const neighbors = ref<NeighborItem[]>([])
const target = ref<{ id: number; lemma: string; rank: number | null } | null>(null)
const manualRanks = ref<Record<number, string>>({})
const dragIndex = ref<number | null>(null)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const loadToken = () => {
  if (!process.client) return
  token.value = sessionStorage.getItem(STORAGE_TOKEN_KEY) || ''
}

const saveToken = () => {
  if (!tokenInput.value) return
  token.value = tokenInput.value
  if (process.client) sessionStorage.setItem(STORAGE_TOKEN_KEY, token.value)
  tokenInput.value = ''
}

const logout = () => {
  token.value = ''
  if (process.client) sessionStorage.removeItem(STORAGE_TOKEN_KEY)
}

const fetchNeighbors = async () => {
  if (!token.value || !targetInput.value.trim()) return
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const response = await $fetch<PreviewResponse>('/api/admin/context/preview', {
      method: 'POST',
      headers: { 'x-admin-token': token.value },
      body: { target: targetInput.value, useStats: useStats.value }
    })
    if (!response.ok) {
      error.value = response.error || 'Не удалось загрузить список'
      return
    }
    target.value = response.target
    neighbors.value = response.neighbors || []
    manualRanks.value = {}
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить список'
  } finally {
    loading.value = false
  }
}

const applyAction = async (item: NeighborItem, action: 'ban' | 'pin' | 'set_rank', rank?: number) => {
  if (!token.value || !target.value) return
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const response = await $fetch<{ ok: boolean; error?: string }>('/api/admin/context/action', {
      method: 'POST',
      headers: { 'x-admin-token': token.value },
      body: {
        targetId: target.value.id,
        wordId: item.id,
        action,
        rank: action === 'set_rank' ? rank : null
      }
    })
    if (!response.ok) {
      error.value = response.error || 'Не удалось обновить слово'
      return
    }
    successMessage.value = 'Готово'
    await fetchNeighbors()
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось обновить слово'
  } finally {
    loading.value = false
  }
}

const applyManualRank = (item: NeighborItem) => {
  const raw = manualRanks.value[item.id]
  if (!raw) return
  const rank = Number(raw)
  if (!Number.isFinite(rank) || rank <= 0) return
  applyAction(item, 'set_rank', rank)
}

const applyGlobalBan = async (item: NeighborItem) => {
  if (!token.value) return
  const confirmed = window.confirm(`Удалить слово "${item.lemma}" глобально?`)
  if (!confirmed) return
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const response = await $fetch<{ ok: boolean; error?: string }>('/api/context/admin/global-ban', {
      method: 'POST',
      headers: { 'x-admin-token': token.value },
      body: { wordId: item.id }
    })
    if (!response.ok) {
      error.value = response.error || 'Не удалось отключить слово'
      return
    }
    neighbors.value = neighbors.value.filter((entry) => entry.id !== item.id)
    successMessage.value = 'Слово отключено'
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось отключить слово'
  } finally {
    loading.value = false
  }
}

const onDragStart = (index: number) => {
  dragIndex.value = index
}

const onDrop = (index: number) => {
  if (dragIndex.value === null) return
  const dragged = neighbors.value[dragIndex.value]
  dragIndex.value = null
  if (!dragged) return
  applyAction(dragged, 'set_rank', index + 1)
}

const formatSimilarity = (value: number) => {
  if (!Number.isFinite(value)) return '0.000'
  return value.toFixed(3)
}

onMounted(() => {
  loadToken()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 32px 16px;
  color: #e5e7eb;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
}

.admin-card {
  max-width: 1100px;
  margin: 0 auto;
  background: rgba(10, 14, 18, 0.85);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 24px;
  display: grid;
  gap: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 12px;
  color: #22c55e;
}

.token-form {
  display: grid;
  gap: 12px;
}

.token-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

input[type='text'],
input[type='password'],
input[type='number'] {
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
}

.primary,
.ghost {
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.primary {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: #05110a;
}

.ghost {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #e2e8f0;
}

.admin-body {
  display: grid;
  gap: 16px;
}

.filters {
  display: grid;
  gap: 12px;
  align-items: center;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ef5c2;
}

.check-row {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: #cbd5f5;
  font-size: 13px;
}

.muted {
  color: #a7b3aa;
  font-size: 13px;
}

.success {
  color: #86efac;
  font-size: 13px;
}

.error {
  color: #fca5a5;
  margin: 0;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #cbd5e1;
  font-size: 13px;
}

.neighbors-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.neighbor-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(12, 16, 20, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.neighbor-item.action-pin {
  border-color: rgba(34, 197, 94, 0.6);
}

.neighbor-item.action-ban {
  border-color: rgba(248, 113, 113, 0.6);
  opacity: 0.7;
}

.neighbor-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.rank {
  font-weight: 800;
  color: #f8fafc;
}

.word {
  display: grid;
  gap: 4px;
}

.lemma {
  font-weight: 700;
  font-size: 15px;
}

.meta {
  font-size: 12px;
  color: #93c5fd;
}

.stats {
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: #cbd5e1;
}

.neighbor-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}

.pill.danger {
  border-color: rgba(248, 113, 113, 0.6);
  color: #fecaca;
}

.rank-set {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rank-set input {
  width: 68px;
  padding: 6px 8px;
  border-radius: 8px;
}

.empty {
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 720px) {
  .neighbor-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
