<template>
  <GlassCard class="tarot-panel" :class="attrs.class">
    <h3 class="tarot-title md text-mist-50">{{ t('tarot.nav.start') }}</h3>
    <div class="tarot-divider"></div>
    <div class="tarot-panel__section">
      <div class="tarot-panel__label text-mist-400">{{ t('tarot.nav.decks') }}</div>
      <div class="text-mist-50">{{ selectedDeck ? t(selectedDeck.titleKey) : t('tarot.cta.chooseDeck') }}</div>
    </div>
    <div class="tarot-panel__section">
      <div class="tarot-panel__label text-mist-400">{{ t('tarot.spreads.title') }}</div>
      <div class="text-mist-50">{{ selectedSpread ? t(selectedSpread.titleKey) : t('tarot.spreads.title') }}</div>
    </div>
    <div class="tarot-panel__section">
      <div class="tarot-panel__label text-mist-400">{{ t('tarot.labels.cards') }}</div>
      <div class="text-mist-50">{{ selectedSpread?.cardCount ?? 0 }}</div>
    </div>
    <div class="tarot-divider"></div>
    <div class="tarot-panel__section">
      <div class="tarot-panel__row">
        <div class="text-mist-200">{{ t('tarot.toggles.meme') }}</div>
        <ToggleSwitch :model-value="memeMode" @update:model-value="emit('update:memeMode', $event)" />
      </div>
      <div class="tarot-panel__row">
        <div class="text-mist-200">{{ t('tarot.toggles.showShadow') }}</div>
        <ToggleSwitch :model-value="showShadow" @update:model-value="emit('update:showShadow', $event)" />
      </div>
    </div>
    <div class="tarot-divider"></div>
    <NeonPrimaryButton type="button" style="width: 100%;" @click="emit('start')">
      {{ t('tarot.cta.startShuffle') }}
    </NeonPrimaryButton>
    <p class="text-mist-600" style="font-size: 12px; text-align: center; margin-top: 12px;">
      {{ t('tarot.microcopy.packKnows') }}
    </p>
  </GlassCard>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import { useTarotData, type DeckMeta, type SpreadMeta } from '@/composables/useTarotData'

defineOptions({ inheritAttrs: false })

defineProps<{
  selectedDeck?: DeckMeta
  selectedSpread?: SpreadMeta
  memeMode: boolean
  showShadow: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'update:memeMode', value: boolean): void
  (e: 'update:showShadow', value: boolean): void
}>()

const attrs = useAttrs()
const { t } = useTarotData()
</script>

<style scoped>
.tarot-panel__section {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
}

.tarot-panel__label {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.tarot-panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
