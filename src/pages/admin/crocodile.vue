<template>
  <div class="admin-page">
    <div class="admin-card">
      <header class="admin-header">
        <div>
          <p class="eyebrow">Админка</p>
          <h1>Крокодил: модерация pending</h1>
        </div>
        <button v-if="token" class="ghost" type="button" @click="logout">Выйти</button>
      </header>

      <div v-if="!token" class="token-form">
        <p>Введите ADMIN_TOKEN для доступа к модерации.</p>
        <div class="token-row">
          <input v-model.trim="tokenInput" type="password" placeholder="ADMIN_TOKEN" />
          <button class="primary" type="button" @click="saveToken">Войти</button>
        </div>
      </div>

      <div v-else class="pending-section">
        <div class="actions-row">
          <button class="primary" type="button" :disabled="loading" @click="fetchPending">
            {{ loading ? 'Обновляем...' : 'Обновить список' }}
          </button>
          <span class="muted">Всего pending: {{ pending.length }}</span>
          <span v-if="successMessage" class="success">{{ successMessage }}</span>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div v-if="!pending.length && !loading" class="empty">Очередь чиста.</div>

        <div class="pending-grid">
          <div v-for="item in pending" :key="item.id" class="pending-card">
            <div class="meta">
              <span class="badge">{{ item.type === 'word' ? 'Слово' : 'Фраза' }}</span>
              <span class="badge">Сложность {{ item.difficulty }}</span>
              <span v-if="item.is_adult" class="badge danger">18+</span>
            </div>
            <div class="edit-grid">
              <button class="pill-btn" type="button" @click="toggleType(item)">
                {{ item.type === 'word' ? 'Слово' : 'Фраза' }}
              </button>
              <button class="pill-btn" type="button" @click="cycleDifficulty(item)">
                {{ difficultyLabel(item.difficulty) }}
              </button>
              <button
                class="pill-btn"
                type="button"
                :class="{ active: item.is_adult }"
                @click="item.is_adult = !item.is_adult"
              >
                18+
              </button>
            </div>
            <div class="field">
              <label>Текст</label>
              <textarea v-model.trim="item.text" rows="2" />
            </div>
            <p class="created">{{ formatDate(item.created_at) }} · {{ item.created_by || 'Без автора' }}</p>
            <div class="actions">
              <button class="approve" type="button" @click="approveItem(item)">Одобрить</button>
              <button class="reject" type="button" @click="updateStatus(item.id, 'reject')">Отклонить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const STORAGE_TOKEN_KEY = 'crocodile_admin_token'

const token = ref('')
const tokenInput = ref('')
const pending = ref([])
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
  fetchPending()
}

const logout = () => {
  token.value = ''
  if (process.client) sessionStorage.removeItem(STORAGE_TOKEN_KEY)
}

const fetchPending = async () => {
  if (!token.value) return
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const response = await $fetch('/api/admin/crocodile/pending', {
      headers: { 'x-admin-token': token.value }
    })
    if (!response?.ok) {
      error.value = response?.error || 'Не удалось загрузить.'
      return
    }
    pending.value = response.items || []
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка при загрузке.'
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, action) => {
  if (!token.value) return
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const response = await $fetch(`/api/admin/crocodile/${action}`, {
      method: 'POST',
      headers: { 'x-admin-token': token.value },
      body: { id }
    })
    if (!response?.ok) {
      error.value = response?.error || 'Не удалось обновить.'
      return
    }
    pending.value = pending.value.filter((item) => item.id !== id)
    successMessage.value = action === 'approve' ? 'Апрувнуто' : 'Реджект'
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка при обновлении.'
  } finally {
    loading.value = false
  }
}

const toggleType = (item) => {
  item.type = item.type === 'word' ? 'phrase' : 'word'
}

const cycleDifficulty = (item) => {
  const next = item.difficulty === 3 ? 1 : item.difficulty + 1
  item.difficulty = next
}

const difficultyLabel = (value) => {
  if (value === 1) return 'Лёгкая'
  if (value === 2) return 'Средняя'
  return 'Сложная'
}

const approveItem = async (item) => {
  if (!token.value) return
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const response = await $fetch('/api/admin/crocodile/update', {
      method: 'POST',
      headers: { 'x-admin-token': token.value },
      body: {
        id: item.id,
        text: item.text,
        type: item.type,
        difficulty: item.difficulty,
        is_adult: item.is_adult
      }
    })
    if (!response?.ok) {
      error.value = response?.error || 'Не удалось обновить.'
      return
    }
    pending.value = pending.value.filter((entry) => entry.id !== item.id)
    successMessage.value = 'Апрувнуто'
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка при обновлении.'
  } finally {
    loading.value = false
  }
}

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString('ru-RU')
}

onMounted(() => {
  loadToken()
  if (token.value) fetchPending()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 32px 16px;
  background: transparent;
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
}

.eyebrow {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 12px;
  color: #34d399;
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

input {
  flex: 1;
  min-width: 200px;
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

.pending-section {
  display: grid;
  gap: 16px;
}

.actions-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.muted {
  color: #a7b3aa;
}

.pending-grid {
  display: grid;
  gap: 14px;
}

.pending-card {
  border-radius: 16px;
  padding: 16px;
  background: rgba(12, 16, 20, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  display: grid;
  gap: 10px;
}

.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
}

.badge.danger {
  background: rgba(248, 113, 113, 0.2);
  color: #fecaca;
}

.created {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 10px;
}

.approve,
.reject {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 700;
  cursor: pointer;
}

.approve {
  background: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
}

.reject {
  background: rgba(239, 68, 68, 0.2);
  color: #fecaca;
}

.error {
  margin: 0;
  color: #fca5a5;
}

.success {
  color: #86efac;
  font-size: 13px;
}

.empty {
  color: #94a3b8;
}

.edit-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill-btn {
  border-radius: 999px;
  padding: 8px 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 700;
}

.pill-btn.active {
  border-color: rgba(34, 197, 94, 0.6);
  color: #86efac;
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

textarea {
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 10px;
  padding: 8px 10px;
}
</style>
