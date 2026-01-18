<template>
  <section class="tarot-card-details">
    <div class="tarot-card-details__header">
      <GlassSecondaryButton type="button" @click="emit('back')">
        {{ t('tarot.cta.back') }}
      </GlassSecondaryButton>
      <div class="tarot-card-details__actions">
        <GlassSecondaryButton type="button" @click="emit('share')">
          {{ t('tarot.cta.share') }}
        </GlassSecondaryButton>
        <NeonPrimaryButton type="button" @click="emit('save')">
          {{ t('tarot.cta.save') }}
        </NeonPrimaryButton>
      </div>
    </div>

    <div class="tarot-card-details__body">
      <div class="tarot-card-details__preview">
        <TarotCard
          v-if="card"
          :card-id="card.cardId"
          :deck-id="deckId"
          :suit="card.suit"
          :rank="card.rank"
          :is-flipped="true"
          :is-reversed="card.isReversed"
          size="lg"
        />
      </div>
      <div class="tarot-card-details__content">
        <h2 class="tarot-title lg text-mist-50">{{ t(nameKey) }}</h2>
        <p class="tarot-lead">{{ t(memeKey) }}</p>

        <div class="tarot-card-details__block">
          <div class="text-mist-200" style="font-size: 12px; letter-spacing: 0.2em;">
            {{ t('tarot.reading.meaning') }}
          </div>
          <p class="tarot-lead">{{ t(meaningKey) }}</p>
        </div>

        <div class="tarot-card-details__block">
          <div class="text-neon-amber-400" style="font-size: 12px; letter-spacing: 0.2em;">
            {{ t('tarot.reading.shadow') }}
          </div>
          <p class="tarot-lead">{{ t(shadowKey) }}</p>
        </div>

        <div class="tarot-card-details__grid">
          <div class="tarot-card-details__block">
            <div class="text-mist-200" style="font-size: 12px; letter-spacing: 0.2em;">
              {{ t('tarot.reading.love') }}
            </div>
            <p class="tarot-lead">{{ t(loveKey) }}</p>
          </div>
          <div class="tarot-card-details__block">
            <div class="text-neon-crimson-500" style="font-size: 12px; letter-spacing: 0.2em;">
              {{ t('tarot.reading.money') }}
            </div>
            <p class="tarot-lead">{{ t(moneyKey) }}</p>
          </div>
          <div class="tarot-card-details__block">
            <div class="text-mist-200" style="font-size: 12px; letter-spacing: 0.2em;">
              {{ t('tarot.reading.rule') }}
            </div>
            <p class="tarot-lead">{{ t(ruleKey) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import TarotCard from '@/components/ui/TarotCard.vue'
import { useTarotData } from '@/composables/useTarotData'
import type { ReadingCard } from '@/composables/useTarotAppState'

const props = defineProps<{ card: ReadingCard | null; deckId: string }>()
const emit = defineEmits<{ (e: 'back'): void; (e: 'save'): void; (e: 'share'): void }>()

const { t, getCardKey } = useTarotData()

const section = computed(() => {
  if (!props.card) return 'majorArcana'
  return props.card.suit === 'major' ? 'majorArcana' : `suits.${props.card.suit}`
})

const nameKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.pullCard'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'name')
})

const memeKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.pullCard'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'meme_quote')
})

const meaningKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'meaning_upright')
})

const shadowKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'shadow')
})

const loveKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'love')
})

const moneyKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'money')
})

const ruleKey = computed(() => {
  if (!props.card) return 'tarot.microcopy.packKnows'
  return getCardKey(props.deckId, section.value, props.card.cardId, 'pack_rule')
})
</script>

<style scoped>
.tarot-card-details {
  display: grid;
  gap: 20px;
}

.tarot-card-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.tarot-card-details__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tarot-card-details__body {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  align-items: start;
}

.tarot-card-details__preview {
  display: grid;
  place-items: center;
}

.tarot-card-details__content {
  display: grid;
  gap: 16px;
}

.tarot-card-details__block {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--border-glass);
  background: rgba(5, 7, 10, 0.4);
  display: grid;
  gap: 8px;
}

.tarot-card-details__grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
</style>
