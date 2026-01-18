<template>
  <div class="tarot-view">
    <CardDetailsPanel
      :card="selectedCard"
      :deck-id="selectedDeckId"
      @back="go('reading')"
      @save="saveReadingToHistory"
      @share="saveReadingToHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardDetailsPanel from '@/components/tarot/CardDetailsPanel.vue'
import { useTarotAppState } from '@/composables/useTarotAppState'

const {
  selectedDeckId,
  readingCards,
  selectedCardIndex,
  go,
  saveReadingToHistory
} = useTarotAppState()

const selectedCard = computed(() => {
  if (selectedCardIndex.value === null) return null
  return readingCards.value[selectedCardIndex.value] ?? null
})
</script>
