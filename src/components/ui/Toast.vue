<template>
  <div v-if="open" class="tarot-toast" :class="variantClass">
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ open: boolean; message?: string; variant?: 'default' | 'success' | 'danger' }>(),
  { message: '', variant: 'default' }
)

const variantClass = computed(() => {
  if (props.variant === 'success') return 'text-neon-emerald-400'
  if (props.variant === 'danger') return 'text-neon-crimson-500'
  return 'text-mist-200'
})
</script>
