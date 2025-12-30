<template>
  <main class="base64-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Base64 онлайн</h1>
      <p class="lead">Кодируй и декодируй Base64 быстро и без регистрации</p>
    </header>

    <section class="tool-card">
      <div class="mode-tabs">
        <button
          class="tab"
          type="button"
          :class="{ active: mode === 'encode' }"
          @click="setMode('encode')"
        >
          Encode
        </button>
        <button
          class="tab"
          type="button"
          :class="{ active: mode === 'decode' }"
          @click="setMode('decode')"
        >
          Decode
        </button>
      </div>

      <div class="panel-grid">
        <div class="panel input-panel">
          <div class="panel-head">
            <div>
              <h2>Ввод</h2>
              <p>Вставь текст или Base64 и нажми кнопку для обработки.</p>
            </div>
            <button class="btn ghost" type="button" @click="insertSample">
              Пример
            </button>
          </div>
          <textarea
            v-model="inputText"
            class="text-area"
            rows="10"
            placeholder="Введи текст или Base64 строку"
          ></textarea>
          <div class="input-meta">
            <span>Символов: {{ inputCount }}</span>
          </div>
        </div>

        <div class="panel output-panel">
          <div class="panel-head">
            <div>
              <h2>Результат</h2>
              <p>Готовый результат с переносами строк и поддержкой Unicode.</p>
            </div>
            <button class="btn ghost" type="button" :disabled="!resultText" @click="copyResult">
              {{ copyLabel }}
            </button>
          </div>
          <textarea
            class="text-area result-area"
            readonly
            :value="resultText"
            rows="10"
            placeholder="Здесь появится результат"
          ></textarea>
          <div class="input-meta">
            <span>Символов: {{ resultCount }}</span>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="!inputText" @click="process">
          {{ modeActionLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!resultText" @click="swapToInput">
          Поменять местами
        </button>
        <button class="btn ghost" type="button" :disabled="!inputText && !resultText" @click="clearAll">
          Очистить
        </button>
        <button class="btn ghost" type="button" :disabled="!resultText" @click="downloadTxt">
          Скачать TXT
        </button>
      </div>

      <div class="settings-card">
        <p class="block-title">Настройки</p>
        <div class="toggle-grid">
          <label class="toggle">
            <input v-model="urlSafe" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>URL safe Base64 (+ → -, / → _)</span>
          </label>
          <label class="toggle" :class="{ highlight: showStripHint }">
            <input v-model="stripWhitespace" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Убирать переносы строк при decode</span>
          </label>
          <label class="toggle">
            <input v-model="addLineBreaks" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Добавлять переносы каждые 76 символов при encode</span>
          </label>
        </div>
      </div>

      <div v-if="errorMessage" class="error" role="alert">
        <p>{{ errorMessage }}</p>
        <p class="error-hint">Base64 должен быть без лишних символов и пробелов.</p>
        <p v-if="showStripHint" class="error-hint">
          Подсказка: включи “Убирать переносы строк при decode”.
        </p>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Что такое Base64 простыми словами</h2>
        <p>
          Base64 — это способ представить бинарные данные в виде обычного текста. Он превращает байты
          в символы из безопасного набора, чтобы их можно было передавать через формы, почту и API.
        </p>

        <h2>Зачем используют Base64 в вебе</h2>
        <p>
          Формат удобен, когда нужно встроить файл в HTML, отправить бинарные данные в JSON или
          сохранить картинку как строку. Base64 читается как текст и не ломает протоколы.
        </p>

        <h2>Base64 и Unicode, почему ломается btoa</h2>
        <p>
          Функция btoa работает только с ASCII и ломается на кириллице и эмодзи. Поэтому здесь
          используется TextEncoder и корректная конвертация байтов, чтобы Unicode кодировался без
          потерь.
        </p>

        <h2>URL safe Base64, чем отличается</h2>
        <p>
          В URL-safe варианте символы “+” и “/” заменяются на “-” и “_”. Так строка становится
          безопасной для ссылок и query-параметров.
        </p>

        <h2>Частые ошибки при декодировании</h2>
        <p>
          Обычно ошибка возникает из-за лишних пробелов, переносов строк или поврежденной длины.
          Проверь, что в строке нет лишних символов, и включи удаление переносов.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/json-formatter">
            <span class="other-title">JSON Formatter</span>
            <span class="other-desc">Форматирование и проверка JSON с удобной структурой.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/url-encode">
            <span class="other-title">URL Encode Decode</span>
            <span class="other-desc">Кодирование параметров для ссылок и API запросов.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/password-generator">
            <span class="other-title">Генератор паролей</span>
            <span class="other-desc">Сильные пароли за секунду с копированием и скачиванием.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-case">
            <span class="other-title">Изменение регистра</span>
            <span class="other-desc">camelCase, snake_case и другие форматы текста.</span>
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import {
  Base64DecodeError,
  decodeBase64,
  encodeBase64
} from '@/utils/encode/base64'

type Mode = 'encode' | 'decode'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Base64' }
]

const mode = ref<Mode>('encode')
const inputText = ref('')
const resultText = ref('')
const errorMessage = ref('')
const copyLabel = ref('Копировать')
const openFaq = ref<number | null>(null)
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const urlSafe = ref(false)
const stripWhitespace = ref(true)
const addLineBreaks = ref(false)

const inputCount = computed(() => inputText.value.length)
const resultCount = computed(() => resultText.value.length)
const modeActionLabel = computed(() => (mode.value === 'encode' ? 'Encode' : 'Decode'))
const showStripHint = computed(
  () => Boolean(errorMessage.value) && !stripWhitespace.value && /[\s\r\n]/.test(inputText.value)
)

const sampleText = 'Привет, волк!'
const sampleBase64 = '0J/RgNC40LLQtdGCLCDQstC+0LvQuiE='

function setMode(nextMode: Mode) {
  mode.value = nextMode
  errorMessage.value = ''
}

function insertSample() {
  inputText.value = mode.value === 'encode' ? sampleText : sampleBase64
  errorMessage.value = ''
}

function process() {
  errorMessage.value = ''
  if (!inputText.value) {
    resultText.value = ''
    return
  }

  if (mode.value === 'encode') {
    resultText.value = encodeBase64(inputText.value, {
      urlSafe: urlSafe.value,
      addLineBreaks: addLineBreaks.value,
      lineLength: 76
    })
    return
  }

  try {
    resultText.value = decodeBase64(inputText.value, {
      urlSafe: urlSafe.value,
      stripWhitespace: stripWhitespace.value
    })
  } catch (error) {
    resultText.value = ''
    if (error instanceof Base64DecodeError) {
      errorMessage.value = error.message
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Не удалось декодировать строку. Проверьте Base64.'
    }
  }
}

function swapToInput() {
  if (!resultText.value) return
  inputText.value = resultText.value
  resultText.value = ''
  errorMessage.value = ''
}

function clearAll() {
  inputText.value = ''
  resultText.value = ''
  errorMessage.value = ''
  copyLabel.value = 'Копировать'
}

async function copyResult() {
  if (!resultText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(resultText.value)
    copyLabel.value = 'Скопировано'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать'
    }, 2000)
  } catch (error) {
    copyLabel.value = 'Ошибка копирования'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать'
    }, 2000)
  }
}

function downloadTxt() {
  if (!resultText.value) return
  if (typeof document === 'undefined') return
  const blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'base64.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

watch([inputText, mode], () => {
  if (errorMessage.value) errorMessage.value = ''
})

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const faqItems = [
  {
    q: 'Base64 это шифрование или нет?',
    a: 'Нет. Base64 — это кодирование данных, а не шифрование. Он не скрывает информацию.'
  },
  {
    q: 'Почему декод не работает?',
    a: 'Чаще всего в строке есть лишние символы, пробелы или переносы. Проверьте формат и длину.'
  },
  {
    q: 'Можно ли кодировать русский текст?',
    a: 'Да, инструмент поддерживает Unicode через TextEncoder, поэтому кириллица кодируется корректно.'
  },
  {
    q: 'Зачем нужен URL safe?',
    a: 'Чтобы Base64 безопасно работал в URL и query-параметрах, где “+” и “/” могут ломать ссылку.'
  },
  {
    q: 'Можно ли хранить пароль в Base64?',
    a: 'Нет. Base64 легко обратим, поэтому для паролей нужны хеши и надежные алгоритмы.'
  },
  {
    q: 'Почему появляются переносы строк?',
    a: 'Некоторые системы делят Base64 на строки по 76 символов. Это можно включить или убрать.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/base64`)
const metaDescription =
  'Кодируй и декодируй Base64 с поддержкой Unicode, URL-safe режимом, копированием и скачиванием.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Base64 encode decode онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'Base64', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Base64 encode decode онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Base64 encode decode онлайн | Neural Wise Wolf',
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
.base64-page {
  display: grid;
  gap: clamp(24px, 3vw, 40px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(32px, 4vw, 64px);
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

.tool-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.16), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.mode-tabs {
  display: inline-flex;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 4px;
  gap: 6px;
  width: fit-content;
}

.tab {
  border: none;
  background: transparent;
  color: #cbd5e1;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.12s ease;
}

.tab.active {
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.9), rgba(34, 197, 94, 0.8));
  color: #0f172a;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.panel {
  display: grid;
  gap: 12px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-head h2 {
  margin: 0 0 4px;
}

.panel-head p {
  margin: 0;
  color: #94a3b8;
  max-width: 360px;
}

.text-area {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  color: #e2e8f0;
  padding: 12px 14px;
  resize: vertical;
  min-height: 240px;
  font-size: 15px;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.text-area::placeholder {
  color: #64748b;
}

.result-area {
  white-space: pre-wrap;
}

.input-meta {
  display: flex;
  gap: 16px;
  color: #94a3b8;
  font-size: 13px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.settings-card {
  display: grid;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  background: rgba(15, 23, 42, 0.5);
}

.block-title {
  margin: 0 0 8px;
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.toggle-grid {
  display: grid;
  gap: 10px;
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

.toggle.highlight {
  border-color: rgba(248, 113, 113, 0.6);
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.3);
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
  background: rgba(56, 189, 248, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.error {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.error p {
  margin: 0 0 6px;
}

.error p:last-child {
  margin-bottom: 0;
}

.error-hint {
  color: #fecaca;
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
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.8), rgba(34, 197, 94, 0.75));
  border: none;
  color: #0f172a;
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

@media (max-width: 720px) {
  .panel-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .mode-tabs {
    width: 100%;
    justify-content: center;
  }
}
</style>
