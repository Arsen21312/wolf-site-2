<template>
  <main class="age-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Калькулятор возраста</h1>
      <p class="lead">
        Посчитайте возраст по дате рождения: точные годы, месяцы и дни, сколько прожито часов и минут,
        плюс сколько осталось до следующего дня рождения.
      </p>
    </header>

    <section class="tool-card">
      <div class="input-grid">
        <div class="input-card">
          <h2>Дата рождения</h2>
          <div class="field">
            <label for="birth-date">Дата</label>
            <input id="birth-date" v-model="birthDate" type="date" />
          </div>
          <div class="field">
            <label for="birth-time">Время (необязательно)</label>
            <input id="birth-time" v-model="birthTime" type="time" step="60" />
            <span class="hint">Если не указывать, считаем 00:00.</span>
          </div>
        </div>

        <div class="input-card">
          <h2>Дата расчета</h2>
          <div class="field">
            <label for="as-of-date">Дата</label>
            <input id="as-of-date" v-model="asOfDate" type="date" />
          </div>
          <div class="inline-actions">
            <button class="btn ghost" type="button" @click="setToday">Сегодня</button>
          </div>
          <p class="hint">Возраст считается на начало указанного дня по локальному времени.</p>
        </div>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="!canCalculate" @click="calculate">
          Посчитать
        </button>
        <button class="btn ghost" type="button" @click="resetAll">Сбросить</button>
        <button class="btn ghost" type="button" :disabled="!hasResult" @click="copyResult">
          {{ copyLabel }}
        </button>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="!hasResult" class="empty-note">Введите дату рождения и нажмите «Посчитать».</p>

      <Transition name="fade-slide">
        <div v-if="hasResult" class="result-grid" role="status" aria-live="polite">
          <article class="result-card">
            <h3>Возраст</h3>
            <p class="big">{{ ageLine }}</p>
            <p class="muted">На дату: {{ asOfDateReadable }}</p>
          </article>

          <article class="result-card">
            <h3>Всего прожито</h3>
            <div class="stat-list">
              <div>
                <span class="stat-value">{{ formatNumber(result.totalDays) }}</span>
                <span class="stat-label">{{ plural(result.totalDays, ['день', 'дня', 'дней']) }}</span>
              </div>
              <div>
                <span class="stat-value">{{ formatNumber(result.totalHours) }}</span>
                <span class="stat-label">{{ plural(result.totalHours, ['час', 'часа', 'часов']) }}</span>
              </div>
              <div>
                <span class="stat-value">{{ formatNumber(result.totalMinutes) }}</span>
                <span class="stat-label">{{ plural(result.totalMinutes, ['минута', 'минуты', 'минут']) }}</span>
              </div>
            </div>
          </article>

          <article class="result-card">
            <h3>До следующего дня рождения</h3>
            <p class="big">
              {{ formatNumber(result.nextBirthdayDays) }}
              {{ plural(result.nextBirthdayDays, ['день', 'дня', 'дней']) }}
            </p>
            <p class="muted">{{ result.nextBirthdayDate }}, {{ result.nextBirthdayWeekday }}</p>
          </article>

          <article class="result-card">
            <h3>Знак зодиака</h3>
            <p class="big">{{ result.zodiac }}</p>
            <p class="muted">Западная система</p>
          </article>

          <article class="result-card">
            <h3>Китайский год</h3>
            <p class="big">{{ result.chinese }}</p>
            <p class="muted">12-летний цикл</p>
          </article>
        </div>
      </Transition>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Калькулятор возраста онлайн</h2>
        <p>
          Этот калькулятор считает возраст по дате рождения и любой дате расчета. Вы увидите календарные
          годы, месяцы и дни, а также точное количество прожитых дней, часов и минут.
        </p>

        <h2>Как считается возраст по дате рождения</h2>
        <p>
          Сначала определяется последняя дата дня рождения, затем вычисляются полные месяцы и оставшиеся
          дни. Такой способ учитывает реальную длину месяцев и високосные годы.
        </p>

        <h2>До следующего дня рождения, как узнать точно</h2>
        <p>
          Мы берем день и месяц рождения в году даты расчета. Если дата уже прошла, добавляется следующий
          год, и показывается количество дней до ближайшего дня рождения вместе с днем недели.
        </p>
      </div>
    </section>

    <section class="faq-card">
      <h2>FAQ</h2>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type DateParts = { y: number; m: number; d: number }
type AgeResult = {
  years: number
  months: number
  days: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  nextBirthdayDays: number
  nextBirthdayDate: string
  nextBirthdayWeekday: string
  zodiac: string
  chinese: string
}

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Калькулятор возраста' }
]

const birthDate = ref('')
const birthTime = ref('00:00')
const asOfDate = ref('')
const error = ref('')
const hasResult = ref(false)
const result = ref<AgeResult | null>(null)
const copyLabel = ref('Копировать результат')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const openFaq = ref<number | null>(null)

const STORAGE_KEYS = {
  birthDate: 'lastBirthDate',
  birthTime: 'lastBirthTime',
  asOfDate: 'lastAsOfDate'
}

const canCalculate = computed(() => Boolean(birthDate.value))

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDateParts(value: string): DateParts | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return { y, m: m - 1, d }
}

function parseTimeParts(value: string | null): { h: number; m: number } {
  if (!value) return { h: 0, m: 0 }
  const [h, m] = value.split(':').map(Number)
  return { h: Number.isFinite(h) ? h : 0, m: Number.isFinite(m) ? m : 0 }
}

function toDateTime(parts: DateParts, time: { h: number; m: number }) {
  return new Date(parts.y, parts.m, parts.d, time.h, time.m, 0, 0)
}

function compareDates(a: DateParts, b: DateParts) {
  if (a.y !== b.y) return a.y - b.y
  if (a.m !== b.m) return a.m - b.m
  return a.d - b.d
}

function isLeapYear(year: number) {
  if (year % 400 === 0) return true
  if (year % 100 === 0) return false
  return year % 4 === 0
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getBirthdayInYear(birth: DateParts, year: number): DateParts {
  const isLeapBirth = birth.m === 1 && birth.d === 29
  if (isLeapBirth && !isLeapYear(year)) {
    return { y: year, m: 1, d: 28 }
  }
  return { y: year, m: birth.m, d: birth.d }
}

function addMonths(date: DateParts, monthsToAdd: number): DateParts {
  let year = date.y
  let month = date.m + monthsToAdd
  year += Math.floor(month / 12)
  month = ((month % 12) + 12) % 12
  const day = Math.min(date.d, daysInMonth(year, month))
  return { y: year, m: month, d: day }
}

function diffDays(a: DateParts, b: DateParts) {
  const ms = Date.UTC(b.y, b.m, b.d) - Date.UTC(a.y, a.m, a.d)
  return Math.round(ms / 86400000)
}

function formatNumber(value: number) {
  return value.toLocaleString('ru-RU')
}

function plural(value: number, forms: [string, string, string]) {
  const abs = Math.abs(value) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last > 1 && last < 5) return forms[1]
  if (last === 1) return forms[0]
  return forms[2]
}

function getWesternZodiac(birth: DateParts) {
  const m = birth.m + 1
  const d = birth.d
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'Козерог'
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'Водолей'
  if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return 'Рыбы'
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'Овен'
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'Телец'
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'Близнецы'
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'Рак'
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Лев'
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Дева'
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'Весы'
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'Скорпион'
  return 'Стрелец'
}

function getChineseZodiac(year: number) {
  const animals = [
    'Крыса',
    'Бык',
    'Тигр',
    'Кролик',
    'Дракон',
    'Змея',
    'Лошадь',
    'Коза',
    'Обезьяна',
    'Петух',
    'Собака',
    'Свинья'
  ]
  const baseYear = 2020
  const index = ((year - baseYear) % 12 + 12) % 12
  return animals[index]
}

function capitalize(value: string) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const ageLine = computed(() => {
  if (!result.value) return ''
  const { years, months, days } = result.value
  return `${years} ${plural(years, ['год', 'года', 'лет'])} ${months} ${plural(months, ['месяц', 'месяца', 'месяцев'])} ${days} ${plural(days, ['день', 'дня', 'дней'])}`
})

const asOfDateReadable = computed(() => {
  const parts = parseDateParts(asOfDate.value)
  if (!parts) return ''
  return new Date(parts.y, parts.m, parts.d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

function calculateCalendarAge(birth: DateParts, asOf: DateParts) {
  const birthdayThisYear = getBirthdayInYear(birth, asOf.y)
  const beforeBirthday = compareDates(asOf, birthdayThisYear) < 0
  const years = asOf.y - birth.y - (beforeBirthday ? 1 : 0)
  const lastBirthdayYear = asOf.y - (beforeBirthday ? 1 : 0)
  const lastBirthday = getBirthdayInYear(birth, lastBirthdayYear)
  let months = 0
  let cursor = lastBirthday

  while (true) {
    const next = addMonths(cursor, 1)
    if (compareDates(next, asOf) <= 0) {
      months += 1
      cursor = next
    } else {
      break
    }
  }

  const days = diffDays(cursor, asOf)

  return { years, months, days }
}

function getNextBirthday(birth: DateParts, asOf: DateParts) {
  let next = getBirthdayInYear(birth, asOf.y)
  if (compareDates(next, asOf) < 0) {
    next = getBirthdayInYear(birth, asOf.y + 1)
  }
  return next
}

function calculate() {
  error.value = ''
  hasResult.value = false
  result.value = null

  const birthParts = parseDateParts(birthDate.value)
  const asOfParts = parseDateParts(asOfDate.value)
  if (!birthParts) {
    error.value = 'Введите дату рождения.'
    return
  }
  if (!asOfParts) {
    error.value = 'Введите дату расчета.'
    return
  }

  const timeParts = parseTimeParts(birthTime.value)
  const birthDateTime = toDateTime(birthParts, timeParts)
  const asOfDateTime = toDateTime(asOfParts, { h: 0, m: 0 })

  if (asOfDateTime.getTime() < birthDateTime.getTime()) {
    error.value = 'Дата рождения позже даты расчета.'
    return
  }

  const calendarAge = calculateCalendarAge(birthParts, asOfParts)
  const diffMs = asOfDateTime.getTime() - birthDateTime.getTime()
  const totalMinutes = Math.floor(diffMs / 60000)
  const totalHours = Math.floor(diffMs / 3600000)
  const totalDays = Math.floor(diffMs / 86400000)

  const nextBirthday = getNextBirthday(birthParts, asOfParts)
  const nextBirthdayDays = diffDays(asOfParts, nextBirthday)
  const nextBirthdayDate = new Date(nextBirthday.y, nextBirthday.m, nextBirthday.d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const nextBirthdayWeekday = capitalize(
    new Date(nextBirthday.y, nextBirthday.m, nextBirthday.d).toLocaleDateString('ru-RU', { weekday: 'long' })
  )

  result.value = {
    years: calendarAge.years,
    months: calendarAge.months,
    days: calendarAge.days,
    totalDays,
    totalHours,
    totalMinutes,
    nextBirthdayDays,
    nextBirthdayDate,
    nextBirthdayWeekday,
    zodiac: getWesternZodiac(birthParts),
    chinese: getChineseZodiac(birthParts.y)
  }

  hasResult.value = true
}

function setToday() {
  asOfDate.value = formatDateInput(new Date())
}

function resetAll() {
  birthDate.value = ''
  birthTime.value = '00:00'
  setToday()
  error.value = ''
  hasResult.value = false
  result.value = null
  copyLabel.value = 'Копировать результат'
}

const summaryText = computed(() => {
  if (!result.value) return ''
  return [
    `Возраст: ${ageLine.value}`,
    `Всего прожито: ${formatNumber(result.value.totalDays)} ${plural(result.value.totalDays, ['день', 'дня', 'дней'])}, ${formatNumber(result.value.totalHours)} ${plural(result.value.totalHours, ['час', 'часа', 'часов'])}, ${formatNumber(result.value.totalMinutes)} ${plural(result.value.totalMinutes, ['минута', 'минуты', 'минут'])}`,
    `До следующего дня рождения: ${formatNumber(result.value.nextBirthdayDays)} ${plural(result.value.nextBirthdayDays, ['день', 'дня', 'дней'])}`,
    `Дата следующего ДР: ${result.value.nextBirthdayDate} (${result.value.nextBirthdayWeekday})`,
    `Знак зодиака: ${result.value.zodiac}`,
    `Китайский год: ${result.value.chinese}`,
    `Дата рождения: ${birthDate.value} ${birthTime.value || '00:00'}`,
    `Дата расчета: ${asOfDate.value}`
  ].join('\n')
})

async function copyResult() {
  if (!summaryText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(summaryText.value)
    copyLabel.value = 'Скопировано'
  } catch (errorCopy) {
    copyLabel.value = 'Не удалось скопировать'
  }
  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyTimer.value = setTimeout(() => {
    copyLabel.value = 'Копировать результат'
  }, 2000)
}

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

const faqItems = [
  {
    q: 'Как посчитать возраст на любую дату?',
    a: 'Выберите «Дату расчета» в прошлом или будущем, нажмите «Посчитать», и калькулятор покажет возраст на выбранный день.'
  },
  {
    q: 'Почему месяцы считаются не как 30 дней?',
    a: 'Мы считаем календарные месяцы, потому что их длина разная: 28–31 день. Так возраст получается точнее.'
  },
  {
    q: 'Что делать если родился 29 февраля?',
    a: 'В невисокосные годы день рождения считается 28 февраля. Это влияет на расчет возраста и следующего ДР.'
  },
  {
    q: 'Считается ли время рождения?',
    a: 'Да, время учитывается в расчете прожитых часов и минут. Календарные годы и месяцы считаются по датам.'
  },
  {
    q: 'Это работает на телефоне?',
    a: 'Да, калькулятор адаптирован для мобильных устройств: все поля и кнопки идут в одну колонку.'
  },
  {
    q: 'Можно ли скопировать результат?',
    a: 'Да, нажмите «Копировать результат» — данные попадут в буфер обмена.'
  },
  {
    q: 'Почему результаты отличаются от других калькуляторов?',
    a: 'Разные сервисы по-разному трактуют месяцы и день рождения 29 февраля. Здесь используются календарные месяцы.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/age-calculator`)
const metaDescription =
  'Посчитай возраст по дате рождения. Точный возраст в годах, месяцах и днях, сколько прожито дней, и сколько осталось до следующего дня рождения.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Калькулятор возраста онлайн',
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
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: `${requestUrl.origin}/generators` },
        { '@type': 'ListItem', position: 3, name: 'Калькулятор возраста', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Калькулятор возраста онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Калькулятор возраста онлайн | Neural Wise Wolf',
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

const storageReady = ref(false)
const isHydrating = ref(true)

onMounted(() => {
  setToday()
  storageReady.value = true
  if (typeof localStorage === 'undefined') return
  const storedBirthDate = localStorage.getItem(STORAGE_KEYS.birthDate)
  const storedBirthTime = localStorage.getItem(STORAGE_KEYS.birthTime)
  const storedAsOfDate = localStorage.getItem(STORAGE_KEYS.asOfDate)
  if (storedBirthDate) birthDate.value = storedBirthDate
  if (storedBirthTime) birthTime.value = storedBirthTime
  if (storedAsOfDate) asOfDate.value = storedAsOfDate
  if (birthDate.value) {
    calculate()
  }
  isHydrating.value = false
})

watch([birthDate, birthTime, asOfDate], () => {
  if (!storageReady.value || typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.birthDate, birthDate.value)
  localStorage.setItem(STORAGE_KEYS.birthTime, birthTime.value)
  localStorage.setItem(STORAGE_KEYS.asOfDate, asOfDate.value)
  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyLabel.value = 'Копировать результат'
  if (hasResult.value && !isHydrating.value) {
    hasResult.value = false
  }
})
</script>

<style scoped>
.age-page {
  display: grid;
  gap: clamp(22px, 3vw, 38px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 30px) 0 clamp(36px, 4vw, 64px);
  color: #e2e8f0;
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
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
  max-width: 760px;
  color: #cbd5e1;
  font-size: 16px;
}

.tool-card,
.seo-card,
.faq-card {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.5));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.tool-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(148, 163, 184, 0.18), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.input-card {
  display: grid;
  gap: 12px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
}

.input-card h2 {
  margin: 0;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  color: #cbd5e1;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.field input {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(2, 6, 23, 0.7);
  padding: 10px 12px;
  color: #e2e8f0;
  outline: none;
}

.hint {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.inline-actions {
  display: flex;
  gap: 10px;
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
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.8), rgba(52, 211, 153, 0.75));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
}

.error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.empty-note {
  margin: 0;
  color: #94a3b8;
}

.result-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.result-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.result-card h3 {
  margin: 0;
}

.big {
  margin: 0;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 800;
}

.muted {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.stat-list {
  display: grid;
  gap: 10px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  display: block;
}

.stat-label {
  color: #94a3b8;
  font-size: 13px;
}

.seo-text h2,
.faq-card h2 {
  margin: 0 0 8px;
}

.seo-text p {
  margin: 0 0 14px;
  color: #cbd5e1;
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
  border-color: rgba(56, 189, 248, 0.45);
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 720px) {
  .action-row {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
