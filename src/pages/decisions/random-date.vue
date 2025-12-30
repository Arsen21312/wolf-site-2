<template>
  <main class="random-date-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Случайная дата онлайн</h1>
      <p class="lead">
        Выбери диапазон и получи случайную дату, удобно для планов, челленджей и жеребьёвок
      </p>
    </header>

    <section class="tool-card">
      <div class="range-grid">
        <label class="field">
          Дата от
          <input v-model="startDate" type="date" />
        </label>
        <label class="field">
          Дата до
          <input v-model="endDate" type="date" />
        </label>
      </div>

      <div class="preset-row">
        <button class="btn ghost" type="button" @click="applyPreset('week')">Сегодня + 7 дней</button>
        <button class="btn ghost" type="button" @click="applyPreset('month')">Этот месяц</button>
        <button class="btn ghost" type="button" @click="applyPreset('next-month')">Следующий месяц</button>
        <button class="btn ghost" type="button" @click="applyPreset('year')">Этот год</button>
        <button class="btn ghost" type="button" @click="applyPreset('special-year')">
          Любая дата в {{ specialYearLabel }}
        </button>
      </div>

      <div class="settings">
        <p class="block-title">Настройки</p>
        <div class="toggle-grid">
          <label class="toggle">
            <input v-model="weekdaysOnly" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Только будни, пн–пт</span>
          </label>
          <label class="toggle">
            <input v-model="weekendsOnly" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Только выходные, сб–вс</span>
          </label>
          <label class="toggle">
            <input v-model="excludeToday" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Исключать сегодня</span>
          </label>
          <label class="toggle">
            <input v-model="excludeHolidays" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Исключить праздники</span>
          </label>
          <label class="toggle">
            <input v-model="addTime" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Добавить случайное время</span>
          </label>
          <label class="toggle">
            <input v-model="multipleDates" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Выбрать несколько дат</span>
          </label>
        </div>
      </div>

      <div v-if="multipleDates" class="subsettings">
        <label class="field">
          Количество (1–50)
          <input v-model.number="multipleCount" type="number" min="1" max="50" />
        </label>
        <label class="toggle compact">
          <input v-model="noRepeats" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Без повторов</span>
        </label>
      </div>

      <div v-if="addTime" class="time-settings">
        <label class="field">
          От
          <input v-model="timeFrom" type="time" />
        </label>
        <label class="field">
          До
          <input v-model="timeTo" type="time" />
        </label>
        <label class="field">
          Шаг минут
          <select v-model.number="timeStep">
            <option v-for="step in timeSteps" :key="step" :value="step">{{ step }}</option>
          </select>
        </label>
      </div>

      <div class="exclusions">
        <label class="field full">
          Исключить даты
          <textarea
            v-model="excludeText"
            rows="4"
            placeholder="2026-02-14&#10;2026-03-08"
          ></textarea>
        </label>
        <p class="hint">Можно вставить список: по одной дате на строку, формат YYYY-MM-DD.</p>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" @click="generate">Сгенерировать</button>
        <button class="btn ghost" type="button" :disabled="!hasResult" @click="copyResult">
          {{ copyLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!hasResult" @click="clearResult">
          Очистить
        </button>
      </div>

      <div v-if="errorMessage" class="error" role="alert">
        {{ errorMessage }}
      </div>

      <div v-if="hasResult" class="result-card">
        <template v-if="resultDates.length === 1">
          <p class="result-human">{{ resultDates[0].human }}</p>
          <p class="result-iso">{{ resultDates[0].iso }}</p>
        </template>
        <template v-else>
          <p class="result-title">Готово: {{ resultDates.length }} дат</p>
          <ol class="result-list">
            <li v-for="item in resultDates" :key="item.iso">{{ item.human }} — {{ item.iso }}</li>
          </ol>
          <button class="btn ghost" type="button" @click="copyAsList">
            {{ copyListLabel }}
          </button>
        </template>
      </div>
    </section>

    <section class="history-card">
      <div class="history-head">
        <div>
          <h2>История</h2>
          <p>Последние 10 результатов сохраняются только в этом браузере.</p>
        </div>
        <button class="btn ghost" type="button" :disabled="!historyItems.length" @click="clearHistory">
          Очистить историю
        </button>
      </div>
      <ul v-if="historyItems.length" class="history-list">
        <li v-for="item in historyItems" :key="item.id">
          <span class="history-label">{{ item.label }}</span>
          <span class="history-date">{{ item.created }}</span>
        </li>
      </ul>
      <p v-else class="hint">История пока пустая.</p>
    </section>

    <section class="seo-article">
      <div class="seo-card">
        <h2>Когда нужна случайная дата</h2>
        <p>
          Случайная дата помогает, когда надо честно выбрать день для события, челленджа или
          жеребьёвки. Ты задаёшь диапазон, добавляешь фильтры и получаешь результат без споров.
        </p>

        <h2>Как выбрать дату честно</h2>
        <p>
          Мы используем <code>crypto.getRandomValues</code>, чтобы выбор был действительно случайным.
          При необходимости сначала собирается список допустимых дат и только потом выбирается
          случайный элемент.
        </p>

        <h2>Будни и выходные, в чём разница</h2>
        <p>
          Фильтр по будням и выходным помогает подстроить выбор под рабочие или свободные дни.
          Можно включить только пн–пт или оставить только сб–вс, а также исключить сегодня.
        </p>

        <h2>Случайная дата со временем</h2>
        <p>
          Если нужен не только день, но и время, включай опцию времени и задавай диапазон и шаг
          минут. Например, шаг 15 даёт только 00, 15, 30 и 45.
        </p>

        <h2>Идеи для челленджей и планов</h2>
        <p>
          Случайная дата отлично подходит для распределения тренировок, расписаний стримов, вызовов
          на неделю и быстрых розыгрышей. Добавь исключения, чтобы исключить праздники или важные
          дни.
        </p>
      </div>
    </section>

    <section class="faq-card">
      <p class="seo-kicker">FAQ</p>
      <h2>Частые вопросы</h2>
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

    <section class="other-decisions">
      <div class="other-card">
        <h2>Другие решения</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/decisions/random-choice">
            <span class="other-title">Случайный выбор</span>
            <span class="other-desc">Да/нет, список или число в одном рандомайзере.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/wheel-of-fortune">
            <span class="other-title">Колесо фортуны</span>
            <span class="other-desc">Крутите колесо и выбирайте честно.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/team-generator">
            <span class="other-title">Генератор команд</span>
            <span class="other-desc">Раздели людей на команды случайно.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/decisions/coin-flip">
            <span class="other-title">Монетка</span>
            <span class="other-desc">Классический выбор 50/50 за секунду.</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import {
  buildAllowedDates,
  formatHumanDate,
  getRandomInt,
  pickRandomDate,
  pickRandomDates,
  type DateFilterOptions
} from '@/utils/decisions/randomDate'

interface GeneratedDate {
  date: Date
  human: string
  iso: string
}

interface HistoryItem {
  id: number
  label: string
  created: string
  isoList: string[]
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const HISTORY_KEY = 'random-date-history-v1'
const MAX_LIST_DAYS = 3660

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Решения', to: '/decisions' },
  { label: 'Случайная дата' }
]

const startDate = ref('')
const endDate = ref('')

const weekdaysOnly = ref(false)
const weekendsOnly = ref(false)
const excludeToday = ref(false)
const excludeHolidays = ref(false)
const addTime = ref(false)
const multipleDates = ref(false)
const multipleCount = ref(3)
const noRepeats = ref(true)

const timeFrom = ref('09:00')
const timeTo = ref('18:00')
const timeStep = ref(15)
const timeSteps = [1, 5, 10, 15, 30, 60]

const excludeText = ref('')
const resultDates = ref<GeneratedDate[]>([])
const errorMessage = ref('')
const copyLabel = ref('Копировать результат')
const copyListLabel = ref('Скопировать как список')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const copyListTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const historyItems = ref<HistoryItem[]>([])

const hasResult = computed(() => resultDates.value.length > 0)
const specialYearLabel = computed(() => {
  const currentYear = new Date().getFullYear()
  return currentYear <= 2026 ? '2026' : String(currentYear + 1)
})

const faqItems = [
  {
    q: 'Можно ли выбрать несколько дат?',
    a: 'Да, включи опцию выбора нескольких дат, задай количество и нажми “Сгенерировать”.'
  },
  {
    q: 'Почему даты могут повторяться?',
    a: 'Повторы возможны, если отключена опция “Без повторов” или диапазон слишком узкий.'
  },
  {
    q: 'Как исключить конкретные дни?',
    a: 'Вставь список дат в блок “Исключить даты”, по одной дате на строку.'
  },
  {
    q: 'Можно ли выбрать только будни?',
    a: 'Да, включи фильтр “Только будни, пн–пт”.'
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Да, интерфейс адаптирован под мобильные устройства.'
  },
  {
    q: 'Сохраняются ли мои данные?',
    a: 'История хранится только в локальном хранилище браузера и не отправляется на сервер.'
  }
]

const openFaq = ref<number | null>(null)

const pad = (value: number) => String(value).padStart(2, '0')

const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const toIsoDateTime = (date: Date): string =>
  `${toIsoDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`

const parseDateInput = (value: string): Date | null => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

const parseTime = (value: string): number | null => {
  if (!/^\d{2}:\d{2}$/.test(value)) return null
  const [hours, minutes] = value.split(':').map(Number)
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  return hours * 60 + minutes
}

const diffDaysInclusive = (start: Date, end: Date): number => {
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.floor((utcEnd - utcStart) / MS_PER_DAY) + 1
}

const parseExcludedDates = (): string[] =>
  excludeText.value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item))

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const applyPreset = (preset: string) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  if (preset === 'week') {
    startDate.value = toIsoDate(today)
    const end = new Date(today)
    end.setDate(end.getDate() + 7)
    endDate.value = toIsoDate(end)
    return
  }

  if (preset === 'month') {
    startDate.value = toIsoDate(new Date(year, month, 1))
    endDate.value = toIsoDate(new Date(year, month + 1, 0))
    return
  }

  if (preset === 'next-month') {
    startDate.value = toIsoDate(new Date(year, month + 1, 1))
    endDate.value = toIsoDate(new Date(year, month + 2, 0))
    return
  }

  if (preset === 'year') {
    startDate.value = toIsoDate(new Date(year, 0, 1))
    endDate.value = toIsoDate(new Date(year, 11, 31))
    return
  }

  const specialYear = Number(specialYearLabel.value)
  startDate.value = toIsoDate(new Date(specialYear, 0, 1))
  endDate.value = toIsoDate(new Date(specialYear, 11, 31))
}

const pickRandomTime = (): number | null => {
  const startMinutes = parseTime(timeFrom.value)
  const endMinutes = parseTime(timeTo.value)
  if (startMinutes === null || endMinutes === null) return null
  if (endMinutes < startMinutes) return null
  const step = Number(timeStep.value) || 1
  const alignedStart = Math.ceil(startMinutes / step) * step
  if (alignedStart > endMinutes) return null
  const slots = Math.floor((endMinutes - alignedStart) / step) + 1
  const choice = getRandomInt(slots)
  return alignedStart + choice * step
}

const validateTimeRange = (): boolean => {
  const startMinutes = parseTime(timeFrom.value)
  const endMinutes = parseTime(timeTo.value)
  if (startMinutes === null || endMinutes === null) return false
  if (endMinutes < startMinutes) return false
  const step = Number(timeStep.value) || 1
  const alignedStart = Math.ceil(startMinutes / step) * step
  return alignedStart <= endMinutes
}

const buildGeneratedDates = (dates: Date[]): GeneratedDate[] => {
  return dates.map((date) => {
    const withTime = addTime.value
    const iso = withTime ? toIsoDateTime(date) : toIsoDate(date)
    return {
      date,
      iso,
      human: formatHumanDate(date, withTime)
    }
  })
}

const generate = () => {
  errorMessage.value = ''
  resultDates.value = []

  const start = parseDateInput(startDate.value)
  const end = parseDateInput(endDate.value)
  if (!start || !end) {
    errorMessage.value = 'Укажи диапазон дат: “от” и “до”.'
    return
  }
  if (end < start) {
    errorMessage.value = 'Дата “до” не может быть раньше даты “от”.'
    return
  }
  if (weekdaysOnly.value && weekendsOnly.value) {
    errorMessage.value = 'Выберите либо будни, либо выходные, но не оба фильтра сразу.'
    return
  }
  if (addTime.value && !validateTimeRange()) {
    errorMessage.value = 'Проверь диапазон времени и шаг минут.'
    return
  }

  const rangeDays = diffDaysInclusive(start, end)
  const options: DateFilterOptions = {
    weekdaysOnly: weekdaysOnly.value,
    weekendsOnly: weekendsOnly.value,
    excludeToday: excludeToday.value,
    excludeHolidays: excludeHolidays.value,
    excludeDates: parseExcludedDates()
  }

  let allowedDates: Date[] | null = null
  if (rangeDays <= MAX_LIST_DAYS) {
    allowedDates = buildAllowedDates(start, end, options)
    if (!allowedDates.length) {
      errorMessage.value = 'В этом диапазоне не осталось допустимых дат.'
      return
    }
  }

  if (multipleDates.value) {
    const count = Math.min(Math.max(multipleCount.value || 1, 1), 50)
    if (noRepeats.value && rangeDays > MAX_LIST_DAYS) {
      errorMessage.value = 'Для выбора без повторов сузьте диапазон до 3660 дней.'
      return
    }

    if (!allowedDates) {
      errorMessage.value = 'Слишком большой диапазон для выбора нескольких дат. Сузьте диапазон.'
      return
    }

    if (noRepeats.value && allowedDates.length < count) {
      errorMessage.value = 'Допустимых дат меньше, чем выбранное количество.'
      return
    }

    const picked = noRepeats.value
      ? pickRandomDates(allowedDates, count)
      : Array.from({ length: count }, () => allowedDates![getRandomInt(allowedDates!.length)])

    const datesWithTime = picked.map((date) => {
      const copy = new Date(date)
      if (addTime.value) {
        const minutes = pickRandomTime()
        if (minutes === null) {
          errorMessage.value = 'Проверь диапазон времени и шаг минут.'
          return null
        }
        copy.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
      }
      return copy
    })

    if (datesWithTime.includes(null)) return
    resultDates.value = buildGeneratedDates(datesWithTime as Date[])
    pushHistory(resultDates.value)
    return
  }

  let pickedDate: Date | null = null
  if (allowedDates) {
    pickedDate = pickRandomDate({ start, end, allowedDates })
  } else {
    pickedDate = pickRandomDate({ start, end, options, maxAttempts: 500 })
    if (!pickedDate) {
      errorMessage.value =
        'Не удалось найти дату с выбранными фильтрами. Сузьте диапазон или отключите фильтры.'
      return
    }
  }

  if (!pickedDate) {
    errorMessage.value = 'Не удалось найти дату с выбранными фильтрами.'
    return
  }

  const finalDate = new Date(pickedDate)
  if (addTime.value) {
    const minutes = pickRandomTime()
    if (minutes === null) {
      errorMessage.value = 'Проверь диапазон времени и шаг минут.'
      return
    }
    finalDate.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
  }

  resultDates.value = buildGeneratedDates([finalDate])
  pushHistory(resultDates.value)
}

const clearResult = () => {
  resultDates.value = []
  errorMessage.value = ''
  copyLabel.value = 'Копировать результат'
  copyListLabel.value = 'Скопировать как список'
}

const copyResult = async () => {
  if (!hasResult.value || typeof navigator === 'undefined' || !navigator.clipboard) return
  const text =
    resultDates.value.length === 1
      ? `${resultDates.value[0].human}\n${resultDates.value[0].iso}`
      : resultDates.value.map((item) => item.human).join(', ')
  try {
    await navigator.clipboard.writeText(text)
    copyLabel.value = 'Скопировано'
  } catch (error) {
    copyLabel.value = 'Ошибка копирования'
  }
  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyTimer.value = setTimeout(() => {
    copyLabel.value = 'Копировать результат'
  }, 2000)
}

const copyAsList = async () => {
  if (!hasResult.value || typeof navigator === 'undefined' || !navigator.clipboard) return
  const text = resultDates.value.map((item) => item.iso).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    copyListLabel.value = 'Скопировано'
  } catch (error) {
    copyListLabel.value = 'Ошибка копирования'
  }
  if (copyListTimer.value) clearTimeout(copyListTimer.value)
  copyListTimer.value = setTimeout(() => {
    copyListLabel.value = 'Скопировать как список'
  }, 2000)
}

const pushHistory = (items: GeneratedDate[]) => {
  const isoList = items.map((item) => item.iso)
  const label =
    items.length === 1 ? items[0].human : `${items.length} дат: ${isoList.join(', ')}`
  const created = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
  const entry: HistoryItem = {
    id: Date.now(),
    label,
    isoList,
    created
  }
  historyItems.value = [entry, ...historyItems.value].slice(0, 10)
  if (process.client) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyItems.value))
  }
}

const clearHistory = () => {
  historyItems.value = []
  if (process.client) {
    localStorage.removeItem(HISTORY_KEY)
  }
}

watch([weekdaysOnly, weekendsOnly], () => {
  if (weekdaysOnly.value && weekendsOnly.value) {
    weekendsOnly.value = false
  }
})

watch(
  [
    startDate,
    endDate,
    excludeText,
    weekdaysOnly,
    weekendsOnly,
    excludeToday,
    excludeHolidays,
    addTime,
    multipleDates,
    multipleCount,
    noRepeats,
    timeFrom,
    timeTo,
    timeStep
  ],
  () => {
    if (errorMessage.value) errorMessage.value = ''
  }
)

onMounted(() => {
  const today = new Date()
  startDate.value = toIsoDate(today)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  endDate.value = toIsoDate(nextWeek)

  const stored = localStorage.getItem(HISTORY_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as HistoryItem[]
      historyItems.value = Array.isArray(parsed) ? parsed.slice(0, 10) : []
    } catch (error) {
      historyItems.value = []
    }
  }
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/random-date`)
const metaDescription =
  'Выбери случайную дату в диапазоне. Будни или выходные, исключения, несколько дат, случайное время.'

useSeoMeta(() => ({
  title: 'Случайная дата онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Случайная дата онлайн | Neural Wise Wolf',
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
      name: 'Случайная дата онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'Случайная дата', item: canonicalUrl.value }
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
.random-date-page {
  display: grid;
  gap: clamp(22px, 4vw, 36px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(32px, 4vw, 56px);
}

.hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  color: #cbd5e1;
  max-width: 720px;
}

.tool-card,
.history-card,
.seo-card,
.faq-card,
.other-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.45));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.tool-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.18), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.range-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
  color: #cbd5e1;
  font-size: 14px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  padding: 10px 12px;
  color: #e2e8f0;
  outline: none;
}

.field textarea {
  resize: vertical;
}

.full {
  width: 100%;
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.settings {
  display: grid;
  gap: 10px;
}

.block-title {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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
  color: #e2e8f0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.toggle.compact {
  max-width: 260px;
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
  background: rgba(45, 212, 191, 0.8);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.subsettings,
.time-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.exclusions {
  display: grid;
  gap: 6px;
}

.hint {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
  background: linear-gradient(130deg, rgba(45, 212, 191, 0.9), rgba(59, 130, 246, 0.85));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.6);
}

.error {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.result-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.6);
  padding: 16px;
  display: grid;
  gap: 10px;
}

.result-human {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  color: #e2e8f0;
}

.result-iso {
  margin: 0;
  color: #94a3b8;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.result-title {
  margin: 0;
  font-weight: 700;
}

.result-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #cbd5e1;
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
  color: #94a3b8;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.history-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
}

.history-label {
  color: #e2e8f0;
}

.history-date {
  color: #94a3b8;
  font-size: 12px;
  white-space: nowrap;
}

.seo-article {
  display: grid;
}

.seo-card h2 {
  margin: 0 0 6px;
}

.seo-card p {
  margin: 0 0 12px;
  color: #cbd5e1;
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
  border-color: rgba(45, 212, 191, 0.45);
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
  max-height: 200px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
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
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .preset-row {
    flex-direction: column;
  }
}
</style>
