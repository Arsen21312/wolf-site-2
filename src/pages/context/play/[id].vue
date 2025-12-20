<template>
  <section class="context-page">
    <div class="context-container">
      <h1 class="context-title">Игра #{{ gameId }}</h1>
      <p class="context-note">Подключаем игру, подожди...</p>
      <p v-if="errorMessage" class="context-error">{{ errorMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const route = useRoute()
const gameId = Number(route.params.id)
const errorMessage = ref('')

onMounted(async () => {
  if (!Number.isFinite(gameId)) {
    errorMessage.value = 'Некорректный id игры'
    return
  }

  try {
    const response = await $fetch<{ ok: boolean; game?: { targetWordId: number } }>(
      `/api/context/game?id=${gameId}`
    )
    if (!response.ok || !response.game?.targetWordId) {
      errorMessage.value = 'Игра не найдена'
      return
    }
    navigateTo(`/games/wolf-context/random?targetId=${response.game.targetWordId}&gameId=1`)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Не удалось загрузить игру'
  }
})
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
