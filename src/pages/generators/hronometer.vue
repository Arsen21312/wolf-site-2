<template>
  <main class="chrono-page">
    <div class="ambient" aria-hidden="true">
      <span class="orb orb-cyan"></span>
      <span class="orb orb-violet"></span>
      <span class="orb orb-blue"></span>
    </div>

    <header class="hero">
      <Breadcrumbs :items="breadcrumbs" />
      <div class="hero-icon">
        <span class="hero-icon-inner">
          <svg class="hero-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M12 9.5v4.5l2.5 1.5" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M9 3h6" fill="none" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </span>
      </div>
      <h1>Хронометр текста</h1>
      <p class="lead">
        Считай время чтения и набора текста, запускай хронометр и контролируй темп. Все работает
        прямо в браузере, без регистрации.
      </p>
    </header>

    <section class="tool-card">
      <div class="input-block">
        <label class="input-label" for="chrono-text">Текст для замера</label>
        <textarea
          id="chrono-text"
          v-model="text"
          class="chrono-textarea"
          rows="8"
          placeholder="Вставь текст сюда, чтобы посчитать время и запустить хронометр."
          :disabled="isTimerActive"
        ></textarea>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <div class="stat-value">{{ charCount }}</div>
          <div class="stat-label">символов</div>
        </article>
        <article class="stat-card accent-purple">
          <div class="stat-value">{{ wordCount }}</div>
          <div class="stat-label">слов</div>
        </article>
        <article class="stat-card accent-blue">
          <div class="stat-value">{{ readingTimeMinutes.toFixed(1) }}</div>
          <div class="stat-label">мин чтения</div>
        </article>
        <article class="stat-card accent-violet">
          <div class="stat-value">{{ typingTimeMinutes.toFixed(1) }}</div>
          <div class="stat-label">мин набора</div>
        </article>
      </div>

      <div v-if="!isTimerActive && elapsedTime === 0" class="start-row">
        <button class="btn primary" type="button" :disabled="!textTrimmed" @click="startTimer('read')">
          <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="8,5 20,12 8,19" fill="currentColor" />
          </svg>
          Запустить чтение
        </button>
        <button class="btn secondary" type="button" :disabled="!textTrimmed" @click="startTimer('type')">
          <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="8,5 20,12 8,19" fill="currentColor" />
          </svg>
          Запустить набор
        </button>
      </div>

      <div v-else class="timer-panel">
        <div class="timer-head">
          <div class="timer-value">{{ formattedTime }}</div>
          <p class="timer-status">
            {{ timerStatus }}
          </p>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="timer-actions">
          <button class="btn ghost" type="button" @click="toggleTimer">
            <svg v-if="isTimerActive" class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" fill="currentColor" />
            </svg>
            <svg v-else class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <polygon points="8,5 20,12 8,19" fill="currentColor" />
            </svg>
            {{ isTimerActive ? 'Пауза' : 'Продолжить' }}
          </button>
          <button class="btn ghost" type="button" @click="resetTimer">
            <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 12a8 8 0 1 0 3-6.3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path d="M4 5v5h5" fill="none" stroke="currentColor" stroke-width="1.8" />
            </svg>
            Сбросить
          </button>
        </div>
      </div>
    </section>

    <section class="hint-card">
      <div>
        <h2>Как работает хронометр</h2>
        <p>
          Мы используем среднюю скорость чтения 225 слов в минуту и скорость набора 40 слов в минуту.
          Хронометр помогает удерживать ритм: запускай таймер, сравнивай свой темп с расчетным и
          планируй время на текст заранее.
        </p>
      </div>
      <div class="hint-list">
        <div class="hint-item">
          <span class="hint-title">Чтение</span>
          <span class="hint-value">225 слов/мин</span>
        </div>
        <div class="hint-item">
          <span class="hint-title">Набор</span>
          <span class="hint-value">40 слов/мин</span>
        </div>
        <div class="hint-item">
          <span class="hint-title">Прогресс</span>
          <span class="hint-value">считается по времени</span>
        </div>
      </div>
    </section>

    <section class="seo-section">
      <article class="seo-card">
        <h2>Хронометр текста онлайн для чтения и набора</h2>
        <p>
          Если нужно быстро понять, сколько времени уйдет на доклад, статью или пост, просто вставь
          текст в поле выше. Мы покажем количество слов и ориентировочное время чтения или набора,
          а встроенный таймер поможет держать темп.
        </p>
      </article>
      <article class="seo-card">
        <h3>Когда особенно полезно</h3>
        <ul>
          <li>планирование презентаций, речей и подкастов</li>
          <li>оценка тайминга лекций и вебинаров</li>
          <li>подготовка текста для сторис и видео</li>
          <li>контроль скорости набора и работы редактора</li>
        </ul>
      </article>
      <article class="seo-card">
        <h3>Советы по использованию</h3>
        <ol>
          <li>Вставь текст и выбери режим: чтение или набор.</li>
          <li>Запусти хронометр и следи за прогрессом.</li>
          <li>Пауза и сброс доступны в один клик.</li>
        </ol>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type ChronoMode = 'read' | 'type'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Хронометр текста' }
]

const text = ref('')
const isTimerActive = ref(false)
const elapsedTime = ref(0)
const mode = ref<ChronoMode>('read')
let timerId: ReturnType<typeof setInterval> | null = null

const textTrimmed = computed(() => text.value.trim().length > 0)
const charCount = computed(() => text.value.length)
const wordCount = computed(() => (text.value.trim() === '' ? 0 : text.value.trim().split(/\s+/).length))
const readingTimeMinutes = computed(() => wordCount.value / 225)
const typingTimeMinutes = computed(() => wordCount.value / 40)

const formattedTime = computed(() => {
  const mins = Math.floor(elapsedTime.value / 60)
  const secs = elapsedTime.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const estimatedTime = computed(() =>
  mode.value === 'read' ? readingTimeMinutes.value * 60 : typingTimeMinutes.value * 60
)
const progress = computed(() => (estimatedTime.value > 0 ? Math.min((elapsedTime.value / estimatedTime.value) * 100, 100) : 0))

const timerStatus = computed(() => {
  if (isTimerActive.value) {
    return mode.value === 'read' ? 'Идет чтение текста' : 'Идет набор текста'
  }
  return 'Пауза'
})

const startTimer = (selectedMode: ChronoMode) => {
  if (!textTrimmed.value) return
  mode.value = selectedMode
  elapsedTime.value = 0
  isTimerActive.value = true
}

const toggleTimer = () => {
  isTimerActive.value = !isTimerActive.value
}

const resetTimer = () => {
  isTimerActive.value = false
  elapsedTime.value = 0
}

watch(
  isTimerActive,
  (active) => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
    if (active) {
      timerId = setInterval(() => {
        elapsedTime.value += 1
      }, 1000)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/hronometer`)
const ogImageUrl = computed(() => `${requestUrl.origin}/favicon.png`)
const metaDescription =
  'Хронометр текста онлайн: считает слова и символы, оценивает время чтения и набора, помогает держать темп с таймером.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Хронометр текста онлайн',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: `${requestUrl.origin}/generators` },
        { '@type': 'ListItem', position: 3, name: 'Хронометр текста', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta({
  title: 'Хронометр текста онлайн - время чтения и набора | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Хронометр текста онлайн - время чтения и набора | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogType: 'website',
  twitterTitle: 'Хронометр текста онлайн - время чтения и набора | Neural Wise Wolf',
  twitterDescription: metaDescription,
  twitterImage: ogImageUrl,
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
})

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
.chrono-page {
  position: relative;
  display: grid;
  gap: clamp(24px, 4vw, 40px);
  width: min(1100px, 100% - 48px);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 36px) 0 clamp(36px, 5vw, 64px);
  color: #e2e8f0;
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  filter: blur(0px);
  opacity: 0.45;
  animation: float 12s ease-in-out infinite;
}

.orb-cyan {
  top: -120px;
  left: -120px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.25), rgba(34, 211, 238, 0.02));
}

.orb-violet {
  right: -160px;
  top: 160px;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.25), rgba(129, 140, 248, 0.03));
  animation-delay: 1.8s;
}

.orb-blue {
  left: 25%;
  bottom: -180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.02));
  animation-delay: 3s;
}

.hero,
.tool-card,
.hint-card,
.seo-section {
  position: relative;
  z-index: 1;
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero-icon-inner {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(150deg, rgba(34, 211, 238, 0.18), rgba(139, 92, 246, 0.14));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.45);
}

.hero-icon-svg {
  width: 30px;
  height: 30px;
  color: #67e8f9;
}

.hero h1 {
  margin: 0;
  font-size: clamp(32px, 6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.lead {
  margin: 0;
  max-width: 720px;
  color: #cbd5e1;
  font-size: 16px;
}

.tool-card,
.hint-card,
.seo-card {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.05), rgba(15, 23, 42, 0.7));
  padding: clamp(18px, 3vw, 28px);
  display: grid;
  gap: 18px;
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.35);
}

.input-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(148, 163, 184, 0.8);
}

.chrono-textarea {
  margin-top: 8px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 6, 23, 0.65);
  color: #e2e8f0;
  padding: 14px 16px;
  font-size: 15px;
  resize: vertical;
  min-height: 180px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chrono-textarea:focus {
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.chrono-textarea:disabled {
  opacity: 0.6;
}

.stats-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.stat-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
  padding: 14px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #e0f2fe;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(148, 163, 184, 0.8);
}

.accent-purple .stat-value {
  color: #c4b5fd;
}

.accent-blue .stat-value {
  color: #7dd3fc;
}

.accent-violet .stat-value {
  color: #a78bfa;
}

.start-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.btn {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.5);
}

.btn.primary {
  background: linear-gradient(140deg, rgba(34, 211, 238, 0.9), rgba(59, 130, 246, 0.9));
  border: none;
  color: #0f172a;
}

.btn.secondary {
  background: linear-gradient(140deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.8));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.45);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.timer-panel {
  display: grid;
  gap: 16px;
}

.timer-head {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.timer-value {
  font-size: clamp(40px, 6vw, 64px);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 700;
  background: linear-gradient(120deg, #67e8f9, #93c5fd, #a78bfa);
  -webkit-background-clip: text;
  color: transparent;
}

.timer-status {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, rgba(34, 211, 238, 0.9), rgba(139, 92, 246, 0.9));
  transition: width 0.3s ease;
}

.timer-actions {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.hint-card {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.hint-card h2 {
  margin: 0 0 8px;
}

.hint-card p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.7;
}

.hint-list {
  display: grid;
  gap: 10px;
}

.hint-item {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.55);
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(148, 163, 184, 0.8);
}

.hint-value {
  color: #e2e8f0;
  font-weight: 700;
}

.seo-section {
  display: grid;
  gap: 18px;
}

.seo-card h2,
.seo-card h3 {
  margin: 0 0 8px;
}

.seo-card p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.7;
}

.seo-card ul,
.seo-card ol {
  margin: 0;
  padding-left: 20px;
  color: #cbd5e1;
  display: grid;
  gap: 6px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-16px);
  }
}

@media (max-width: 620px) {
  .chrono-page {
    width: min(1100px, 100% - 32px);
  }
}
</style>
