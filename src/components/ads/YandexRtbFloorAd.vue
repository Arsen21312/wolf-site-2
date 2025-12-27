<template>
  <ClientOnly>
    <div class="yandex-rtb-floor"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

type YandexWindow = Window & {
  yaContextCb?: Array<() => void>
  Ya?: {
    Context?: {
      AdvManager?: {
        render?: (options: { blockId: string; type?: string; platform?: string }) => void
      }
    }
  }
}

const blockId = 'R-A-18145254-3'

onMounted(() => {
  if (!process.client) return
  const w = window as YandexWindow
  w.yaContextCb = w.yaContextCb || []
  w.yaContextCb.push(() => {
    w.Ya?.Context?.AdvManager?.render?.({
      blockId,
      type: 'floorAd',
      platform: 'touch'
    })
  })
})
</script>
