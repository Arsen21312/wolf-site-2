<template>
  <section class="context-page">
    <div class="context-container">
      <div class="context-header">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <div class="context-topbar">
          <div class="context-chips">
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'random' }"
              @click="setMode('random')"
            >
              Случайная
            </button>
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'tasks' }"
              @click="setMode('tasks')"
            >
              Задания
            </button>
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'create' }"
              @click="setMode('create')"
            >
              Загадай слово
            </button>
            <button
              type="button"
              class="context-chip"
              :class="{ active: activeMode === 'party' }"
              @click="setMode('party')"
            >
              Вечеринка
            </button>
          </div>
        </div>
        <h1 class="context-title">Вечеринка</h1>
        <p class="context-subtitle">Играй вместе с друзьями — создавай комнату или присоединяйся к чужой.</p>
      </div>

      <div class="context-card context-info">
        <h2>Вечеринка!</h2>
        <p>
          В режиме вечеринки вы можете угадывать слова одновременно с другими игроками. Так играть веселее! Чтобы начать
          игру, создайте комнату.
        </p>
        <p>
          Также вы можете присоединиться к открытым комнатам других игроков. Для этого перейдите в Задания —&gt; Комнаты.
        </p>
      </div>

      <div class="context-card">
        <div class="context-switches">
          <label class="context-switch">
            <input v-model="isOpenRoom" type="checkbox" />
            <span class="context-switch-track"></span>
            <span class="context-switch-label">Открытая комната</span>
          </label>
          <label class="context-switch">
            <input v-model="isRandomWord" type="checkbox" />
            <span class="context-switch-track"></span>
            <span class="context-switch-label">Случайное слово</span>
          </label>
        </div>

        <div v-if="!isRandomWord" class="context-input-row">
          <input v-model="customWord" class="context-input" type="text" placeholder="Введите слово" />
          <button class="context-btn ghost" type="button" @click="confirmWord">&gt;</button>
        </div>

        <button class="context-btn" type="button" :disabled="!canCreate" @click="createRoom">
          Создать комнату
        </button>
      </div>

      <div class="context-card">
        <div class="context-card-header">
          <h2>Присоединиться</h2>
        </div>
        <div class="context-input-row">
          <input v-model="playerName" class="context-input" type="text" placeholder="Введите имя" />
          <button class="context-btn" type="button" :disabled="!playerName.trim()" @click="joinRoom">
            Присоединиться
          </button>
        </div>
        <button class="context-btn share" type="button" @click="shareInvite">Поделиться</button>
      </div>
    </div>
    <ContextTasksModal v-model="isTasksOpen" />
  </section>
</template>

<script setup lang="ts">
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { ref, computed } from 'vue'
import ContextTasksModal from '~/components/context/ContextTasksModal.vue'

const activeMode = ref<'random' | 'create' | 'party' | 'tasks'>('party')
const isTasksOpen = ref(false)

const isOpenRoom = ref(true)
const isRandomWord = ref(true)
const customWord = ref('')
const playerName = ref('')

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий Контекст' }
]

const canCreate = computed(() => {
  if (!isRandomWord.value && !customWord.value.trim()) return false
  return true
})

function setMode(nextMode: 'random' | 'create' | 'party' | 'tasks') {
  activeMode.value = nextMode
  if (nextMode === 'random') {
    navigateTo('/games/wolf-context/random')
    return
  }
  if (nextMode === 'create') {
    navigateTo('/context/create')
    return
  }
  if (nextMode === 'tasks') {
    isTasksOpen.value = true
  }
}

function confirmWord() {
  customWord.value = customWord.value.trim()
}

function createRoom() {
  console.log('create room', { open: isOpenRoom.value, random: isRandomWord.value, word: customWord.value })
}

function joinRoom() {
  console.log('join room as', playerName.value)
}

function shareInvite() {
  console.log('share invite')
}
</script>

<style scoped>
.context-page {
  padding: 32px 18px 64px;
  color: #e5e7eb;
}

.context-container {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.context-header {
  display: grid;
  gap: 6px;
  text-align: center;
}

.context-topbar {
  display: flex;
  justify-content: center;
}

.context-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.context-chip {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.context-chip.active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.8);
  color: #f8fafc;
}

.context-chip:hover {
  transform: translateY(-1px);
}

.context-title {
  font-size: clamp(44px, 8vw, 64px);
  font-weight: 900;
  letter-spacing: -0.02em;
}

.context-subtitle {
  margin: 0;
  color: #cbd5e1;
}

.context-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}

.context-info h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.context-info p {
  margin: 0;
  line-height: 1.6;
  color: #e2e8f0;
}

.context-switches {
  display: grid;
  gap: 10px;
}

.context-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.context-switch input {
  display: none;
}

.context-switch-track {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  position: relative;
  transition: background 0.2s ease;
}

.context-switch-track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: transform 0.2s ease;
}

.context-switch input:checked + .context-switch-track {
  background: rgba(74, 222, 128, 0.6);
}

.context-switch input:checked + .context-switch-track::after {
  transform: translateX(20px);
}

.context-switch-label {
  font-weight: 700;
}

.context-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.context-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
}

.context-btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0b1220;
}

.context-btn.ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.context-btn.share {
  background: #f59e0b;
}

.context-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.context-card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

@media (max-width: 640px) {
  .context-input-row {
    grid-template-columns: 1fr;
  }
}
</style>
