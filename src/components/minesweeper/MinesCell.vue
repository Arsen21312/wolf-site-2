<template>
  <button
    class="cell"
    :class="{
      revealed: cell.isRevealed,
      flagged: cell.isFlagged,
      mine: cell.isMine && cell.isRevealed
    }"
    type="button"
    :aria-label="ariaLabel"
    @click="handleClick"
    @contextmenu.prevent="handleFlag"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointerleave="clearPress"
    @pointercancel="clearPress"
  >
    <span v-if="cell.isRevealed && cell.isMine" class="mine-icon">M</span>
    <span v-else-if="cell.isFlagged" class="flag-icon" aria-hidden="true"></span>
    <span
      v-else-if="cell.isRevealed && cell.adjacent > 0"
      class="adjacent"
      :class="`adjacent-${cell.adjacent}`"
    >
      {{ cell.adjacent }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MinesweeperCell } from '@/composables/useMinesweeper'

type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

const props = defineProps<{
  cell: MinesweeperCell
  status: GameStatus | string
}>()

const emit = defineEmits<{
  (e: 'reveal', index: number): void
  (e: 'flag', index: number): void
}>()

const suppressClick = ref(false)
let longPressTimer: ReturnType<typeof setTimeout> | null = null

const handleClick = () => {
  if (suppressClick.value) {
    suppressClick.value = false
    return
  }
  emit('reveal', props.cell.id)
}

const handleFlag = () => {
  emit('flag', props.cell.id)
}

const handlePointerDown = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') return
  suppressClick.value = false
  if (longPressTimer) clearTimeout(longPressTimer)
  longPressTimer = setTimeout(() => {
    suppressClick.value = true
    emit('flag', props.cell.id)
    longPressTimer = null
  }, 420)
}

const handlePointerUp = () => {
  if (longPressTimer) clearTimeout(longPressTimer)
  longPressTimer = null
}

const clearPress = () => {
  if (longPressTimer) clearTimeout(longPressTimer)
  longPressTimer = null
}

const ariaLabel = computed(() => {
  if (props.cell.isFlagged) return 'Flag'
  if (!props.cell.isRevealed) return 'Hidden'
  if (props.cell.isMine) return 'Mine'
  return props.cell.adjacent ? `Adjacent ${props.cell.adjacent}` : 'Empty'
})
</script>

<style scoped>
.cell {
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(30, 41, 59, 0.85);
  color: #e2e8f0;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  transition: transform 0.08s ease, background 0.15s ease, border-color 0.2s ease;
  position: relative;
}

.cell:hover {
  border-color: rgba(148, 163, 184, 0.6);
  transform: translateY(-1px);
}

.cell.revealed {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(148, 163, 184, 0.2);
  cursor: default;
  transform: none;
}

.cell.flagged {
  background: rgba(30, 64, 175, 0.4);
  border-color: rgba(96, 165, 250, 0.6);
}

.cell.mine {
  background: rgba(220, 38, 38, 0.3);
  border-color: rgba(248, 113, 113, 0.7);
}

.flag-icon {
  width: 16px;
  height: 14px;
  position: relative;
}

.flag-icon::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1px;
  width: 2px;
  height: 12px;
  background: #cbd5f5;
  border-radius: 2px;
}

.flag-icon::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 10px;
  height: 8px;
  background: #60a5fa;
  clip-path: polygon(0 0, 100% 25%, 0 50%);
}

.mine-icon {
  color: #fca5a5;
}

.adjacent-1 {
  color: #38bdf8;
}

.adjacent-2 {
  color: #4ade80;
}

.adjacent-3 {
  color: #f87171;
}

.adjacent-4 {
  color: #a78bfa;
}

.adjacent-5 {
  color: #facc15;
}

.adjacent-6 {
  color: #22d3ee;
}

.adjacent-7 {
  color: #f97316;
}

.adjacent-8 {
  color: #e2e8f0;
}
</style>
