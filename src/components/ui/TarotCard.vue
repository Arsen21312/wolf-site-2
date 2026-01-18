<template>
  <div
    v-bind="attrs"
    class="tarot-card"
    :class="[sizeClass, { 'is-flipped': isFlipped }, attrs.class]"
    @click="emit('flip')"
  >
    <div class="tarot-card__inner">
      <div class="tarot-card__face back">
        <div class="tarot-card__back-glyph">*</div>
        <div class="tarot-card__corner top-left"></div>
        <div class="tarot-card__corner top-right"></div>
        <div class="tarot-card__corner bottom-left"></div>
        <div class="tarot-card__corner bottom-right"></div>
      </div>
      <div class="tarot-card__face front" :style="{ transform: frontTransform }">
        <div class="tarot-card__badge">
          <SuitBadge :suit="suit" size="sm" />
        </div>
        <div v-if="rankLabel" class="tarot-card__rank text-mist-200">
          {{ rankLabel }}
        </div>
        <div class="tarot-card__front-title">
          {{ t(nameKey) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import SuitBadge from '@/components/ui/SuitBadge.vue'
import { useTarotData, type TarotSuit } from '@/composables/useTarotData'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    cardId: string
    deckId?: string
    suit?: TarotSuit
    rank?: string
    isFlipped?: boolean
    isReversed?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    deckId: 'wolf_neon',
    suit: 'major',
    rank: undefined,
    isFlipped: false,
    isReversed: false,
    size: 'md'
  }
)

const emit = defineEmits<{ (e: 'flip'): void }>()
const attrs = useAttrs()
const { t, getCardKey } = useTarotData()

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'tarot-card__size-sm'
  if (props.size === 'lg') return 'tarot-card__size-lg'
  return 'tarot-card__size-md'
})

const section = computed(() => (props.suit === 'major' ? 'majorArcana' : `suits.${props.suit}`))
const nameKey = computed(() => getCardKey(props.deckId, section.value, props.cardId, 'name'))
const rankLabel = computed(() => {
  if (!props.rank) return ''
  if (props.suit === 'major') return props.rank
  const key = `tarot.ranks.${props.rank}`
  const label = t(key)
  return label === key ? props.rank : label
})

const frontTransform = computed(() => {
  const base = 'rotateY(180deg)'
  return props.isReversed ? `${base} rotate(180deg)` : base
})
</script>
