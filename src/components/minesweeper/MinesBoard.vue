<template>
  <div class="mines-board" :style="{ '--cols': cols }" @contextmenu.prevent>
    <MinesCell
      v-for="cell in board"
      :key="cell.id"
      :cell="cell"
      :status="status"
      @reveal="$emit('reveal', $event)"
      @flag="$emit('flag', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import MinesCell from '@/components/minesweeper/MinesCell.vue'
import type { MinesweeperCell } from '@/composables/useMinesweeper'

defineProps<{
  board: MinesweeperCell[]
  rows: number
  cols: number
  status: string
}>()

defineEmits<{
  (e: 'reveal', index: number): void
  (e: 'flag', index: number): void
}>()
</script>

<style scoped>
.mines-board {
  --cell-size: min(32px, calc(92vw / var(--cols)));
  display: grid;
  grid-template-columns: repeat(var(--cols), var(--cell-size));
  grid-auto-rows: var(--cell-size);
  gap: 4px;
  padding: 10px;
  border-radius: 18px;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.16);
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  touch-action: manipulation;
  user-select: none;
  justify-content: center;
}

@media (max-width: 720px) {
  .mines-board {
    gap: 3px;
    padding: 8px;
  }
}
</style>
