<template>
  <div class="wc-head">
    <Breadcrumbs v-if="breadcrumbs?.length" class="center" :items="breadcrumbs" />
    <div class="wc-title-row">
      <span class="wc-title-spacer" aria-hidden="true"></span>
      <h1 class="section-title wc-title">{{ title }}</h1>
      <div v-if="showMenu" ref="menuRef" class="wc-menu" :class="{ 'wc-menu-open': isMenuOpen }">
        <button
          class="wc-menu-btn"
          type="button"
          :aria-label="labels.menuAria"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          @click="toggleMenu"
        >
          <span class="wc-hamburger" :class="{ 'is-open': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div v-show="isMenuOpen" class="wc-menu-dropdown" role="menu">
          <button
            v-if="showHowTo"
            class="wc-menu-item"
            type="button"
            role="menuitem"
            @click="emitAction('howTo')"
          >
            {{ labels.howTo }}
          </button>
          <button
            v-if="showTasks"
            class="wc-menu-item"
            type="button"
            role="menuitem"
            @click="emitAction('tasks')"
          >
            {{ labels.tasks }}
          </button>
          <button
            v-if="showRandom"
            class="wc-menu-item"
            type="button"
            role="menuitem"
            @click="emitAction('random')"
          >
            {{ labels.random }}
          </button>
          <div v-if="showParty || showCreate || showCopyLink" class="wc-menu-divider"></div>
          <button
            v-if="showParty"
            class="wc-menu-item"
            type="button"
            role="menuitem"
            @click="emitAction('party')"
          >
            {{ labels.party }}
          </button>
          <button
            v-if="showCreate"
            class="wc-menu-item"
            type="button"
            role="menuitem"
            @click="emitAction('create')"
          >
            {{ labels.create }}
          </button>
          <button
            v-if="showCopyLink"
            class="wc-menu-item"
            type="button"
            role="menuitem"
            @click="emitAction('copyLink')"
          >
            {{ labels.copy }}
          </button>
          <div v-if="showReset" class="wc-menu-divider"></div>
          <button
            v-if="showReset"
            class="wc-menu-item danger"
            type="button"
            role="menuitem"
            @click="emitAction('reset')"
          >
            {{ labels.reset }}
          </button>
        </div>
      </div>
    </div>
    <p v-if="showCounts" class="wc-status-line">{{ labels.attempts }}: {{ attempts }} | {{ labels.hints }}: {{ hints }}</p>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { onBeforeUnmount, onMounted, ref, toRefs } from 'vue'

type BreadcrumbItem = {
  label: string
  to?: string
}

const labels = {
  menuAria: 'Открыть меню',
  howTo: 'Как играть',
  tasks: 'Задания',
  random: 'Рандомная игра',
  party: 'Вечеринка',
  create: 'Загадать слово',
  copy: 'Скопировать ссылку',
  reset: 'Сбросить кеш',
  attempts: 'Попыток',
  hints: 'Подсказок'
}

const props = withDefaults(
  defineProps<{
    breadcrumbs?: BreadcrumbItem[]
    title?: string
    attempts?: number
    hints?: number
    showCounts?: boolean
    showMenu?: boolean
    showHowTo?: boolean
    showTasks?: boolean
    showRandom?: boolean
    showParty?: boolean
    showCreate?: boolean
    showCopyLink?: boolean
    showReset?: boolean
  }>(),
  {
    title: 'Волчий Контекст',
    attempts: 0,
    hints: 0,
    showCounts: true,
    showMenu: true,
    showHowTo: true,
    showTasks: true,
    showRandom: false,
    showParty: true,
    showCreate: true,
    showCopyLink: false,
    showReset: true
  }
)

const emit = defineEmits<{
  (e: 'howTo'): void
  (e: 'tasks'): void
  (e: 'random'): void
  (e: 'party'): void
  (e: 'create'): void
  (e: 'copyLink'): void
  (e: 'reset'): void
}>()

const isMenuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function emitAction(action: 'howTo' | 'tasks' | 'random' | 'party' | 'create' | 'copyLink' | 'reset') {
  closeMenu()
  emit(action)
}

function onOutsideClick(event: MouseEvent) {
  if (!isMenuOpen.value) return
  const target = event.target as Node | null
  if (menuRef.value && target && menuRef.value.contains(target)) return
  closeMenu()
}

function onMenuKeydown(event: KeyboardEvent) {
  if (!isMenuOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
  }
}

onMounted(() => {
  if (process.client) {
    document.addEventListener('click', onOutsideClick)
    document.addEventListener('keydown', onMenuKeydown)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    document.removeEventListener('click', onOutsideClick)
    document.removeEventListener('keydown', onMenuKeydown)
  }
})

const { breadcrumbs } = toRefs(props)
</script>

<style scoped>
.wc-head {
  display: grid;
  gap: 6px;
  text-align: center;
  width: 100%;
}

.wc-title-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.wc-title-spacer {
  width: 100%;
  height: 1px;
}

.wc-title {
  grid-column: 2;
  justify-self: center;
  font-size: clamp(52px, 10vw, 80px);
  font-weight: 900;
  letter-spacing: -0.02em;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  text-align: center;
}

.wc-status-line {
  margin: 0;
  color: #cbd5e1;
}

.wc-menu {
  grid-column: 3;
  position: relative;
  z-index: 2000;
}

.wc-menu-btn {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #0f172a;
  color: #e2e8f0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  margin-top: 6px;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.wc-menu-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(59, 130, 246, 0.8);
}

.wc-hamburger {
  position: relative;
  width: 18px;
  height: 12px;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
}

.wc-hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: currentColor;
  border-radius: 999px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.wc-hamburger.is-open span:nth-child(1) {
  transform: translateY(5px) rotate(45deg);
}

.wc-hamburger.is-open span:nth-child(2) {
  opacity: 0;
}

.wc-hamburger.is-open span:nth-child(3) {
  transform: translateY(-5px) rotate(-45deg);
}

.wc-menu-dropdown {
  position: absolute;
  top: 42px;
  right: 0;
  min-width: 220px;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.6);
  padding: 8px;
  display: grid;
  gap: 4px;
  z-index: 2001;
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top right;
}

.wc-menu-open .wc-menu-dropdown {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.wc-menu-item {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #e2e8f0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.wc-menu-item:hover {
  background: rgba(59, 130, 246, 0.18);
}

.wc-menu-item.danger:hover {
  background: rgba(248, 113, 113, 0.2);
  color: #fecaca;
}

.wc-menu-divider {
  height: 1px;
  background: rgba(148, 163, 184, 0.2);
  margin: 4px 2px;
}

@media (max-width: 480px) {
  .wc-title-row {
    width: 100%;
  }

  .wc-title {
    width: 100%;
    font-size: clamp(26px, 6.5vw, 38px);
    line-height: 1.1;
    white-space: nowrap;
  }

  .wc-menu {
    justify-self: end;
  }

  .wc-menu-dropdown {
    position: fixed;
    top: 64px;
    right: 16px;
  }

  .wc-menu-btn {
    margin-top: -6px;
  }
}
</style>
