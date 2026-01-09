<template>
  <main class="trust-wolf-redirect">
    <div class="loader-card">
      <div class="spinner" aria-hidden="true"></div>
      <p>ђ-ђшђх‘?‘?ђуђшђзђ? ђсђ?‘?‘?ў?і</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'

onMounted(() => {
  navigateTo('/trust-wolf/', { replace: true, external: true })
})
</script>

<style scoped>
.trust-wolf-redirect {
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: clamp(24px, 5vw, 48px);
}

.loader-card {
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 20px 26px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
}

.spinner {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 3px solid rgba(148, 163, 184, 0.35);
  border-top-color: rgba(248, 250, 252, 0.9);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
