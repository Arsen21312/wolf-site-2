<template>
  <div class="loopy-shell">
    <header class="loopy-topbar">
      <nav class="loopy-breadcrumbs" aria-label="Навигация">
        <NuxtLink to="/generators">Генераторы</NuxtLink>
        <span class="crumb-sep">/</span>
        <span>Петли стаи</span>
      </nav>
      <div class="loopy-actions"></div>
    </header>
    <iframe
      ref="iframeRef"
      class="loopy-frame"
      src="/loopy/"
      title="Петли стаи"
      loading="lazy"
    ></iframe>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const iframeRef = ref(null)
const route = useRoute()

definePageMeta({
  layout: false
})

const handleMessage = (event) => {
  if (event.origin !== window.location.origin) return
  const payload = event.data || {}
  if (payload.type === 'loopy-open-help') {
    sendToLoopy({ type: 'loopy-open-howto' })
  }
  if (payload.type === 'loopy-open-credits') {
    sendToLoopy({ type: 'loopy-open-credits' })
  }
}

const pendingPayload = ref(null)

const sendToLoopy = (payload) => {
  const frame = iframeRef.value
  if (!frame || !frame.contentWindow) return false
  frame.contentWindow.postMessage(payload, window.location.origin)
  return true
}

const loadExample = async (exampleId) => {
  const id = Array.isArray(exampleId) ? exampleId[0] : exampleId
  if (!id) return
  try {
    const response = await fetch(`/loopy/examples/${id}.json`)
    if (!response.ok) return
    const example = await response.json()
    const data = example.data ?? example
    const sent = sendToLoopy({ type: 'loopy-load-example', data })
    if (!sent) pendingPayload.value = { type: 'loopy-load-example', data }
  } catch (error) {
    // noop
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  if (iframeRef.value) {
    iframeRef.value.addEventListener('load', () => {
      if (pendingPayload.value) {
        sendToLoopy(pendingPayload.value)
        pendingPayload.value = null
      }
    })
  }
  loadExample(route.query.example)
  if (route.query.help === '1') {
    sendToLoopy({ type: 'loopy-open-howto' })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})

watch(
  () => route.query.example,
  (value) => {
    loadExample(value)
  }
)

watch(
  () => route.query.help,
  (value) => {
    if (value === '1') {
      sendToLoopy({ type: 'loopy-open-howto' })
    }
  }
)
</script>

<style scoped>
.loopy-shell {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0;
  background: var(--bg);
}

.loopy-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  background: rgba(11, 16, 33, 0.9);
  backdrop-filter: blur(10px);
  z-index: 2;
  height: 56px;
}

.loopy-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #c9d4f3;
}

.loopy-breadcrumbs a {
  color: #c9d4f3;
  text-decoration: none;
}

.loopy-breadcrumbs a:hover {
  color: #ffffff;
}

.crumb-sep {
  color: #5e6a8a;
}

.loopy-actions {
  display: flex;
  gap: 10px;
}

.loopy-frame {
  display: block;
  width: 100%;
  height: calc(100vh - 56px);
  border: 0;
}

@media (max-width: 640px) {
  .loopy-topbar {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

:global(body) {
  margin: 0;
  overflow: hidden;
}
</style>
