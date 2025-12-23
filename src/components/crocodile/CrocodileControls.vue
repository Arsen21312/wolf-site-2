<template>
  <div class="filters-bar">
    <button class="cycle-btn wiggle" type="button" @click="cycleDifficulty">
      {{ difficultyLabel }}
    </button>
    <button class="cycle-btn wiggle" type="button" @click="cycleType">
      {{ typeLabel }}
    </button>
    <label class="adult-toggle wiggle">
      <input type="checkbox" :checked="adultAllowed" @change="onAdultChange" />
      <span>18+</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  difficulty: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  adultAllowed: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:difficulty', 'update:type', 'update:adult-allowed'])

const difficultyOptions = [
  { value: 1, label: 'Лёгкая' },
  { value: 2, label: 'Средняя' },
  { value: 3, label: 'Сложная' }
]

const typeOptions = [
  { value: 'all', label: 'Всё' },
  { value: 'word', label: 'Слова' },
  { value: 'phrase', label: 'Фразы' }
]

const difficultyLabel = computed(() => {
  return difficultyOptions.find((option) => option.value === props.difficulty)?.label || 'Средняя'
})

const typeLabel = computed(() => {
  return typeOptions.find((option) => option.value === props.type)?.label || 'Всё'
})

const cycleDifficulty = () => {
  const currentIndex = difficultyOptions.findIndex((option) => option.value === props.difficulty)
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % difficultyOptions.length
  emit('update:difficulty', difficultyOptions[nextIndex].value)
}

const cycleType = () => {
  const currentIndex = typeOptions.findIndex((option) => option.value === props.type)
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % typeOptions.length
  emit('update:type', typeOptions[nextIndex].value)
}

const onAdultChange = (event) => {
  emit('update:adult-allowed', event.target.checked)
}
</script>

<style scoped>
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(10, 14, 18, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.cycle-btn {
  border-radius: 999px;
  padding: 8px 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 700;
}

.adult-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #e5e7eb;
}

.adult-toggle input {
  accent-color: #22c55e;
}

.wiggle {
  animation: wiggle 8s ease-in-out infinite;
}

@keyframes wiggle {
  0%,
  92%,
  100% {
    transform: translateX(0);
  }
  93% {
    transform: translateX(-2px);
  }
  94% {
    transform: translateX(2px);
  }
  95% {
    transform: translateX(-1px);
  }
  96% {
    transform: translateX(1px);
  }
}

@media (max-width: 720px) {
  .filters-bar {
    flex-direction: row;
    align-items: center;
  }
}
</style>
