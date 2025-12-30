<template>
  <main class="json-formatter-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>JSON Formatter онлайн</h1>
      <p class="lead">Форматируй, минифицируй и проверяй JSON без регистрации</p>
    </header>

    <section class="formatter-card">
      <div class="panel-grid">
        <div class="panel input-panel">
          <div class="panel-head">
            <div>
              <h2>Ввод JSON</h2>
              <p>Вставь JSON и выбери действие. Все работает локально, без сервера.</p>
            </div>
            <button class="btn ghost" type="button" @click="insertSample">
              Вставить пример
            </button>
          </div>
          <textarea
            v-model="inputText"
            class="json-input"
            rows="14"
            placeholder="Вставь JSON сюда"
          ></textarea>
          <div class="input-meta">
            <span>Строк: {{ lineCount }}</span>
            <span>Символов: {{ charCount }}</span>
          </div>
        </div>

        <div class="panel output-panel">
          <div class="panel-head">
            <div>
              <h2>Результат</h2>
              <p>Форматированный JSON или дерево структуры.</p>
            </div>
            <div class="view-toggle">
              <button
                class="btn ghost"
                type="button"
                :class="{ active: viewMode === 'code' }"
                @click="viewMode = 'code'"
              >
                Код
              </button>
              <button
                class="btn ghost"
                type="button"
                :class="{ active: viewMode === 'tree' }"
                @click="viewMode = 'tree'"
              >
                Дерево
              </button>
            </div>
          </div>

          <div v-if="viewMode === 'code'" class="code-output" role="status" aria-live="polite">
            <pre v-if="resultText"><code>{{ resultText }}</code></pre>
            <p v-else class="empty-output">Здесь появится результат форматирования или минификации.</p>
          </div>

          <div v-else class="tree-output">
            <div class="tree-actions">
              <button class="btn ghost" type="button" :disabled="!treeValue" @click="expandAll">
                Развернуть все
              </button>
              <button class="btn ghost" type="button" :disabled="!treeValue" @click="collapseAll">
                Свернуть все
              </button>
            </div>
            <div v-if="treeValue" class="tree-shell">
              <JsonTreeNode
                :key="treeKey"
                node-key="root"
                :value="treeValue"
                :depth="0"
                :open-default="treeDefaultOpen"
              />
            </div>
            <p v-else class="empty-output">Для просмотра дерева сначала отформатируй или проверь JSON.</p>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="!inputText" @click="formatJsonText">
          Форматировать
        </button>
        <button class="btn primary" type="button" :disabled="!inputText" @click="minifyJsonText">
          Минифицировать
        </button>
        <button class="btn ghost" type="button" :disabled="!inputText" @click="validateJsonText">
          Валидировать
        </button>
        <button
          class="btn ghost"
          type="button"
          :disabled="!inputText && !resultText"
          @click="clearAll"
        >
          Очистить
        </button>
        <button class="btn ghost" type="button" :disabled="!resultText" @click="copyResult">
          {{ copyLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!resultText" @click="downloadJson">
          Скачать .json
        </button>
      </div>

      <div class="settings-card">
        <div>
          <p class="block-title">Настройки форматирования</p>
          <div class="indent-row">
            <span class="indent-label">Отступ</span>
            <button
              class="btn ghost"
              type="button"
              :class="{ active: indent === 2 }"
              @click="indent = 2"
            >
              2
            </button>
            <button
              class="btn ghost"
              type="button"
              :class="{ active: indent === 4 }"
              @click="indent = 4"
            >
              4
            </button>
            <button
              class="btn ghost"
              type="button"
              :class="{ active: indent === '\t' }"
              @click="indent = '\t'"
            >
              tab
            </button>
          </div>
        </div>
        <div class="toggle-grid">
          <label class="toggle">
            <input v-model="sortKeys" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Сортировать ключи</span>
          </label>
          <label class="toggle">
            <input v-model="trimTrailingWhitespace" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять хвостовые пробелы</span>
          </label>
        </div>
      </div>

      <div v-if="statusMessage" class="status" :class="statusType" role="status">
        {{ statusMessage }}
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Зачем форматировать JSON</h2>
        <p>
          Форматирование делает JSON читаемым: структура становится очевидной, вложенные объекты легко
          сканировать, а баги замечаются быстрее. Это важно для командной работы, интеграций и
          отладки API.
        </p>

        <h2>Чем отличается format и minify</h2>
        <p>
          Format добавляет переносы строк и отступы, чтобы человек видел структуру. Minify удаляет
          пробелы и переносы, чтобы уменьшить размер. Это удобно для передачи по сети и хранения.
        </p>

        <h2>Типичные ошибки в JSON</h2>
        <p>
          Чаще всего ломают JSON незакрытые кавычки, лишние запятые, комментарии и смешение одинарных
          и двойных кавычек. Валидатор подсветит строку и колонку, где ошибка началась.
        </p>

        <h2>Как проверить JSON перед API запросом</h2>
        <p>
          Вставь JSON в поле ввода и нажми «Валидировать». Если все хорошо, увидишь подтверждение.
          Если есть ошибка, инструмент покажет строку и колонку — это ускоряет правку.
        </p>

        <h2>JSON vs JavaScript объект, почему путают</h2>
        <p>
          JSON — это текстовый формат, а объект JavaScript — структура данных в коде. В JSON только
          двойные кавычки, нет комментариев и функций. Поэтому объект не всегда является валидным
          JSON.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/base64">
            <span class="other-title">Base64</span>
            <span class="other-desc">Кодируй и декодируй строки без лишних движений.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/url-encode">
            <span class="other-title">URL Encode Decode</span>
            <span class="other-desc">Шифруй параметры, чтобы ссылки работали корректно.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/password-generator">
            <span class="other-title">Генератор паролей</span>
            <span class="other-desc">Надежные пароли с оценкой силы и копированием.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-counter">
            <span class="other-title">Счетчик текста</span>
            <span class="other-desc">Быстро посчитай символы, слова и строки.</span>
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
import { computed, defineComponent, h, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { formatJson, minifyJson, type JsonIndent } from '@/utils/json/format'
import { getJsonErrorLocation } from '@/utils/json/errorPos'
import { sortJsonKeys } from '@/utils/json/sortKeys'

type ViewMode = 'code' | 'tree'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'JSON Formatter' }
]

const inputText = ref('')
const resultText = ref('')
const treeValue = ref<unknown | null>(null)
const viewMode = ref<ViewMode>('code')
const indent = ref<JsonIndent>(2)
const sortKeys = ref(false)
const trimTrailingWhitespace = ref(true)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')
const copyLabel = ref('Копировать результат')
const openFaq = ref<number | null>(null)
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const treeKey = ref(0)
const treeDefaultOpen = ref(true)

const lineCount = computed(() => (inputText.value ? inputText.value.split(/\r\n|\r|\n/).length : 0))
const charCount = computed(() => inputText.value.length)

const sampleJson = `{
  "project": "Neural Wise Wolf",
  "version": 3,
  "active": true,
  "tags": ["json", "formatter", "validator"],
  "meta": {
    "owner": "Wolf",
    "released": null,
    "stats": { "requests": 128, "errors": 2 }
  },
  "items": [
    { "id": 1, "title": "Alpha" },
    { "id": 2, "title": "Beta" }
  ]
}`

const faqItems = [
  {
    q: 'Почему JSON не парсится из-за кавычек?',
    a: 'JSON принимает только двойные кавычки. Одинарные кавычки считаются ошибкой.'
  },
  {
    q: 'Можно ли ставить запятые в конце?',
    a: 'Нет, trailing comma запрещен спецификацией JSON. Удали последнюю запятую.'
  },
  {
    q: 'Можно ли писать комментарии в JSON?',
    a: 'Комментарии не поддерживаются. Если нужен поясняющий текст — используй отдельное поле.'
  },
  {
    q: 'Как быстро найти ошибку?',
    a: 'Нажми «Валидировать» — инструмент покажет строку и колонку, где возникла проблема.'
  },
  {
    q: 'Безопасно ли вставлять JSON сюда?',
    a: 'Да, все происходит в браузере. Данные не отправляются на сервер.'
  },
  {
    q: 'Можно ли скачать результат файлом?',
    a: 'Да, кнопка «Скачать .json» сохранит отформатированный результат.'
  }
]

function insertSample() {
  inputText.value = sampleJson
  setStatus('info', 'Пример вставлен. Можно форматировать или валидировать.')
}

function setStatus(type: 'success' | 'error' | 'info', message: string) {
  statusType.value = type
  statusMessage.value = message
}

function clearAll() {
  inputText.value = ''
  resultText.value = ''
  treeValue.value = null
  statusMessage.value = ''
  copyLabel.value = 'Копировать результат'
}

function formatJsonText() {
  try {
    const { text, value } = formatJson(inputText.value, {
      indent: indent.value,
      sortKeys: sortKeys.value,
      trimTrailingWhitespace: trimTrailingWhitespace.value
    })
    resultText.value = text
    treeValue.value = value
    setStatus('success', 'JSON отформатирован.')
  } catch (error) {
    handleJsonError(error)
  }
}

function minifyJsonText() {
  try {
    const { text, value } = minifyJson(inputText.value, { sortKeys: sortKeys.value })
    resultText.value = text
    treeValue.value = value
    setStatus('success', 'JSON минифицирован.')
  } catch (error) {
    handleJsonError(error)
  }
}

function validateJsonText() {
  try {
    const parsed = JSON.parse(inputText.value)
    treeValue.value = sortKeys.value ? sortJsonKeys(parsed) : parsed
    setStatus('success', 'JSON валиден. Ошибок не найдено.')
  } catch (error) {
    handleJsonError(error)
  }
}

function handleJsonError(error: unknown) {
  const location = getJsonErrorLocation(inputText.value, error)
  resultText.value = ''
  treeValue.value = null
  if (location.line && location.column) {
    setStatus('error', `Ошибка: ${location.message}. Строка ${location.line}, колонка ${location.column}.`)
  } else if (location.line) {
    setStatus('error', `Ошибка на строке ${location.line}. ${location.message}`)
  } else {
    setStatus('error', `Ошибка: ${location.message}`)
  }
}

async function copyResult() {
  if (!resultText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(resultText.value)
    copyLabel.value = 'Скопировано'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать результат'
    }, 2000)
  } catch (error) {
    copyLabel.value = 'Не удалось скопировать'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать результат'
    }, 2000)
  }
}

function downloadJson() {
  if (!resultText.value) return
  if (typeof document === 'undefined') return
  const blob = new Blob([resultText.value], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'formatted.json'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function expandAll() {
  treeDefaultOpen.value = true
  treeKey.value += 1
}

function collapseAll() {
  treeDefaultOpen.value = false
  treeKey.value += 1
}

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const JsonTreeNode = defineComponent({
  name: 'JsonTreeNode',
  props: {
    nodeKey: { type: String, default: '' },
    value: { type: null, required: true },
    depth: { type: Number, default: 0 },
    openDefault: { type: Boolean, default: true }
  },
  setup(props) {
    const isOpen = ref(props.openDefault)
    const isArray = computed(() => Array.isArray(props.value))
    const isObject = computed(
      () => !!props.value && typeof props.value === 'object' && !Array.isArray(props.value)
    )
    const isExpandable = computed(() => isArray.value || isObject.value)
    const entries = computed(() => {
      if (isArray.value) {
        return (props.value as unknown[]).map((item, index) => ({
          key: `[${index}]`,
          value: item
        }))
      }
      if (isObject.value) {
        return Object.entries(props.value as Record<string, unknown>).map(([key, value]) => ({
          key,
          value
        }))
      }
      return []
    })
    const typeLabel = computed(() => {
      if (isArray.value) {
        return `Array(${entries.value.length})`
      }
      if (isObject.value) {
        return `Object(${entries.value.length})`
      }
      if (props.value === null) return 'null'
      return typeof props.value
    })
    const valueLabel = computed(() => {
      if (typeof props.value === 'string') return `"${props.value}"`
      if (typeof props.value === 'number') return String(props.value)
      if (typeof props.value === 'boolean') return props.value ? 'true' : 'false'
      if (props.value === null) return 'null'
      return ''
    })

    function toggle() {
      if (!isExpandable.value) return
      isOpen.value = !isOpen.value
    }

    return () => {
      const rowChildren = [
        isExpandable.value
          ? h(
              'button',
              { class: 'tree-toggle', type: 'button', onClick: toggle },
              isOpen.value ? '-' : '+'
            )
          : null,
        props.nodeKey ? h('span', { class: 'tree-key' }, props.nodeKey) : null,
        h('span', { class: 'tree-type' }, typeLabel.value),
        !isExpandable.value ? h('span', { class: 'tree-value' }, valueLabel.value) : null
      ].filter(Boolean)

      const nodeRow = h(
        'div',
        { class: 'tree-node', style: { paddingLeft: `${props.depth * 16}px` } },
        rowChildren
      )

      const children =
        isExpandable.value && isOpen.value
          ? h(
              'div',
              { class: 'tree-children' },
              entries.value.map((entry) =>
                h(JsonTreeNode, {
                  key: entry.key,
                  nodeKey: entry.key,
                  value: entry.value,
                  depth: props.depth + 1,
                  openDefault: props.openDefault
                })
              )
            )
          : null

      return h('div', null, [nodeRow, children].filter(Boolean))
    }
  }
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/json-formatter`)
const metaDescription =
  'Форматируй, минифицируй и проверяй JSON. Показ ошибки по строке, дерево, копирование и скачивание.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'JSON Formatter онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'JSON Formatter', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'JSON Formatter онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'JSON Formatter онлайн | Neural Wise Wolf',
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
.json-formatter-page {
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

.formatter-card,
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

.formatter-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.16), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
  max-width: 380px;
}

.json-input {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  color: #e2e8f0;
  padding: 12px 14px;
  resize: vertical;
  min-height: 260px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  outline: none;
}

.json-input::placeholder {
  color: #64748b;
}

.input-meta {
  display: flex;
  gap: 16px;
  color: #94a3b8;
  font-size: 13px;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.code-output {
  background: rgba(2, 6, 23, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  min-height: 260px;
  color: #e2e8f0;
  overflow: auto;
}

.code-output pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}

.tree-output {
  display: grid;
  gap: 10px;
}

.tree-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tree-shell {
  background: rgba(2, 6, 23, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  min-height: 260px;
  color: #e2e8f0;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: #e2e8f0;
}

.tree-toggle {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(148, 163, 184, 0.15);
  color: #e2e8f0;
  cursor: pointer;
}

.tree-key {
  color: #38bdf8;
}

.tree-type {
  color: #94a3b8;
}

.tree-value {
  color: #facc15;
}

.tree-children {
  margin-top: 4px;
}

.empty-output {
  margin: 0;
  color: #94a3b8;
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

.indent-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.indent-label {
  color: #94a3b8;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: 4px;
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

.status {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.status.success {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.15);
  color: #bbf7d0;
}

.status.error {
  border-color: rgba(248, 113, 113, 0.4);
  background: rgba(248, 113, 113, 0.15);
  color: #fecaca;
}

.status.info {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.12);
  color: #bae6fd;
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

.btn.ghost.active {
  border-color: rgba(56, 189, 248, 0.7);
  background: rgba(56, 189, 248, 0.2);
  color: #e2e8f0;
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
}
</style>
