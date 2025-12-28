<template>
  <main class="remove-line-breaks-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Удаление переносов строк онлайн</h1>
      <p class="lead">Склей текст в одну строку или приведи переносы в порядок за один клик</p>
    </header>

    <section class="cleaner-card">
      <div class="input-block">
        <label for="source-text">Текст для обработки</label>
        <textarea
          id="source-text"
          v-model="sourceText"
          rows="10"
          placeholder="Вставь текст с переносами строк"
        />
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="!sourceText" @click="applyClean">
          Обработать текст
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
          <span class="result-meta">
            {{ hasResult ? 'Текст обработан' : 'Нет обработанного текста' }}
          </span>
        </div>
        <div class="result-output" role="status" aria-live="polite">
          {{
            hasResult
              ? resultText
              : 'Подготовь текст и нажми «Обработать текст», чтобы увидеть результат.'
          }}
        </div>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-label">Было строк</span>
          <span class="stat-value">{{ stats.linesBefore }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Стало строк</span>
          <span class="stat-value">{{ stats.linesAfter }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Было символов</span>
          <span class="stat-value">{{ stats.charsBefore }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Стало символов</span>
          <span class="stat-value">{{ stats.charsAfter }}</span>
        </article>
      </div>

      <div class="mode-block">
        <p class="block-title">Режим обработки</p>
        <div class="mode-grid">
          <label class="radio-card">
            <input v-model="mode" type="radio" value="remove-all" />
            <span class="radio-ui" aria-hidden="true"></span>
            <span>Удалить все переносы строк, заменить на пробел</span>
          </label>
          <label class="radio-card">
            <input v-model="mode" type="radio" value="collapse-multiple" />
            <span class="radio-ui" aria-hidden="true"></span>
            <span>Заменить множественные переносы на один</span>
          </label>
          <label class="radio-card">
            <input v-model="mode" type="radio" value="paragraphs" />
            <span class="radio-ui" aria-hidden="true"></span>
            <span>Удалить переносы внутри абзацев, абзацы сохранить</span>
          </label>
          <label class="radio-card">
            <input v-model="mode" type="radio" value="pdf" />
            <span class="radio-ui" aria-hidden="true"></span>
            <span>Удалить переносы после каждого слова, частый случай из PDF</span>
          </label>
        </div>
      </div>

      <div class="options-block">
        <p class="block-title">Дополнительные настройки</p>
        <div class="options-grid">
          <label class="toggle">
            <input v-model="preserveDoubleSpaces" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Сохранять двойные пробелы</span>
          </label>
          <label class="toggle">
            <input v-model="removeExtraSpaces" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять лишние пробелы после обработки</span>
          </label>
          <label class="toggle">
            <input v-model="preserveEmptyLines" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Сохранять пустые строки</span>
          </label>
          <label class="toggle">
            <input v-model="normalizeLineEndings" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Учитывать переносы Windows и Unix, \r\n и \n</span>
          </label>
        </div>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Зачем удалять переносы строк</h2>
        <p>
          Переносы строк полезны в верстке, но мешают, когда текст нужно отправить в чат,
          вставить в документ или подготовить к публикации. Из-за «ломаных» строк
          сложно редактировать текст, искать ошибки или быстро читать его с экрана.
        </p>

        <h2>Когда переносы мешают</h2>
        <p>Чаще всего проблема появляется в таких сценариях:</p>
        <ul>
          <li>текст из PDF, где каждое слово на новой строке;</li>
          <li>копипаст с сайтов с жесткой разметкой;</li>
          <li>тексты из Word с сохранением скрытых переносов.</li>
        </ul>

        <h2>Способы обработки переносов</h2>
        <p>
          Иногда достаточно склеить все строки в одну, а иногда важнее сохранить абзацы.
          В этом инструменте есть четыре режима: полное удаление, сжатие множественных
          переносов, очистка внутри абзацев и PDF-режим, который учитывает пунктуацию.
        </p>

        <h2>Как работает этот инструмент</h2>
        <p>
          Текст обрабатывается прямо в браузере: мы заменяем или удаляем переносы,
          корректируем пробелы и показываем результат с сохранением структуры.
          Ты можешь включить сохранение пустых строк или оставить двойные пробелы,
          если они важны для смысловых пауз.
        </p>

        <h2>Частые ошибки при ручной очистке</h2>
        <p>
          Самое распространенное - удалить абзацы вместе с переносами или, наоборот,
          оставить лишние пробелы между словами. Еще одна ошибка - не учитывать PDF,
          где конец строки не означает конец предложения. Автоматическая обработка
          избавляет от этих мелких, но критичных проблем.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/remove-spaces">
            <span class="other-title">Удаление лишних пробелов</span>
            <span class="other-desc">Чистит табы, пробелы и лишние пустые строки.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-case">
            <span class="other-title">Изменение регистра</span>
            <span class="other-desc">Меняй стиль слов и формат текста за секунды.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-counter">
            <span class="other-title">Счетчик текста</span>
            <span class="other-desc">Показывает символы, слова и строки.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/wolf-lorem">
            <span class="other-title">Волчий рыбий текст</span>
            <span class="other-desc">Абзацы про волков для макетов и прототипов.</span>
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
import { removeLineBreaks } from '@/utils/text/removeLineBreaks'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Удаление переносов строк' }
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

const mode = ref('remove-all')
const preserveDoubleSpaces = ref(false)
const removeExtraSpaces = ref(true)
const preserveEmptyLines = ref(true)
const normalizeLineEndings = ref(true)

const optionsSignature = computed(() =>
  JSON.stringify({
    mode: mode.value,
    preserveDoubleSpaces: preserveDoubleSpaces.value,
    removeExtraSpaces: removeExtraSpaces.value,
    preserveEmptyLines: preserveEmptyLines.value,
    normalizeLineEndings: normalizeLineEndings.value
  })
)

const hasResult = computed(
  () =>
    hasCleaned.value &&
    sourceText.value === lastInput.value &&
    optionsSignature.value === lastOptionsSignature.value
)

const stats = computed(() => {
  if (!hasResult.value) {
    return { linesBefore: 0, linesAfter: 0, charsBefore: 0, charsAfter: 0 }
  }

  const beforeText = lastInput.value
  const afterText = resultText.value

  return {
    linesBefore: countLines(beforeText),
    linesAfter: countLines(afterText),
    charsBefore: beforeText.length,
    charsAfter: afterText.length
  }
})

const faqItems = [
  {
    q: 'Почему текст из PDF разбит на строки?',
    a: 'PDF хранит текст в виде фрагментов. При копировании строки часто ломаются по ширине страницы, а не по смыслу.'
  },
  {
    q: 'Чем отличается перенос строки от абзаца?',
    a: 'Перенос строки просто переносит текст на следующую строку, а абзац отделяет мысль и обычно содержит пустую строку между блоками.'
  },
  {
    q: 'Можно ли склеить текст без потери смысла?',
    a: 'Да, если удалить переносы внутри абзацев или использовать PDF-режим, который учитывает пунктуацию.'
  },
  {
    q: 'Безопасно ли это для больших текстов?',
    a: 'Да, обработка идет прямо в браузере, данные никуда не отправляются.'
  },
  {
    q: 'Работает ли с русским языком?',
    a: 'Да, инструмент одинаково корректно обрабатывает русский и любой другой язык.'
  }
]

function countLines(text) {
  if (!text) return 0
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  return normalized.split('\n').length
}

function buildOptions() {
  return {
    mode: mode.value,
    preserveDoubleSpaces: preserveDoubleSpaces.value,
    removeExtraSpaces: removeExtraSpaces.value,
    preserveEmptyLines: preserveEmptyLines.value,
    normalizeLineEndings: normalizeLineEndings.value
  }
}

async function applyClean() {
  const cleaned = removeLineBreaks(sourceText.value, buildOptions())
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
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/remove-line-breaks`)
const metaDescription =
  'Убери переносы строк из текста, склей строки из PDF и Word. Бесплатно и без регистрации.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Удаление переносов строк онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'Удаление переносов строк', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Удаление переносов строк онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Удаление переносов строк онлайн | Neural Wise Wolf',
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
.remove-line-breaks-page {
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

.mode-grid,
.options-grid {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.radio-card,
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

.radio-card input,
.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-ui {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  position: relative;
  transition: background 0.2s ease;
}

.radio-ui::after {
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

.radio-card input:checked + .radio-ui {
  background: rgba(56, 189, 248, 0.7);
}

.radio-card input:checked + .radio-ui::after {
  transform: translateX(18px);
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

.seo-text ul {
  margin: 0 0 12px;
  padding-left: 20px;
  color: #cbd5e1;
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
