<template>
  <div v-bind="attrs" class="tarot-chip-row" :class="attrs.class">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="tarot-chip"
      :class="{ active: modelValue.includes(option.value) }"
      :aria-pressed="modelValue.includes(option.value)"
      @click="toggle(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  modelValue: string[]
  options: { value: string; label: string }[]
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string[]): void }>()
const attrs = useAttrs()

const toggle = (value: string) => {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((item) => item !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
}
</script>
