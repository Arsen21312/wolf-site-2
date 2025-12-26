<template>
  <div class="wc-control">
    <div class="wc-control-row">
      <input
        ref="inputRef"
        :value="modelValue"
        class="wc-control-input"
        type="text"
        :placeholder="placeholder"
        :disabled="disabledInput"
        @input="onInput"
        @keyup.enter="emit('submit')"
      />
      <button
        class="wc-control-btn"
        type="button"
        :disabled="disabledSubmit"
        :aria-label="submitAriaLabel"
        @click="emit('submit')"
      >
        <span v-if="isSending" class="wc-control-spinner"></span>
        <span v-else class="wc-control-icon">&gt;</span>
      </button>
      <button
        class="wc-control-btn ghost"
        type="button"
        :disabled="disabledHint"
        :aria-label="hintAriaLabel"
        @click="emit('hint')"
      >
        ?
      </button>
    </div>
    <button
      v-if="showNewGame"
      class="wc-control-new"
      type="button"
      :disabled="newGameDisabled"
      @click="emit('new-game')"
    >
      Новая игра
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'

type Props = {
  modelValue: string
  placeholder?: string
  disabledInput?: boolean
  disabledSubmit?: boolean
  disabledHint?: boolean
  isSending?: boolean
  showNewGame?: boolean
  newGameDisabled?: boolean
  submitAriaLabel?: string
  hintAriaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Пиши ассоциацию',
  disabledInput: false,
  disabledSubmit: false,
  disabledHint: false,
  isSending: false,
  showNewGame: false,
  newGameDisabled: false,
  submitAriaLabel: 'Проверить',
  hintAriaLabel: 'Подсказка'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
  (e: 'hint'): void
  (e: 'new-game'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function focusInput() {
  inputRef.value?.focus()
}

defineExpose({ focusInput })

const {
  modelValue,
  placeholder,
  disabledInput,
  disabledSubmit,
  disabledHint,
  isSending,
  showNewGame,
  newGameDisabled,
  submitAriaLabel,
  hintAriaLabel
} = toRefs(props)
</script>

<style scoped>
.wc-control {
  display: grid;
  gap: 8px;
}

.wc-control-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 6px;
  align-items: center;
}

.wc-control-input {
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 14px;
}

.wc-control-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  font-weight: 900;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.wc-control-btn.ghost {
  background: rgba(255, 255, 255, 0.04);
}

.wc-control-icon {
  font-size: 16px;
  line-height: 1;
}

.wc-control-spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(226, 232, 240, 0.25);
  border-top-color: #e2e8f0;
  animation: wc-control-spin 0.9s linear infinite;
}

.wc-control-new {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 9px 12px;
  font-weight: 800;
  cursor: pointer;
  font-size: 13px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0b1220;
  box-shadow: 0 8px 22px rgba(99, 102, 241, 0.35);
}

.wc-control-btn:disabled,
.wc-control-new:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

@keyframes wc-control-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
