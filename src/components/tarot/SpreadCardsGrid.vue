<template>
  <section class="tarot-section">
    <div v-if="titleKey" class="tarot-section__head">
      <h2 class="tarot-title lg text-mist-50">{{ t(titleKey) }}</h2>
      <p v-if="subtitleKey" class="tarot-lead">{{ t(subtitleKey) }}</p>
    </div>
    <div class="tarot-grid four">
      <GlassCard
        v-for="spread in spreads"
        :key="spread.id"
        class="tarot-spread-card"
        :class="{ active: spread.id === selectedId, clickable: interactive }"
        @click="handleSelect(spread.id)"
      >
        <div class="tarot-spread-card__top">
          <div class="tarot-spread-card__icon">*</div>
          <div class="text-neon-emerald-400" style="font-size: 12px; letter-spacing: 0.2em;">
            {{ spread.cardCount }}
          </div>
        </div>
        <div class="tarot-title md text-mist-50">{{ t(spread.titleKey) }}</div>
        <p v-if="showDescription" class="tarot-lead" style="font-size: 13px;">
          {{ t(spread.descriptionKey) }}
        </p>
        <div class="tarot-layout-preview">
          <span
            v-for="index in spread.cardCount"
            :key="`${spread.id}-${index}`"
            class="tarot-layout-preview__dot"
          ></span>
        </div>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import { useTarotData, type SpreadMeta } from '@/composables/useTarotData'

const props = withDefaults(
  defineProps<{
    spreads: SpreadMeta[]
    selectedId?: string
    interactive?: boolean
    titleKey?: string
    subtitleKey?: string
    showDescription?: boolean
  }>(),
  {
    selectedId: undefined,
    interactive: false,
    titleKey: undefined,
    subtitleKey: undefined,
    showDescription: true
  }
)

const emit = defineEmits<{ (e: 'select', spreadId: string): void }>()
const { t } = useTarotData()

const handleSelect = (spreadId: string) => {
  if (!props.interactive) return
  emit('select', spreadId)
}
</script>

<style scoped>
.tarot-section__head {
  text-align: center;
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.tarot-spread-card {
  display: grid;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.tarot-spread-card.clickable {
  cursor: pointer;
}

.tarot-spread-card.active {
  border-color: var(--border-neon-emerald);
  box-shadow: var(--tarot-shadow-glow);
}

.tarot-spread-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tarot-spread-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border-glass-strong);
  background: rgba(34, 211, 238, 0.1);
  display: grid;
  place-items: center;
  color: var(--neon-ice-400);
}

.tarot-layout-preview {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tarot-layout-preview__dot {
  width: 14px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid var(--border-glass);
  background: rgba(5, 7, 10, 0.6);
}
</style>
