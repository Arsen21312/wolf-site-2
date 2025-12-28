<template>
  <main class="remove-spaces-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Удаление лишних пробелов онлайн</h1>
      <p class="lead">Приведи текст в порядок за один клик, без регистрации</p>
    </header>

    <section class="cleaner-card">
      <div class="input-block">
        <label for="source-text">Текст для очистки</label>
        <textarea
          id="source-text"
          v-model="sourceText"
          rows="9"
          placeholder="Вставь текст с лишними пробелами"
        />
      </div>

      <div class="options-block">
        <p class="block-title">Настройки очистки</p>
        <div class="options-grid">
          <label class="toggle">
            <input v-model="removeMultipleSpaces" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять двойные и множественные пробелы</span>
          </label>
          <label class="toggle">
            <input v-model="trimLines" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять пробелы в начале и конце строк</span>
          </label>
          <label class="toggle">
            <input v-model="removeTabs" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять табы</span>
          </label>
          <label class="toggle">
            <input v-model="removeEmptyLines" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять пустые строки</span>
          </label>
          <label class="toggle">
            <input v-model="normalizeLineBreaks" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Заменять переносы строк на один перенос</span>
          </label>
          <label class="toggle">
            <input v-model="replaceLineBreaksWithSpace" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Заменять все переносы строк на пробел, полезно для текста в одну строку</span>
          </label>
        </div>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="!sourceText" @click="applyClean">
          Очистить текст
        </button>
        <button
          class="btn ghost"
          type="button"
          :disabled="!hasResult || !resultText"
          @click="copyResult"
        >
          {{ copyLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!sourceText && !resultText" @click="clearAll">
          Очистить все
        </button>
      </div>

      <div id="result" ref="resultRef" class="result-block">
        <div class="result-head">
          <h2>Результат</h2>
          <span class="result-meta">{{ hasResult ? 'Текст очищен' : 'Ждет очистки' }}</span>
        </div>
        <div class="result-output" role="status" aria-live="polite">
          {{ hasResult ? resultText : 'Сначала вставь текст и нажми «Очистить текст».' }}
        </div>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-label">Было символов</span>
          <span class="stat-value">{{ stats.before }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Стало символов</span>
          <span class="stat-value">{{ stats.after }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Удалено символов</span>
          <span class="stat-value">{{ stats.removed }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Удалено пробелов</span>
          <span class="stat-value">{{ stats.removedSpaces }}</span>
        </article>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Очистка текста от лишних пробелов — аккуратный результат без ручной правки</h2>
        <p>
          Инструмент удаляет лишние пробелы, табы и пустые строки в один клик. Это полезно, когда
          текст скопирован из документов, мессенджеров или чужих CMS: в нем часто остаются
          двойные пробелы, случайные отступы и пустые строки.
        </p>
        <p>
          Настройки позволяют управлять каждой операцией отдельно: можно убрать табы, обрезать
          пробелы по краям строк, схлопнуть множественные пробелы, сохранить структуру абзацев
          или, наоборот, собрать текст в одну строку.
        </p>
        <p>
          Все вычисления идут в браузере — текст никуда не отправляется. Поэтому инструмент подходит
          для черновиков кода, SEO-описаний, верстки, карточек товаров и рабочих заметок.
        </p>
      </div>

      <div class="usage">
        <h3>Где пригодится удаление лишних пробелов</h3>
        <ul class="usage-list">
          <li>Подготовка текстов для верстки и публикаций</li>
          <li>Чистка описаний и SEO-текстов перед загрузкой в CMS</li>
          <li>Приведение в порядок данных из таблиц и писем</li>
          <li>Аккуратные сообщения для чатов и рассылок</li>
        </ul>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/text-counter">
            <span class="other-title">Счетчик символов</span>
            <span class="other-desc">Считает символы, слова и строки для текста любой длины.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-reverser">
            <span class="other-title">Реверс текста</span>
            <span class="other-desc">Переворачивает текст по буквам, словам или строкам.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/wolf-lorem">
            <span class="other-title">Волчий рыбий текст</span>
            <span class="other-desc">Генерирует абзацы и фразы про волков для макетов.</span>
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

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import { removeSpaces } from '@/utils/text/removeSpaces'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Удаление лишних пробелов' }
]

const sourceText = ref('')
const resultText = ref('')
const lastInput = ref('')
const lastOptionsSignature = ref('')
const hasCleaned = ref(false)
const copyLabel = ref('Копировать результат')
const copyTimer = ref(null)
const resultRef = ref(null)
const openFaq = ref(null)

const removeMultipleSpaces = ref(true)
const trimLines = ref(true)
const removeTabs = ref(true)
const removeEmptyLines = ref(true)
const normalizeLineBreaks = ref(false)
const replaceLineBreaksWithSpace = ref(false)

const optionsSignature = computed(() =>
  JSON.stringify({
    removeMultipleSpaces: removeMultipleSpaces.value,
    trimLines: trimLines.value,
    removeTabs: removeTabs.value,
    removeEmptyLines: removeEmptyLines.value,
    normalizeLineBreaks: normalizeLineBreaks.value,
    replaceLineBreaksWithSpace: replaceLineBreaksWithSpace.value
  })
)

const hasResult = computed(
  () => hasCleaned.value && sourceText.value === lastInput.value && optionsSignature.value === lastOptionsSignature.value
)

const stats = computed(() => {
  if (!hasResult.value) {
    return { before: 0, after: 0, removed: 0, removedSpaces: 0 }
  }

  const beforeText = lastInput.value
  const afterText = resultText.value
  const before = beforeText.length
  const after = afterText.length
  const removed = Math.max(0, before - after)
  const removedSpaces = Math.max(0, countSpaces(beforeText) - countSpaces(afterText))

  return { before, after, removed, removedSpaces }
})

const faqItems = [
  {
    q: 'Удаляются ли табы и скрытые пробелы?',
    a: 'Да, по умолчанию табы заменяются на пробелы, а множественные пробелы схлопываются.'
  },
  {
    q: 'Сохраняются ли переносы строк?',
    a: 'Да, если не включать замену переносов строк. Можно сохранить структуру или сделать одну строку.'
  },
  {
    q: 'Можно ли убрать пустые строки между абзацами?',
    a: 'Да, включи удаление пустых строк или схлопывание переносов до одного.'
  },
  {
    q: 'Инструмент работает с кодом и Markdown?',
    a: 'Да, он удобен для черновиков кода, описаний, SEO-текста и сообщений.'
  },
  {
    q: 'Данные куда-то отправляются?',
    a: 'Нет, очистка происходит в браузере, текст никуда не отправляется.'
  }
]

function countSpaces(text) {
  const matches = text.match(/ /g)
  return matches ? matches.length : 0
}

function buildOptions() {
  return {
    replaceTabs: removeTabs.value,
    trimLines: trimLines.value,
    collapseMultipleSpaces: removeMultipleSpaces.value,
    removeEmptyLines: removeEmptyLines.value,
    normalizeLineBreaks: normalizeLineBreaks.value,
    replaceLineBreaksWithSpace: replaceLineBreaksWithSpace.value
  }
}

async function applyClean() {
  const cleaned = removeSpaces(sourceText.value, buildOptions())
  resultText.value = cleaned
  lastInput.value = sourceText.value
  lastOptionsSignature.value = optionsSignature.value
  hasCleaned.value = true
  copyLabel.value = 'Копировать результат'

  if (sourceText.value.length > 600) {
    await nextTick()
    scrollToResult()
  }
}

function clearAll() {
  sourceText.value = ''
  resultText.value = ''
  lastInput.value = ''
  lastOptionsSignature.value = ''
  hasCleaned.value = false
  copyLabel.value = 'Копировать результат'
}

async function copyResult() {
  if (!hasResult.value || !resultText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(resultText.value)
    copyLabel.value = '✅ Скопировано'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать результат'
    }, 2000)
  } catch (err) {
    copyLabel.value = 'Не удалось скопировать'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать результат'
    }, 2000)
  }
}

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
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
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/remove-spaces`)
const metaDescription =
  'Убери лишние пробелы, табы и пустые строки из текста. Быстро, бесплатно, онлайн'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Удаление лишних пробелов онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'Удаление лишних пробелов', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Удаление лишних пробелов онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Удаление лишних пробелов онлайн | Neural Wise Wolf',
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
.remove-spaces-page {
  display: grid;
  gap: clamp(20px, 3vw, 36px);
  width: min(1120px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 32px) 0 clamp(32px, 4vw, 60px);
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 48px);
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  max-width: 760px;
  color: #cbd5e1;
}

.cleaner-card,
.other-card,
.faq-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.cleaner-card::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.14), transparent 60%);
  right: -70px;
  top: -90px;
  pointer-events: none;
}

.input-block {
  display: grid;
  gap: 8px;
}

.input-block label {
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-block textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.6);
  padding: 14px 16px;
  color: #fff;
  font-size: 16px;
  resize: vertical;
  min-height: 240px;
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

.options-grid {
  display: grid;
  gap: 10px;
  margin-top: 8px;
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
  background: rgba(56, 189, 248, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
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

.result-meta {
  color: #94a3b8;
  font-size: 13px;
}

.result-output {
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  color: #e5e7eb;
  min-height: 140px;
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

.extras {
  display: grid;
  gap: clamp(16px, 3vw, 24px);
}

.seo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: 18px;
}

.seo-text h2 {
  margin: 0 0 8px;
}

.seo-text p {
  margin: 0 0 12px;
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.usage-list li {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 12px;
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

@media (max-width: 768px) {
  .result-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-row {
    justify-content: flex-start;
  }
}
</style>
