<template>
  <div class="layout-shell">
    <GlobalSnow />
    <MainHeader />

    <main class="container main-content">
      <slot />
      <YandexRtbBlock v-if="showAds" />
      <YandexRtbFloorAd v-if="showAds" />
    </main>

    <MainFooter />
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MainHeader from '@/components/navigation/MainHeader.vue'
import MainFooter from '@/components/navigation/MainFooter.vue'
import YandexRtbBlock from '@/components/ads/YandexRtbBlock.vue'
import YandexRtbFloorAd from '@/components/ads/YandexRtbFloorAd.vue'
import GlobalSnow from '@/components/ui/GlobalSnow.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import faviconUrl from '~/assets/images/wolf-favicon.png'

const route = useRoute()
const showAds = computed(() => !['/witch', '/witch-hut'].includes(route.path))

useHead(() => ({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: faviconUrl
    }
  ],
  script: showAds.value
    ? [
        {
          hid: 'adsense',
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1011761534614555',
          async: true,
          crossorigin: 'anonymous'
        },
        {
          hid: 'yandex-rtb-init',
          innerHTML: 'window.yaContextCb=window.yaContextCb||[]'
        },
        {
          hid: 'yandex-rtb',
          src: 'https://yandex.ru/ads/system/context.js',
          async: true
        }
      ]
    : []
}))
</script>

<style scoped>
.layout-shell {
  overflow-x: hidden;
}

.main-content {
  overflow-x: hidden;
}

</style>
