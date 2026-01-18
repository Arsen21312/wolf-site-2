<template>
  <nav class="tarot-nav">
    <div class=" tarot-nav__inner">
      <div class="tarot-nav__brand">
        <div class="tarot-nav__glyph">*</div>
        <div>
          <div class="text-mist-50 tarot-title">{{ t('tarot.brand') }}</div>
          <div class="text-mist-400" style="font-size: 12px;">
            {{ t('tarot.appSubtitle') }}
          </div>
        </div>
      </div>
      <div class="tarot-nav__links">
        <button
          v-for="item in navItems"
          :key="item.view"
          type="button"
          class="tarot-nav__link"
          :class="{ active: activeView === item.view }"
          @click="emit('navigate', item.view)"
        >
          {{ t(item.labelKey) }}
        </button>
        <NeonPrimaryButton type="button" @click="emit('navigate', 'spread')">
          {{ t('tarot.nav.start') }}
        </NeonPrimaryButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import NeonPrimaryButton from '@/components/ui/NeonPrimaryButton.vue'
import { useTarotData } from '@/composables/useTarotData'
import type { TarotView } from '@/composables/useTarotAppState'

defineProps<{ activeView: TarotView }>()
const emit = defineEmits<{ (e: 'navigate', view: TarotView): void }>()
const { t } = useTarotData()

const navItems: { view: TarotView; labelKey: string }[] = [
  { view: 'home', labelKey: 'tarot.nav.home' },
  { view: 'decks', labelKey: 'tarot.nav.decks' },
  { view: 'history', labelKey: 'tarot.nav.history' },
  { view: 'settings', labelKey: 'tarot.nav.settings' }
]
</script>
