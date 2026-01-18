<template>
  <section class="tarot-section">
    <div class="tarot-section__head">
      <h2 class="tarot-title lg text-mist-50">{{ t('tarot.howItWorks.title') }}</h2>
    </div>
    <div class="tarot-grid three">
      <GlassCard v-for="step in steps" :key="step.step" class="tarot-how-card">
        <div class="tarot-how-card__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <path :d="step.icon" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="text-neon-emerald-400" style="font-size: 12px; letter-spacing: 0.2em;">
          {{ step.step }}
        </div>
        <div class="tarot-title md text-mist-50">{{ t(step.labelKey) }}</div>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import { useTarotData } from '@/composables/useTarotData'

const { t } = useTarotData()

const steps = [
  {
    step: '01',
    labelKey: 'tarot.howItWorks.step1',
    icon: 'M12 2l2.6 5.2 5.7.8-4.1 4 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.1-4 5.7-.8L12 2z'
  },
  {
    step: '02',
    labelKey: 'tarot.howItWorks.step2',
    icon: 'M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z'
  },
  {
    step: '03',
    labelKey: 'tarot.howItWorks.step3',
    icon: 'M5 12h14m-4-4 4 4-4 4'
  }
]
</script>

<style scoped>
.tarot-section__head {
  text-align: center;
  display: grid;
  gap: 10px;
}

.tarot-how-card {
  display: grid;
  gap: 12px;
  text-align: center;
}

.tarot-how-card__icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  border: 1px solid var(--border-glass-strong);
  background: rgba(16, 185, 129, 0.15);
  display: grid;
  place-items: center;
  color: var(--neon-emerald-400);
  margin: 0 auto;
}

.tarot-how-card__icon svg {
  width: 24px;
  height: 24px;
}
</style>
