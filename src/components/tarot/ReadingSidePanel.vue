<template>
  <GlassCard class="tarot-panel" :class="attrs.class">
    <template v-if="selectedCard">
      <div class="tarot-panel__header">
        <div>
          <div class="text-mist-400" style="font-size: 12px; letter-spacing: 0.2em;">
            {{ t('tarot.reading.panelTitle') }}
          </div>
          <h3 class="tarot-title md text-mist-50">{{ t(nameKey) }}</h3>
        </div>
        <SuitBadge :suit="selectedCard.suit" size="sm" />
      </div>

      <div v-if="memeMode" class="tarot-panel__quote">
        {{ t(memeKey) }}
      </div>

      <Tabs v-model="activeTab" :tabs="tabItems">
        <template #default="{ active }">
          <div v-if="active === 'upright'" class="tarot-panel__content">
            <div>
              <div class="text-mist-200" style="font-size: 12px; letter-spacing: 0.12em;">
                {{ t('tarot.reading.meaning') }}
              </div>
              <p class="tarot-lead" style="font-size: 13px;">
                {{ t(meaningKey) }}
              </p>
            </div>
            <div>
              <div class="text-neon-amber-400" style="font-size: 12px; letter-spacing: 0.12em;">
                {{ t('tarot.reading.shadow') }}
              </div>
              <p class="tarot-lead" style="font-size: 13px;">
                {{ t(shadowKey) }}
              </p>
            </div>
            <div>
              <div class="text-mist-200" style="font-size: 12px; letter-spacing: 0.12em;">
                {{ t('tarot.reading.rule') }}
              </div>
              <p class="tarot-lead" style="font-size: 13px;">
                {{ t(ruleKey) }}
              </p>
            </div>
          </div>
          <div v-else class="tarot-panel__content">
            <div>
              <div class="text-mist-200" style="font-size: 12px; letter-spacing: 0.12em;">
                {{ t('tarot.reading.meaning') }}
              </div>
              <p class="tarot-lead" style="font-size: 13px;">
                {{ t(reversedKey) }}
              </p>
            </div>
          </div>
        </template>
      </Tabs>

      <div class="tarot-panel__actions">
        <GlassSecondaryButton type="button" @click="emit('details')">
          {{ t('tarot.cta.openCard') }}
        </GlassSecondaryButton>
        <GlassSecondaryButton type="button" @click="emit('share')">
          {{ t('tarot.cta.share') }}
        </GlassSecondaryButton>
        <NeonPrimaryButton type="button" @click="emit('save')">
          {{ t('tarot.cta.save') }}
        </NeonPrimaryButton>
      </div>
    </template>

    <template v-else>
      <div class="tarot-panel__empty">
        <div class="tarot-panel__empty-icon">*</div>
        <p class="tarot-lead" style="font-size: 14px;">
          {{ t('tarot.microcopy.pullCard') }}
        </p>
      </div>
    </template>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import SuitBadge from '@/components/ui/SuitBadge.vue'
import Tabs from '@/components/ui/Tabs.vue'
import { useTarotData } from '@/composables/useTarotData'
import type { ReadingCard } from '@/composables/useTarotAppState'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  selectedCard: ReadingCard | null
  deckId: string
  memeMode: boolean
}>()

const emit = defineEmits<{
  (e: 'details'): void
  (e: 'share'): void
  (e: 'save'): void
}>()

const attrs = useAttrs()
const { t, getCardKey } = useTarotData()

const activeTab = ref('upright')
const tabItems = [
  { value: 'upright', label: t('tarot.reading.upright') },
  { value: 'reversed', label: t('tarot.reading.reversed') }
]

const section = computed(() => {
  if (!props.selectedCard) return 'majorArcana'
  return props.selectedCard.suit === 'major' ? 'majorArcana' : `suits.${props.selectedCard.suit}`
})

const nameKey = computed(() => {
  if (!props.selectedCard) return 'tarot.microcopy.pullCard'
  return getCardKey(props.deckId, section.value, props.selectedCard.cardId, 'name')
})

const memeKey = computed(() => {
  if (!props.selectedCard) return 'tarot.microcopy.pullCard'
  return getCardKey(props.deckId, section.value, props.selectedCard.cardId, 'meme_quote')
})

const meaningKey = computed(() => {
  if (!props.selectedCard) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.selectedCard.cardId, 'meaning_upright')
})

const shadowKey = computed(() => {
  if (!props.selectedCard) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.selectedCard.cardId, 'shadow')
})

const ruleKey = computed(() => {
  if (!props.selectedCard) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.selectedCard.cardId, 'pack_rule')
})

const reversedKey = computed(() => {
  if (!props.selectedCard) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.selectedCard.cardId, 'meaning_reversed')
})
</script>

<style scoped>
.tarot-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tarot-panel__quote {
  margin: 16px 0;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-glass);
  background: rgba(5, 7, 10, 0.5);
  font-size: 13px;
  color: var(--mist-200);
  font-style: italic;
}

.tarot-panel__content {
  display: grid;
  gap: 16px;
}

.tarot-panel__actions {
  display: grid;
  gap: 10px;
  margin-top: 20px;
}

.tarot-panel__empty {
  display: grid;
  place-items: center;
  text-align: center;
  gap: 12px;
  padding: 32px 0;
}

.tarot-panel__empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  border: 1px solid var(--border-glass);
  display: grid;
  place-items: center;
  color: var(--mist-600);
  font-size: 24px;
}
</style>
