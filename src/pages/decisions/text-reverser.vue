<template>
  <main class="reverser-page">
    <header class="reverser-hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Реверс текста онлайн</h1>
      <p class="lead">
        Бесплатно, без регистрации — 3 режима реверса: полный, по словам и по строкам.
      </p>
    </header>

    <section class="mode-strip">
      <p class="block-title">Режим реверса</p>
      <div class="mode-inline">
        <label
          v-for="option in modeOptions"
          :key="option.value"
          class="mode-pill"
          :class="{ active: mode === option.value }"
        >
          <input v-model="mode" type="radio" name="reverse-mode" :value="option.value" />
          <span class="mode-title">{{ option.title }}</span>
          <span class="mode-desc">{{ option.description }}</span>
        </label>
      </div>
    </section>

    <section class="reverser-card">
      <div class="input-block">
        <label for="source-text">Исходный текст</label>
        <textarea
          id="source-text"
          v-model="sourceText"
          rows="6"
          placeholder="Введи текст для реверса"
        />
      </div>

      <div class="action-row">
        <button class="btn primary" :disabled="!sourceText.length" @click="applyReverse">
          Перевернуть текст
        </button>
        <button class="btn ghost" type="button" :disabled="!sourceText.length" @click="resetAll">
          Очистить
        </button>
        <button
          v-if="showScrollToResult"
          class="btn ghost scroll-btn"
          type="button"
          @click="scrollToResult"
        >
          ↓ К результату
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Символов</span>
          <span class="stat-value">{{ stats.characters }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Слов</span>
          <span class="stat-value">{{ stats.words }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Строк</span>
          <span class="stat-value">{{ stats.lines }}</span>
        </div>
      </div>

      <div id="result" ref="resultRef" class="result-block">
        <div class="result-head">
          <h2>Результат</h2>
          <button class="btn ghost" type="button" :disabled="!hasResult || !result" @click="copyResult">
            {{ copyLabel }}
          </button>
        </div>
        <div class="result-output" role="status" aria-live="polite">
          {{ hasResult ? result : 'Здесь появится результат после реверса.' }}
        </div>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Три режима реверса: когда и зачем использовать</h2>
        <p>
          Полный реверс разворачивает весь текст посимвольно: это удобно для проверки палиндромов,
          эффектных подписй и экспериментов с форматированием. Реверс по словам меняет только их
          порядок, сохраняя буквы внутри — полезно для перестановки фраз в заголовках и черновиках.
          Реверс по строкам пригодится для многострочных заметок, списков и логов.
        </p>
        <p>
          Инструмент работает прямо в браузере и сразу считает статистику. Никаких серверов, логинов
          и лишних шагов — вставляешь текст, выбираешь режим, получаешь результат и копируешь одним
          кликом.
        </p>
      </div>

      <div class="usage">
        <h3>Где пригодится реверс текста</h3>
        <ul class="usage-list">
          <li>Проверка палиндромов и игры со словами</li>
          <li>Перестановка строк в списках и планах</li>
          <li>Перевернутые подписи для сторис и мемов</li>
          <li>Быстрое тестирование шрифтов и UI</li>
          <li>Подготовка примеров для обучения</li>
        </ul>
      </div>

      <div class="faq">
        <h3>FAQ</h3>
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

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import { reverseText } from '@/utils/text/reverse'

definePageMeta({
  alias: ['/generators/text-reverser', '/generators/text-reverser/']
})

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Инструменты', to: '/decisions' },
  { label: 'Реверс текста онлайн' }
]

const modeOptions = [
  {
    value: 'full',
    title: 'Полный реверс',
    description: 'Разворот всех символов'
  },
  {
    value: 'words',
    title: 'По словам',
    description: 'Меняем порядок слов, буквы внутри не трогаем'
  },
  {
    value: 'lines',
    title: 'По строкам',
    description: 'Меняем порядок строк, содержимое строк не трогаем'
  }
]

const sourceText = ref('')
const mode = ref('full')
const result = ref('')
const lastInput = ref('')
const lastMode = ref('full')
const hasReversed = ref(false)
const copyLabel = ref('Копировать')
const copyTimer = ref(null)
const resultRef = ref(null)
const openFaq = ref(null)

const hasResult = computed(
  () => hasReversed.value && sourceText.value === lastInput.value && mode.value === lastMode.value
)

const showScrollToResult = computed(() => sourceText.value.length > 0 && !hasResult.value)

const stats = computed(() => {
  const text = sourceText.value
  const characters = text.length
  const words = text.trim() ? text.trim().split(/[ \t]+/).filter(Boolean).length : 0
  const lines = text.length ? text.split('\n').length : 0
  return { characters, words, lines }
})

const faqItems = [
  {
    q: 'Чем отличается полный реверс от реверса по словам?',
    a: 'Полный реверс переворачивает каждый символ, а режим по словам меняет только порядок слов.'
  },
  {
    q: 'Сохраняются ли эмодзи и спецсимволы?',
    a: 'Да, инструмент работает с emoji и юникодом, символы сохраняются корректно.'
  },
  {
    q: 'Можно ли переворачивать многострочный текст?',
    a: 'Да, выбери режим по строкам — он меняет порядок строк без изменения содержимого.'
  },
  {
    q: 'Почему количество слов может отличаться от ожиданий?',
    a: 'Слова считаются по пробелам и табам, пустые значения игнорируются.'
  },
  {
    q: 'Работает ли инструмент без регистрации?',
    a: 'Да, это полностью бесплатный инструмент, который работает прямо в браузере.'
  }
]

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
}

function applyReverse() {
  result.value = reverseText(sourceText.value, mode.value)
  lastInput.value = sourceText.value
  lastMode.value = mode.value
  hasReversed.value = true
  copyLabel.value = 'Копировать'
}

function resetAll() {
  sourceText.value = ''
  result.value = ''
  hasReversed.value = false
  copyLabel.value = 'Копировать'
}

async function copyResult() {
  if (!hasResult.value || !result.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(result.value)
    copyLabel.value = '✅ Скопировано!'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать'
    }, 2000)
  } catch (err) {
    copyLabel.value = 'Не удалось скопировать'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать'
    }, 2000)
  }
}

function scrollToResult() {
  if (typeof document === 'undefined') return
  const el = resultRef.value || document.getElementById('result')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/text-reverser`)
const metaDescription =
  'Переверни текст задом наперед, по словам или по строкам. Бесплатно, работает с emoji, копирование в один клик'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Реверс текста онлайн',
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
        { '@type': 'ListItem', position: 2, name: 'Инструменты', item: `${requestUrl.origin}/decisions` },
        { '@type': 'ListItem', position: 3, name: 'Реверс текста онлайн', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Реверс текста онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Реверс текста онлайн | Neural Wise Wolf',
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
.reverser-page {
  display: grid;
  gap: clamp(20px, 3vw, 36px);
  width: min(1100px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 32px) 0 clamp(32px, 4vw, 56px);
}

.reverser-hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.reverser-hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 48px);
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.reverser-hero .lead {
  max-width: 720px;
  margin: 0;
  color: #cbd5e1;
}

.reverser-card,
.seo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.reverser-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.input-block {
  display: grid;
  gap: 6px;
}

.input-block label {
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-block textarea {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 14px;
  color: #fff;
  font-size: 16px;
  resize: vertical;
  min-height: 160px;
  outline: none;
}

.input-block textarea::placeholder {
  color: #94a3b8;
}

.block-title {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mode-strip {
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.02);
}

.mode-inline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.mode-pill {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.mode-pill input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.mode-title {
  font-weight: 700;
  color: #e2e8f0;
}

.mode-pill.active {
  border-color: rgba(56, 189, 248, 0.45);
  background: linear-gradient(145deg, rgba(56, 189, 248, 0.18), rgba(255, 255, 255, 0.04));
  box-shadow: 0 10px 24px rgba(56, 189, 248, 0.16);
}

.mode-desc {
  color: #94a3b8;
  font-size: 13px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e5e7eb;
}

.scroll-btn {
  display: none;
  margin-left: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.stat-label {
  display: block;
  color: #94a3b8;
  font-size: 13px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #e5e7eb;
}

.result-block {
  display: grid;
  gap: 10px;
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.result-head h2 {
  margin: 0;
}

.result-output {
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  color: #e5e7eb;
  min-height: 120px;
}

.seo-card {
  gap: 20px;
}

.seo-text h2 {
  margin: 0 0 8px;
}

.seo-text p {
  margin: 0 0 10px;
  color: #cbd5e1;
}

.usage h3 {
  margin: 0 0 8px;
}

.usage-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.usage-list li {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 12px;
}

.faq h3 {
  margin: 0 0 10px;
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
  border-color: rgba(56, 189, 248, 0.4);
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

@media (max-width: 768px) {
  .mode-strip {
    padding: 14px;
  }

  .scroll-btn {
    display: inline-flex;
  }
  .result-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .scroll-btn {
    margin-left: 0;
  }

  .action-row {
    justify-content: flex-start;
  }
}
</style>
