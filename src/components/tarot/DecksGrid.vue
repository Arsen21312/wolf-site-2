<template>
  <section class="tarot-section">
    <div class="tarot-section__head">
      <h2 class="tarot-title lg text-mist-50">{{ t('tarot.nav.decks') }}</h2>
      <p class="tarot-lead">{{ t('tarot.cta.chooseDeck') }}</p>
    </div>
    <div class="tarot-grid three">
      <DeckCoverCard
        v-for="deck in decks"
        :key="deck.deckId"
        :deck-id="deck.deckId"
        :title-key="deck.titleKey"
        :major-count="deck.counts.major"
        :minor-count="deck.counts.minor"
        :tags-key="deck.tagsKey"
        @open="emit('open', deck.deckId)"
        @start="emit('select', deck.deckId)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import DeckCoverCard from '@/components/ui/DeckCoverCard.vue'
import { useTarotData, type DeckMeta } from '@/composables/useTarotData'

defineProps<{ decks: DeckMeta[] }>()
const emit = defineEmits<{
  (e: 'select', deckId: string): void
  (e: 'open', deckId: string): void
}>()

const { t } = useTarotData()
</script>

<style scoped>
.tarot-section__head {
  text-align: left;
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
