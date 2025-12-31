<template>
  <div class="sudoku-keypad">
    <button
      v-for="digit in digits"
      :key="digit"
      type="button"
      class="key"
      @click="emit('input', digit)"
    >
      {{ digit }}
    </button>
    <button type="button" class="key erase" @click="emit('erase')">Стереть</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'input', digit: number): void
  (event: 'erase'): void
}>()

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
</script>

<style scoped>
.sudoku-keypad {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  width: min(520px, 100%);
}

.key {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-weight: 800;
  padding: 12px 0;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.key:active {
  transform: translateY(1px) scale(0.98);
  border-color: rgba(148, 163, 184, 0.6);
  background: rgba(30, 41, 59, 0.95);
}

.key.erase {
  grid-column: span 2;
  background: rgba(248, 113, 113, 0.18);
  border-color: rgba(248, 113, 113, 0.4);
}

@media (min-width: 900px) {
  .sudoku-keypad {
    display: none;
  }
}
</style>
