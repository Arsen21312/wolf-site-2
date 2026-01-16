<template>
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="hero__eyebrow">NeuralWiseWolf / мем-станция</p>
        <h1 class="hero__title">Игры и генераторы, чтобы мозг выл, но по кайфу</h1>
        <p class="hero__subtitle">
          Мемные тесты, мини-игры и штуки для решений, заходи, тыкай, делись.
        </p>
        <div class="hero__actions">
          <WButton to="/games" size="lg">Играть сейчас</WButton>
          <WButton variant="ghost" size="lg" @click="goRandom">Случайная штука</WButton>
        </div>
        <div class="hero__badges">
          <span v-for="badge in badges" :key="badge" class="badge">{{ badge }}</span>
        </div>
      </div>

      <div class="hero__vitrine" :style="parallaxStyle">
        <div class="vitrine-card">
          <div class="vitrine-card__top">
            <span class="vitrine-chip">Мемная витрина</span>
            <span class="vitrine-status">online</span>
          </div>
          <div class="vitrine-card__screen">
            <img class="vitrine-image" :src="aufImage" alt="Neural Wolf" loading="lazy" />
          </div>
          <div class="vitrine-stats">
            <div class="vitrine-stat">
              <strong>{{ stats.games }}</strong>
              <span>игр</span>
            </div>
            <div class="vitrine-stat">
              <strong>{{ stats.generators }}</strong>
              <span>генераторов</span>
            </div>
          </div>
          <div class="vitrine-card__bottom">
            <div class="chat-bubble chat-bubble--left">Это я сдул домики тех трех поросят</div>
            <div class="chat-bubble chat-bubble--right">Быстро и четка от души</div>
          </div>
        </div>

        <div class="floating-sticker floating-sticker--top">Безумно можно быть первым</div>
        <div class="floating-sticker floating-sticker--bottom">все мои волки делаеют ауф</div>
        <div class="floating-glow" aria-hidden="true"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { homeRandomRoutes } from '@/content/home/featured'
import WButton from '@/components/ui/WButton.vue'
import aufImage from '@/assets/images/auf1.png'

const stats = {
  games: 12,
  generators: 31
}

const badges = ['без регистрации', 'быстро', 'на русском']

const offsetX = ref(0)
const offsetY = ref(0)

const parallaxStyle = computed(() => ({
  transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`
}))

const goRandom = () => {
  const target = homeRandomRoutes[Math.floor(Math.random() * homeRandomRoutes.length)]
  navigateTo(target)
}

const handleMouseMove = (event) => {
  const { innerWidth, innerHeight } = window
  const x = (event.clientX / innerWidth - 0.5) * 18
  const y = (event.clientY / innerHeight - 0.5) * 18
  offsetX.value = x
  offsetY.value = y
}

onMounted(() => {
  const canHover = window.matchMedia('(hover: hover)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!canHover || reduceMotion) return
  window.addEventListener('mousemove', handleMouseMove)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.hero {
  padding: 72px 0 48px;
}

.hero__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
  align-items: center;
}

.hero__eyebrow {
  margin: 0 0 14px;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
}

.hero__title {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  margin: 0 0 18px;
}

.hero__subtitle {
  margin: 0 0 22px;
  font-size: 17px;
  color: var(--muted);
  max-width: 520px;
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hero__badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(8, 12, 18, 0.8);
  color: var(--muted);
  font-size: 12px;
}

.hero__vitrine {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 360px;
}

.vitrine-card {
  width: min(420px, 100%);
  background: rgba(8, 14, 18, 0.8);
  border-radius: 24px;
  border: 1px solid rgba(106, 215, 255, 0.25);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  padding: 20px;
  backdrop-filter: blur(14px);
  animation: floatVitrine 8s ease-in-out infinite;
}

.vitrine-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.vitrine-chip {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(106, 215, 255, 0.4);
  color: var(--accent-2);
  font-size: 12px;
  text-transform: uppercase;
}

.vitrine-status {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.6px;
}

.vitrine-card__screen {
  position: relative;
  border-radius: 18px;
  background: rgba(12, 18, 24, 0.9);
  padding: 0;
  min-height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: block;
  overflow: hidden;
}

.vitrine-stats {
  margin-top: 14px;
  display: flex;
  gap: 12px;
}

.vitrine-stat {
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.vitrine-stat strong {
  font-size: 18px;
  color: var(--text);
}

.vitrine-stat span {
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
}

.vitrine-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
  object-fit: fill;
}

.vitrine-card__bottom {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  font-size: 13px;
  background: rgba(255, 255, 255, 0.06);
}

.chat-bubble--left {
  justify-self: flex-start;
}

.chat-bubble--right {
  justify-self: flex-end;
  background: rgba(106, 215, 255, 0.1);
  border-color: rgba(106, 215, 255, 0.35);
}

.floating-sticker {
  position: absolute;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(9, 13, 18, 0.85);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}


.floating-sticker--top {
  top: 12px;
  right: 12px;
  color: var(--accent-2);
}

.floating-sticker--bottom {
  bottom: 12px;
  left: 16px;
  color: var(--muted);
}

.floating-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(106, 215, 255, 0.35), transparent 70%);
  filter: blur(14px);
  opacity: 0.6;
  z-index: -1;
}

@keyframes floatVitrine {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__vitrine {
    order: -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vitrine-card {
    animation: none;
  }
}
</style>
