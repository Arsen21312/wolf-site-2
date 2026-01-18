<template>
  <div class="tarot-spread-view">
    <div class="tarot-spread-view__main">
      <SpreadCardsGrid
        :spreads="spreads"
        :selected-id="selectedSpreadId"
        :interactive="true"
        title-key="tarot.spreads.title"
        @select="selectSpread"
      />
    </div>
    <div class="tarot-spread-view__panel">
      <SpreadSelectorPanel
        :selected-deck="selectedDeck"
        :selected-spread="selectedSpread"
        :meme-mode="memeMode"
        :show-shadow="showShadow"
        @update:meme-mode="memeMode = $event"
        @update:show-shadow="showShadow = $event"
        @start="startReading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SpreadCardsGrid from '@/components/tarot/SpreadCardsGrid.vue'
import SpreadSelectorPanel from '@/components/tarot/SpreadSelectorPanel.vue'
import { useTarotData } from '@/composables/useTarotData'
import { useTarotAppState } from '@/composables/useTarotAppState'

const { getSpreadList, getDeckById, getSpreadById } = useTarotData()
const {
  selectedDeckId,
  selectedSpreadId,
  memeMode,
  showShadow,
  selectSpread,
  startShuffle,
  dealCards,
  go
} = useTarotAppState()

const spreads = computed(() => getSpreadList())
const selectedDeck = computed(() => getDeckById(selectedDeckId.value))
const selectedSpread = computed(() => getSpreadById(selectedSpreadId.value))

const startReading = () => {
  startShuffle()
  go('reading')
  setTimeout(() => {
    dealCards()
  }, 800)
}
</script>

<style scoped>
.tarot-spread-view {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: start;
}

.tarot-spread-view__panel {
  position: sticky;
  top: 90px;
}
</style>
