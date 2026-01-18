<template>
  <div class="tarot-reading-view">
    <ReadingTable
      :cards="readingCards"
      :positions="activeSpreadLayout.positions"
      :selected-index="selectedCardIndex"
      :deck-id="selectedDeckId"
      :show-shadow="showShadow"
      :is-shuffling="isShuffling"
      @shuffle="shuffle"
      @select-card="revealCard"
    />
    <ReadingSidePanel
      :selected-card="selectedCard"
      :deck-id="selectedDeckId"
      :meme-mode="memeMode"
      @details="openDetails"
      @share="share"
      @save="saveReadingToHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ReadingTable from '@/components/tarot/ReadingTable.vue'
import ReadingSidePanel from '@/components/tarot/ReadingSidePanel.vue'
import { useTarotAppState } from '@/composables/useTarotAppState'

const {
  selectedDeckId,
  readingCards,
  selectedCardIndex,
  activeSpreadLayout,
  memeMode,
  showShadow,
  isShuffling,
  startShuffle,
  dealCards,
  revealCard,
  openCardDetails,
  saveReadingToHistory
} = useTarotAppState()

const selectedCard = computed(() => {
  if (selectedCardIndex.value === null) return null
  return readingCards.value[selectedCardIndex.value] ?? null
})

const shuffle = () => {
  startShuffle()
  setTimeout(() => {
    dealCards()
  }, 800)
}

const openDetails = () => {
  if (selectedCardIndex.value === null) return
  openCardDetails(selectedCardIndex.value)
}

const share = () => {
  saveReadingToHistory()
}
</script>

<style scoped>
.tarot-reading-view {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: start;
}
</style>
