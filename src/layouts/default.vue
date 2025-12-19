<template>
  <div class="layout-shell">
    <GlobalSnow />
    <MainHeader />

    <main class="container main-content">
      <slot />
    </main>

    <MainFooter />
  </div>
</template>

<script setup lang="ts">
import MainHeader from '@/components/navigation/MainHeader.vue'
import MainFooter from '@/components/navigation/MainFooter.vue'
import GlobalSnow from '@/components/ui/GlobalSnow.vue'
import faviconUrl from '~/assets/images/wolf-favicon.png'

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: faviconUrl
    }
  ]
})
</script>
