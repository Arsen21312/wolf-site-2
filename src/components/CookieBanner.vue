<template>
  <div v-if="shouldShowBanner" class="cookie-banner">
    <div class="cookie-banner__body">
      <p class="cookie-banner__text">
        Мы используем cookies, чтобы сайт работал быстрее и мы понимали, что заходит, а что нет. Никакого спама и слежки
        за личной жизнью
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-btn primary" type="button" @click="acceptAll">Принять</button>
        <button class="cookie-btn ghost" type="button" @click="openSettings">Настроить</button>
        <button class="cookie-btn subtle" type="button" @click="rejectAll">Отказаться</button>
      </div>
    </div>
    <CookieSettingsModal
      v-if="showSettings"
      :analytics="analyticsDraft"
      @close="showSettings = false"
      @save="applySettings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCookieConsent } from '@/composables/useCookieConsent'
import CookieSettingsModal from '@/components/CookieSettingsModal.vue'

const { shouldShowBanner, acceptAll, rejectAll, saveSettings } = useCookieConsent()

const showSettings = ref(false)
const analyticsDraft = ref(false)

const openSettings = () => {
  analyticsDraft.value = false
  showSettings.value = true
}

const applySettings = (value: boolean) => {
  saveSettings(value)
  showSettings.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(1120px, calc(100% - 32px));
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(9, 13, 26, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  z-index: 50;
}

.cookie-banner__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cookie-banner__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--muted);
  max-width: 640px;
  flex: 1 1 auto;
}

.cookie-banner__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  flex: 0 0 auto;
}

.cookie-btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  line-height: 1;
  min-height: 34px;
}

.cookie-btn.primary {
  background: linear-gradient(120deg, #fca63d, #f76c1b);
  color: #0b0d14;
}

.cookie-btn.ghost {
  background: transparent;
  border-color: var(--border);
  color: var(--text);
}

.cookie-btn.subtle {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
  color: var(--muted);
}

.cookie-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .cookie-banner__body {
    flex-direction: column;
    align-items: center;
  }

  .cookie-banner__actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 520px) {
  .cookie-banner {
    padding: 12px 14px;
  }

  .cookie-banner__text {
    font-size: 13px;
  }
}
</style>
