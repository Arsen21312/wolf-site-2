<template>
  <div class="tarot-reading">
    <div class="tarot-reading__status">
      <template v-if="isShuffling">
        <span class="tarot-reading__loader"></span>
        <span>{{ t('tarot.reading.statusShuffling') }}</span>
      </template>
      <span v-else class="text-mist-400" style="font-size: 13px;">
        {{ t('tarot.reading.statusReady') }}
      </span>
    </div>

    <div class="tarot-reading__table">
      <div class="tarot-reading__positions">
        <div
          v-for="(card, index) in cards"
          :key="`${card.cardId}-${index}`"
          class="tarot-reading__card-slot"
          :style="positionStyle(index)"
        >
          <TarotCard
            :card-id="card.cardId"
            :deck-id="deckId"
            :suit="card.suit"
            :rank="card.rank"
            :is-flipped="card.isRevealed"
            :is-reversed="card.isReversed"
            size="md"
            :class="{ 'tarot-card__glow': selectedIndex === index && showShadow }"
            @flip="emit('selectCard', index)"
          />
        </div>
      </div>
      <div class="tarot-reading__deck"></div>
    </div>

    <div class="tarot-reading__actions">
      <GlassSecondaryButton type="button" @click="emit('shuffle')">
        {{ t('tarot.cta.startShuffle') }}
      </GlassSecondaryButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import TarotCard from '@/components/ui/TarotCard.vue'
import { useTarotData } from '@/composables/useTarotData'
import type { ReadingCard } from '@/composables/useTarotAppState'

const props = defineProps<{
  cards: ReadingCard[]
  positions: { x: number; y: number }[]
  selectedIndex: number | null
  deckId: string
  showShadow: boolean
  isShuffling: boolean
}>()

const emit = defineEmits<{ (e: 'shuffle'): void; (e: 'selectCard', index: number): void }>()
const { t } = useTarotData()

const positionStyle = (index: number) => {
  const pos = props.positions[index] ?? { x: 0.5, y: 0.5 }
  return {
    left: `${pos.x * 100}%`,
    top: `${pos.y * 100}%`
  }
}
</script>

<style scoped>
.tarot-reading__actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
