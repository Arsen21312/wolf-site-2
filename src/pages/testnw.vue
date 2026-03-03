<template>
  <main class="redirect-page">
    <p>Открываем тест...</p>
  </main>
</template>

<script setup lang="ts">
import { navigateTo } from '#imports'

await navigateTo('/testnw/index.html', { external: true, replace: true })
</script>

<style scoped>
.redirect-page {
  min-height: 40vh;
  display: grid;
  place-items: center;
  color: var(--muted);
}
</style>
