<template>
  <button
    v-bind="attrs"
    class="tarot-toggle"
    :class="[{ 'tarot-toggle--checked': modelValue }, attrs.class]"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="toggle"
  >
    <span class="tarot-toggle__track">
      <span class="tarot-toggle__thumb"></span>
    </span>
    <span v-if="label" class="text-mist-200">{{ label }}</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ modelValue: boolean; label?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
const attrs = useAttrs()

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>
