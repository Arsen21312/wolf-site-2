<template>
  <div class="stats">
    <div v-if="loading" class="status">Загружаем статистику...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else-if="stats" class="stats-grid">
      <div class="stat-card">
        <p class="label">Онлайн игроков</p>
        <p class="value">{{ formatNumber(stats.online_count) }}</p>
      </div>
      <div class="stat-card">
        <p class="label">Всего показов</p>
        <p class="value">{{ formatNumber(stats.total_views) }}</p>
      </div>
      <div class="stat-card">
        <p class="label">Средняя скорость</p>
        <p class="value">{{ formatSeconds(stats.avg_seconds_per_show) }}</p>
      </div>
      <div class="stat-card">
        <p class="label">Ожидают модерации</p>
        <p class="value">{{ formatNumber(stats.pending_count) }}</p>
      </div>

      <div class="stat-card wide">
        <p class="label">Одобренные по сложностям</p>
        <div class="list">
          <div v-for="row in stats.approved_by_difficulty" :key="row.difficulty" class="list-row">
            <span>Сложность {{ row.difficulty }}</span>
            <span>{{ formatNumber(row.count) }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card wide">
        <p class="label">Новые слова и фразы</p>
        <ul class="items-list">
          <li v-for="item in stats.latest_items" :key="item.id">
            <span class="item-type">{{ item.type === 'word' ? 'Слово' : 'Фраза' }}</span>
            <span class="item-text">{{ item.text }}</span>
          </li>
        </ul>
      </div>

      <div class="stat-card wide">
        <p class="label">Топ 5 слов по лайкам</p>
        <ul class="items-list">
          <li v-for="item in stats.top_words" :key="item.id">
            <span class="item-text">{{ item.text }}</span>
            <span class="likes">Лайки: {{ formatNumber(item.likes) }}</span>
          </li>
        </ul>
      </div>

      <div class="stat-card wide">
        <p class="label">Топ 5 фраз по лайкам</p>
        <ul class="items-list">
          <li v-for="item in stats.top_phrases" :key="item.id">
            <span class="item-text">{{ item.text }}</span>
            <span class="likes">Лайки: {{ formatNumber(item.likes) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const stats = ref(null)
const loading = ref(false)
const error = ref('')
const hasLoaded = ref(false)

const formatNumber = (value) => {
  if (value === null || value === undefined) return '--'
  return Number(value).toLocaleString('ru-RU')
}

const formatSeconds = (value) => {
  if (!value) return '--'
  return `${Number(value).toFixed(1)} сек`
}

const loadStats = async () => {
  if (loading.value || hasLoaded.value) return
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/crocodile/stats')
    if (!response?.ok) {
      error.value = response?.error || 'Не удалось загрузить статистику.'
      return
    }
    stats.value = {
      approved_by_difficulty: [],
      latest_items: [],
      top_words: [],
      top_phrases: [],
      ...(response.stats || {})
    }
    hasLoaded.value = true
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка при загрузке статистики.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.active,
  (value) => {
    if (value) loadStats()
  },
  { immediate: false }
)
</script>

<style scoped>
.stats {
  display: grid;
  gap: 12px;
}

.status {
  color: #cbd5cb;
}

.status.error {
  color: #fca5a5;
}

.stats-grid {
  display: grid;
  gap: 14px;
}

.stat-card {
  background: rgba(10, 14, 18, 0.75);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 14px 16px;
  display: grid;
  gap: 10px;
}

.stat-card.wide {
  grid-column: 1 / -1;
}

.label {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #7ee7a7;
}

.value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.list {
  display: grid;
  gap: 6px;
}

.list-row {
  display: flex;
  justify-content: space-between;
  color: #cbd5cb;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.items-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #cbd5cb;
  font-size: 14px;
}

.item-type {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ef5c2;
}

.item-text {
  flex: 1;
}

.likes {
  color: #fbbf24;
}

@media (max-width: 640px) {
  .items-list li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
