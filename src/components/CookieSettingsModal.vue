<template>
  <div class="cookie-settings" role="dialog" aria-modal="true" aria-label="Настройки cookies">
    <div class="cookie-settings__title">Настройки cookies</div>
    <div class="cookie-settings__row">
      <div>
        <div class="cookie-settings__label">Обязательные</div>
        <div class="cookie-settings__hint">Нужны для стабильной работы сайта</div>
      </div>
      <span class="cookie-settings__status">Всегда включены</span>
    </div>
    <div class="cookie-settings__row">
      <div>
        <div class="cookie-settings__label">Аналитика</div>
        <div class="cookie-settings__hint">Помогает понять, что действительно полезно</div>
      </div>
      <label class="toggle">
        <input v-model="localAnalytics" type="checkbox" />
        <span class="toggle__track"></span>
      </label>
    </div>
    <div class="cookie-settings__actions">
      <button class="cookie-btn ghost" type="button" @click="$emit('close')">Отмена</button>
      <button class="cookie-btn primary" type="button" @click="apply">Сохранить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  analytics: boolean
}>()

const emit = defineEmits<{
  (event: 'save', value: boolean): void
  (event: 'close'): void
}>()

const localAnalytics = ref(props.analytics)

watch(
  () => props.analytics,
  (value) => {
    localAnalytics.value = value
  }
)

const apply = () => {
  emit('save', localAnalytics.value)
}
</script>

<style scoped>
.cookie-settings {
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  width: min(360px, calc(100vw - 32px));
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(11, 16, 33, 0.95);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  z-index: 60;
  backdrop-filter: blur(10px);
}

.cookie-settings__title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 12px;
}

.cookie-settings__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--border);
}

.cookie-settings__row:first-of-type {
  border-top: none;
}

.cookie-settings__label {
  font-weight: 600;
  font-size: 14px;
}

.cookie-settings__hint {
  font-size: 12px;
  color: var(--muted);
}

.cookie-settings__status {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle__track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border);
  transition: 0.2s ease;
}

.toggle__track::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #9fb2d8;
  transition: 0.2s ease;
}

.toggle input:checked + .toggle__track {
  background: rgba(106, 215, 255, 0.2);
  border-color: rgba(106, 215, 255, 0.5);
}

.toggle input:checked + .toggle__track::after {
  transform: translateX(18px);
  background: #6ad7ff;
}

.cookie-settings__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.cookie-btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
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

.cookie-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .cookie-settings {
    right: 50%;
    transform: translateX(50%);
  }
}
</style>
