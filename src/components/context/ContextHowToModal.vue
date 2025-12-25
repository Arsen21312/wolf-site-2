<template>
  <Teleport to="body">
    <div v-if="modelValue" class="context-modal">
      <div class="context-modal-backdrop" @click="close"></div>
      <div class="context-modal-card" role="dialog" aria-modal="true">
        <div class="context-modal-header">
          <h2>Как играть в Волчий контекст</h2>
          <button class="context-modal-close" type="button" @click="close">×</button>
        </div>
        <div class="context-modal-body">
          <div class="context-modal-block">
            <h3>Цель</h3>
            <p>
              Есть секретное слово — оно номер 1 в списке. Твоя задача — добраться до него, угадывая ассоциации.
            </p>
          </div>
          <div class="context-modal-block">
            <h3>Правила</h3>
            <p>
              Пиши любые русские слова. Чем меньше номер, тем ближе слово к ответу. Попыток сколько угодно.
            </p>
          </div>
          <div class="context-modal-block">
            <h3>Горячо/холодно</h3>
            <p>
              Это игра «горячо/холодно» для слов: если ответ «кот», то «кошка» ближе, чем «собака».
            </p>
          </div>
          <div class="context-modal-block">
            <h3>Подсказки</h3>
            <p>
              Подсказка даёт слово, которое лучше твоего текущего результата. Пользуйся, если застрял.
            </p>
          </div>
        </div>
        <div class="context-modal-actions">
          <button class="context-modal-cta" type="button" @click="close">Понятно, играем</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.context-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.context-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
}

.context-modal-card {
  position: relative;
  z-index: 1;
  width: min(720px, 92vw);
  max-height: 80vh;
  overflow: auto;
  background: #0f172a;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
}

.context-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.context-modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.context-modal-close {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
}

.context-modal-body {
  display: grid;
  gap: 16px;
  padding: 18px 20px;
}

.context-modal-block h3 {
  margin: 0 0 6px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #93c5fd;
}

.context-modal-block p {
  margin: 0;
  line-height: 1.6;
  color: #e2e8f0;
}

.context-modal-actions {
  padding: 0 20px 18px;
}

.context-modal-cta {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 800;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0b1220;
  cursor: pointer;
}
</style>
