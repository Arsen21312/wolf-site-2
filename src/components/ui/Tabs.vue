<template>
  <div v-bind="attrs" class="tarot-tabs" :class="attrs.class">
    <div class="tarot-tabs__list">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="tarot-tabs__trigger"
        :class="{ active: tab.value === modelValue }"
        @click="setTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tarot-tabs__content">
      <slot :active="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  modelValue: string
  tabs: { value: string; label: string }[]
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const attrs = useAttrs()

const setTab = (value: string) => {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
}
</script>
