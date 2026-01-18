<template>
  <div v-bind="attrs" :class="['tarot-suit-badge', sizeClass, suitClass, attrs.class]">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path v-if="suit === 'pentacles'" d="M12 3l3 5 5 1-4 4 1 5-5-3-5 3 1-5-4-4 5-1 3-5z" stroke="currentColor" stroke-width="1.4" />
      <path v-else-if="suit === 'swords'" d="M12 3v12m0-12l3 3m-3-3l-3 3m3 9l4 5H8l4-5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      <path v-else-if="suit === 'wands'" d="M7 19l10-10m-7-2l6 6m-9 1l4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      <path v-else-if="suit === 'cups'" d="M7 5h10v5a5 5 0 0 1-10 0V5zM9 19h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      <circle v-else cx="12" cy="12" r="7" stroke="currentColor" stroke-width="1.4" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { TarotSuit } from '@/composables/useTarotData'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{ suit: TarotSuit; size?: 'sm' | 'md' | 'lg' }>(),
  { size: 'md' }
)
const attrs = useAttrs()

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'sm'
  if (props.size === 'lg') return 'lg'
  return ''
})

const suitClass = computed(() => {
  switch (props.suit) {
    case 'pentacles':
      return 'text-neon-amber-400'
    case 'swords':
      return 'text-neon-ice-400'
    case 'wands':
      return 'text-neon-amber-500'
    case 'cups':
      return 'text-neon-ice-300'
    default:
      return 'text-gold-500'
  }
})
</script>
