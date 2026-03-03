<template>
  <div class="layout-shell">
    <GlobalSnow />
    <MainHeader />

    <main class="container main-content">
      <slot />
    </main>

    <MainFooter />
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MainHeader from '@/components/navigation/MainHeader.vue'
import MainFooter from '@/components/navigation/MainFooter.vue'
import GlobalSnow from '@/components/ui/GlobalSnow.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import faviconUrl from '~/assets/images/wolf-favicon.png'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const adsEnabled = computed(() => runtimeConfig.public.adsEnabled === 'true')
const isDesktopClient = ref(false)
const adsSessionAllowed = ref(false)

onMounted(() => {
  if (!process.client) return

  isDesktopClient.value = window.matchMedia('(min-width: 1024px)').matches

  const sessionKey = 'ads_session_allowed'
  const existing = sessionStorage.getItem(sessionKey)
  if (existing === null) {
    const allowThisSession = Math.random() < 0.35
    sessionStorage.setItem(sessionKey, allowThisSession ? '1' : '0')
    adsSessionAllowed.value = allowThisSession
    return
  }

  adsSessionAllowed.value = existing === '1'
})

const shouldLoadAds = computed(
  () =>
    adsEnabled.value &&
    !['/witch', '/witch-hut'].includes(route.path) &&
    isDesktopClient.value &&
    adsSessionAllowed.value
)

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
  script: shouldLoadAds.value
    ? [
        {
          hid: 'adsense',
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${runtimeConfig.public.googleAdsClient}`,
          async: true,
          crossorigin: 'anonymous'
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
