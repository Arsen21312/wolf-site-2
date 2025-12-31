<template>
  <main class="wolf-clicker-page">
    <div v-if="isAufActive" class="auf-overlay"></div>

    <section class="page-wrap">
      <header class="hero">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <h1>Волчий кликер</h1>
        <p class="lead">
          Кликаешь по волку, собираешь очки, качаешь стаю и запускаешь режим АУФ.
        </p>
      </header>

      <div class="game-stack">
        <section class="game-panel">
          <div class="stats-row">
            <div class="stat-main">
              <p class="stat-label">Очки</p>
              <p class="stat-value">{{ formattedPoints }}</p>
              <p class="stat-sub">Рекорд: {{ formattedBest }}</p>
            </div>
            <div class="stat-chips">
              <div class="chip">+{{ formatNumber(pointsPerClick) }} за клик</div>
              <div class="chip">+{{ formatNumber(pointsPerSecond) }} / сек</div>
              <div class="chip">Шанс двойного: {{ Math.round(doubleChance * 100) }}%</div>
            </div>
          </div>

          <div class="clicker-zone">
            <button
              type="button"
              class="wolf-button"
              :class="{ pulse: clickPulse }"
              aria-label="Клик по волку"
              @click="handleWolfClick"
            >
              <span class="wolf-emoji">🐺</span>
              <span class="click-gain">+{{ formatNumber(totalClickValue) }}</span>
            </button>

            <div class="mini-grid">
              <div class="mini-card">
                <p>Клик множитель</p>
                <strong>x{{ clickMultiplier.toFixed(2) }}</strong>
              </div>
              <div class="mini-card">
                <p>Общий множитель</p>
                <strong>x{{ allMultiplier.toFixed(2) }}</strong>
              </div>
              <div class="mini-card">
                <p>Пассив</p>
                <strong>{{ formatNumber(pointsPerSecond) }} / сек</strong>
              </div>
            </div>
          </div>

          <div class="auf-card">
            <div>
              <p class="stat-label">Режим АУФ</p>
              <p class="auf-power">x{{ aufMultiplier }} ко всем доходам</p>
              <p class="stat-sub">Длительность {{ aufDuration }} сек, кулдаун 60 сек</p>
            </div>
            <button type="button" class="btn auf" :disabled="!canActivateAuf" @click="activateAuf">
              {{ aufButtonLabel }}
            </button>
          </div>
        </section>

        <section class="upgrades">
          <p class="eyebrow">Апгрейды стаи</p>
          <div class="upgrade-list">
            <div v-for="upgrade in upgrades" :key="upgrade.id" class="upgrade-card">
              <div class="upgrade-head">
                <div>
                  <h3>{{ upgrade.name }}</h3>
                  <p class="upgrade-desc">{{ upgrade.description }}</p>
                  <p class="upgrade-effect">{{ upgrade.effect }}</p>
                </div>
                <span class="level">lvl {{ upgrade.level }}</span>
              </div>
              <div class="upgrade-foot">
                <p class="price">Цена: {{ formatNumber(getUpgradeCost(upgrade)) }}</p>
                <button
                  type="button"
                  class="btn ghost"
                  :disabled="points < getUpgradeCost(upgrade)"
                  @click="buyUpgrade(upgrade)"
                >
                  Купить
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="tips">
          <p class="eyebrow">Подсказки</p>
          <ul>
            <li>Клик по волку = очки + апгрейды.</li>
            <li>Пассивный доход начисляется раз в секунду.</li>
            <li>АУФ ускоряет все доходы на время.</li>
            <li>Прогресс сохраняется автоматически.</li>
          </ul>
        </section>
      </div>

      <section class="seo-block">
        <div class="seo-card">
          <h2>Волчий кликер онлайн</h2>
          <p>
            Волчий кликер - это быстрый кликер про доминирование стаи. Ты кликаешь по
            волку, набираешь очки и усиливаешь команду за счет апгрейдов.
          </p>

          <h2>Как играть</h2>
          <p>
            Просто кликай по волку, получай очки и вкладывайся в улучшения. Пассивный
            доход работает, пока вкладка открыта, поэтому важно разогнать стаю.
          </p>

          <h2>Зачем прокачивать стаю</h2>
          <p>
            Прокачка дает больше кликов, пассивных очков и усиливает режим АУФ. Чем
            сильнее стая, тем быстрее растет счет и легче бить рекорды.
          </p>
        </div>

        <div class="faq-card">
          <h2>Частые вопросы</h2>
          <div class="faq-list">
            <details v-for="item in faqItems" :key="item.q" class="faq-item">
              <summary>{{ item.q }}</summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type UpgradeEffect = 'click' | 'pps' | 'clickMult' | 'allMult' | 'doubleChance' | 'aufDuration'

type Upgrade = {
  id: string
  name: string
  description: string
  effect: string
  baseCost: number
  costMultiplier: number
  effectType: UpgradeEffect
  effectValue: number
  level: number
}

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Волчий кликер' }
]

const points = ref(0)
const bestScore = ref(0)
const basePointsPerClick = ref(1)
const basePointsPerSecond = ref(0)
const clickMultiplier = ref(1)
const allMultiplier = ref(1)
const doubleChance = ref(0)
const aufDuration = ref(10)
const aufMultiplier = 3
const aufCooldown = ref(0)
const isAufActive = ref(false)
const clickPulse = ref(false)

const upgrades = ref<Upgrade[]>([
  {
    id: 'bite',
    name: 'Сила укуса',
    description: 'Сильнее укус - больше очков за клик.',
    effect: '+1 клик',
    baseCost: 15,
    costMultiplier: 1.4,
    effectType: 'click',
    effectValue: 1,
    level: 0
  },
  {
    id: 'pack',
    name: 'Размер стаи',
    description: 'Чем больше стая, тем выше пассивный доход.',
    effect: '+1 / сек',
    baseCost: 40,
    costMultiplier: 1.45,
    effectType: 'pps',
    effectValue: 1,
    level: 0
  },
  {
    id: 'alpha',
    name: 'Альфа волк',
    description: 'Сильнее лидер - мощнее клик.',
    effect: '+12% к кликам',
    baseCost: 90,
    costMultiplier: 1.5,
    effectType: 'clickMult',
    effectValue: 0.12,
    level: 0
  },
  {
    id: 'instinct',
    name: 'Инстинкт',
    description: 'Иногда клик удваивается.',
    effect: '+4% шанс двойного клика',
    baseCost: 140,
    costMultiplier: 1.55,
    effectType: 'doubleChance',
    effectValue: 0.04,
    level: 0
  },
  {
    id: 'night-hunt',
    name: 'Охота ночью',
    description: 'Временный буст длится дольше.',
    effect: '+1 сек к АУФ',
    baseCost: 220,
    costMultiplier: 1.5,
    effectType: 'aufDuration',
    effectValue: 1,
    level: 0
  },
  {
    id: 'legend',
    name: 'Легенда стаи',
    description: 'Общий множитель растет.',
    effect: '+8% ко всем доходам',
    baseCost: 320,
    costMultiplier: 1.6,
    effectType: 'allMult',
    effectValue: 0.08,
    level: 0
  }
])

const numberFormatter = new Intl.NumberFormat('ru-RU')
const formatNumber = (value: number) => numberFormatter.format(Math.floor(value))

const pointsPerClick = computed(() => basePointsPerClick.value * clickMultiplier.value * allMultiplier.value)
const pointsPerSecond = computed(() => basePointsPerSecond.value * allMultiplier.value)
const totalClickValue = computed(() => pointsPerClick.value * (isAufActive.value ? aufMultiplier : 1))
const totalPpsValue = computed(() => pointsPerSecond.value * (isAufActive.value ? aufMultiplier : 1))
const formattedPoints = computed(() => formatNumber(points.value))
const formattedBest = computed(() => formatNumber(bestScore.value))
const canActivateAuf = computed(() => !isAufActive.value && aufCooldown.value === 0)
const aufButtonLabel = computed(() => {
  if (isAufActive.value) return 'АУФ!'
  if (aufCooldown.value > 0) return `КД ${aufCooldown.value}s`
  return 'АУФ'
})

const getUpgradeCost = (upgrade: Upgrade) =>
  Math.ceil(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level))

const applyUpgradeEffect = (upgrade: Upgrade) => {
  switch (upgrade.effectType) {
    case 'click':
      basePointsPerClick.value += upgrade.effectValue
      break
    case 'pps':
      basePointsPerSecond.value += upgrade.effectValue
      break
    case 'clickMult':
      clickMultiplier.value *= 1 + upgrade.effectValue
      break
    case 'allMult':
      allMultiplier.value *= 1 + upgrade.effectValue
      break
    case 'doubleChance':
      doubleChance.value = Math.min(0.6, doubleChance.value + upgrade.effectValue)
      break
    case 'aufDuration':
      aufDuration.value += upgrade.effectValue
      break
  }
}

const buyUpgrade = (upgrade: Upgrade) => {
  const cost = getUpgradeCost(upgrade)
  if (points.value < cost) return
  points.value -= cost
  upgrade.level += 1
  applyUpgradeEffect(upgrade)
  syncBestScore()
}

const syncBestScore = () => {
  if (points.value > bestScore.value) bestScore.value = Math.floor(points.value)
}

const handleWolfClick = () => {
  const chance = Math.random()
  let gain = totalClickValue.value
  if (chance < doubleChance.value) gain *= 2
  points.value += gain
  syncBestScore()
  clickPulse.value = false
  window.requestAnimationFrame(() => {
    clickPulse.value = true
    window.setTimeout(() => {
      clickPulse.value = false
    }, 200)
  })
}

const activateAuf = () => {
  if (!canActivateAuf.value) return
  isAufActive.value = true
  aufCooldown.value = 60
  window.setTimeout(() => {
    isAufActive.value = false
  }, aufDuration.value * 1000)
}

const saveState = () => {
  if (typeof window === 'undefined') return
  const payload = {
    points: Math.floor(points.value),
    pointsPerClick: pointsPerClick.value,
    pointsPerSecond: pointsPerSecond.value,
    bestScore: bestScore.value,
    upgrades: upgrades.value.map((upgrade) => ({ id: upgrade.id, level: upgrade.level }))
  }
  localStorage.setItem('wolfClickerState', JSON.stringify(payload))
}

const loadState = () => {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem('wolfClickerState')
  if (!raw) return
  try {
    const saved = JSON.parse(raw) as {
      points?: number
      pointsPerClick?: number
      pointsPerSecond?: number
      bestScore?: number
      upgrades?: Array<{ id: string; level: number }>
    }
    points.value = saved.points ?? points.value
    bestScore.value = saved.bestScore ?? bestScore.value
    const levels = new Map(saved.upgrades?.map((item) => [item.id, item.level]))
    basePointsPerClick.value = 1
    basePointsPerSecond.value = 0
    clickMultiplier.value = 1
    allMultiplier.value = 1
    doubleChance.value = 0
    aufDuration.value = 10
    upgrades.value.forEach((upgrade) => {
      const level = levels.get(upgrade.id) ?? 0
      upgrade.level = level
      for (let idx = 0; idx < level; idx += 1) {
        applyUpgradeEffect(upgrade)
      }
    })
  } catch (error) {
    localStorage.removeItem('wolfClickerState')
  }
}

let tickTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  loadState()
  tickTimer = window.setInterval(() => {
    if (totalPpsValue.value > 0) {
      points.value += totalPpsValue.value
      syncBestScore()
    }
    if (aufCooldown.value > 0) {
      aufCooldown.value = Math.max(0, aufCooldown.value - 1)
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (tickTimer) window.clearInterval(tickTimer)
})

watch(
  () => [points.value, basePointsPerClick.value, basePointsPerSecond.value, bestScore.value],
  saveState
)

watch(
  upgrades,
  () => {
    saveState()
  },
  { deep: true }
)

const faqItems = [
  {
    q: 'Что даёт прокачка?',
    a: 'Апгрейды усиливают клики, пассивный доход и повышают общий множитель.'
  },
  {
    q: 'Сохраняется ли прогресс?',
    a: 'Да, все очки и улучшения сохраняются в localStorage браузера.'
  },
  {
    q: 'Можно ли играть с телефона?',
    a: 'Да, игра адаптирована под мобилу, достаточно тапать по волку.'
  },
  {
    q: 'Что такое режим Ауф?',
    a: 'Это временный x3 ко всем доходам на 10 секунд с кулдауном.'
  },
  {
    q: 'Есть ли конец игры?',
    a: 'Нет, цель - разогнать стаю и бить собственные рекорды.'
  },
  {
    q: 'Почему игра залипательная?',
    a: 'Рост очков, эффекты апгрейдов и режим АУФ постоянно подталкивают к новым целям.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games/wolf-clicker`)
const metaDescription = 'Волчий кликер, прокачай стаю, кликай, собирай очки и доминируй'

useSeoMeta(() => ({
  title: 'Волчий кликер онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Волчий кликер онлайн | Neural Wise Wolf',
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
      name: 'Волчий кликер',
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
        { '@type': 'ListItem', position: 3, name: 'Волчий кликер', item: canonicalUrl.value }
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
.wolf-clicker-page {
  min-height: 100vh;
  color: #e2e8f0;
}

.page-wrap {
  width: min(1100px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(16px, 3vw, 28px) 0 clamp(28px, 4vw, 48px);
  display: grid;
  gap: clamp(18px, 4vw, 32px);
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(32px, 6vw, 54px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
  color: #f8fafc;
}

.lead {
  margin: 0;
  max-width: 680px;
  color: #cbd5f5;
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #94a3b8;
}

.game-stack {
  display: grid;
  gap: 18px;
}

.game-panel {
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 58%),
    linear-gradient(150deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.92));
  padding: clamp(16px, 2.5vw, 22px);
  display: grid;
  gap: 18px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-main {
  display: grid;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #94a3b8;
  margin: 0;
}

.stat-value {
  font-size: clamp(32px, 6vw, 52px);
  font-weight: 800;
  color: #fbbf24;
  margin: 0;
}

.stat-sub {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
}

.stat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
}

.chip {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.6);
  padding: 6px 12px;
  color: #cbd5f5;
}

.clicker-zone {
  display: grid;
  gap: 12px;
  justify-items: center;
}

.wolf-button {
  position: relative;
  width: clamp(160px, 32vw, 220px);
  height: clamp(160px, 32vw, 220px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: radial-gradient(circle at top, rgba(148, 163, 184, 0.18), rgba(2, 6, 23, 0.96));
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.2s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
}

.wolf-button:hover {
  border-color: rgba(148, 163, 184, 0.6);
}

.wolf-button:active {
  transform: scale(0.96);
}

.wolf-button.pulse {
  animation: wolfPulse 0.2s ease;
}

.wolf-emoji {
  font-size: clamp(56px, 8vw, 84px);
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.5));
}

.click-gain {
  position: absolute;
  top: -10px;
  right: 20px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.9);
  color: #0f172a;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  padding: 6px 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.wolf-button:active .click-gain {
  opacity: 1;
}

.mini-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.mini-card {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
  padding: 10px;
  display: grid;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
}

.mini-card strong {
  font-size: 14px;
  color: #e2e8f0;
}

.auf-card {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.7);
  padding: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.auf-power {
  margin: 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: #fbbf24;
}

.btn {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  padding: 10px 18px;
  font-weight: 700;
  cursor: pointer;
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

.btn.auf {
  background: linear-gradient(130deg, rgba(251, 191, 36, 0.95), rgba(249, 115, 22, 0.9));
  border: none;
  color: #0f172a;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.btn.ghost {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 11px;
}

.upgrades,
.tips {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
  padding: 16px;
}

.upgrade-list {
  display: grid;
  gap: 12px;
  margin-top: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.upgrade-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.6);
  padding: 12px;
  display: grid;
  gap: 10px;
}

.upgrade-head {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.upgrade-head h3 {
  margin: 0;
  font-size: 16px;
  color: #f8fafc;
}

.upgrade-desc {
  margin: 6px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.upgrade-effect {
  margin: 6px 0 0;
  font-size: 12px;
  color: #fbbf24;
}

.level {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.7);
  padding: 4px 8px;
  font-size: 11px;
  color: #cbd5f5;
  white-space: nowrap;
}

.upgrade-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.price {
  margin: 0;
  font-size: 13px;
  color: #e2e8f0;
}

.tips ul {
  margin: 12px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #cbd5f5;
  font-size: 13px;
}

.seo-block {
  display: grid;
  gap: 16px;
}

.seo-card,
.faq-card {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.55);
  padding: clamp(18px, 3vw, 26px);
  display: grid;
  gap: 12px;
}

.seo-card h2,
.faq-card h2 {
  margin: 0;
  color: #f8fafc;
}

.seo-card p {
  margin: 0;
  color: #cbd5f5;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.6);
  padding: 12px 14px;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 700;
  color: #e2e8f0;
}

.faq-item p {
  margin: 8px 0 0;
  color: #cbd5f5;
  font-size: 14px;
}

.auf-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: radial-gradient(circle at top, rgba(249, 115, 22, 0.22), transparent 60%);
  mix-blend-mode: screen;
  animation: aufGlow 1.2s ease-in-out infinite;
}

@media (min-width: 1100px) {
  .upgrade-list {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }
}

@keyframes aufGlow {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.4;
  }
}

@keyframes wolfPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 960px) {
  .stats-row {
    justify-content: center;
    text-align: center;
  }

  .stat-chips {
    justify-content: center;
  }

  .auf-card {
    justify-content: center;
    text-align: center;
  }
}
</style>
