<template>
  <Teleport to="body">
    <div v-if="modelValue" class="context-modal">
      <div class="context-modal-backdrop" @click="close"></div>
      <div class="context-modal-card" role="dialog" aria-modal="true">
        <div class="context-modal-header">
          <h2>Задания</h2>
          <button class="context-modal-close" type="button" @click="close">×</button>
        </div>

        <div class="context-modal-tabs">
          <button
            type="button"
            class="context-tab"
            :class="{ active: activeTab === 'official' }"
            @click="activeTab = 'official'"
          >
            Официальные
          </button>
          <button
            type="button"
            class="context-tab"
            :class="{ active: activeTab === 'rooms' }"
            @click="activeTab = 'rooms'"
          >
            Комнаты
          </button>
          <button
            type="button"
            class="context-tab"
            :class="{ active: activeTab === 'user' }"
            @click="activeTab = 'user'"
          >
            Пользовательские
          </button>
        </div>

        <div class="context-modal-body">
          <div v-if="activeTab === 'official'" class="context-list">
            <button
              v-for="item in gamesOfficial"
              :key="item.id"
              class="context-list-item"
              type="button"
              @click="selectOfficial(item.id)"
            >
              {{ item.title }}
            </button>
          </div>

          <div v-else-if="activeTab === 'rooms'" class="context-list">
            <div v-for="room in gamesRooms" :key="room.id" class="context-list-card">
              <div class="context-list-title">{{ room.name }}</div>
              <div class="context-list-meta">{{ room.players }} игроков</div>
            </div>
          </div>

          <div v-else class="context-list">
            <button
              v-for="item in gamesUser"
              :key="item.id"
              class="context-list-item"
              type="button"
              @click="selectUser(item.id)"
            >
              {{ item.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const activeTab = ref<'official' | 'rooms' | 'user'>('official')

const gamesOfficial = [
  { id: 30, title: 'Игра #30' },
  { id: 29, title: 'Игра #29' },
  { id: 28, title: 'Игра #28' }
]

const gamesRooms = [
  { id: '0d25cd3f', name: 'Комната 0d25cd3f', players: 0 },
  { id: 'a23f9b1c', name: 'Комната a23f9b1c', players: 3 }
]

const gamesUser = ref<Array<{ id: number; title: string }>>([])

function close() {
  emit('update:modelValue', false)
}

async function loadUserGames() {
  try {
    const response = await $fetch<{ ok: boolean; games?: Array<{ id: number; title: string }> }>(
      '/api/context/user-games'
    )
    if (response?.ok && response.games) {
      gamesUser.value = response.games
    }
  } catch (error) {
    console.error(error)
  }
}

function selectOfficial(id: number) {
  console.log('select official game', id)
}

function selectUser(id: number) {
  navigateTo(`/context/play/${id}`)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      loadUserGames()
    }
  }
)
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
  width: min(760px, 92vw);
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

.context-modal-tabs {
  display: flex;
  gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  flex-wrap: wrap;
}

.context-tab {
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.context-tab.active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.8);
  color: #f8fafc;
}

.context-modal-body {
  padding: 18px 20px 24px;
}

.context-list {
  display: grid;
  gap: 12px;
}

.context-list-item {
  text-align: left;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.4);
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.context-list-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.4);
  padding: 12px 14px;
  border-radius: 12px;
}

.context-list-title {
  font-weight: 800;
}

.context-list-meta {
  color: #94a3b8;
  font-size: 13px;
  margin-top: 4px;
}
</style>
