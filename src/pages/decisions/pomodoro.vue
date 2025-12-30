<template>
  <main class="pomodoro-page" :class="{ mini: miniMode }">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Таймер Помидора онлайн</h1>
      <p class="lead">
        Работай короткими рывками, отдыхай по делу, и день будет легче
      </p>
    </header>

    <section class="timer-card">
      <div class="timer-top">
        <span class="phase-badge" :class="phaseClass">{{ phaseLabel }}</span>
        <div class="timer-actions">
          <button class="btn ghost small" type="button" @click="toggleMini">
            {{ miniMode ? 'Обычный режим' : 'Мини режим' }}
          </button>
          <button class="btn ghost small" type="button" @click="toggleFullscreen">
            {{ fullscreenLabel }}
          </button>
        </div>
      </div>

      <div class="timer-body">
        <div class="timer-ring" :style="ringStyle">
          <span class="time-value">{{ formattedTime }}</span>
          <span class="time-caption">{{ phaseLabel }}</span>
        </div>

        <div class="status-row">
          <div class="status-item">
            <span class="status-label">Статус</span>
            <span class="status-value">{{ phaseLabel }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Цикл</span>
            <span class="status-value">{{ timer.completedPomodoros }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Сегодня</span>
            <span class="status-value">{{ todayPomodoros }}</span>
          </div>
        </div>

        <div class="progress-line">
          <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="timer.isRunning" @click="startTimer">
          Старт
        </button>
        <button class="btn ghost" type="button" :disabled="!timer.isRunning" @click="pauseTimer">
          Пауза
        </button>
        <button class="btn ghost" type="button" @click="resetTimer">
          Сброс
        </button>
        <button class="btn ghost" type="button" @click="skipPhase">
          Пропустить фазу
        </button>
      </div>

      <div class="action-row secondary">
        <button class="btn ghost" type="button" @click="copyPlan">
          {{ copyPlanLabel }}
        </button>
        <button class="btn ghost" type="button" @click="requestNotifications">
          {{ notificationButtonLabel }}
        </button>
      </div>
    </section>

    <section v-if="!miniMode" class="settings-card">
      <div class="card-head">
        <div>
          <h2>Настройки таймера</h2>
          <p>Подбери длительности под себя и сохрани свой ритм.</p>
        </div>
        <div class="preset-row">
          <button class="btn ghost" type="button" @click="applyPreset('classic')">Классика 25/5</button>
          <button class="btn ghost" type="button" @click="applyPreset('light')">Лёгкий 20/5</button>
          <button class="btn ghost" type="button" @click="applyPreset('hard')">Жёсткий фокус 50/10</button>
          <button class="btn ghost" type="button" @click="applyPreset('study')">Учёба 30/5, длинный 20</button>
        </div>
      </div>

      <div class="settings-grid">
        <label class="field">
          Работа, минут
          <div class="range-row">
            <input v-model.number="settings.workMinutes" type="range" min="10" max="60" />
            <input v-model.number="settings.workMinutes" type="number" min="10" max="60" />
          </div>
        </label>
        <label class="field">
          Короткий перерыв, минут
          <div class="range-row">
            <input v-model.number="settings.shortBreakMinutes" type="range" min="3" max="20" />
            <input v-model.number="settings.shortBreakMinutes" type="number" min="3" max="20" />
          </div>
        </label>
        <label class="field">
          Длинный перерыв, минут
          <div class="range-row">
            <input v-model.number="settings.longBreakMinutes" type="range" min="10" max="40" />
            <input v-model.number="settings.longBreakMinutes" type="number" min="10" max="40" />
          </div>
        </label>
        <label class="field">
          Длинный перерыв каждые N помидоров
          <div class="range-row">
            <input v-model.number="settings.longBreakEvery" type="range" min="2" max="8" />
            <input v-model.number="settings.longBreakEvery" type="number" min="2" max="8" />
          </div>
        </label>
      </div>

      <div class="toggle-grid">
        <label class="toggle">
          <input v-model="settings.autoStartNext" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Автостарт следующей фазы</span>
        </label>
        <label class="toggle">
          <input v-model="settings.soundEnabled" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Звук в конце фазы</span>
        </label>
        <label class="toggle">
          <input v-model="settings.notificationsEnabled" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Уведомления браузера</span>
        </label>
        <label class="toggle">
          <input v-model="settings.keepAwake" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Не гасить экран (если поддерживается)</span>
        </label>
      </div>
    </section>

    <section v-if="!miniMode" class="sessions-card">
      <div class="history-head">
        <div>
          <h2>Сессии</h2>
          <p>Последние 10 фаз: время, тип и длительность.</p>
        </div>
        <button class="btn ghost" type="button" :disabled="!history.length" @click="clearHistory">
          Очистить историю
        </button>
      </div>
      <ul v-if="history.length" class="history-list">
        <li v-for="item in history" :key="item.id">
          <span class="history-time">{{ formatSessionTime(item.endedAt) }}</span>
          <span class="history-label">{{ formatSessionLabel(item) }}</span>
          <span class="history-min">{{ item.minutes }} мин</span>
        </li>
      </ul>
      <p v-else class="hint">Пока пусто. Запусти первый помидор.</p>
    </section>

    <section v-if="!miniMode" class="seo-article">
      <div class="seo-card">
        <h2>Что такое метод Помидора</h2>
        <p>
          Метод Помидора — это простая техника фокусировки: работаешь короткими отрезками и
          отдыхаешь по таймеру. Такой ритм помогает держать концентрацию, не выгорать и
          реально видеть прогресс.
        </p>

        <h2>Почему 25 минут работают</h2>
        <p>
          25 минут достаточно, чтобы погрузиться в задачу, но мало, чтобы устать. Ты
          успеваешь войти в поток, а короткий перерыв сбрасывает напряжение и оставляет
          энергию на следующий цикл.
        </p>

        <h2>Как настроить Помодоро под себя</h2>
        <p>
          Подними длительность работы, если привычно держишь фокус 40–50 минут, или сделай
          короткие отрезки по 15–20 минут для сложных задач. Главное — держать баланс между
          усилием и восстановлением.
        </p>

        <h2>Помодоро для учёбы, работы, спорта</h2>
        <p>
          Для учёбы удобно чередовать чтение и конспекты, для работы — отдельные спринты на
          задачи, для спорта — интервалы активности и отдыха. Одна схема, разные сценарии.
        </p>

        <h2>Ошибки новичков и как не сгореть</h2>
        <p>
          Самая частая ошибка — игнорировать перерывы и пытаться «дожать». Это быстро
          снижает концентрацию. Делай паузы, слушай усталость и постепенно увеличивай
          длительность работы.
        </p>
      </div>
    </section>

    <section v-if="!miniMode" class="faq-card">
      <p class="seo-kicker">FAQ</p>
      <h2>Частые вопросы о Помодоро</h2>
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
    </section>

    <section v-if="!miniMode" class="other-decisions">
      <div class="other-card">
        <h2>Другие решения</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/decisions/random-date">
            <span class="other-title">Случайная дата</span>
            <span class="other-desc">Генератор дат для челленджей и планов.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/random-choice">
            <span class="other-title">Случайный выбор</span>
            <span class="other-desc">Выбери «да» или «нет», цифру или слово.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/wheel-of-fortune">
            <span class="other-title">Колесо фортуны</span>
            <span class="other-desc">Крути колесо и получай решение без споров.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/remove-spaces">
            <span class="other-title">Удалить пробелы</span>
            <span class="other-desc">Быстро очисти текст для отправки и обработки.</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import {
  DEFAULT_SETTINGS,
  getDefaultState,
  getPhaseDurationMs,
  loadHistory,
  loadSettings,
  loadState,
  saveHistory,
  saveSettings,
  saveState,
  type PomodoroPhase,
  type PomodoroSession,
  type PomodoroSettings,
  type PomodoroState
} from '@/utils/decisions/pomodoro/state'
import { formatTime } from '@/utils/decisions/pomodoro/timer'
import { playBeep } from '@/utils/decisions/pomodoro/sound'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Решения', to: '/decisions' },
  { label: 'Таймер Помидора' }
]

const phaseLabels: Record<PomodoroPhase, string> = {
  work: 'Работа',
  shortBreak: 'Перерыв',
  longBreak: 'Длинный перерыв'
}

const settings = reactive<PomodoroSettings>({ ...DEFAULT_SETTINGS })
const timer = reactive<PomodoroState>(getDefaultState(settings))
const history = ref<PomodoroSession[]>([])
const miniMode = ref(false)
const isFullscreen = ref(false)
const openFaq = ref<number | null>(null)
const copyPlanLabel = ref('Скопировать план')
const copyPlanTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const wakeLockRef = ref<{ release: () => Promise<void> } | null>(null)

const formattedTime = computed(() => formatTime(timer.remainingMs))
const phaseLabel = computed(() => phaseLabels[timer.phase])
const phaseClass = computed(() => `phase-${timer.phase}`)
const progress = computed(() => {
  if (!timer.activeDurationMs) return 0
  const value = (timer.activeDurationMs - timer.remainingMs) / timer.activeDurationMs
  return Math.min(1, Math.max(0, value))
})
const progressPercent = computed(() => Math.round(progress.value * 100))
const ringStyle = computed(() => ({
  '--progress': `${progressPercent.value}%`,
  '--ring-color': phaseColor.value
}))

const phaseColor = computed(() => {
  if (timer.phase === 'shortBreak') return '#22c55e'
  if (timer.phase === 'longBreak') return '#38bdf8'
  return '#f59e0b'
})

const planText = computed(
  () => `${settings.workMinutes}/${settings.shortBreakMinutes} x${settings.longBreakEvery}, длинный ${settings.longBreakMinutes}`
)

const todayPomodoros = computed(() => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  return history.value.filter(
    (item) => item.phase === 'work' && item.endedAt >= startOfDay.getTime()
  ).length
})

const fullscreenLabel = computed(() => (isFullscreen.value ? 'Выйти из полноэкранного' : 'Полноэкранный режим'))

const faqItems = [
  {
    q: 'Можно ли менять 25/5?',
    a: 'Да, таймер полностью настраивается: работа от 10 до 60 минут, перерывы — от 3 до 40.'
  },
  {
    q: 'Нужны ли длинные перерывы?',
    a: 'Да, они помогают восстановиться после нескольких циклов и не выгореть в длинных сессиях.'
  },
  {
    q: 'Работает ли таймер в фоне?',
    a: 'Да, время считается по таймстампам, поэтому вкладка может быть свернута.'
  },
  {
    q: 'Сохраняется ли прогресс?',
    a: 'Да, состояние и история сохраняются в браузере и восстанавливаются после перезагрузки.'
  },
  {
    q: 'Можно ли без звука?',
    a: 'Да, отключи звук в настройках — таймер продолжит работать без сигналов.'
  },
  {
    q: 'Помодоро помогает при прокрастинации?',
    a: 'Да, короткие отрезки снижают порог входа и помогают начать работу без стресса.'
  }
]

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const clampSettings = () => {
  settings.workMinutes = Math.min(Math.max(settings.workMinutes || 25, 10), 60)
  settings.shortBreakMinutes = Math.min(Math.max(settings.shortBreakMinutes || 5, 3), 20)
  settings.longBreakMinutes = Math.min(Math.max(settings.longBreakMinutes || 15, 10), 40)
  settings.longBreakEvery = Math.min(Math.max(settings.longBreakEvery || 4, 2), 8)
}

const syncIdleDuration = () => {
  if (timer.isRunning) return
  if (timer.remainingMs !== timer.activeDurationMs) return
  const duration = getPhaseDurationMs(timer.phase, settings)
  timer.remainingMs = duration
  timer.activeDurationMs = duration
}

const updateDocumentTitle = () => {
  if (typeof document === 'undefined') return
  document.title = timer.isRunning ? `⏱ ${formattedTime.value} ${phaseLabel.value}` : DEFAULT_TITLE
}

const persistState = (force = false) => {
  if (typeof window === 'undefined') return
  const now = Date.now()
  if (!force && now - lastPersistAt < 1000) return
  lastPersistAt = now
  saveState({ ...timer })
}

const addSession = (phase: PomodoroPhase, durationMs: number, endedAt: number) => {
  const entry: PomodoroSession = {
    id: endedAt,
    phase,
    minutes: Math.round(durationMs / 60000),
    endedAt
  }
  history.value = [entry, ...history.value].slice(0, 10)
  saveHistory(history.value)
}

const notifyPhase = (nextPhase: PomodoroPhase) => {
  if (!settings.notificationsEnabled) return
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  const title = nextPhase === 'work' ? 'Пора в фокус' : 'Время отдыха'
  const body =
    nextPhase === 'work'
      ? 'Следующий рабочий спринт готов. Давай продолжим.'
      : 'Сделай паузу, растянись и перезагрузи голову.'
  try {
    new Notification(title, { body })
  } catch (error) {
    // Ignore notification errors.
  }
}

const completePhase = (record = true, endedAt = Date.now()) => {
  if (isCompleting) return
  isCompleting = true
  const finishedPhase = timer.phase
  const durationMs = timer.activeDurationMs || getPhaseDurationMs(finishedPhase, settings)

  timer.isRunning = false
  timer.endAt = null
  timer.remainingMs = 0

  if (record) {
    addSession(finishedPhase, durationMs, endedAt)
  }

  if (finishedPhase === 'work' && record) {
    timer.completedPomodoros += 1
  }

  const shouldLongBreak =
    finishedPhase === 'work' && timer.completedPomodoros % settings.longBreakEvery === 0
  const nextPhase: PomodoroPhase =
    finishedPhase === 'work' ? (shouldLongBreak ? 'longBreak' : 'shortBreak') : 'work'

  timer.phase = nextPhase
  timer.activeDurationMs = getPhaseDurationMs(nextPhase, settings)
  timer.remainingMs = timer.activeDurationMs

  if (settings.soundEnabled) {
    playBeep()
  }
  notifyPhase(nextPhase)

  if (settings.autoStartNext) {
    startTimer()
  }

  persistState(true)
  updateDocumentTitle()
  isCompleting = false
}

const startTimer = () => {
  if (timer.isRunning) return
  const phaseDuration = timer.activeDurationMs || getPhaseDurationMs(timer.phase, settings)
  if (!timer.remainingMs) {
    timer.remainingMs = phaseDuration
  }
  if (timer.remainingMs > phaseDuration) {
    timer.remainingMs = phaseDuration
  }
  timer.activeDurationMs = phaseDuration
  timer.endAt = Date.now() + timer.remainingMs
  timer.isRunning = true
  persistState(true)
  updateDocumentTitle()
  ensureWakeLock()
}

const pauseTimer = () => {
  if (!timer.isRunning) return
  timer.remainingMs = Math.max(0, (timer.endAt ?? Date.now()) - Date.now())
  timer.endAt = null
  timer.isRunning = false
  persistState(true)
  updateDocumentTitle()
  releaseWakeLock()
}

const resetTimer = () => {
  timer.isRunning = false
  timer.endAt = null
  timer.remainingMs = getPhaseDurationMs(timer.phase, settings)
  timer.activeDurationMs = timer.remainingMs
  persistState(true)
  updateDocumentTitle()
  releaseWakeLock()
}

const skipPhase = () => {
  completePhase(false)
}

const applyPreset = (preset: string) => {
  if (preset === 'classic') {
    settings.workMinutes = 25
    settings.shortBreakMinutes = 5
    settings.longBreakMinutes = 15
    settings.longBreakEvery = 4
  } else if (preset === 'light') {
    settings.workMinutes = 20
    settings.shortBreakMinutes = 5
    settings.longBreakMinutes = 15
    settings.longBreakEvery = 4
  } else if (preset === 'hard') {
    settings.workMinutes = 50
    settings.shortBreakMinutes = 10
    settings.longBreakMinutes = 15
    settings.longBreakEvery = 4
  } else if (preset === 'study') {
    settings.workMinutes = 30
    settings.shortBreakMinutes = 5
    settings.longBreakMinutes = 20
    settings.longBreakEvery = 4
  }
  clampSettings()
  syncIdleDuration()
}

const requestNotifications = async () => {
  if (typeof Notification === 'undefined') return
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      settings.notificationsEnabled = false
    }
  } catch (error) {
    settings.notificationsEnabled = false
  }
}

const notificationButtonLabel = computed(() => {
  if (typeof Notification === 'undefined') return 'Уведомления недоступны'
  if (Notification.permission === 'granted') return 'Уведомления разрешены'
  if (Notification.permission === 'denied') return 'Уведомления заблокированы'
  return 'Разрешить уведомления'
})

const toggleMini = () => {
  miniMode.value = !miniMode.value
}

const toggleFullscreen = async () => {
  if (typeof document === 'undefined') return
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (error) {
    // Ignore fullscreen failures.
  }
}

const copyPlan = async () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(planText.value)
    copyPlanLabel.value = 'План скопирован'
  } catch (error) {
    copyPlanLabel.value = 'Не удалось скопировать'
  }
  if (copyPlanTimer.value) clearTimeout(copyPlanTimer.value)
  copyPlanTimer.value = setTimeout(() => {
    copyPlanLabel.value = 'Скопировать план'
  }, 2000)
}

const formatSessionTime = (value: number) =>
  new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const formatSessionLabel = (item: PomodoroSession) => `${phaseLabels[item.phase]}`

const clearHistory = () => {
  history.value = []
  saveHistory(history.value)
}

const ensureWakeLock = async () => {
  if (!settings.keepAwake) return
  if (typeof navigator === 'undefined') return
  if (!('wakeLock' in navigator)) return
  if (!timer.isRunning) return
  try {
    const wakeLockApi = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> }
    }
    if (!wakeLockApi.wakeLock) return
    wakeLockRef.value = await wakeLockApi.wakeLock.request('screen')
  } catch (error) {
    wakeLockRef.value = null
  }
}

const releaseWakeLock = () => {
  if (!wakeLockRef.value) return
  wakeLockRef.value.release().catch(() => null)
  wakeLockRef.value = null
}

let tickTimer: ReturnType<typeof setInterval> | null = null
let lastPersistAt = 0
let isCompleting = false
const DEFAULT_TITLE = 'Таймер Помидора онлайн | Neural Wise Wolf'

const startTicking = () => {
  if (tickTimer) return
  tickTimer = setInterval(() => {
    if (!timer.isRunning || !timer.endAt) return
    timer.remainingMs = Math.max(0, timer.endAt - Date.now())
    if (timer.remainingMs <= 0) {
      completePhase(true, timer.endAt)
      return
    }
    persistState()
    updateDocumentTitle()
  }, 250)
}

const stopTicking = () => {
  if (!tickTimer) return
  clearInterval(tickTimer)
  tickTimer = null
}

onMounted(() => {
  Object.assign(settings, loadSettings())
  Object.assign(timer, loadState(settings))
  history.value = loadHistory()

  if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
    settings.notificationsEnabled = false
  }

  if (timer.isRunning && !timer.endAt) {
    timer.isRunning = false
    timer.remainingMs = Math.max(0, timer.remainingMs)
  }

  if (timer.isRunning && timer.endAt) {
    const remaining = timer.endAt - Date.now()
    if (remaining <= 0) {
      completePhase(true, timer.endAt)
    } else {
      timer.remainingMs = remaining
    }
  }

  startTicking()
  updateDocumentTitle()

  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = Boolean(document.fullscreenElement)
    })
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') ensureWakeLock()
    })
  }
})

onBeforeUnmount(() => {
  stopTicking()
  releaseWakeLock()
  if (copyPlanTimer.value) clearTimeout(copyPlanTimer.value)
})

watch(
  settings,
  () => {
    clampSettings()
    saveSettings({ ...settings })
    syncIdleDuration()
    if (!settings.keepAwake) {
      releaseWakeLock()
    } else {
      ensureWakeLock()
    }
  },
  { deep: true }
)

watch(
  () => [timer.phase, timer.isRunning, timer.remainingMs],
  () => {
    updateDocumentTitle()
  }
)

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/pomodoro`)
const metaDescription =
  'Помодоро таймер 25/5 с настройками, уведомлениями, звуком и сохранением прогресса. Работай и отдыхай по циклам'

useSeoMeta(() => ({
  title: DEFAULT_TITLE,
  description: metaDescription,
  ogTitle: DEFAULT_TITLE,
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Таймер Помидора онлайн',
      applicationCategory: 'ProductivityApplication',
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
        { '@type': 'ListItem', position: 3, name: 'Таймер Помидора', item: canonicalUrl.value }
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
.pomodoro-page {
  --bg-card: rgba(15, 23, 42, 0.7);
  --border-soft: rgba(255, 255, 255, 0.08);
  --text-soft: #cbd5e1;
  --text-strong: #f8fafc;
  display: grid;
  gap: clamp(20px, 4vw, 36px);
  width: min(1160px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(36px, 5vw, 64px);
}

.pomodoro-page.mini .settings-card,
.pomodoro-page.mini .sessions-card,
.pomodoro-page.mini .seo-article,
.pomodoro-page.mini .faq-card,
.pomodoro-page.mini .other-decisions {
  display: none;
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(32px, 5.6vw, 52px);
  font-weight: 800;
  color: var(--text-strong);
}

.hero .lead {
  margin: 0;
  color: var(--text-soft);
  max-width: 680px;
}

.timer-card,
.settings-card,
.sessions-card,
.seo-card,
.faq-card,
.other-card {
  background: radial-gradient(circle at top, rgba(245, 158, 11, 0.08), transparent 55%),
    linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.75));
  border: 1px solid var(--border-soft);
  border-radius: 24px;
  padding: clamp(18px, 3vw, 28px);
  display: grid;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.timer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.phase-badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
}

.phase-work {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.phase-shortBreak {
  background: rgba(34, 197, 94, 0.18);
  color: #4ade80;
}

.phase-longBreak {
  background: rgba(56, 189, 248, 0.18);
  color: #7dd3fc;
}

.timer-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.timer-body {
  display: grid;
  gap: 16px;
  justify-items: center;
}

.timer-ring {
  width: clamp(200px, 40vw, 260px);
  height: clamp(200px, 40vw, 260px);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--ring-color) var(--progress), rgba(255, 255, 255, 0.08) 0);
  position: relative;
}

.timer-ring::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.time-value {
  font-size: clamp(36px, 8vw, 52px);
  font-weight: 800;
  color: var(--text-strong);
  z-index: 1;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
}

.time-caption {
  z-index: 1;
  color: var(--text-soft);
  margin-top: -4px;
  font-size: 14px;
}

.status-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  width: 100%;
}

.status-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 10px 12px;
  display: grid;
  gap: 4px;
}

.status-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.status-value {
  font-weight: 700;
  color: var(--text-strong);
  font-size: 16px;
}

.progress-line {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.9), rgba(34, 197, 94, 0.9));
  transition: width 0.2s ease;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (min-width: 641px) {
  .action-row {
    justify-content: center;
  }
}

.action-row.secondary {
  margin-top: 4px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-strong);
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn.small {
  padding: 8px 12px;
  font-size: 13px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(245, 158, 11, 0.9), rgba(34, 197, 94, 0.9));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.6);
}

.card-head {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.card-head h2 {
  margin: 0 0 4px;
}

.card-head p {
  margin: 0;
  color: var(--text-soft);
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
  color: var(--text-soft);
  font-size: 14px;
}

.range-row {
  display: grid;
  grid-template-columns: 1fr 72px;
  gap: 10px;
  align-items: center;
}

.range-row input[type='range'] {
  accent-color: #f59e0b;
}

.range-row input[type='number'] {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.8);
  color: var(--text-strong);
  padding: 6px 8px;
  text-align: center;
}

.toggle-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: var(--text-strong);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
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
  background: rgba(245, 158, 11, 0.8);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.sessions-card {
  display: grid;
  gap: 16px;
}

.history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.history-head h2 {
  margin: 0 0 4px;
}

.history-head p {
  margin: 0;
  color: var(--text-soft);
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.history-list li {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
}

.history-time {
  color: #94a3b8;
  font-size: 12px;
}

.history-label {
  color: var(--text-strong);
}

.history-min {
  color: #94a3b8;
  font-size: 12px;
}

.hint {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.seo-article {
  display: grid;
}

.seo-card h2 {
  margin: 0 0 6px;
}

.seo-card p {
  margin: 0 0 12px;
  color: var(--text-soft);
}

.faq-card {
  display: grid;
  gap: 12px;
}

.seo-kicker {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.faq-card h2 {
  margin: 0;
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
  border-color: rgba(245, 158, 11, 0.45);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-strong);
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
  max-height: 200px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: var(--text-soft);
}

.other-decisions {
  display: grid;
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

@media (max-width: 860px) {
  .history-list li {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .timer-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .timer-actions {
    width: 100%;
  }

  .range-row {
    grid-template-columns: 1fr 64px;
  }

  .preset-row {
    flex-direction: column;
    width: 100%;
  }
}
</style>
