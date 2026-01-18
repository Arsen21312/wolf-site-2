<template>
  <div v-bind="attrs" class="tarot-search" :class="attrs.class">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.4" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
    </svg>
    <input type="text" :value="modelValue" :placeholder="placeholder" @input="onInput" />
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{ modelValue: string; placeholder?: string }>(),
  { placeholder: '' }
)
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const attrs = useAttrs()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
