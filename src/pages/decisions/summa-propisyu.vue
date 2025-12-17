<template>
  <div class="decisions-page flex flex-col gap-10 pb-16">
    <NavBar />

    <section class="page-center gap-4">
      <div class="px-3 py-1 rounded-full border border-white/10 bg-white/10 text-sm text-white/90 shadow-lg shadow-blue-500/10">
        Инструмент · Финансы
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
        Сумма прописью в тенге и рублях онлайн
      </h1>
      <p class="max-w-3xl text-lg text-slate-100">
        Бесплатный конвертер чисел в текст. Подходит для договоров, счетов, и любых документов, где нужна сумма прописью.
      </p>
      
    </section>

    <section class="page-center gap-6">
      <div class="converter-card">
        <div class="field-block">
          <label class="field-label">Сумма</label>
          <input v-model="amountRaw" type="text" class="neuro-input" placeholder="Например: 12345.67" />
          <p class="input-hint">Можно вводить 250500,25 или 250500.25</p>
        </div>

        <div class="currency-buttons">
          <button
            v-for="c in currencies"
            :key="c"
            :class="['pill-button', currency === c ? 'active' : '']"
            @click="setCurrency(c)"
          >
            {{ c }}
          </button>
        </div>

        <div class="options-grid">
          <div class="field-block">
            <label class="field-label">Налог НДС</label>
            <select v-model="vatMode" class="neuro-select">
              <option value="none">Без НДС</option>
              <option value="10">НДС 10%</option>
              <option value="12">НДС 12%</option>
              <option value="20">НДС 20%</option>
              <option value="custom">Своя ставка</option>
            </select>
          </div>

          <div class="field-block" v-if="vatMode === 'custom'">
            <label class="field-label">Своя ставка, %</label>
            <input v-model.number="vatCustom" type="number" min="0" max="100" class="neuro-input" placeholder="Например: 8" />
          </div>

          <div class="field-block" :class="vatMode === 'custom' ? '' : 'md-span'">
            <label class="field-label">Разделитель</label>
            <select v-model="decimalSeparator" class="neuro-select">
              <option value=".">Точка (123.45)</option>
              <option value=",">Запятая (123,45)</option>
            </select>
          </div>
        </div>

        <div class="results-card">
          <div class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['pill-button', activeTab === tab.id ? 'active' : '']"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <div v-if="currentResults.length" class="results-list">
            <div v-for="(line, idx) in currentResults" :key="idx" class="result-row">
              <span class="result-text">{{ line }}</span>
              <button class="copy-btn" @click="copyResult(line)">
                <span v-if="copiedText === line">✅</span>
                <span v-else>📋</span>
                <span aria-live="polite">{{ copiedText === line ? 'Скопировано' : 'Копировать' }}</span>
              </button>
            </div>
          </div>
          <p v-else class="text-slate-300 text-center">Введите сумму и текст появится</p>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto w-full flex flex-col gap-4">
      <h2 class="text-2xl font-bold text-white features-title">Особенности инструмента</h2>
      <div class="features-grid">
        <article class="feature-card">
          <h3 class="text-lg font-semibold text-white mb-2">Мгновенное преобразование</h3>
          <p class="text-slate-300 text-sm">Конвертация суммы прописью в пару кликов, без ограничений и регистрации.</p>
        </article>
        <article class="feature-card">
          <h3 class="text-lg font-semibold text-white mb-2">Мультивалютность</h3>
          <p class="text-slate-300 text-sm">Рубли, тенге, доллары, евро и гривны с корректными падежами и копейками.</p>
        </article>
        <article class="feature-card">
          <h3 class="text-lg font-semibold text-white mb-2">Умное копирование</h3>
          <p class="text-slate-300 text-sm">Копируй нужную строку одной кнопкой, есть отметка успешного копирования.</p>
        </article>
      </div>
    </section>

    <section class="max-w-6xl mx-auto w-full flex flex-col gap-6 seo-section">
      <h2 class="text-2xl font-bold text-white seo-main-title">Как перевести сумму прописью</h2>
      <div class="seo-layout">
        <article class="seo-card guide-card">
          <h3 class="seo-card-title">Гайд за 30 секунд</h3>
          <ul class="guide-list">
            <li v-for="item in guideItems" :key="item.label">
              <span class="guide-icon">{{ item.icon }}</span>
              <span class="guide-text">{{ item.label }}</span>
            </li>
          </ul>
        </article>

        <div class="seo-column wide-column">
          <article class="seo-card formulas-card accent-card">
            <h3 class="seo-card-title">Примеры</h3>
            <div class="formulas-list">
              <button
                v-for="example in examples"
                :key="example.label"
                class="example-tile"
                type="button"
                @click="applyExample(example)"
              >
                <div class="formula-text">
                  <p class="formula-label">{{ example.label }}</p>
                  <p class="formula-desc">{{ example.description }}</p>
                </div>
                <span class="tile-icon" aria-hidden="true">↺</span>
              </button>
            </div>
          </article>

          <article class="seo-card faq-card">
            <h3 class="seo-card-title">FAQ</h3>
            <div class="faq-list">
              <div
                v-for="(item, idx) in faqItems"
                :key="item.question"
                class="faq-item"
                :class="{ 'faq-open': openFaq === idx }"
              >
                <button class="faq-toggle" type="button" @click="openFaq = openFaq === idx ? null : idx">
                  <span>{{ item.question }}</span>
                  <span class="faq-icon" aria-hidden="true">{{ openFaq === idx ? '−' : '+' }}</span>
                </button>
                <div v-show="openFaq === idx" class="faq-answer">
                  <p>{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <article class="seo-card templates-card">
          <div class="templates-header">
            <h3 class="seo-card-title">Готовые формулировки</h3>
            <p class="templates-subtitle">Спокойные заготовки под договоры и счета</p>
          </div>
          <div class="templates-chips">
            <button
              v-for="item in templateItems"
              :key="item.label"
              class="pill-button template-chip"
              :class="{ active: selectedTemplateLabel === item.label }"
              @click="selectTemplate(item.label)"
            >
              {{ item.label }}
            </button>
          </div>
          <div class="template-preview">
            <p>{{ resolveTemplate(selectedTemplateLabel) }}</p>
            <small class="template-note">Формулировка подходит для договоров и счетов</small>
          </div>
          <button class="pill-button template-copy-btn" @click="copyTemplate">Скопировать с текущими данными</button>
          <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'

const amountRaw = ref('')
const currency = ref('RUB')
const vatMode = ref('none')
const vatCustom = ref(0)
const decimalSeparator = ref('.')
const activeTab = ref('basic')
const copiedText = ref('')
const history = ref([])

const currencies = ['RUB', 'USD', 'EUR', 'UAH', 'KZT']
const tabs = [
  { id: 'basic', label: 'Основные' },
  { id: 'extended', label: 'Расширенные' },
  { id: 'financial', label: 'Финансовые' }
]

const guideItems = [
  { label: 'Вводишь сумму', icon: '🔢' },
  { label: 'Выбираешь валюту', icon: '💱' },
  { label: 'Настраиваешь НДС', icon: '📑' },
  { label: 'Ставишь разделитель', icon: '⚙️' },
  { label: 'Копируешь строку', icon: '📋' }
]

const templateItems = [
  {
    label: 'Счёт на оплату',
    build: (sum, words) => `Итого к оплате: ${sum}. Сумма прописью: ${words}`
  },
  {
    label: 'Договор',
    build: (sum, words) => `Стоимость работ составляет ${sum} (${words})`
  },
  {
    label: 'Акт',
    build: (sum, words) => `Работы выполнены на сумму ${sum} (${words})`
  },
  {
    label: 'КП',
    build: (sum, words) => `Предложение на сумму ${sum}. Прописью: ${words}`
  }
]

const faqItems = [
  {
    question: 'Как перевести сумму в текст?',
    answer:
      'Введи число, выбери валюту и нажми на вкладку результата. Мы сразу покажем сумму прописью и готовую строку для договора или счёта.'
  },
  {
    question: 'Как работает НДС?',
    answer:
      'Укажи ставку или выбери готовую. Мы посчитаем налог, покажем сумму с НДС и дадим строки для копирования. Если НДС не нужен, выбери «Без НДС».'
  },
  {
    question: 'Какие валюты поддерживаются?',
    answer:
      'Сейчас доступны рубли (RUB), тенге (KZT), доллары, евро и гривны — с правильными падежами и копейками/тиынами/центами.'
  },
  {
    question: 'Точка или запятая?',
    answer:
      'Можно вводить 250500,25 или 250500.25. В настройках выбери разделитель, который нужен для документа, и результаты будут в нужном формате.'
  },
  {
    question: 'Подходит ли для договоров и счетов?',
    answer:
      'Да, формулировки подходят для договоров, счетов и актов. Используй готовые строки, чтобы избежать ошибок в сумме прописью.'
  }
]

const openFaq = ref(null)
const selectedTemplateLabel = ref(templateItems[0].label)
const lastFormatted = ref('')
const lastWords = ref('')
const toastMessage = ref('')

const examples = [
  { label: '1 000.00 RUB', description: 'Одна тысяча рублей 00 копеек', amount: '1000.00', currency: 'RUB' },
  { label: '250 500,25 KZT', description: 'двести пятьдесят тысяч пятьсот тенге 25 тиынов', amount: '250500,25', currency: 'KZT' },
  { label: '9999.99 USD', description: 'девять тысяч девятьсот девяносто девять долларов 99 центов', amount: '9999.99', currency: 'USD' }
]

let debounceTimer

watch([amountRaw, currency, vatMode, vatCustom, decimalSeparator], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(convert, 400)
})

const currentResults = computed(() => {
  const last = history.value[0]
  if (!last) return []
  return last[activeTab.value] || []
})

function setCurrency(c) {
  currency.value = c
}

function parseAmount(raw) {
  if (!raw) return null
  const cleaned = raw.replace(/\s+/g, '').replace(',', '.')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : null
}

function getVatRate() {
  if (vatMode.value === 'none') return 0
  if (vatMode.value === 'custom') return Math.max(0, Math.min(100, vatCustom.value || 0))
  return Number(vatMode.value)
}

function plural(value, forms) {
  const n = Math.abs(value) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return forms[2]
  if (n1 > 1 && n1 < 5) return forms[1]
  if (n1 === 1) return forms[0]
  return forms[2]
}

const UNITS = [
  [
    ['ноль', '', ''],
    ['один', 'одна', 'одно'],
    ['два', 'две', 'два'],
    ['три', 'три', 'три'],
    ['четыре', 'четыре', 'четыре'],
    ['пять', 'пять', 'пять'],
    ['шесть', 'шесть', 'шесть'],
    ['семь', 'семь', 'семь'],
    ['восемь', 'восемь', 'восемь'],
    ['девять', 'девять', 'девять']
  ],
  ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
  ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'],
  ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']
]

const RANKS = [
  { forms: ['рубль', 'рубля', 'рублей'], fem: 0 },
  { forms: ['тысяча', 'тысячи', 'тысяч'], fem: 1 },
  { forms: ['миллион', 'миллиона', 'миллионов'], fem: 0 },
  { forms: ['миллиард', 'миллиарда', 'миллиардов'], fem: 0 }
]

function tripletToWords(num, fem) {
  const words = []
  const h = Math.floor(num / 100)
  const t = Math.floor((num % 100) / 10)
  const u = num % 10
  if (h) words.push(UNITS[3][h])
  if (t > 1) {
    words.push(UNITS[2][t])
    if (u) words.push(UNITS[0][u][fem])
  } else if (t === 1) {
    words.push(UNITS[1][u])
  } else if (u || (!h && !t && !words.length)) {
    words.push(UNITS[0][u][fem])
  }
  return words.join(' ')
}

function numberToWordsRu(value) {
  if (value === 0) return 'ноль'
  const parts = []
  let rank = 0
  let n = value
  while (n > 0 && rank < RANKS.length) {
    const triplet = n % 1000
    if (triplet) {
      const words = tripletToWords(triplet, rank === 1 ? 1 : 0)
      const rankWord = rank > 0 ? ` ${plural(triplet, RANKS[rank].forms)}` : ''
      parts.unshift(`${words}${rankWord}`.trim())
    }
    n = Math.floor(n / 1000)
    rank++
  }
  return parts.join(' ')
}

function amountToWords(amount, curr) {
  const whole = Math.floor(amount)
  const cents = Math.round((amount - whole) * 100)
  const currencyMap = {
    RUB: { main: ['рубль', 'рубля', 'рублей'], minor: ['копейка', 'копейки', 'копеек'], fem: 0 },
    KZT: { main: ['тенге', 'тенге', 'тенге'], minor: ['тиын', 'тиына', 'тиынов'], fem: 0 },
    USD: { main: ['доллар', 'доллара', 'долларов'], minor: ['цент', 'цента', 'центов'], fem: 0 },
    EUR: { main: ['евро', 'евро', 'евро'], minor: ['цент', 'цента', 'центов'], fem: 0 },
    UAH: { main: ['гривна', 'гривны', 'гривен'], minor: ['копейка', 'копейки', 'копеек'], fem: 0 }
  }
  const cfg = currencyMap[curr] || currencyMap.RUB
  const mainWords = numberToWordsRu(whole)
  const mainUnit = plural(whole, cfg.main)
  const minorUnit = plural(cents, cfg.minor)
  return `${mainWords} ${mainUnit} ${String(cents).padStart(2, '0')} ${minorUnit}`.trim()
}

function formatNumber(value) {
  const sep = decimalSeparator.value
  const parts = value.toFixed(2).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join(sep)
}

function buildResults(amountNum, formatted, vatPercent) {
  const baseWords = amountToWords(amountNum, currency.value)
  const vatValue = (amountNum * vatPercent) / 100
  const totalWithVat = amountNum + vatValue

  const basic = [`${formatted} (${baseWords})`]

  const extended = [
    `${formatted} — сумма прописью: ${baseWords}`,
    vatPercent > 0 ? `НДС ${vatPercent}%: ${formatNumber(vatValue)}` : 'Без НДС',
    vatPercent > 0 ? `Итого с НДС: ${formatNumber(totalWithVat)}` : `Итого: ${formatted}`
  ]

  const financial = [
    `Сумма: ${formatted}`,
    vatPercent > 0 ? `НДС ${vatPercent}%: ${formatNumber(vatValue)}` : 'НДС не облагается',
    vatPercent > 0 ? `Всего к оплате: ${formatNumber(totalWithVat)}` : `Всего к оплате: ${formatted}`,
    `Прописью: ${baseWords}`
  ]

  return { basic, extended, financial, baseWords, formatted }
}

function convert() {
  const num = parseAmount(amountRaw.value)
  if (num === null) {
    history.value = [{ basic: ['Введите корректную сумму'], extended: [], financial: [] }]
    lastFormatted.value = ''
    lastWords.value = ''
    return
  }
  const vatPercent = getVatRate()
  const formatted = formatNumber(num)
  const resultSets = buildResults(num, formatted, vatPercent)
  lastFormatted.value = resultSets.formatted
  lastWords.value = resultSets.baseWords
  history.value = [resultSets, ...history.value].slice(0, 10)
}

function copyResult(line) {
  if (!line) return
  navigator.clipboard?.writeText(line)
  copiedText.value = line
  setTimeout(() => {
    if (copiedText.value === line) copiedText.value = ''
  }, 1800)
}

function applyExample(example) {
  amountRaw.value = example.amount
  currency.value = example.currency
  convert()
}

function resolveTemplate(label) {
  const sum = lastFormatted.value || '{сумма}'
  const words = lastWords.value || '{сумма прописью}'
  const item = templateItems.find((t) => t.label === label)
  return item ? item.build(sum, words) : ''
}

function selectTemplate(label) {
  selectedTemplateLabel.value = label
}

function copyTemplate() {
  const text = resolveTemplate(selectedTemplateLabel.value)
  if (!text) return
  navigator.clipboard?.writeText(text)
  copiedText.value = text
  toastMessage.value = 'Готово, вставляй'
  setTimeout(() => {
    if (copiedText.value === text) copiedText.value = ''
    toastMessage.value = ''
  }, 1800)
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/summa-propisyu`)

const metaDescription =
  'Конвертер суммы прописью онлайн: KZT и RUB, числа в текст для договора или счета, учёт НДС и копирование готовых строк.'

useSeoMeta(() => ({
  title: 'Сумма прописью онлайн, тенге и рубли, конвертер чисел в текст | Нейронный Волк',
  description: metaDescription,
  ogTitle: 'Сумма прописью онлайн, тенге и рубли, конвертер чисел в текст | Нейронный Волк',
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
      name: 'Конвертер суммы прописью',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB'
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Решения', item: `${requestUrl.origin}/decisions` },
        { '@type': 'ListItem', position: 3, name: 'Сумма прописью', item: canonicalUrl.value }
      ]
    }
  ]
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
.converter-card {
  width: min(960px, 100%);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  text-align: center;
  margin: 0 auto;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
}

.field-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #cbd5e1;
}

.input-hint {
  margin: 0;
  color: #cbd5e1;
  font-size: 12px;
}

.neuro-input,
.neuro-select {
  width: min(520px, 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 12px 14px;
  font-size: 18px;
  text-align: center;
  outline: none;
}

.neuro-select {
  font-size: 15px;
  color: #0f172a;
  background: #fff;
  border-color: rgba(255, 255, 255, 0.35);
}

.currency-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.pill-button {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.pill-button:hover {
  border-color: rgba(255, 255, 255, 0.35);
}

.pill-button.active {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  width: 100%;
  justify-items: center;
}

.md-span {
  grid-column: span 1;
}

.results-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: center;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.result-row {
  width: 100%;
  max-width: 760px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

@media (min-width: 640px) {
  .result-row {
    flex-direction: row;
    justify-content: space-between;
  }
}

.result-text {
  color: #e5e7eb;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  padding: 8px 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

.copy-btn:hover {
  border-color: rgba(59, 130, 246, 0.6);
  color: #fff;
}

.neuro-select option {
  color: #0f172a;
  background-color: #fff;
}

.neuro-select:focus {
  color: #0f172a;
}

.page-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  justify-items: center;
}

.features-title {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  width: 100%;
  text-align: center;
}

.seo-section {
  padding: 48px 0 64px;
}

.seo-main-title {
  text-align: center;
  margin: 0 auto 10px;
}

.seo-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: start;
}

.seo-card {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
  display: grid;
  gap: 12px;
}

.seo-column {
  display: grid;
  gap: 12px;
}

.wide-column {
  grid-template-rows: auto auto;
}

.guide-card {
  padding-top: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: none;
}

.seo-card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
}

.guide-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.guide-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 9px 10px;
}

.guide-icon {
  font-size: 18px;
}

.guide-text {
  color: #e5e7eb;
  font-weight: 700;
}

.formulas-card {
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(35, 112, 255, 0.18);
}

.formulas-list {
  display: grid;
  gap: 10px;
}

.example-tile {
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.example-tile:hover {
  transform: translateY(-1px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.2);
}

.formula-text {
  display: grid;
  gap: 4px;
}

.formula-label {
  margin: 0;
  color: #fff;
  font-weight: 700;
}

.formula-desc {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.tile-icon {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 8px;
  color: #e5e7eb;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px 8px;
}

.faq-item.faq-open {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  background: transparent;
  border: none;
  color: #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
  padding: 8px 2px;
  text-align: left;
}

.faq-icon {
  font-size: 18px;
  line-height: 1;
}

.faq-answer {
  margin: 6px 2px 8px;
  color: #cbd5e1;
  line-height: 1.6;
}

.templates-header {
  display: grid;
  gap: 4px;
}

.templates-subtitle {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.templates-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.template-chip {
  padding: 8px 12px;
  border-radius: 12px;
}

.template-chip.active {
  background: linear-gradient(120deg, rgba(59, 130, 246, 0.35), rgba(168, 85, 247, 0.35));
  border-color: rgba(168, 85, 247, 0.6);
}

.template-copy-btn {
  padding: 10px 14px;
  justify-self: start;
}

.template-preview {
  margin: 4px 0 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  color: #e5e7eb;
  line-height: 1.6;
}

.template-note {
  display: block;
  margin-top: 6px;
  color: #cbd5e1;
  font-size: 12px;
}

.toast {
  margin-top: 8px;
  padding: 10px 12px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 12px;
  color: #e5e7eb;
  font-weight: 700;
}

@media (max-width: 768px) {
  .seo-layout {
    grid-template-columns: 1fr;
  }

  .wide-column {
    grid-template-columns: 1fr;
  }

  .seo-card {
    border-radius: 14px;
  }
}
</style>
