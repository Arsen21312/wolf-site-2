<template>
  <section class="tarot-section">
    <div class="tarot-section__head">
      <h2 class="tarot-title lg text-mist-50">{{ t('tarot.nav.history') }}</h2>
      <p class="tarot-lead">{{ t('tarot.cta.myHistory') }}</p>
    </div>

    <div class="tarot-history__filters">
      <SearchInput v-model="search" :placeholder="t('tarot.history.search')" />
      <FilterChips v-model="activeSuits" :options="suitOptions" />
    </div>

    <div v-if="filteredReadings.length" class="tarot-history__list">
      <GlassCard v-for="reading in filteredReadings" :key="reading.id" class="tarot-history-card">
        <div class="tarot-history-card__cards">
          <CardMini v-for="(card, index) in reading.cards" :key="`${reading.id}-${index}`" :card-id="card.cardId" :suit="card.suit" />
        </div>
        <div class="tarot-history-card__info">
          <div class="text-mist-400" style="font-size: 12px;">
            {{ reading.createdAt }}
          </div>
          <div class="tarot-title md text-mist-50">
            {{ t(spreadTitle(reading.spreadId)) }}
          </div>
          <div class="text-mist-400" style="font-size: 13px;">
            {{ t(deckTitle(reading.deckId)) }}
          </div>
        </div>
        <div class="tarot-history-card__actions">
          <GlassSecondaryButton type="button" @click="repeat(reading)">
            {{ t('tarot.cta.repeat') }}
          </GlassSecondaryButton>
          <GlassSecondaryButton type="button" @click="openDetails(reading)">
            {{ t('tarot.cta.openCard') }}
          </GlassSecondaryButton>
        </div>
      </GlassCard>
    </div>

    <div v-else class="tarot-history__empty">
      <div class="tarot-history__empty-icon">*</div>
      <h3 class="tarot-title md text-mist-50">{{ t('tarot.nav.history') }}</h3>
      <p class="tarot-lead">{{ t('tarot.microcopy.emptyHistory') }}</p>
      <NeonPrimaryButton type="button" @click="go('spread')">
        {{ t('tarot.cta.makeReading') }}
      </NeonPrimaryButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CardMini from '@/components/ui/CardMini.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import { useTarotData } from '@/composables/useTarotData'
import { useReadingHistory, type ReadingHistoryItem } from '@/composables/useReadingHistory'
import { useTarotAppState } from '@/composables/useTarotAppState'

const search = ref('')
const activeSuits = ref<string[]>([])

const { t, getDeckById, getSpreadById } = useTarotData()
const { history } = useReadingHistory()
const { repeatReading, go } = useTarotAppState()

const suitOptions = [
  { value: 'cups', label: t('tarot.suits.cups') },
  { value: 'wands', label: t('tarot.suits.wands') },
  { value: 'swords', label: t('tarot.suits.swords') },
  { value: 'pentacles', label: t('tarot.suits.pentacles') }
]

const deckTitle = (deckId: string) => getDeckById(deckId)?.titleKey ?? 'tarot.nav.decks'
const spreadTitle = (spreadId: string) => getSpreadById(spreadId)?.titleKey ?? 'tarot.spreads.title'

const filteredReadings = computed(() => {
  const query = search.value.trim().toLowerCase()
  return history.value.filter((entry) => {
    const matchesQuery = !query || entry.deckId.toLowerCase().includes(query) || entry.spreadId.toLowerCase().includes(query)
    const matchesSuit =
      !activeSuits.value.length || entry.cards.some((card) => activeSuits.value.includes(card.suit))
    return matchesQuery && matchesSuit
  })
})

const repeat = (entry: ReadingHistoryItem) => {
  repeatReading({ deckId: entry.deckId, spreadId: entry.spreadId, cards: entry.cards })
}

const openDetails = (entry: ReadingHistoryItem) => {
  repeat(entry)
}
</script>

<style scoped>
.tarot-section__head {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.tarot-history__filters {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.tarot-history__list {
  display: grid;
  gap: 16px;
}

.tarot-history-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
}

.tarot-history-card__cards {
  display: flex;
  gap: 8px;
}

.tarot-history-card__info {
  display: grid;
  gap: 6px;
}

.tarot-history-card__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tarot-history__empty {
  display: grid;
  gap: 12px;
  place-items: center;
  text-align: center;
  padding: 36px 0;
}

.tarot-history__empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  border: 1px dashed var(--border-glass);
  display: grid;
  place-items: center;
  color: var(--mist-600);
  font-size: 24px;
}

@media (max-width: 800px) {
  .tarot-history-card {
    grid-template-columns: 1fr;
    align-items: start;
  }
}
</style>
