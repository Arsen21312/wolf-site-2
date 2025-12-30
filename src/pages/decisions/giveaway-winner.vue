<template>
  <main class="giveaway-page">
    <section class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Генератор победителя розыгрыша</h1>
      <p class="lead">Вставь список участников и нажми кнопку — всё честно и без сервера</p>
    </section>

    <section class="stack">
      <article class="card participants-card">
        <div class="card-head">
          <div>
            <h2>Список участников</h2>
            <p>По одному участнику на строку: ник, ссылка, имя или любые строки.</p>
          </div>
          <div class="card-actions">
            <button class="btn ghost" type="button" @click="insertSample">Вставить пример</button>
            <button class="btn ghost" type="button" @click="clearParticipants">Очистить</button>
          </div>
        </div>
        <textarea
          v-model="participantsInput"
          rows="12"
          placeholder="@winner_one&#10;https://t.me/giveaway&#10;Мария Петрова&#10;user-123"
        ></textarea>
        <div class="meta-row">
          <span>Строк всего: {{ totalLines }}</span>
          <span>Уникальных участников: {{ uniqueCount }}</span>
        </div>
      </article>

      <article class="card settings-card">
        <h2>Настройки</h2>
        <div class="field-row">
          <label class="field">
            Количество победителей
            <input v-model.number="winnersCount" type="number" min="1" max="20" />
          </label>
        </div>
        <label class="toggle">
          <input v-model="removeDuplicates" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Удалять дубли (рекомендуется)</span>
        </label>
      </article>

      <article class="card action-card">
        <div class="action-row">
          <button class="btn primary" type="button" :disabled="!participantsInput.trim()" @click="runGiveaway">
            Провести розыгрыш
          </button>
          <button class="btn ghost" type="button" :disabled="!protocolText" @click="copyResult">
            {{ copyLabel }}
          </button>
          <button class="btn ghost" type="button" :disabled="!protocolText" @click="downloadProtocol">
            Скачать протокол TXT
          </button>
          <button class="btn ghost" type="button" :disabled="!protocolText" @click="resetGiveaway">
            Сбросить
          </button>
        </div>
        <p v-if="drawError" class="alert">{{ drawError }}</p>
      </article>

      <article class="card result-card">
        <div class="result-head">
          <h2>Результат</h2>
          <span v-if="resultTimestamp">Время: {{ resultTimestamp }}</span>
        </div>
        <div v-if="hasResult" class="result-body">
          <div class="result-block">
            <h3>Победители</h3>
            <ol>
              <li v-for="(winner, index) in winners" :key="`winner-${index}`">{{ winner }}</li>
            </ol>
          </div>
          <div class="result-meta">
            <p>Строк всего {{ resultStats.totalLines }}, уникальных {{ resultStats.uniqueCount }}</p>
            <p>Итоговый пул: {{ resultStats.poolCount }} участников</p>
          </div>
          <div class="hash-row">
            <span>Проверочный код</span>
            <code>{{ resultHash }}</code>
          </div>
          <details class="protocol" v-if="protocolText">
            <summary>Показать протокол</summary>
            <textarea readonly rows="8" :value="protocolText"></textarea>
          </details>
        </div>
        <p v-else class="empty-state">Пока нет результатов. Нажми "Провести розыгрыш".</p>
      </article>
    </section>

    <section class="fairness-card">
      <h2>Честность рандома</h2>
      <p>
        Используем <strong>crypto.getRandomValues</strong> и фиксируем протокол с хэшем, чтобы результат можно было проверить.
      </p>
    </section>

    <section class="seo-article">
      <h2>Как выбрать победителя честно</h2>
      <p>
        Честный розыгрыш начинается с прозрачных правил. Заранее определи количество победителей, включи удаление дублей,
        зафиксируй условия и используй криптографический рандом.
      </p>

      <h2>Почему важно убирать дубли</h2>
      <p>
        Один человек с десятью одинаковыми строками получает десять шансов вместо одного. Удаление дублей выравнивает вероятность
        и делает результат справедливым.
      </p>

      <h2>Можно выбрать несколько победителей</h2>
      <p>
        Просто укажи нужное количество победителей и запускай розыгрыш. Генератор покажет список сразу после выбора.
      </p>

      <h2>Как подготовить список из комментариев</h2>
      <p>
        Скопируй участников из комментариев, вставь в поле списка и включи автообрезку пробелов. Если в тексте есть @, # или ссылки,
        список всё равно подходит.
      </p>

      <h2>Протокол розыгрыша и доверие аудитории</h2>
      <p>
        Протокол фиксирует параметры, итоговый список и хэш. Это позволяет быстро показать аудитории, что победители выбраны честно.
      </p>
    </section>

    <section class="faq-block">
      <div class="faq-card">
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
              <span class="faq-icon" aria-hidden="true">{{ openFaq === idx ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="other-decisions">
      <h2>Другие решения</h2>
      <div class="other-grid">
        <NuxtLink class="other-link" to="/decisions/wheel-of-fortune">
          <span class="other-title">Колесо фортуны</span>
          <span class="other-desc">Крути колесо, чтобы выбрать победителя или решение.</span>
        </NuxtLink>
        <NuxtLink class="other-link" to="/decisions/random-choice">
          <span class="other-title">Случайный выбор</span>
          <span class="other-desc">Быстрое решение между вариантами и списками.</span>
        </NuxtLink>
        <NuxtLink class="other-link" to="/decisions/coin-flip">
          <span class="other-title">Монетка</span>
          <span class="other-desc">Самый быстрый выбор 50/50.</span>
        </NuxtLink>
        <NuxtLink class="other-link" to="/decisions/yes-no">
          <span class="other-title">Да / Нет</span>
          <span class="other-desc">Честный ответ на любой вопрос.</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { normalizeParticipants } from '@/utils/decisions/giveaway/normalize'
import { pickWinners } from '@/utils/decisions/giveaway/pickWinners'
import { sha256 } from '@/utils/decisions/giveaway/hash'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Решения', to: '/decisions' },
  { label: 'Генератор победителя' }
]

const participantsInput = ref('')

const winnersCount = ref(1)
const removeDuplicates = ref(true)

const trimEdges = ref(true)
const ignoreEmpty = ref(true)
const normalizeCase = ref(false)

const drawError = ref('')
const winners = ref<string[]>([])
const resultHash = ref('')
const resultTimestamp = ref('')
const protocolText = ref('')
const resultStats = reactive({
  totalLines: 0,
  uniqueCount: 0,
  poolCount: 0,
  duplicateCount: 0
})

const copyLabel = ref('Копировать результат')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const options = computed(() => ({
  trimEdges: trimEdges.value,
  ignoreEmpty: ignoreEmpty.value,
  normalizeCase: normalizeCase.value
}))

const previewNormalized = computed(() => normalizeParticipants(participantsInput.value, options.value))
const totalLines = computed(() => previewNormalized.value.totalLines)
const uniqueCount = computed(() => previewNormalized.value.unique.length)
const hasResult = computed(() => winners.value.length > 0)

const buildPool = () => {
  const normalized = normalizeParticipants(participantsInput.value, options.value)
  const pool = removeDuplicates.value ? normalized.unique : normalized.normalized

  return {
    pool,
    stats: {
      totalLines: normalized.totalLines,
      uniqueCount: normalized.unique.length,
      poolCount: pool.length,
      duplicateCount: normalized.duplicateCount
    }
  }
}

const buildProtocol = (payload: {
  timestamp: string
  winners: string[]
  stats: { totalLines: number; uniqueCount: number; poolCount: number; duplicateCount: number }
  hash: string
}) => {
  const lines = [
    'Протокол розыгрыша',
    `Время: ${payload.timestamp}`,
    '',
    'Параметры:',
    `- Победителей: ${winnersCount.value}`,
    `- Удалять дубли: ${removeDuplicates.value ? 'да' : 'нет'}`,
    '',
    'Статистика:',
    `- Строк всего: ${payload.stats.totalLines}`,
    `- Уникальных: ${payload.stats.uniqueCount}`,
    `- Убрано дублей: ${removeDuplicates.value ? payload.stats.duplicateCount : 0}`,
    `- Итоговый пул: ${payload.stats.poolCount}`,
    '',
    'Победители:',
    payload.winners.length ? payload.winners.map((winner, idx) => `${idx + 1}. ${winner}`).join('\n') : '-',
    '',
    `Проверочный код: ${payload.hash || '-'}`
  ]

  return lines.join('\n')
}

const runGiveaway = async () => {
  drawError.value = ''
  const { pool, stats } = buildPool()

  if (!pool.length) {
    winners.value = []
    protocolText.value = ''
    resultHash.value = ''
    resultTimestamp.value = ''
    drawError.value = 'Список пуст. Введи участников.'
    return
  }

  const winnersLimit = Math.min(Math.max(1, winnersCount.value), 20)

  const { winners: pickedWinners } = pickWinners(pool, {
    winnersCount: winnersLimit,
    backupsCount: 0,
    removeWinnerFromPool: true
  })

  winners.value = pickedWinners

  resultStats.totalLines = stats.totalLines
  resultStats.uniqueCount = stats.uniqueCount
  resultStats.poolCount = stats.poolCount
  resultStats.duplicateCount = stats.duplicateCount

  const timestamp = new Date().toISOString()
  resultTimestamp.value = timestamp

  const hashInput = JSON.stringify({
    participants: participantsInput.value,
    settings: {
      winnersCount: winnersLimit,
      removeDuplicates: removeDuplicates.value
    },
    results: {
      winners: pickedWinners
    },
    timestamp
  })

  const hash = await sha256(hashInput)
  resultHash.value = hash
  protocolText.value = buildProtocol({
    timestamp,
    winners: pickedWinners,
    stats,
    hash
  })
}

const copyResult = async () => {
  if (!protocolText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(protocolText.value)
    copyLabel.value = 'Скопировано'
  } catch (error) {
    copyLabel.value = 'Не удалось скопировать'
  }

  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyTimer.value = setTimeout(() => {
    copyLabel.value = 'Копировать результат'
  }, 2000)
}

const downloadProtocol = () => {
  if (!protocolText.value) return
  if (typeof document === 'undefined') return
  const blob = new Blob([protocolText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'giveaway-protocol.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const resetGiveaway = () => {
  winners.value = []
  resultHash.value = ''
  resultTimestamp.value = ''
  protocolText.value = ''
  drawError.value = ''
  copyLabel.value = 'Копировать результат'
}

const insertSample = () => {
  participantsInput.value = [
    '@wolf_club',
    '@wolf_club',
    '@night_runner',
    'Мария Петрова',
    'Илья С.',
    'https://t.me/neuralwisewolf',
    'User-404',
    '#giveaway2025'
  ].join('\n')
}

const clearParticipants = () => {
  participantsInput.value = ''
}

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const openFaq = ref<number | null>(null)
const faqItems = [
  {
    q: 'Это реально случайно?',
    a: 'Да. Выбор делается через crypto.getRandomValues - это криптографический источник случайности.'
  },
  {
    q: 'Можно выбрать несколько победителей?',
    a: 'Да, просто укажи количество победителей перед запуском.'
  },
  {
    q: 'Как убрать дубли?',
    a: 'Оставь включенным переключатель "Удалять дубли". Список будет очищен автоматически.'
  },
  {
    q: 'Можно ли загрузить CSV?',
    a: 'Сейчас нет - чтобы всё было максимально просто.'
  },
  {
    q: 'Сохраняется ли мой список?',
    a: 'Нет. Всё работает в браузере и не отправляется на сервер.'
  },
  {
    q: 'Как сделать розыгрыш прозрачным?',
    a: 'Скачай протокол и покажи его участникам - там есть параметры, список и проверочный код.'
  }
]

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/giveaway-winner`)
const metaDescription =
  'Выбери победителя из списка участников. Удаление дублей и честный рандом на crypto.getRandomValues.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Генератор победителя розыгрыша',
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
        { '@type': 'ListItem', position: 3, name: 'Генератор победителя', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Генератор победителя розыгрыша онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Генератор победителя розыгрыша онлайн | Neural Wise Wolf',
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
.giveaway-page {
  display: grid;
  gap: clamp(24px, 3.4vw, 42px);
  width: min(900px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(40px, 4vw, 64px);
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(30px, 5vw, 46px);
  font-family: 'Unbounded', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  color: #cbd5e1;
  max-width: 660px;
}

.stack {
  display: grid;
  gap: 16px;
}

.card {
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.65), rgba(2, 6, 23, 0.88));
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 20px;
  padding: clamp(16px, 2.2vw, 22px);
  padding-top: 12px;
  display: grid;
  gap: 14px;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.card-actions .btn {
  align-self: center;
  line-height: 1.2;
  padding: 6px 12px;
}

textarea,
input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(2, 6, 23, 0.85);
  color: #e2e8f0;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

textarea {
  resize: vertical;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #94a3b8;
  font-size: 13px;
}

.field {
  display: grid;
  gap: 8px;
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: #e2e8f0;
  cursor: pointer;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 12px;
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
  background: rgba(34, 197, 94, 0.8);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(148, 163, 184, 0.1);
  color: #e2e8f0;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(56, 189, 248, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(34, 197, 94, 0.9), rgba(14, 165, 233, 0.9));
  border: none;
  color: #0f172a;
}

.alert {
  margin: 0;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #fecaca;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

.result-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: #cbd5e1;
  font-size: 13px;
}

.result-body {
  display: grid;
  gap: 14px;
}

.result-block h3 {
  margin: 0 0 8px;
}

.result-block ol {
  margin: 0;
  padding-left: 18px;
  color: #e2e8f0;
  display: grid;
  gap: 4px;
}

.result-meta {
  color: #94a3b8;
  font-size: 13px;
}

.hash-row {
  display: grid;
  gap: 6px;
  color: #cbd5e1;
}

.hash-row code {
  background: rgba(15, 23, 42, 0.6);
  padding: 8px 10px;
  border-radius: 10px;
  word-break: break-all;
}

.protocol {
  display: grid;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 10px 12px;
  background: rgba(15, 23, 42, 0.5);
}

.protocol summary {
  cursor: pointer;
  color: #e2e8f0;
  font-weight: 700;
}

.protocol textarea {
  margin-top: 10px;
  background: rgba(2, 6, 23, 0.9);
  min-height: 140px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.empty-state {
  margin: 0;
  color: #94a3b8;
}

.fairness-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 20px;
  padding: clamp(16px, 2.5vw, 22px);
  display: grid;
  gap: 10px;
}

.fairness-card h2 {
  margin: 0;
}

.fairness-card p {
  margin: 0;
  color: #cbd5e1;
}

.seo-article {
  display: grid;
  gap: 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 20px;
  padding: clamp(16px, 2.5vw, 22px);
}

.seo-article h2 {
  margin: 0;
}

.seo-article p {
  margin: 0;
  color: #cbd5e1;
}

.faq-block {
  display: grid;
  justify-items: center;
}

.faq-card {
  width: 100%;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 20px;
  padding: clamp(16px, 2.5vw, 22px);
  display: grid;
  gap: 12px;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.6);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(14, 165, 233, 0.6);
  background: rgba(14, 165, 233, 0.12);
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

.faq-answer {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 14px;
}

.faq-item.open .faq-answer {
  max-height: 180px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-answer p {
  margin: 0;
  color: #cbd5e1;
}

.other-decisions {
  display: grid;
  gap: 12px;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.other-link {
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  padding: 14px;
  display: grid;
  gap: 6px;
  transition: transform 0.12s ease, border-color 0.2s ease;
}

.other-link:hover {
  transform: translateY(-2px);
  border-color: rgba(14, 165, 233, 0.6);
}

.other-title {
  font-weight: 800;
}

.other-desc {
  color: #94a3b8;
  font-size: 13px;
}

@media (max-width: 720px) {
  .card-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
