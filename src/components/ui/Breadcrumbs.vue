<template>
  <nav class="breadcrumbs" aria-label="breadcrumbs">
    <ol ref="listRef" class="breadcrumbs-list" @mouseleave="clearHover">
      <span ref="highlightRef" class="breadcrumbs-highlight" aria-hidden="true"></span>
      <li
        v-for="(item, index) in displayItems"
        :key="`${item.label}-${index}`"
        class="breadcrumbs-item"
        @mouseenter="setHover(index)"
      >
        <NuxtLink v-if="item.to" class="breadcrumb-link" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else class="breadcrumb-current" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface BreadcrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const isCompact = ref(false)

function updateCompact() {
  if (!process.client) return
  isCompact.value = window.innerWidth <= 430
}

const displayItems = computed(() => {
  if (!isCompact.value) return props.items
  return props.items.slice(-3)
})

const listRef = ref<HTMLOListElement | null>(null)
const highlightRef = ref<HTMLSpanElement | null>(null)
const hoveredIndex = ref<number | null>(null)
let resizeObserver: ResizeObserver | null = null

const activeIndex = computed(() => Math.max(displayItems.value.length - 1, 0))

function updateHighlight(index?: number) {
  if (!process.client) return
  const list = listRef.value
  const highlight = highlightRef.value
  if (!list || !highlight) return

  const items = list.querySelectorAll<HTMLElement>('.breadcrumbs-item')
  const fallbackIndex = activeIndex.value
  const targetIndex = typeof index === 'number' ? index : fallbackIndex
  const targetItem = items[targetIndex]
  if (!targetItem) {
    highlight.style.opacity = '0'
    return
  }

  const target = targetItem.querySelector<HTMLElement>('.breadcrumb-link, .breadcrumb-current') ?? targetItem
  const listRect = list.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const x = targetRect.left - listRect.left
  const y = targetRect.top - listRect.top

  highlight.style.opacity = '1'
  highlight.style.transform = `translate3d(${x}px, ${y}px, 0)`
  highlight.style.width = `${targetRect.width}px`
  highlight.style.height = `${targetRect.height}px`
}

function scheduleHighlight() {
  nextTick(() => updateHighlight(hoveredIndex.value ?? undefined))
}

function setHover(index: number) {
  hoveredIndex.value = index
  updateHighlight(index)
}

function clearHover() {
  hoveredIndex.value = null
  scheduleHighlight()
}

onMounted(() => {
  updateCompact()
  window.addEventListener('resize', updateCompact)
  scheduleHighlight()

  if (process.client && listRef.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => scheduleHighlight())
    resizeObserver.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCompact)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

watch(displayItems, () => {
  hoveredIndex.value = null
  scheduleHighlight()
})
</script>

<style scoped>
.breadcrumbs {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.02em;
  margin: 0 auto 12px;
  width: max-content;
  max-width: 100%;
  overflow: hidden;
  align-self: center;
  justify-self: center;
}

.breadcrumbs.center {
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  justify-self: center;
}

.breadcrumbs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 6px;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  padding: 2px 0;
}

.breadcrumbs-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  position: relative;
  z-index: 1;
}

.breadcrumbs-item + .breadcrumbs-item::before {
  content: '/';
  color: var(--muted);
  opacity: 0.6;
  z-index: 1;
}

.breadcrumb-link {
  color: inherit;
  text-decoration: none;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.breadcrumb-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}

.breadcrumb-current {
  color: var(--text);
  font-weight: 700;
  padding: 2px 6px;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.breadcrumbs-highlight {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(106, 215, 255, 0.25), rgba(255, 185, 106, 0.22));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.35);
  transition: transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1), width 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
    height 240ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 180ms ease;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

@media (max-width: 430px) {
  .breadcrumbs {
    padding: 6px 8px;
    font-size: 11px;
  }

  .breadcrumbs-list {
    gap: 6px;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 2px 4px;
  }

  .breadcrumbs-item {
    flex: 0 1 auto;
    min-width: 0;
  }
}
</style>
