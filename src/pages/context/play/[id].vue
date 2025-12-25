<template>
  <section class="context-page">
    <div class="context-container">
      <h1 class="context-title">Contexto #{{ gameId }}</h1>
      <p class="context-note">Mode is being reworked after moving to local ambient.</p>
      <p v-if="errorMessage" class="context-error">{{ errorMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const gameId = Number(route.params.id)
const errorMessage = ref('')

if (!Number.isFinite(gameId)) {
  errorMessage.value = 'Invalid game id'
} else {
  errorMessage.value = 'Contexto rooms are temporarily disabled'
}
</script>

<style scoped>
.context-page {
  padding: 32px 18px 64px;
  color: #e5e7eb;
}

.context-container {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
  text-align: center;
}

.context-title {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 900;
}

.context-note {
  margin: 0;
  color: #cbd5e1;
}

.context-error {
  margin: 0;
  color: #fca5a5;
}
</style>
