<template>
  <div class="crocodile-card">
    <p v-if="item" class="task-text">{{ item.text }}</p>
      <p v-else class="task-placeholder">Выбери сложность и нажми «Показать».</p>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.crocodile-card {
  border-radius: 20px;
  padding: 32px;
  background: rgba(10, 14, 18, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.25);
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
}

.task-text {
  font-size: clamp(26px, 4vw, 38px);
  color: #9ca3af;
  margin: 0;
}

.task-placeholder {
  margin: 0;
  color: #6b7280;
}

.card-footer {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
}
</style>
