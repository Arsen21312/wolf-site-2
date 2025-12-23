<template>
  <nav class="breadcrumbs" aria-label="breadcrumbs">
    <ol class="breadcrumbs-list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="breadcrumbs-item">
        <NuxtLink v-if="item.to" class="breadcrumb-link" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else class="breadcrumb-current" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
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
  flex-wrap: wrap;
  gap: 6px;
}

.breadcrumbs-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
}
</style>
