<template>
  <main class="wolf-jump-page" :class="{ fullscreen: isFullscreen }">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Wolf Jump</h1>
      <p class="lead">Бесконечный прыжковый раннер вверх: волк ловит платформы, а камера не отпускает.</p>
    </header>

    <section class="game-shell" ref="gameShell">
      <div class="hud">
        <div class="hud-group">
          <span class="hud-label">Score</span>
          <span class="hud-value">{{ paddedScore }}</span>
        </div>
        <div class="hud-group">
          <span class="hud-label">Best</span>
          <span class="hud-value">{{ paddedBest }}</span>
        </div>
        <button class="btn ghost fullscreen-btn" type="button" @click="toggleFullscreen">
          {{ isFullscreen ? 'Окно' : 'На весь экран' }}
        </button>
      </div>

      <div class="canvas-wrap" ref="canvasWrap">
        <canvas ref="canvasRef" class="game-canvas" aria-label="Wolf Jump"></canvas>
        <div class="overlay">
          <div v-if="phase === 'idle'" class="overlay-card">
            <p>Нажми Space или тапни старт</p>
            <span class="overlay-hint">A/D или стрелки — движение</span>
            <button class="btn primary" type="button" @click="startGame">Старт</button>
          </div>
          <div v-else-if="phase === 'over'" class="overlay-card">
            <p>Волк сорвался</p>
            <div class="overlay-score">
              <span>Score: {{ score }}</span>
              <span>Best: {{ bestScore }}</span>
            </div>
            <div class="overlay-actions">
              <button class="btn primary" type="button" @click="restart">Заново</button>
              <button class="btn ghost" type="button" @click="shareScore">{{ shareLabel }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="touch-controls">
        <button
          class="touch-btn"
          type="button"
          @pointerdown="setLeft(true)"
          @pointerup="setLeft(false)"
          @pointerleave="setLeft(false)"
          @pointercancel="setLeft(false)"
        >
          ←
        </button>
        <button
          class="touch-btn"
          type="button"
          @pointerdown="setRight(true)"
          @pointerup="setRight(false)"
          @pointerleave="setRight(false)"
          @pointercancel="setRight(false)"
        >
          →
        </button>
      </div>

      <div class="controls">
        <div class="control-item">
          <span class="key">A</span>
          <span class="key">D</span>
          <span class="desc">Движение</span>
        </div>
        <div class="control-item">
          <span class="key">←</span>
          <span class="key">→</span>
          <span class="desc">Движение</span>
        </div>
        <div class="control-item">
          <span class="key">Space</span>
          <span class="desc">Старт</span>
        </div>
      </div>
    </section>

    <section class="seo-article">
      <div class="seo-card">
        <h2>Wolf Jump, бесконечная прыжковая миниигра</h2>
        <p>
          Волк летит вверх по платформам, камера тянется за ним, а падение вниз означает конец забега. Цель проста:
          прыгать всё выше и бить собственный рекорд.
        </p>

        <h2>Как играть</h2>
        <p>
          На компьютере используй A/D или стрелки, чтобы смещаться влево и вправо. Нажми Space, чтобы стартовать. На
          телефоне жми экранные кнопки ← →, чтобы контролировать прыжки.
        </p>

        <h2>Как набрать больше очков</h2>
        <p>
          Лови ритм платформ: не гонись за дальними прыжками, оценивай траекторию и используй обёртку по краям экрана.
          Чем выше поднимаешься, тем чаще встречаются сложные платформы.
        </p>
      </div>
    </section>

    <section class="faq-card">
      <p class="seo-kicker">FAQ</p>
      <h2>Вопросы о Wolf Jump</h2>
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
import { createWolfJumpEngine, type JumpPhase } from '@/utils/games/wolfJump/engine'
import { createWolfJumpInput } from '@/utils/games/wolfJump/input'
import { loadBestScore, saveBestScore } from '@/utils/games/wolfJump/storage'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Wolf Jump' }
]

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrap = ref<HTMLDivElement | null>(null)
const gameShell = ref<HTMLElement | null>(null)
const phase = ref<JumpPhase>('idle')
const score = ref(0)
const bestScore = ref(0)
const shareLabel = ref('Поделиться')
const isFullscreen = ref(false)
const shareTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const openFaq = ref<number | null>(null)

const paddedScore = computed(() => String(score.value).padStart(6, '0'))
const paddedBest = computed(() => String(bestScore.value).padStart(6, '0'))

const BASE_WIDTH = 900
const BASE_HEIGHT = 360
let deviceScale = 1
let viewScale = 1
let viewOffsetX = 0
let viewOffsetY = 0

const faqItems = [
  {
    q: 'Как управлять на телефоне?',
    a: 'Нажимай экранные кнопки ← →, чтобы смещаться влево и вправо. Прыжки происходят автоматически при касании платформ.'
  },
  {
    q: 'Сохраняется ли рекорд?',
    a: 'Да, рекорд сохраняется в localStorage и не пропадает после перезагрузки.'
  },
  {
    q: 'Игра бесконечная?',
    a: 'Да, платформы генерируются всё выше по мере подъема, пока волк не упадет.'
  },
  {
    q: 'Почему платформы становятся сложнее?',
    a: 'Чем выше высота, тем больше движущихся и ломких платформ — так прогресс ощущается сильнее.'
  }
]

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

let engine: ReturnType<typeof createWolfJumpEngine> | null = null
let ctx: CanvasRenderingContext2D | null = null
let input: ReturnType<typeof createWolfJumpInput> | null = null
let frameId: number | null = null
let lastTime = 0
let lastPhase: JumpPhase = 'idle'

const syncInput = () => {
  if (!engine || !input) return
  const state = input.getState()
  engine.setInput(state.left, state.right)
}

const updateStats = () => {
  if (!engine) return
  const stats = engine.getStats()
  phase.value = stats.phase
  score.value = stats.score
  if (stats.phase === 'over' && lastPhase !== 'over') {
    if (score.value > bestScore.value) {
      bestScore.value = score.value
      saveBestScore(bestScore.value)
    }
  }
  lastPhase = stats.phase
}

const renderFrame = () => {
  if (!canvasRef.value || !engine || !ctx) return
  const width = canvasRef.value.width / deviceScale
  const height = canvasRef.value.height / deviceScale
  ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0)
  ctx.clearRect(0, 0, width, height)
  if (isFullscreen.value) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#0b1020')
    gradient.addColorStop(1, '#131b2f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  ctx.setTransform(
    deviceScale * viewScale,
    0,
    0,
    deviceScale * viewScale,
    viewOffsetX * deviceScale,
    viewOffsetY * deviceScale
  )
  engine.render()
}

const resizeCanvas = () => {
  if (!canvasRef.value || !canvasWrap.value || !engine) return
  const rect = canvasWrap.value.getBoundingClientRect()
  deviceScale = Math.min(window.devicePixelRatio || 1, 2)
  canvasRef.value.width = Math.floor(rect.width * deviceScale)
  canvasRef.value.height = Math.floor(rect.height * deviceScale)
  if (!ctx) return
  if (isFullscreen.value) {
    viewScale = Math.min(rect.width / BASE_WIDTH, rect.height / BASE_HEIGHT)
    viewOffsetX = (rect.width - BASE_WIDTH * viewScale) * 0.5
    viewOffsetY = (rect.height - BASE_HEIGHT * viewScale) * 0.5
    engine.setSize(BASE_WIDTH, BASE_HEIGHT)
  } else {
    viewScale = 1
    viewOffsetX = 0
    viewOffsetY = 0
    engine.setSize(rect.width, rect.height)
  }
  renderFrame()
}

const gameLoop = (time: number) => {
  if (!engine) return
  const dt = Math.min(50, time - lastTime)
  lastTime = time
  syncInput()
  engine.update(dt)
  renderFrame()
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

const startGame = () => {
  if (!engine) return
  engine.start()
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
  const text = `Я набрал ${score.value} в Wolf Jump`
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

const setLeft = (value: boolean) => {
  if (!input) return
  input.setLeft(value)
}

const setRight = (value: boolean) => {
  if (!input) return
  input.setRight(value)
}

onMounted(() => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  engine = createWolfJumpEngine(ctx, BASE_WIDTH, BASE_HEIGHT)
  bestScore.value = loadBestScore()
  updateStats()

  input = createWolfJumpInput(startGame)
  input.attach()

  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  startLoop()
  resizeCanvas()
})

onBeforeUnmount(() => {
  stopLoop()
  if (shareTimer.value) clearTimeout(shareTimer.value)
  input?.detach()
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

const handleFullscreenChange = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
  resizeCanvas()
}

const toggleFullscreen = async () => {
  if (!gameShell.value) return
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }
  await gameShell.value.requestFullscreen()
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games/wolf-jump`)
const metaDescription =
  'Прыгай по платформам вверх в Wolf Jump. Бесконечная игра, счёт, рекорд, быстрый рестарт'

useSeoMeta(() => ({
  title: 'Wolf Jump онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Wolf Jump онлайн | Neural Wise Wolf',
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
      name: 'Wolf Jump',
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
        { '@type': 'ListItem', position: 3, name: 'Wolf Jump', item: canonicalUrl.value }
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
.wolf-jump-page {
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
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.14), transparent 60%),
    linear-gradient(150deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.92));
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
  height: clamp(320px, 48vw, 420px);
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

.overlay-score {
  display: grid;
  gap: 4px;
  font-size: 14px;
  color: #cbd5e1;
}

.touch-controls {
  display: none;
  gap: 12px;
  justify-content: center;
}

.touch-btn {
  width: 86px;
  height: 58px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.touch-btn:active {
  transform: translateY(1px) scale(0.98);
  border-color: rgba(148, 163, 184, 0.7);
  background: rgba(30, 41, 59, 0.9);
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
  border-color: rgba(56, 189, 248, 0.45);
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

@media (max-width: 900px) {
  .touch-controls {
    display: flex;
  }
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

.fullscreen .hero,
.fullscreen .seo-article,
.fullscreen .faq-card,
.fullscreen .controls {
  display: none;
}

.fullscreen .game-shell {
  border-radius: 0;
  border: none;
  padding: 0;
  min-height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
}

.fullscreen .canvas-wrap {
  width: 100vw;
  height: 100vh;
  margin: 0;
  border-radius: 0;
  border: none;
}

.fullscreen .touch-controls {
  display: flex;
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  z-index: 3;
  pointer-events: auto;
}

.fullscreen-btn {
  white-space: nowrap;
}

.fullscreen .hud {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 3;
  background: rgba(2, 6, 23, 0.72);
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

@media (orientation: portrait) {
  .fullscreen .touch-controls {
    bottom: 24px;
  }
}
</style>
