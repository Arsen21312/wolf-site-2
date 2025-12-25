<template>
  <div class="wc-history">
    <ul v-if="items.length || status || currentText" class="wc-history-list">
      <li v-if="status || currentText" class="wc-history-item">
        <div
          :class="[
            'wc-row',
            currentText
              ? currentType === 'guess'
                ? 'wc-row-current'
                : 'wc-row-status'
              : 'wc-row-status',
            currentType === 'error' ? 'wc-row-status-error' : '',
            !currentText && status?.type === 'error' ? 'wc-row-status-error' : ''
          ]"
        >
          <div
            class="wc-row-content"
            :class="{
              'wc-row-status-content': !currentText || currentType === 'error' || currentType === 'info'
            }"
          >
            <template v-if="currentText">
              <span class="wc-word" :class="{ 'wc-word-center': currentType === 'error' || currentType === 'info' }">
                {{ currentText }}
                <span
                  v-if="currentType === 'guess'"
                  class="wc-hint-pill"
                  :class="{ 'wc-current-pill': !currentIsHint }"
                >
                  {{ currentIsHint ? 'подсказка' : 'текущий ход' }}
                </span>
                <span
                  v-if="currentType === 'guess' && currentPlayerName"
                  class="wc-player-inline"
                >
                  · {{ currentPlayerName }}
                </span>
              </span>
              <span v-if="status?.type === 'loading'" class="wc-spinner wc-current-spinner"></span>
              <span v-if="currentType === 'guess' && currentRank !== null" class="wc-rank">
                {{ currentRank }}
              </span>
            </template>
            <span v-else class="wc-status-text">
              <span v-if="status?.type === 'loading'" class="wc-spinner"></span>
              {{ status?.text }}
            </span>
          </div>
        </div>
      </li>
      <li v-for="item in items" :key="String(item.id)" class="wc-history-item">
        <div :class="['wc-row', item.isHint ? 'wc-row-hint' : '']">
          <div
            class="wc-row-fill"
            :style="{ width: `${5 + 95 * (item.heatScore ?? 0)}%`, background: getZoneColor(item.zone) }"
          ></div>
          <div class="wc-row-content">
            <span class="wc-word">
              {{ item.lemma }}
              <span v-if="item.isHint" class="wc-hint-pill">подсказка</span>
              <span v-if="showPlayer && item.playerName" class="wc-player-inline">· {{ item.playerName }}</span>
            </span>
            <span class="wc-rank">{{ item.position }}</span>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="wc-muted">{{ emptyText }}</p>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

type GuessItem = {
  id: number | string
  lemma: string
  position: number
  heatScore: number
  zone: 'ice' | 'cold' | 'warm' | 'hot' | 'fire' | 'finish'
  isHint: boolean
  playerName?: string | null
}

type StatusState = { type: 'loading' | 'error' | 'info'; text: string } | null

const props = withDefaults(
  defineProps<{
    items: GuessItem[]
    status?: StatusState
    currentText?: string
    currentType?: 'guess' | 'error' | 'info'
    currentRank?: number | null
    currentPlayerName?: string | null
    currentIsHint?: boolean
    emptyText?: string
    showPlayer?: boolean
  }>(),
  {
    status: null,
    currentText: '',
    currentType: 'guess',
    currentRank: null,
    currentPlayerName: null,
    currentIsHint: false,
    emptyText: 'История пока пуста',
    showPlayer: false
  }
)

const { items, status, currentText, currentType, emptyText, showPlayer } = toRefs(props)

function getZoneColor(zone: GuessItem['zone']) {
  switch (zone) {
    case 'finish':
      return '#22c55e'
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
</script>

<style scoped>
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
  background: rgba(248, 113, 113, 0.12);
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

.wc-word-center {
  justify-content: center;
  text-align: center;
  width: 100%;
}

.wc-player-inline {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
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

.wc-muted {
  margin: 0;
  color: #94a3b8;
  text-align: center;
}

.wc-spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(226, 232, 240, 0.25);
  border-top-color: #e2e8f0;
  animation: wc-spin 0.9s linear infinite;
}

.wc-current-spinner {
  width: 12px;
  height: 12px;
  border-width: 2px;
}

@keyframes wc-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
