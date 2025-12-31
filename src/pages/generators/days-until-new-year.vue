<template>
  <main class="new-year-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Сколько дней до Нового года</h1>
      <p class="lead">
        Таймер до Нового года с днями, часами, минутами и секундами. Работает на телефоне и ПК,
        копируется в один клик.
      </p>
    </header>

    <section class="timer-card">
      <div class="timer-grid" aria-live="polite" v-if="!isCelebration">
        <div class="time-box">
          <span class="time-value">{{ formatNumber(timeLeft.days) }}</span>
          <span class="time-label">Осталось дней</span>
        </div>
        <div class="time-box">
          <span class="time-value">{{ pad(timeLeft.hours) }}</span>
          <span class="time-label">Часы</span>
        </div>
        <div class="time-box">
          <span class="time-value">{{ pad(timeLeft.minutes) }}</span>
          <span class="time-label">Минуты</span>
        </div>
        <div class="time-box">
          <span class="time-value">{{ pad(timeLeft.seconds) }}</span>
          <span class="time-label">Секунды</span>
        </div>
      </div>

      <div v-else class="celebration">
        <h2>С Новым годом!</h2>
        <p>Праздник наступил. Можно запустить счетчик до следующего 1 января.</p>
        <button class="btn primary" type="button" @click="countNextYear">Считать до следующего</button>
      </div>

      <div class="timer-meta">
        <p v-if="!isCelebration">Новый год наступит: {{ targetDateLabel }}</p>
        <p v-else>Следующий Новый год: {{ nextTargetDateLabel }}</p>
        <p class="note">Ваш часовой пояс: {{ timeZoneLabel }}</p>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" @click="copyResult">
          {{ copyLabel }}
        </button>
        <button class="btn ghost" type="button" @click="shareLink">
          {{ shareLabel }}
        </button>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Сколько дней осталось до Нового года</h2>
        <div class="callout">
          <p>
            Коротко: таймер считает до ближайшего 1 января 00:00 по вашему локальному времени и
            обновляется раз в секунду. Если дата уже наступила, появляется поздравление и кнопка
            для старта нового отсчета.
          </p>
        </div>
        <p>
          Этот таймер показывает точный отсчет до ближайшего 1 января 00:00 по вашему локальному
          времени. Мы берем текущее время устройства и считаем разницу до следующего Нового года,
          поэтому цифры обновляются каждую секунду и не требуют ручного обновления страницы. Большие
          числа помогают быстро оценить масштаб ожидания, а секунды показывают, что движение идет
          постоянно.
        </p>
        <p>
          Новый год наступает в полночь, но в разных часовых поясах это происходит в разное время.
          Поэтому один и тот же момент может быть 31 декабря в одном городе и уже 1 января в другом.
          Таймер учитывает именно ваш пояс, чтобы результат был честным и полезным для планов.
        </p>
        <p>
          Счетчик удобен для планирования: до праздника можно распределить покупки, подготовить
          подарки, забронировать билеты или подвести итоги года. Когда время преобразуется в цифры,
          легче принимать решения и не откладывать важные задачи до последней недели декабря.
        </p>
        <div class="highlight-grid">
          <div class="highlight">
            <h3>Что дает таймер</h3>
            <ul>
              <li>Показывает точный остаток до 1 января.</li>
              <li>Обновляется каждую секунду без обновления страницы.</li>
              <li>Учитывает ваш локальный часовой пояс.</li>
            </ul>
          </div>
          <div class="highlight">
            <h3>Кому подходит</h3>
            <ul>
              <li>Тем, кто планирует подарки и покупки заранее.</li>
              <li>Командам для синхронизации дедлайнов.</li>
              <li>Тем, кто любит видеть прогресс ожидания.</li>
            </ul>
          </div>
        </div>
        <figure class="media">
          <img
            src="/images/days-until-new-year/ny-hero.png"
            alt="Новогодние огни и атмосфера праздника"
            loading="lazy"
          />
          <figcaption>Теплая новогодняя атмосфера, мягкий свет и ощущение ожидания.</figcaption>
        </figure>

        <h2>Таймер до Нового года онлайн, как пользоваться</h2>
        <p>
          Все просто: открываете страницу и сразу видите дни, часы, минуты и секунды до наступления
          Нового года. Никаких настроек, регистраций и переключателей. Таймер обновляется автоматически,
          поэтому можно оставить вкладку открытой в фоне и возвращаться к ней в любой момент.
        </p>
        <p>
          Кнопка «Скопировать» создает готовую фразу, например: «До Нового года осталось 123 дня
          04:12:09». Эту строку удобно отправить друзьям, вставить в чат команды или добавить в
          заметки. «Поделиться ссылкой» копирует текущий адрес страницы или открывает системное меню
          шаринга на телефоне.
        </p>
        <p>
          Если в момент 1 января таймер уже достиг нуля, появится поздравление и кнопка «Считать до
          следующего». Она запускает отсчет до следующего Нового года, чтобы можно было продолжать
          планирование без перезагрузки страницы.
        </p>
        <div class="divider"></div>
        <div class="pill-row">
          <span class="pill">Автообновление</span>
          <span class="pill">Локальное время</span>
          <span class="pill">Копирование</span>
          <span class="pill">Ссылка</span>
        </div>
        <figure class="media align-right">
          <img
            src="/images/days-until-new-year/ny-clock.png"
            alt="Часы и зимний декор"
            loading="lazy"
          />
          <figcaption>Отсчет времени в зимнем настроении: часы, свет и спокойный ритм.</figcaption>
        </figure>

        <h2>Почему у разных людей может отличаться счетчик</h2>
        <p>
          Основная причина отличий - часовые пояса. Новый год наступает в полночь локального времени,
          поэтому люди из разных городов видят разную разницу до цели. Это нормально и ожидаемо: таймер
          работает с вашим устройством и показывает именно вашу локальную дату и время.
        </p>
        <p>
          Дополнительный фактор - точность системных часов. Если время на устройстве выставлено вручную
          и отличается от реального, результат тоже может быть смещен. В таком случае стоит включить
          автоматическую синхронизацию времени, и счетчик станет точным.
        </p>
        <p>
          Также влияет переход между часовыми поясами. Если вы путешествуете, таймер корректно
          адаптируется: сразу после смены пояса счетчик подстроится под новое локальное время.
        </p>
        <div class="note-card">
          <h3>Почему это не ошибка</h3>
          <p>
            Новый год фиксируется на 00:00 местного времени. В одном городе это наступает раньше, в
            другом позже, поэтому отсчет закономерно отличается. Таймер просто честно следует вашей
            локальной дате.
          </p>
        </div>

        <h2>Идеи, как использовать счетчик</h2>
        <p>
          Таймер помогает превратить абстрактное «скоро» в конкретный дедлайн. Это удобно для личных
          целей и рабочих задач: можно распределить список покупок по неделям, выделить время на
          подготовку подарков, планировать поездки и отпуск. Чем ближе дата, тем проще контролировать
          прогресс.
        </p>
        <p>
          Счетчик также подходит для мотивации: приятно видеть, как уменьшается число дней до праздника
          и как меняется ожидание. Некоторые используют таймер как фон на рабочем столе, чтобы держать
          фокус на годовых целях и вовремя подводить итоги.
        </p>
        <p>
          Для команд и проектов можно копировать строку с отсчетом и делиться ей в рабочих чатах. Это
          помогает синхронизировать подготовку: корпоративные подарки, закрытие задач, финальные отчеты
          или сезонные акции.
        </p>
        <figure class="media">
          <img
            src="/images/days-until-new-year/ny-wolf.png"
            alt="Волк и зимний пейзаж в нейтральной стилистике"
            loading="lazy"
          />
          <figcaption>Зимний сюжет с волком или спокойный снегопад — на выбор.</figcaption>
        </figure>

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
              <span class="icon">{{ openFaq === idx ? '−' : '+' }}</span>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'До Нового года' }
]

const timeLeft = ref<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
const isCelebration = ref(false)
const targetYear = ref<number>(new Date().getFullYear() + 1)
const timeZoneLabel = ref('—')

const copyLabel = ref('Скопировать')
const shareLabel = ref('Поделиться ссылкой')

const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const shareTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const tickTimer = ref<ReturnType<typeof setInterval> | null>(null)

const openFaq = ref<number | null>(null)

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function plural(value: number, forms: [string, string, string]) {
  const abs = Math.abs(value) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last > 1 && last < 5) return forms[1]
  if (last === 1) return forms[0]
  return forms[2]
}

function formatNumber(value: number) {
  return value.toLocaleString('ru-RU')
}

function getTargetDate(year: number) {
  return new Date(year, 0, 1, 0, 0, 0, 0)
}

function updateCountdown() {
  const now = new Date()
  const target = getTargetDate(targetYear.value)
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) {
    isCelebration.value = true
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  isCelebration.value = false
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  timeLeft.value = { days, hours, minutes, seconds }
}

function countNextYear() {
  targetYear.value += 1
  updateCountdown()
}

function setTempLabel(
  labelRef: typeof copyLabel,
  timerRef: typeof copyTimer,
  value: string,
  fallback: string
) {
  labelRef.value = value
  if (timerRef.value) clearTimeout(timerRef.value)
  timerRef.value = setTimeout(() => {
    labelRef.value = fallback
  }, 2000)
}

const targetDateLabel = computed(() => {
  const date = new Date(targetYear.value, 0, 1).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  return `${date}, 00:00`
})

const nextTargetDateLabel = computed(() => {
  const date = new Date(targetYear.value + 1, 0, 1).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  return `${date}, 00:00`
})

const summaryText = computed(() => {
  if (isCelebration.value) {
    return `С Новым годом! Следующий Новый год: ${nextTargetDateLabel.value}.`
  }
  const { days, hours, minutes, seconds } = timeLeft.value
  return `До Нового года осталось ${formatNumber(days)} ${plural(days, [
    'день',
    'дня',
    'дней'
  ])} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})

async function copyResult() {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(summaryText.value)
    setTempLabel(copyLabel, copyTimer, 'Скопировано', 'Скопировать')
  } catch (error) {
    setTempLabel(copyLabel, copyTimer, 'Не удалось скопировать', 'Скопировать')
  }
}

async function shareLink() {
  const url = canonicalUrl.value
  if (typeof navigator === 'undefined') return
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Сколько дней до Нового года',
        text: summaryText.value,
        url
      })
      setTempLabel(shareLabel, shareTimer, 'Ссылка отправлена', 'Поделиться ссылкой')
      return
    } catch (error) {
      setTempLabel(shareLabel, shareTimer, 'Не удалось поделиться', 'Поделиться ссылкой')
      return
    }
  }

  if (!navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(url)
    setTempLabel(shareLabel, shareTimer, 'Ссылка скопирована', 'Поделиться ссылкой')
  } catch (error) {
    setTempLabel(shareLabel, shareTimer, 'Не удалось скопировать', 'Поделиться ссылкой')
  }
}

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

const faqItems = [
  {
    q: 'Как считается время до Нового года?',
    a: 'Берется текущее локальное время устройства и считается разница до ближайшего 1 января 00:00. Таймер обновляется каждую секунду.'
  },
  {
    q: 'Учитывается ли часовой пояс?',
    a: 'Да, счетчик использует ваш локальный часовой пояс, поэтому для разных регионов числа могут отличаться.'
  },
  {
    q: 'Почему у меня другое число чем у друга?',
    a: 'Скорее всего, у вас разные часовые пояса или на устройствах разное системное время.'
  },
  {
    q: 'Можно ли скопировать результат?',
    a: 'Да, кнопка «Скопировать» создаст готовую строку с днями, часами, минутами и секундами.'
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Да, страница адаптивна, кнопки и цифры удобно читаются на мобильных экранах.'
  },
  {
    q: 'Что будет когда наступит 1 января?',
    a: 'Появится поздравление «С Новым годом» и кнопка, чтобы запустить отсчет до следующего года.'
  },
  {
    q: 'Как узнать сколько часов осталось?',
    a: 'Посмотрите блок «Часы» в таймере: он показывает точные часы до полуночи 1 января.'
  },
  {
    q: 'Считает ли до ближайшего Нового года?',
    a: 'Да, цель всегда ближайшее 1 января по вашему местному времени.'
  },
  {
    q: 'Что если системное время неправильное?',
    a: 'Таймер опирается на время устройства. Включите авто-синхронизацию времени, чтобы увидеть точный результат.'
  },
  {
    q: 'Можно ли добавить на рабочий стол?',
    a: 'Да, сохраните страницу как ярлык или добавьте в избранное, чтобы открывать таймер в один тап.'
  },
  {
    q: 'Обновляется ли счетчик автоматически?',
    a: 'Да, данные обновляются каждую секунду без перезагрузки страницы.'
  },
  {
    q: 'Почему я вижу нули?',
    a: 'Это означает, что Новый год уже наступил. Нажмите кнопку «Считать до следующего» для нового отсчета.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/days-until-new-year`)
const metaDescription =
  'Сколько дней осталось до Нового года. Таймер до 1 января с днями, часами, минутами и секундами. Копирование, ссылка, работает на телефоне.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
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
        { '@type': 'ListItem', position: 3, name: 'До Нового года', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Сколько дней до Нового года | Таймер онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Сколько дней до Нового года | Таймер онлайн | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  ogUrl: canonicalUrl.value,
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

onMounted(() => {
  timeZoneLabel.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  updateCountdown()
  tickTimer.value = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  if (tickTimer.value) clearInterval(tickTimer.value)
  if (copyTimer.value) clearTimeout(copyTimer.value)
  if (shareTimer.value) clearTimeout(shareTimer.value)
})
</script>

<style scoped>
.new-year-page {
  display: grid;
  gap: clamp(22px, 3vw, 40px);
  width: min(1100px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 32px) 0 clamp(36px, 4vw, 70px);
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
  font-size: clamp(34px, 6vw, 56px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  max-width: 860px;
  color: #cbd5e1;
  font-size: 16px;
}

.timer-card,
.seo-card {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.65));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 14px;
}

.time-box {
  background: rgba(2, 6, 23, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 18px;
  text-align: center;
  display: grid;
  gap: 8px;
}

.time-value {
  font-size: clamp(32px, 5vw, 46px);
  font-weight: 800;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}

.time-label {
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.celebration {
  display: grid;
  gap: 10px;
  text-align: center;
  padding: 16px;
  border-radius: 16px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
}

.celebration h2 {
  margin: 0;
  font-size: 26px;
}

.celebration p {
  margin: 0;
  color: #cbd5e1;
}

.timer-meta {
  display: grid;
  gap: 6px;
  color: #cbd5e1;
}

.timer-meta .note {
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

.btn.primary {
  background: linear-gradient(130deg, rgba(250, 204, 21, 0.9), rgba(56, 189, 248, 0.8));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
}

.seo-text h2 {
  margin: 0 0 8px;
}

.seo-text {
  --seo-bleed: 16px;
}

.seo-text h3 {
  margin: 16px 0 6px;
  font-size: 18px;
}

.seo-text p {
  margin: 0 0 14px;
  color: #cbd5e1;
}

.seo-text ul {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  display: grid;
  gap: 8px;
}

.callout {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 14px;
  margin: 0 0 14px calc(var(--seo-bleed) * -1);
  padding: 12px 16px;
  color: #e2e8f0;
}

.callout p {
  margin: 0;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.45), transparent);
  margin: 10px 0;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin: 6px 0 14px calc(var(--seo-bleed) * -1);
}

.highlight {
  border: 1px dashed rgba(148, 163, 184, 0.35);
  border-radius: 14px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.55);
}

.highlight h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.highlight ul {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  display: grid;
  gap: 6px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 6px 0 12px calc(var(--seo-bleed) * -1);
  padding-left: var(--seo-bleed);
}

.pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: #e2e8f0;
}

.note-card {
  border: 1px solid rgba(250, 204, 21, 0.35);
  background: rgba(250, 204, 21, 0.1);
  border-radius: 14px;
  padding: 12px 16px;
  margin: 10px 0 4px calc(var(--seo-bleed) * -1);
}

.note-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.note-card p {
  margin: 0;
  color: #e2e8f0;
}

.media {
  margin: 12px 0 18px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.7);
}

.media img {
  width: 100%;
  display: block;
  height: auto;
}

.media figcaption {
  padding: 10px 12px;
  font-size: 13px;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.65);
}

.media.align-right {
  float: right;
  max-width: 360px;
  margin: 8px 0 18px 18px;
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
  border-color: rgba(250, 204, 21, 0.45);
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

@media (max-width: 720px) {
  .media.align-right {
    float: none;
    max-width: 100%;
    margin-left: 0;
  }

  .action-row {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
