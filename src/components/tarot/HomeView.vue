<template>
  <div class="tarot-view">
    <HeroBlock @primary="go('spread')" @secondary="go('decks')" />
    <HowItWorks />
    <SpreadCardsGrid
      :spreads="spreads"
      :selected-id="selectedSpreadId"
      :interactive="true"
      title-key="tarot.spreads.title"
      @select="handleSpread"
    />
    <footer class="tarot-footer">
      <div>{{ t('tarot.brand') }}</div>
      <div>{{ t('tarot.appSubtitle') }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeroBlock from '@/components/tarot/HeroBlock.vue'
import HowItWorks from '@/components/tarot/HowItWorks.vue'
import SpreadCardsGrid from '@/components/tarot/SpreadCardsGrid.vue'
import { useTarotData } from '@/composables/useTarotData'
import { useTarotAppState } from '@/composables/useTarotAppState'

const { getSpreadList, t } = useTarotData()
const { go, selectSpread, selectedSpreadId } = useTarotAppState()

const spreads = computed(() => getSpreadList())

const handleSpread = (spreadId: string) => {
  selectSpread(spreadId)
  go('spread')
}
</script>
