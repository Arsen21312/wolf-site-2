<template>
  <main class="redirect-wrap">
    <p>Открываем тест...</p>
  </main>
</template>

<script setup lang="ts">
import { navigateTo, useHead, useRequestURL } from '#imports'

const url = useRequestURL()

useHead({
  meta: [{ name: 'robots', content: 'noindex,follow' }],
  link: [{ rel: 'canonical', href: `${url.origin}/testnw` }]
})

await navigateTo('/testnw', { redirectCode: 301 })
</script>

<style scoped>
.redirect-wrap {
  min-height: 40vh;
  display: grid;
  place-items: center;
  color: var(--muted);
}
</style>
