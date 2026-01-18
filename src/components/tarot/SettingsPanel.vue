<template>
  <section class="tarot-section">
    <div class="tarot-section__head">
      <h2 class="tarot-title lg text-mist-50">{{ t('tarot.settings.title') }}</h2>
      <p class="tarot-lead">{{ t('tarot.settings.subtitle') }}</p>
    </div>

    <div class="tarot-settings__grid">
      <GlassCard class="tarot-settings__card">
        <h3 class="tarot-title md text-mist-50">{{ t('tarot.settings.neon.title') }}</h3>
        <input
          class="tarot-range"
          type="range"
          min="0"
          max="100"
          step="1"
          v-model="neonIntensity"
        />
        <div class="text-mist-400" style="font-size: 12px; text-align: center;">
          {{ neonIntensity }}%
        </div>
      </GlassCard>

      <GlassCard class="tarot-settings__card">
        <h3 class="tarot-title md text-mist-50">{{ t('tarot.settings.defaults.title') }}</h3>
        <div class="tarot-settings__row">
          <div class="text-mist-200">{{ t('tarot.settings.defaults.meme') }}</div>
          <ToggleSwitch v-model="memeMode" />
        </div>
        <div class="tarot-settings__row">
          <div class="text-mist-200">{{ t('tarot.settings.defaults.shadow') }}</div>
          <ToggleSwitch v-model="showShadow" />
        </div>
      </GlassCard>

      <GlassCard class="tarot-settings__card">
        <h3 class="tarot-title md text-mist-50">{{ t('tarot.settings.language.title') }}</h3>
        <select class="tarot-select">
          <option value="ru">ru</option>
          <option value="en">en</option>
        </select>
      </GlassCard>

      <GlassCard class="tarot-settings__card tarot-settings__danger">
        <h3 class="tarot-title md text-neon-crimson-500">{{ t('tarot.settings.danger.title') }}</h3>
        <p class="tarot-lead" style="font-size: 13px;">
          {{ t('tarot.settings.danger.subtitle') }}
        </p>
        <GlassSecondaryButton type="button" @click="clearHistory">
          {{ t('tarot.settings.danger.clear') }}
        </GlassSecondaryButton>
      </GlassCard>

      <div class="tarot-settings__actions">
        <GlassSecondaryButton type="button">{{ t('tarot.settings.actions.cancel') }}</GlassSecondaryButton>
        <NeonPrimaryButton type="button">{{ t('tarot.settings.actions.save') }}</NeonPrimaryButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import { useTarotData } from '@/composables/useTarotData'
import { useTarotAppState } from '@/composables/useTarotAppState'
import { useReadingHistory } from '@/composables/useReadingHistory'

const { t } = useTarotData()
const { memeMode, showShadow } = useTarotAppState()
const { clearHistory } = useReadingHistory()

const neonIntensity = ref(70)
</script>

<style scoped>
.tarot-section__head {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.tarot-settings__grid {
  display: grid;
  gap: 16px;
}

.tarot-settings__card {
  display: grid;
  gap: 16px;
}

.tarot-settings__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tarot-settings__danger {
  border-color: rgba(239, 68, 68, 0.35);
}

.tarot-settings__actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.tarot-range {
  width: 100%;
  accent-color: var(--neon-emerald-400);
}

.tarot-select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-glass);
  background: rgba(5, 7, 10, 0.6);
  color: var(--mist-50);
}
</style>
