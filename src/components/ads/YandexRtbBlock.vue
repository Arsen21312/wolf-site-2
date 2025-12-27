<template>
  <div class="yandex-rtb">
    <ClientOnly>
      <div :id="containerId"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

type YandexWindow = Window & {
  yaContextCb?: Array<() => void>
  Ya?: {
    Context?: {
      AdvManager?: {
        render?: (options: { blockId: string; renderTo: string }) => void
      }
    }
  }
}

const blockId = 'R-A-18145254-2'
const containerId = `yandex_rtb_${blockId}`

onMounted(() => {
  if (!process.client) return
  const w = window as YandexWindow
  w.yaContextCb = w.yaContextCb || []
  w.yaContextCb.push(() => {
    w.Ya?.Context?.AdvManager?.render?.({
      blockId,
      renderTo: containerId
    })
  })
})
</script>

<style scoped>
.yandex-rtb {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 28px auto 0;
}
</style>
