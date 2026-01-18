<template>
  <section class="tarot-hero">
    <div class="tarot-hero__badge">{{ t('tarot.brand') }}</div>
    <h1 class="tarot-title xl text-mist-50">{{ t('tarot.appTitle') }}</h1>
    <p class="tarot-lead">{{ t('tarot.appSubtitle') }}</p>
    <div class="tarot-hero__cta">
      <NeonPrimaryButton type="button" @click="emit('primary')">
        {{ t('tarot.cta.makeReading') }}
      </NeonPrimaryButton>
      <GlassSecondaryButton type="button" @click="emit('secondary')">
        {{ t('tarot.cta.chooseDeck') }}
      </GlassSecondaryButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import GlassSecondaryButton from '@/components/ui/GlassSecondaryButton.vue'
import { useTarotData } from '@/composables/useTarotData'

const emit = defineEmits<{ (e: 'primary'): void; (e: 'secondary'): void }>()
const { t } = useTarotData()
</script>
