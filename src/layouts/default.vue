<template>
  <div class="layout-shell">
    <ClientOnly>
      <RippleGrid
        class="ripple-grid-layer"
        :enable-rainbow="false"
        :ripple-intensity="0.01"
        :grid-size="20"
        :grid-thickness="20"
        :mouse-interaction="true"
        :mouse-interaction-radius="1.2"
        :opacity="0.85"
        grid-color="#d6e6ff"
      />
    </ClientOnly>
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
import RippleGrid from '@/components/ui/RippleGrid.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import faviconUrl from '~/assets/images/wolf-favicon.png'

const route = useRoute()
const showAds = computed(() => route.path !== '/witch')

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
  position: relative;
}

.main-content {
  overflow-x: hidden;
}

.layout-shell > :not(.ripple-grid-layer) {
  position: relative;
  z-index: 2;
}
</style>
