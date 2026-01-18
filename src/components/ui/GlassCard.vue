<template>
  <div v-bind="attrs" :class="['tarot-glass-card', variantClass, attrs.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ variant?: 'default' | 'strong' }>()
const attrs = useAttrs()

const variantClass = computed(() => (props.variant === 'strong' ? 'bg-glass-strong' : ''))
</script>
