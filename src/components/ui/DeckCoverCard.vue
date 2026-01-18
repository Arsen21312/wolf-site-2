<template>
  <GlassCard class="tarot-deck-card" :class="attrs.class">
    <div class="tarot-deck-card__cover">
      <div class="tarot-deck-card__glyph">*</div>
      <div class="tarot-deck-card__seal"></div>
    </div>
    <div class="tarot-deck-card__body">
      <h3 class="tarot-title md text-mist-50">{{ t(titleKey) }}</h3>
      <p class="text-mist-400 tarot-deck-card__count">
        {{ majorCount }} + {{ minorCount }}
      </p>
      <div v-if="tagsKey.length" class="tarot-chip-row">
        <span v-for="tag in tagsKey" :key="tag" class="tarot-chip">
          {{ t(tag) }}
        </span>
      </div>
      <div class="tarot-deck-card__actions">
        <GlassSecondaryButton type="button" @click="emit('open')">
          {{ t('tarot.cta.chooseDeck') }}
        </GlassSecondaryButton>
        <NeonPrimaryButton type="button" @click="emit('start')">
          {{ t('tarot.cta.makeReading') }}
        </NeonPrimaryButton>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import { useTarotData } from '@/composables/useTarotData'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    deckId: string
    titleKey: string
    majorCount?: number
    minorCount?: number
    tagsKey?: string[]
  }>(),
  {
    majorCount: 22,
    minorCount: 56,
    tagsKey: () => []
  }
)

const emit = defineEmits<{ (e: 'open'): void; (e: 'start'): void }>()
const attrs = useAttrs()
const { t } = useTarotData()
</script>

<style scoped>
.tarot-deck-card {
  display: grid;
  gap: 16px;
}

.tarot-deck-card__cover {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  border: 1px solid var(--border-glass-strong);
  background: linear-gradient(150deg, rgba(10, 17, 24, 0.9), rgba(5, 7, 10, 0.95));
  display: grid;
  place-items: center;
  overflow: hidden;
}

.tarot-deck-card__glyph {
  font-size: 42px;
  color: rgba(148, 163, 184, 0.2);
}

.tarot-deck-card__seal {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid rgba(214, 178, 94, 0.4);
}

.tarot-deck-card__body {
  display: grid;
  gap: 12px;
}

.tarot-deck-card__count {
  font-size: 13px;
}

.tarot-deck-card__actions {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
