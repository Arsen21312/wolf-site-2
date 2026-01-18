<template>
  <div v-bind="attrs" class="tarot-card-mini" :class="attrs.class">
    <SuitBadge :suit="suit" size="sm" />
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import SuitBadge from '@/components/ui/SuitBadge.vue'
import type { TarotSuit } from '@/composables/useTarotData'

defineOptions({ inheritAttrs: false })

defineProps<{ cardId: string; suit: TarotSuit }>()
const attrs = useAttrs()
</script>
