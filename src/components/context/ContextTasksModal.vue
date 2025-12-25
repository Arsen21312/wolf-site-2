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
            @click="setTab('official')"
          >
            Официальные
          </button>
          <button type="button" class="context-tab" :class="{ active: activeTab === 'rooms' }" @click="setTab('rooms')">
            Комнаты
          </button>
          <button type="button" class="context-tab" :class="{ active: activeTab === 'user' }" @click="setTab('user')">
            Пользовательские
          </button>
        </div>

        <div class="context-modal-body">
          <div v-if="activeTab === 'official'" class="context-list">
            <div v-if="officialLoading" class="context-list-empty">Загрузка...</div>
            <div v-else-if="officialError" class="context-list-empty">{{ officialError }}</div>
            <button
              v-else
              v-for="item in officialTasks"
              :key="item.id"
              :class="['context-list-item', selectedOfficialId === item.id ? 'context-list-item-active' : '']"
              type="button"
              @click="selectOfficial(item.id)"
            >
              <div class="context-list-title">{{ item.title }}</div>
              <div class="context-list-desc">{{ item.hint }}</div>
            </button>
          </div>

          <div v-else-if="activeTab === 'rooms'" class="context-list">
            <div v-if="roomsLoading" class="context-list-empty">Загрузка...</div>
            <div v-else-if="roomsError" class="context-list-empty">{{ roomsError }}</div>
            <button
              v-else
              v-for="room in rooms"
              :key="room.id"
              class="context-list-item"
              type="button"
              @click="selectRoom(room.id)"
            >
              <div class="context-list-title">Комната {{ room.host_name || 'без имени' }}</div>
              <div class="context-list-desc">Активна: {{ formatRoomTime(room.last_active_at) }}</div>
            </button>
          </div>

          <div v-else class="context-list">
            <div v-if="userLoading" class="context-list-empty">Загрузка...</div>
            <div v-else-if="gamesUser.length === 0" class="context-list-empty">
              Пользовательских игр пока нет.
            </div>
            <button
              v-else
              v-for="item in gamesUser"
              :key="item.id"
              class="context-list-item"
              type="button"
              @click="selectUser(item.id)"
            >
              <div class="context-list-title">{{ item.title }}</div>
              <div v-if="item.createdByName" class="context-list-desc">Автор: {{ item.createdByName }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { officialGames } from '~/data/wolf-context/officialGames'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
const route = useRoute()

const activeTab = ref<'official' | 'rooms' | 'user'>('official')
const officialTasks = ref(officialGames)
const officialLoading = ref(false)
const officialError = ref('')
const roomsLoading = ref(false)
const roomsError = ref('')
const rooms = ref<Array<{ id: string; host_name: string | null; last_active_at: string | null }>>([])
const userLoading = ref(false)

const gamesUser = ref<Array<{ id: number; title: string; createdByName?: string | null }>>([])

const selectedOfficialId = computed(() => {
  const mode = typeof route.query.mode === 'string' ? route.query.mode : ''
  const rawId = typeof route.query.id === 'string' ? Number(route.query.id) : NaN
  if (mode !== 'official') return null
  return Number.isFinite(rawId) ? rawId : null
})

function close() {
  emit('update:modelValue', false)
}

function setTab(tab: 'official' | 'rooms' | 'user') {
  activeTab.value = tab
  if (tab === 'official') {
    loadOfficialTasks()
  }
  if (tab === 'user') {
    loadUserGames()
  }
  if (tab === 'rooms') {
    loadRooms()
  }
}

async function loadOfficialTasks() {
  if (officialLoading.value || officialTasks.value.length) return
  officialLoading.value = true
  officialError.value = ''
  try {
    officialTasks.value = officialGames
    if (!officialTasks.value.length) {
      officialError.value = 'Список пока пуст'
    }
  } catch (error) {
    console.error(error)
    officialError.value = 'Не удалось загрузить список'
  } finally {
    officialLoading.value = false
  }
}

async function loadUserGames() {
  if (userLoading.value) return
  userLoading.value = true
  try {
    const response = await $fetch<{ ok: boolean; games?: Array<{ id: number; title: string; createdByName?: string | null }> }>(
      '/api/context/user-games'
    )
    if (response?.ok && response.games) {
      gamesUser.value = response.games
    } else {
      gamesUser.value = []
    }
  } catch (error) {
    console.error(error)
  } finally {
    userLoading.value = false
  }
}

async function loadRooms() {
  if (roomsLoading.value) return
  roomsLoading.value = true
  roomsError.value = ''
  try {
    const response = await $fetch<{ ok: boolean; rooms?: Array<{ id: string; host_name: string | null; last_active_at: string | null }> }>(
      '/api/party/public-rooms'
    )
    if (response?.ok && response.rooms) {
      rooms.value = response.rooms
    } else {
      rooms.value = []
      roomsError.value = 'Комнаты не найдены'
    }
  } catch (error) {
    console.error(error)
    roomsError.value = 'Комнаты не найдены'
  } finally {
    roomsLoading.value = false
  }
}

function selectOfficial(code: number) {
  close()
  navigateTo(`/games/wolf-context/random?mode=official&id=${code}`)
}

function selectUser(id: number) {
  close()
  navigateTo(`/games/wolf-context/random?mode=user&id=${id}`)
}

function selectRoom(id: string) {
  close()
  navigateTo(`/games/wolf-context/room/${id}`)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open && activeTab.value === 'official') {
      loadOfficialTasks()
    }
    if (open && activeTab.value === 'rooms') {
      loadRooms()
    }
    if (open && activeTab.value === 'user') {
      loadUserGames()
    }
  }
)

function formatRoomTime(value: string | null) {
  if (!value) return 'Нет данных'
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return 'Нет данных'
  return date.toLocaleString()
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
  justify-content: center;
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
  display: grid;
  gap: 6px;
}

.context-list-item-active {
  border-color: rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.1);
}

.context-list-title {
  font-weight: 800;
}

.context-list-desc {
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 600;
}

.context-list-empty {
  color: #94a3b8;
  text-align: center;
  padding: 18px 12px;
}
</style>
