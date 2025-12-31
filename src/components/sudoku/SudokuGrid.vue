<template>
  <div class="sudoku-grid" :class="{ paused }">
    <button
      v-for="(value, index) in grid"
      :key="index"
      type="button"
      class="cell"
      :class="cellClass(index)"
      @click="emit('select', index)"
      :aria-pressed="selectedIndex === index"
    >
      <span v-if="value">{{ value }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type SudokuGrid = number[]

const props = defineProps<{
  grid: SudokuGrid
  puzzle: SudokuGrid
  selectedIndex: number | null
  highlightDigit: number | null
  conflicts: Set<number>
  checkedErrors: Set<number>
  paused: boolean
}>()

const emit = defineEmits<{
  (event: 'select', index: number): void
}>()

const selectedRow = computed(() =>
  props.selectedIndex === null ? null : Math.floor(props.selectedIndex / 9)
)
const selectedCol = computed(() => (props.selectedIndex === null ? null : props.selectedIndex % 9))
const selectedBox = computed(() => {
  if (props.selectedIndex === null) return null
  const row = Math.floor(props.selectedIndex / 9)
  const col = props.selectedIndex % 9
  return Math.floor(row / 3) * 3 + Math.floor(col / 3)
})

const cellClass = (index: number) => {
  const row = Math.floor(index / 9)
  const col = index % 9
  const isFixed = props.puzzle[index] !== 0
  const isSelected = props.selectedIndex === index
  const isRelated =
    props.selectedIndex !== null &&
    (row === selectedRow.value ||
      col === selectedCol.value ||
      Math.floor(row / 3) * 3 + Math.floor(col / 3) === selectedBox.value)
  const isSameDigit = props.highlightDigit !== null && props.grid[index] === props.highlightDigit

  return {
    fixed: isFixed,
    selected: isSelected,
    related: isRelated && !isSelected,
    same: isSameDigit && !isSelected,
    conflict: props.conflicts.has(index),
    wrong: props.checkedErrors.has(index),
    'thick-left': col % 3 === 0,
    'thick-top': row % 3 === 0,
    'thick-right': col === 8,
    'thick-bottom': row === 8
  }
}
</script>

<style scoped>
.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 0;
  width: min(540px, 100%);
  aspect-ratio: 1;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: inset 0 0 0 2px rgba(15, 23, 42, 0.8);
}

.cell {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: transparent;
  color: #e2e8f0;
  font-size: clamp(16px, 3vw, 22px);
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.cell.thick-left {
  border-left: 2px solid rgba(226, 232, 240, 0.5);
}

.cell.thick-top {
  border-top: 2px solid rgba(226, 232, 240, 0.5);
}

.cell.thick-right {
  border-right: 2px solid rgba(226, 232, 240, 0.5);
}

.cell.thick-bottom {
  border-bottom: 2px solid rgba(226, 232, 240, 0.5);
}

.cell.fixed {
  color: #f8fafc;
  background: rgba(148, 163, 184, 0.18);
}

.cell.selected {
  background: rgba(59, 130, 246, 0.45);
  color: #0f172a;
}

.cell.related {
  background: rgba(59, 130, 246, 0.15);
}

.cell.same {
  background: rgba(34, 197, 94, 0.25);
}

.cell.conflict {
  background: rgba(248, 113, 113, 0.35);
  color: #0f172a;
}

.cell.wrong {
  box-shadow: inset 0 0 0 2px rgba(248, 113, 113, 0.9);
}

.sudoku-grid.paused .cell {
  cursor: default;
}
</style>
