<template>
  <section class="random-cta">
    <div class="container">
      <WCard class="random-cta__card">
        <div>
          <p class="eyebrow">Случайная кнопка судьбы</p>
          <h2 class="title">Нажми и тебя кинет в случайную игру или генератор</h2>
        </div>
        <WButton size="lg" @click="goRandom">Ауф, погнали</WButton>
      </WCard>
    </div>
  </section>
</template>

<script setup>
import { homeRandomRoutes } from '@/content/home/featured'
import WButton from '@/components/ui/WButton.vue'
import WCard from '@/components/ui/WCard.vue'

const goRandom = () => {
  const target = homeRandomRoutes[Math.floor(Math.random() * homeRandomRoutes.length)]
  navigateTo(target)
}
</script>

<style scoped>
.random-cta {
  padding: 64px 0;
}

.random-cta__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  background: linear-gradient(135deg, rgba(106, 215, 255, 0.18), rgba(252, 166, 61, 0.05)),
    rgba(9, 14, 18, 0.88);
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--muted);
}

.title {
  margin: 0;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(24px, 3vw, 32px);
}

@media (max-width: 720px) {
  .random-cta__card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
