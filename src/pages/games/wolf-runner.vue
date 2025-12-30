<template>
  <main class="wolf-runner-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Волчий раннер</h1>
      <p class="lead">Бесконечный забег по ночному лесу: прыгай, приседай, ставь рекорд.</p>
    </header>

    <section class="game-shell">
      <div class="hud">
        <div class="hud-group">
          <span class="hud-label">Счет</span>
          <span class="hud-value">{{ paddedScore }}</span>
        </div>
        <div class="hud-group">
          <span class="hud-label">Рекорд</span>
          <span class="hud-value">{{ paddedBest }}</span>
        </div>
        <div class="hud-group small">
          <span class="hud-label">Скорость</span>
          <span class="hud-value">x{{ speedLabel }}</span>
        </div>
      </div>

      <div class="canvas-wrap" ref="canvasWrap">
        <canvas ref="canvasRef" class="game-canvas" aria-label="Волчий раннер"></canvas>
        <div class="overlay">
          <div v-if="phase === 'idle'" class="overlay-card">
            <p>Нажми Space чтобы начать</p>
          </div>
          <div v-else-if="phase === 'paused'" class="overlay-card">
            <p>Пауза</p>
            <span class="overlay-hint">Esc или Space — продолжить</span>
          </div>
          <div v-else-if="phase === 'over'" class="overlay-card">
            <p>Волк упал</p>
            <div class="overlay-actions">
              <button class="btn primary" type="button" @click="restart">Заново</button>
              <button class="btn ghost" type="button" @click="shareScore">{{ shareLabel }}</button>
            </div>
          </div>
        </div>

        <div v-if="showMobileHint" class="mobile-hint">
          <div class="mobile-hint-card">
            <p>Тап — прыжок</p>
            <p>Свайп вниз — присесть</p>
            <button class="btn ghost" type="button" @click="dismissHint">Понятно</button>
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="control-item">
          <span class="key">Space</span>
          <span class="desc">Прыжок</span>
        </div>
        <div class="control-item">
          <span class="key">↑</span>
          <span class="desc">Прыжок</span>
        </div>
        <div class="control-item">
          <span class="key">↓</span>
          <span class="desc">Присесть / быстрый спуск</span>
        </div>
        <div class="control-item">
          <span class="key">Esc</span>
          <span class="desc">Пауза</span>
        </div>
      </div>
    </section>

    <section class="seo-article">
      <div class="seo-card">
        <h2>Волчий раннер, миниигра на реакцию</h2>
        <p>
          Волчий раннер — бесконечный забег в стиле «динозаврика», только вместо динозавра
          бежит волк. Чем дольше продержишься, тем выше скорость и сложнее препятствия.
        </p>

        <h2>Как играть</h2>
        <p>
          Нажми Space или тапни по экрану, чтобы прыгнуть. Стрелка вниз или свайп вниз —
          присесть и проскочить под костями. Уклоняйся от пней и камней, чтобы не упасть.
        </p>

        <h2>Как побить рекорд</h2>
        <p>
          Следи за темпом: не прыгай слишком рано, оставляй запас перед двойными
          препятствиями и привыкай к ускорению — оно растет каждые несколько секунд.
        </p>
      </div>
    </section>

    <section class="faq-card">
      <p class="seo-kicker">FAQ</p>
      <h2>Вопросы о Волчьем раннере</h2>
      <div class="faq-list">
        <div v-for="(item, idx) in faqItems" :key="item.q" class="faq-item" :class="{ open: openFaq === idx }">
          <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
            <span>{{ item.q }}</span>
            <span class="icon">{{ openFaq === idx ? '-' : '+' }}</span>
          </button>
          <div class="faq-body">
            <p>{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { createWolfRunnerEngine, getBaseSpeed, type RunnerPhase } from '@/utils/games/wolfRunner/engine'
import { loadHighscore, saveHighscore } from '@/utils/games/wolfRunner/storage'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий раннер' }
]

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrap = ref<HTMLDivElement | null>(null)
const phase = ref<RunnerPhase>('idle')
const score = ref(0)
const bestScore = ref(0)
const speed = ref(1)
const openFaq = ref<number | null>(null)
const showMobileHint = ref(false)
const shareLabel = ref('Поделиться')
const shareTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const paddedScore = computed(() => String(score.value).padStart(6, '0'))
const paddedBest = computed(() => String(bestScore.value).padStart(6, '0'))
const speedLabel = computed(() => speed.value.toFixed(1))

const faqItems = [
  {
    q: 'Как управлять на телефоне?',
    a: 'Тап — прыжок, свайп вниз — присесть или быстрый спуск. Подсказка показывается один раз.'
  },
  {
    q: 'Как сохраняется рекорд?',
    a: 'Рекорд сохраняется в localStorage браузера и не пропадает после перезагрузки.'
  },
  {
    q: 'Почему игра ускоряется?',
    a: 'Скорость растет, чтобы усложнять забег и давать шанс побить прошлый результат.'
  },
  {
    q: 'Работает ли офлайн?',
    a: 'Да, игра запускается прямо в браузере и не требует сети после загрузки.'
  }
]

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const dismissHint = () => {
  showMobileHint.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('wolfRunnerHintSeen', '1')
  }
}

let engine: ReturnType<typeof createWolfRunnerEngine> | null = null
let frameId: number | null = null
let lastTime = 0
let lastPhase: RunnerPhase = 'idle'
const handleVisibility = () => {
  if (document.visibilityState === 'hidden') {
    if (phase.value === 'running') togglePause()
  }
}

const updateStats = () => {
  if (!engine) return
  const stats = engine.getStats()
  phase.value = stats.phase
  score.value = stats.score
  speed.value = stats.speed / getBaseSpeed()
  if (stats.phase === 'over' && lastPhase !== 'over') {
    if (score.value > bestScore.value) {
      bestScore.value = score.value
      saveHighscore(bestScore.value)
    }
  }
  lastPhase = stats.phase
}

const resizeCanvas = () => {
  if (!canvasRef.value || !canvasWrap.value || !engine) return
  const rect = canvasWrap.value.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvasRef.value.width = Math.floor(rect.width * dpr)
  canvasRef.value.height = Math.floor(rect.height * dpr)
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  engine.setSize(rect.width, rect.height)
  engine.render()
}

const gameLoop = (time: number) => {
  if (!engine) return
  const dt = Math.min(50, time - lastTime)
  lastTime = time
  engine.update(dt)
  engine.render()
  updateStats()
  frameId = window.requestAnimationFrame(gameLoop)
}

const startLoop = () => {
  if (frameId) return
  lastTime = performance.now()
  frameId = window.requestAnimationFrame(gameLoop)
}

const stopLoop = () => {
  if (!frameId) return
  window.cancelAnimationFrame(frameId)
  frameId = null
}

const handleJump = () => {
  if (!engine) return
  if (phase.value === 'over') {
    engine.reset()
    engine.start()
  } else if (phase.value === 'paused') {
    engine.resume()
  } else {
    engine.handleJump()
  }
  updateStats()
}

const handleDuck = (isDown: boolean) => {
  if (!engine) return
  engine.handleDuck(isDown)
}

const togglePause = () => {
  if (!engine) return
  if (phase.value === 'running') {
    engine.pause()
  } else if (phase.value === 'paused') {
    engine.resume()
  }
  updateStats()
}

const restart = () => {
  if (!engine) return
  engine.reset()
  engine.start()
  updateStats()
}

const shareScore = async () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  const text = `Я набрал ${score.value} в Волчьем раннере`
  try {
    await navigator.clipboard.writeText(text)
    shareLabel.value = 'Скопировано'
  } catch (error) {
    shareLabel.value = 'Не удалось'
  }
  if (shareTimer.value) clearTimeout(shareTimer.value)
  shareTimer.value = setTimeout(() => {
    shareLabel.value = 'Поделиться'
  }, 2000)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault()
    handleJump()
    return
  }
  if (event.code === 'ArrowDown') {
    event.preventDefault()
    handleDuck(true)
    return
  }
  if (event.code === 'Escape') {
    event.preventDefault()
    togglePause()
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.code === 'ArrowDown') {
    event.preventDefault()
    handleDuck(false)
  }
}

let touchStartY = 0
let touchHandled = false

const handleTouchStart = (event: TouchEvent) => {
  if (!event.touches.length) return
  touchHandled = false
  touchStartY = event.touches[0].clientY
}

const handleTouchMove = (event: TouchEvent) => {
  if (!event.touches.length || touchHandled) return
  const delta = event.touches[0].clientY - touchStartY
  if (delta > 35) {
    handleDuck(true)
    touchHandled = true
  }
}

const handleTouchEnd = () => {
  handleDuck(false)
  if (!touchHandled) {
    handleJump()
  }
  touchHandled = false
}

onMounted(() => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  engine = createWolfRunnerEngine(ctx, 900, 360)
  bestScore.value = loadHighscore()
  updateStats()
  startLoop()

  const isMobile = window.innerWidth < 768
  const hintSeen = localStorage.getItem('wolfRunnerHintSeen')
  showMobileHint.value = isMobile && hintSeen !== '1'

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  document.addEventListener('visibilitychange', handleVisibility)
  canvasWrap.value?.addEventListener('touchstart', handleTouchStart, { passive: true })
  canvasWrap.value?.addEventListener('touchmove', handleTouchMove, { passive: true })
  canvasWrap.value?.addEventListener('touchend', handleTouchEnd)

  resizeCanvas()

})

onBeforeUnmount(() => {
  stopLoop()
  if (shareTimer.value) clearTimeout(shareTimer.value)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  document.removeEventListener('visibilitychange', handleVisibility)
  canvasWrap.value?.removeEventListener('touchstart', handleTouchStart)
  canvasWrap.value?.removeEventListener('touchmove', handleTouchMove)
  canvasWrap.value?.removeEventListener('touchend', handleTouchEnd)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games/wolf-runner`)
const metaDescription =
  'Бесконечный раннер как динозаврик, только волк. Прыгай, уклоняйся, ставь рекорды'

useSeoMeta(() => ({
  title: 'Волчий раннер онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Волчий раннер онлайн | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'VideoGame',
      name: 'Волчий раннер',
      applicationCategory: 'Game',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Игры', item: `${requestUrl.origin}/games` },
        { '@type': 'ListItem', position: 3, name: 'Волчий раннер', item: canonicalUrl.value }
      ]
    }
  ]
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{ type: 'application/ld+json', children: JSON.stringify(structuredData.value) }]
}))
</script>

<style scoped>
.wolf-runner-page {
  display: grid;
  gap: clamp(20px, 4vw, 36px);
  width: min(1100px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(36px, 5vw, 64px);
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 56px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
  color: #f8fafc;
}

.hero .lead {
  margin: 0;
  color: #cbd5e1;
  max-width: 720px;
}

.game-shell {
  background: radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 60%),
    linear-gradient(150deg, rgba(17, 24, 39, 0.96), rgba(2, 6, 23, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  padding: clamp(18px, 3vw, 28px);
  display: grid;
  gap: 16px;
}

.hud {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.hud-group {
  display: grid;
  gap: 4px;
  color: #e2e8f0;
  font-weight: 700;
  min-width: 140px;
}

.hud-group.small {
  min-width: auto;
}

.hud-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.hud-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 22px;
}

.canvas-wrap {
  position: relative;
  width: 100%;
  height: clamp(240px, 36vw, 340px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.8);
  touch-action: none;
}

.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.overlay-card {
  display: grid;
  gap: 10px;
  padding: 16px 22px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  text-align: center;
  pointer-events: auto;
}

.overlay-card p {
  margin: 0;
  font-weight: 700;
  font-size: 18px;
}

.overlay-hint {
  font-size: 12px;
  color: #94a3b8;
}

.overlay-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.mobile-hint {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: end center;
  padding: 16px;
  pointer-events: none;
}

.mobile-hint-card {
  pointer-events: auto;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  padding: 14px 18px;
  display: grid;
  gap: 6px;
  text-align: center;
  color: #e2e8f0;
  font-weight: 600;
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.control-item {
  display: grid;
  gap: 6px;
  align-content: start;
  justify-items: center;
  text-align: center;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 28px;
  padding: 0 6px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(2, 6, 23, 0.7);
  font-weight: 700;
}

.desc {
  color: #94a3b8;
  font-size: 13px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(59, 130, 246, 0.9), rgba(56, 189, 248, 0.9));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.7);
}

.seo-article {
  display: grid;
}

.seo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(18px, 3vw, 26px);
  display: grid;
  gap: 12px;
}

.seo-card h2 {
  margin: 0;
}

.seo-card p {
  margin: 0;
  color: #cbd5e1;
}

.faq-card {
  display: grid;
  gap: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(18px, 3vw, 26px);
}

.seo-kicker {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.faq-item.open {
  border-color: rgba(59, 130, 246, 0.45);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.faq-toggle .icon {
  font-size: 18px;
}

.faq-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 14px;
}

.faq-item.open .faq-body {
  max-height: 160px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
}

@media (max-width: 720px) {
  .hud {
    justify-content: center;
    text-align: center;
  }

  .hud-group {
    align-items: center;
  }
}
</style>
