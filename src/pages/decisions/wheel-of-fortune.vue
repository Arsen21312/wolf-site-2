<template>
  <main class="wheel-page">
    <header class="wheel-hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Колесо фортуны онлайн</h1>
      <p class="lead">Крути колесо и пусть случай решит за тебя</p>
    </header>

    <section class="wheel-card">
      <div class="wheel-layout">
        <div class="options-panel">
          <div class="panel-head">
            <div>
              <h2>Варианты</h2>
              <p>По одному варианту на строку. Колесо автоматически обновится.</p>
            </div>
          </div>
          <textarea
            v-model="optionsInput"
            class="options-area"
            rows="8"
            placeholder="Пицца&#10;Шаурма&#10;Домой&#10;Бар"
          ></textarea>
          <div class="options-meta">
            <span>Вариантов: {{ optionCount }}</span>
            <button class="btn ghost" type="button" :disabled="!optionsInput" @click="clearOptions">
              Очистить
            </button>
          </div>
          <div class="option-actions">
            <button class="btn ghost" type="button" :disabled="optionCount < 2" @click="shuffleOptions">
              Перемешать варианты
            </button>
            <label class="toggle">
              <input v-model="removeAfterWin" type="checkbox" />
              <span class="toggle-ui" aria-hidden="true"></span>
              <span>Удалить выбранный вариант после выигрыша</span>
            </label>
            <label class="toggle">
              <input v-model="soundEnabled" type="checkbox" />
              <span class="toggle-ui" aria-hidden="true"></span>
              <span>Звук клика</span>
            </label>
          </div>
        </div>

        <div class="wheel-panel">
          <div class="wheel-shell" ref="wheelContainer">
            <div class="wheel-pointer" aria-hidden="true"></div>
            <div class="wheel-rotator" :style="wheelStyle">
              <canvas ref="wheelCanvas"></canvas>
            </div>
          </div>
          <button
            class="btn primary spin-btn"
            type="button"
            :disabled="isSpinning || optionCount === 0"
            @click="spinWheel"
          >
            {{ isSpinning ? 'Крутим...' : 'Крутить колесо' }}
          </button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-if="resultText" class="result-card" role="status" aria-live="polite">
        <div>
          <p class="result-label">Выпало:</p>
          <p class="result-value">{{ resultText }}</p>
        </div>
        <div class="result-actions">
          <button class="btn primary" type="button" @click="spinWheel">Крутить снова</button>
          <button
            v-if="removeAfterWin"
            class="btn ghost"
            type="button"
            @click="removeSelectedOption"
          >
            Убрать этот вариант
          </button>
        </div>
      </div>
    </section>

    <section class="history-card">
      <div class="history-head">
        <h2>История</h2>
        <button class="btn ghost" type="button" :disabled="history.length === 0" @click="clearHistory">
          Очистить историю
        </button>
      </div>
      <div class="history-list">
        <p v-if="history.length === 0" class="history-empty">История пока пустая.</p>
        <ul v-else>
          <li v-for="(item, index) in history" :key="`${item}-${index}`">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Что такое колесо фортуны</h2>
        <p>
          Колесо фортуны — это визуальный инструмент для случайного выбора. Ты задаешь
          варианты, крутишь колесо и получаешь результат без споров и давления.
        </p>

        <h2>Когда удобно использовать колесо решений</h2>
        <p>
          Колесо подходит для стримов, игр, мозговых штурмов, споров в компании и
          быстрых бизнес-решений вроде «какой бонус дать» или «какую задачу взять».
        </p>

        <h2>Честный случайный выбор</h2>
        <p>
          Выбор делается с помощью crypto.getRandomValues, а вращение — только
          визуальный эффект. Это исключает предсказуемость и делает результат честным.
        </p>

        <h2>Колесо для стримов и компаний</h2>
        <p>
          На трансляциях и в компании колесо добавляет азарт: зрители видят варианты,
          слышат клик и ждут финального сектора. Это работает лучше обычного списка.
        </p>

        <h2>Как правильно задавать варианты</h2>
        <p>
          Делай варианты короткими и понятными, добавляй 4–12 пунктов, а длинные
          формулировки лучше разбивать на две строки или сокращать.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие решения</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/decisions/randomizer">
            <span class="other-title">Случайный выбор</span>
            <span class="other-desc">Быстрый выбор из списка, числа или да/нет.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/coin-flip">
            <span class="other-title">Монетка</span>
            <span class="other-desc">Честная монетка для быстрых решений.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/randomizer">
            <span class="other-title">Да или нет</span>
            <span class="other-desc">Решение на один клик, когда нужен короткий ответ.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/password-generator">
            <span class="other-title">Генератор паролей</span>
            <span class="other-desc">Создавай надежные пароли и копируй их за секунду.</span>
          </NuxtLink>
        </div>
      </div>

      <div class="faq-card">
        <h2>FAQ</h2>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.q"
            class="faq-item"
            :class="{ open: openFaq === idx }"
          >
            <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="icon">{{ openFaq === idx ? '-' : '+' }}</span>
            </button>
            <div class="faq-body">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { calculateSpin, getRandomInt, shuffleList } from '@/utils/decisions/wheel'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Решения', to: '/decisions' },
  { label: 'Колесо фортуны' }
]

const optionsInput = ref('')
const removeAfterWin = ref(false)
const soundEnabled = ref(true)
const errorMessage = ref('')
const resultText = ref('')
const selectedIndex = ref<number | null>(null)
const history = ref<string[]>([])

const wheelCanvas = ref<HTMLCanvasElement | null>(null)
const wheelContainer = ref<HTMLDivElement | null>(null)
const wheelSize = ref(360)
const rotation = ref(0)
const isSpinning = ref(false)
const spinDuration = ref(4200)
const spinTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)
const lastSpinOptions = ref<string[]>([])

const options = computed(() =>
  optionsInput.value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
)
const optionCount = computed(() => options.value.length)

const wheelStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg)`,
  transition: isSpinning.value
    ? `transform ${spinDuration.value}ms cubic-bezier(0.12, 0.62, 0.12, 1)`
    : 'none'
}))

const faqItems = [
  {
    q: 'Колесо реально случайное?',
    a: 'Да. Выбор делается через crypto.getRandomValues, а вращение влияет только на визуал.'
  },
  {
    q: 'Можно ли убрать вариант после выпадения?',
    a: 'Да, включи чекбокс и нажми кнопку «Убрать этот вариант» после результата.'
  },
  {
    q: 'Сколько вариантов можно добавить?',
    a: 'Рекомендуем 4–16 вариантов. Чем больше, тем мельче текст и меньше читаемость.'
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Да, интерфейс адаптивный и колесо подстраивается под ширину экрана.'
  },
  {
    q: 'Можно ли сохранить варианты?',
    a: 'Пока нет. Можно скопировать список и вставить позже.'
  },
  {
    q: 'Используется ли сервер?',
    a: 'Нет, все работает локально в браузере.'
  }
]

const openFaq = ref<number | null>(null)

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

function clearOptions() {
  optionsInput.value = ''
}

function updateWheelSize() {
  if (!wheelContainer.value) return
  const width = wheelContainer.value.clientWidth
  wheelSize.value = Math.max(240, Math.min(width, 460))
  drawWheel()
}

function buildColors(count: number) {
  return Array.from({ length: count }, (_, idx) => {
    const hue = (idx * (360 / count) + 18) % 360
    const lightness = idx % 2 === 0 ? 58 : 44
    const fill = `hsl(${hue} 70% ${lightness}%)`
    const text = lightness > 52 ? '#0f172a' : '#f8fafc'
    return { fill, text }
  })
}

function drawWheel() {
  const canvas = wheelCanvas.value
  if (!canvas) return
  const size = wheelSize.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const ratio = window.devicePixelRatio || 1
  canvas.width = size * ratio
  canvas.height = size * ratio
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.clearRect(0, 0, size, size)
  const radius = size / 2
  ctx.translate(radius, radius)

  if (optionCount.value === 0) {
    ctx.beginPath()
    ctx.arc(0, 0, radius - 6, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.setLineDash([6, 6])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#94a3b8'
    ctx.font = "600 14px 'Manrope', sans-serif"
    ctx.textAlign = 'center'
    ctx.fillText('Добавь варианты', 0, 6)
    ctx.resetTransform()
    return
  }

  const sectorAngle = (Math.PI * 2) / optionCount.value
  const colors = buildColors(optionCount.value)
  const startAngle = -Math.PI / 2

  options.value.forEach((label, index) => {
    const start = startAngle + index * sectorAngle
    const end = start + sectorAngle
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, radius - 4, start, end)
    ctx.closePath()
    ctx.fillStyle = colors[index].fill
    ctx.fill()

    ctx.save()
    const centerAngle = start + sectorAngle / 2
    ctx.rotate(centerAngle)
    const maxLabel = label.length > 28 ? `${label.slice(0, 26)}…` : label
    const fontSize = Math.max(12, Math.min(20, 240 / Math.max(maxLabel.length, 6)))
    ctx.font = `700 ${fontSize}px 'Manrope', sans-serif`
    ctx.fillStyle = colors[index].text
    ctx.textAlign = 'right'
    ctx.fillText(maxLabel, radius - 16, fontSize / 3)
    ctx.restore()
  })

  ctx.beginPath()
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.resetTransform()
}

function playClick() {
  if (!soundEnabled.value) return
  if (typeof window === 'undefined') return
  const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContext) return
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'square'
  oscillator.frequency.value = 720
  gain.gain.value = 0.08
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08)
  oscillator.stop(context.currentTime + 0.09)
  oscillator.onended = () => {
    context.close()
  }
}

function spinWheel() {
  if (isSpinning.value) return
  errorMessage.value = ''
  resultText.value = ''

  const count = optionCount.value
  if (count === 0) {
    errorMessage.value = 'Добавьте хотя бы один вариант.'
    return
  }

  let targetIndex = 0
  let spins = 3
  try {
    targetIndex = getRandomInt(count)
    spins = 3 + getRandomInt(4)
  } catch (error) {
    errorMessage.value = 'Ваш браузер не поддерживает crypto.getRandomValues.'
    return
  }

  const spinResult = calculateSpin(rotation.value, count, spins, targetIndex)
  spinDuration.value = 3600 + spins * 420
  rotation.value = spinResult.nextRotation
  isSpinning.value = true
  selectedIndex.value = targetIndex
  lastSpinOptions.value = options.value.slice()
  playClick()

  if (spinTimer.value) clearTimeout(spinTimer.value)
  spinTimer.value = setTimeout(() => {
    const finalValue = lastSpinOptions.value[targetIndex] || options.value[targetIndex] || ''
    resultText.value = finalValue
    if (finalValue) {
      history.value = [finalValue, ...history.value].slice(0, 5)
    }
    isSpinning.value = false
    playClick()
  }, spinDuration.value)
}

function shuffleOptions() {
  if (optionCount.value < 2) return
  let shuffled: string[] = []
  try {
    shuffled = shuffleList(options.value)
  } catch (error) {
    errorMessage.value = 'Не удалось перемешать варианты.'
    return
  }
  optionsInput.value = shuffled.join('\n')
}

function removeSelectedOption() {
  if (selectedIndex.value === null || !resultText.value) return
  const current = options.value.slice()
  const index = current.findIndex((item) => item === resultText.value)
  if (index === -1) return
  current.splice(index, 1)
  optionsInput.value = current.join('\n')
}

function clearHistory() {
  history.value = []
}

watch([optionsInput, optionCount], () => {
  drawWheel()
})

onMounted(() => {
  if (typeof window === 'undefined') return
  updateWheelSize()
  resizeObserver.value = new ResizeObserver(() => {
    updateWheelSize()
  })
  if (wheelContainer.value) {
    resizeObserver.value.observe(wheelContainer.value)
  }
})

onBeforeUnmount(() => {
  if (spinTimer.value) clearTimeout(spinTimer.value)
  if (resizeObserver.value) resizeObserver.value.disconnect()
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/wheel-of-fortune`)
const metaDescription =
  'Онлайн колесо фортуны для случайного выбора. Добавь варианты и крути колесо бесплатно.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Колесо фортуны онлайн',
      applicationCategory: 'UtilityApplication',
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
        { '@type': 'ListItem', position: 2, name: 'Решения', item: `${requestUrl.origin}/decisions` },
        { '@type': 'ListItem', position: 3, name: 'Колесо фортуны', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Колесо фортуны онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Колесо фортуны онлайн | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))
</script>

<style scoped>
.wheel-page {
  display: grid;
  gap: clamp(24px, 3vw, 40px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(32px, 4vw, 64px);
}

.wheel-hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.wheel-hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.wheel-hero .lead {
  margin: 0;
  color: #cbd5e1;
  max-width: 720px;
}

.wheel-card,
.history-card,
.seo-card,
.other-card,
.faq-card {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.wheel-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.18), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.wheel-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.panel-head h2 {
  margin: 0 0 6px;
}

.panel-head p {
  margin: 0;
  color: #94a3b8;
}

.options-panel {
  display: grid;
  gap: 12px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
}

.options-area {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  color: #e2e8f0;
  padding: 12px 14px;
  resize: vertical;
  min-height: 220px;
  font-size: 15px;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.options-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 13px;
  gap: 12px;
}

.option-actions {
  display: grid;
  gap: 10px;
}

.wheel-panel {
  display: grid;
  gap: 16px;
  justify-items: center;
  width: 100%;
}

.wheel-shell {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  position: relative;
}

.wheel-rotator {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.wheel-pointer {
  position: absolute;
  top: -6px;
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 26px solid #fbbf24;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35));
  z-index: 2;
  transform: rotate(180deg);
}

.spin-btn {
  width: min(320px, 100%);
}

.result-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px;
  flex-wrap: wrap;
}

.result-label {
  margin: 0 0 4px;
  color: #94a3b8;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.result-value {
  margin: 0;
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 800;
  color: #fbbf24;
}

.result-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.history-card {
  display: grid;
  gap: 12px;
}

.history-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.history-head h2 {
  margin: 0;
}

.history-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.history-list li {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
}

.history-empty {
  margin: 0;
  color: #94a3b8;
}

.seo-text h2 {
  margin: 0 0 8px;
}

.seo-text p {
  margin: 0 0 14px;
  color: #cbd5e1;
}

.extras {
  display: grid;
  gap: clamp(16px, 3vw, 24px);
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.other-link {
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  padding: 14px;
  display: grid;
  gap: 6px;
  transition: transform 0.12s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.other-link:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.5);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.4);
}

.other-title {
  font-weight: 800;
}

.other-desc {
  color: #94a3b8;
  font-size: 13px;
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
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e5e7eb;
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
  max-height: 220px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: #e2e8f0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
}

.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle-ui {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  position: relative;
  transition: background 0.2s ease;
}

.toggle-ui::after {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: transform 0.2s ease;
}

.toggle input:checked + .toggle-ui {
  background: rgba(34, 197, 94, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
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
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(34, 197, 94, 0.85), rgba(251, 191, 36, 0.9));
  border: none;
  color: #0f172a;
}

.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

@media (max-width: 900px) {
  .wheel-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 520px) {
  .wheel-shell {
    max-width: 320px;
  }
}
</style>
