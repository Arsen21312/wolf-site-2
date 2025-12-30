<template>
  <div class="layout-shell">
    <GlobalSnow />
    <MainHeader />

    <main class="container main-content">
      <slot />
      <YandexRtbBlock />
      <YandexRtbFloorAd />
    </main>

    <MainFooter />
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import MainHeader from '@/components/navigation/MainHeader.vue'
import MainFooter from '@/components/navigation/MainFooter.vue'
import YandexRtbBlock from '@/components/ads/YandexRtbBlock.vue'
import YandexRtbFloorAd from '@/components/ads/YandexRtbFloorAd.vue'
import GlobalSnow from '@/components/ui/GlobalSnow.vue'
import CookieBanner from '@/components/CookieBanner.vue'
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

<style scoped>
.layout-shell {
  overflow-x: hidden;
}

.main-content {
  overflow-x: hidden;
}
</style>
