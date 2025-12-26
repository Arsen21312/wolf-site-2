<template>
  <nav class="breadcrumbs" aria-label="breadcrumbs">
    <ol class="breadcrumbs-list">
      <li v-for="(item, index) in displayItems" :key="`${item.label}-${index}`" class="breadcrumbs-item">
        <NuxtLink v-if="item.to" class="breadcrumb-link" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else class="breadcrumb-current" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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

onMounted(() => {
  updateCompact()
  window.addEventListener('resize', updateCompact)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCompact)
})

const displayItems = computed(() => {
  if (!isCompact.value) return props.items
  return props.items.slice(-3)
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
  margin-bottom: 12px;
  width: max-content;
  max-width: 100%;
  overflow: hidden;
  align-self: start;
  justify-self: start;
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
}

.breadcrumbs-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
}

.breadcrumbs-item + .breadcrumbs-item::before {
  content: '/';
  color: var(--muted);
  opacity: 0.6;
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
