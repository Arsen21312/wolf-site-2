<template>
  <main class="url-encode-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>URL encode decode онлайн</h1>
      <p class="lead">Кодируй текст для ссылок, UTM и query параметров, без регистрации</p>
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
              <p>Вставь текст, ссылку или query строку. Подойдет для UTM и параметров.</p>
            </div>
            <button class="btn ghost" type="button" @click="insertSample">
              Пример
            </button>
          </div>
          <textarea
            v-model="inputText"
            class="text-area"
            rows="10"
            placeholder="Введи строку для URL кодирования или декодирования"
          ></textarea>
          <div class="input-meta">
            <span>Символов: {{ inputCount }}</span>
          </div>
        </div>

        <div class="panel output-panel">
          <div class="panel-head">
            <div>
              <h2>Результат</h2>
              <p>Готовую строку можно сразу скопировать или скачать как TXT.</p>
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
            <input type="checkbox" :checked="isComponent" @change="setComponentMode" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Кодировать как компонент (encodeURIComponent)</span>
          </label>
          <label class="toggle">
            <input type="checkbox" :checked="isFullUrl" @change="setFullUrlMode" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Кодировать как полный URL (encodeURI)</span>
          </label>
          <label class="toggle">
            <input v-model="formUrlEncoded" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Плюсы вместо пробелов (form urlencoded)</span>
          </label>
          <label class="toggle" :class="{ disabled: !formUrlEncoded }">
            <input v-model="decodePlusAsSpace" type="checkbox" :disabled="!formUrlEncoded" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Декодировать + как пробел</span>
          </label>
        </div>
        <p class="settings-hint">
          component — для параметров и значений, full url — для всей ссылки. Form режим
          делает строки совместимыми с application/x-www-form-urlencoded.
        </p>
      </div>

      <div v-if="errorMessage" class="error" role="alert">
        <p>{{ errorMessage }}</p>
      </div>
    </section>

    <section class="query-card">
      <div class="query-head">
        <div>
          <h2>Query helper</h2>
          <p>Разбирай параметры, редактируй и собирай обратно без ручного кодирования.</p>
        </div>
        <button class="btn ghost" type="button" @click="addParam">Добавить параметр</button>
      </div>

      <div class="query-input">
        <label for="query-url">Вставь полный URL</label>
        <div class="query-row">
          <input
            id="query-url"
            v-model="queryUrlInput"
            type="text"
            placeholder="https://example.com/?utm_source=telegram&utm_medium=social"
          />
          <button class="btn primary" type="button" :disabled="!queryUrlInput" @click="parseUrl">
            Разобрать параметры
          </button>
        </div>
        <p v-if="queryError" class="query-error">{{ queryError }}</p>
      </div>

      <div class="query-table">
        <div class="query-table-head">
          <span>Key</span>
          <span>Value</span>
          <span></span>
        </div>
        <div v-for="(param, index) in queryParams" :key="`param-${index}`" class="query-table-row">
          <input v-model="param.key" type="text" placeholder="utm_source" />
          <input v-model="param.value" type="text" placeholder="telegram" />
          <button class="btn ghost small" type="button" @click="removeParam(index)">Удалить</button>
        </div>
      </div>

      <div class="query-actions">
        <button class="btn primary" type="button" :disabled="!queryBaseUrl" @click="buildQueryUrl">
          Собрать обратно
        </button>
        <button
          class="btn ghost"
          type="button"
          :disabled="!builtQueryUrl"
          @click="copyQueryUrl"
        >
          {{ queryCopyLabel }}
        </button>
      </div>

      <div class="query-result">
        <h3>Собранный URL</h3>
        <code>{{ builtQueryUrl || 'Сначала разберите ссылку или добавьте параметры.' }}</code>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Что такое URL encoding</h2>
        <p>
          URL encoding — это способ безопасно передать данные в адресной строке. Браузер
          преобразует пробелы и специальные символы в последовательности вида %20, чтобы
          ссылка оставалась валидной и читалась одинаково во всех системах.
        </p>

        <h2>encodeURIComponent vs encodeURI</h2>
        <p>
          encodeURIComponent подходит для параметров и значений, потому что кодирует
          почти все специальные символы. encodeURI используют для всей ссылки целиком —
          он оставляет разделители вроде ? и & неизменными.
        </p>

        <h2>Почему пробел иногда становится плюсом</h2>
        <p>
          В форме application/x-www-form-urlencoded пробел кодируется как плюс. Это
          удобно для веб-форм и UTM-меток, но в обычном URL чаще используют %20.
        </p>

        <h2>Как правильно кодировать UTM метки</h2>
        <p>
          Кодируй каждое значение отдельно, а не всю строку. Так UTM-метки останутся
          читаемыми, и аналитика корректно распознает источник, канал и кампанию.
        </p>

        <h2>Типичные ошибки при декодировании</h2>
        <p>
          Чаще всего проблема в неполной строке или в символах, которые уже были
          декодированы. Используй decodeURIComponent и проверяй исходную строку на
          обрезанные проценты и лишние пробелы.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/base64">
            <span class="other-title">Base64</span>
            <span class="other-desc">Кодируй и декодируй Base64, работай с Unicode и URL-safe.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/json-formatter">
            <span class="other-title">JSON Formatter</span>
            <span class="other-desc">Форматируй, минифицируй и проверяй JSON за секунды.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-counter">
            <span class="other-title">Счетчик текста</span>
            <span class="other-desc">Быстро посчитай символы, слова и абзацы в тексте.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/remove-spaces">
            <span class="other-title">Удаление лишних пробелов</span>
            <span class="other-desc">Чистит текст от пробелов, табов и пустых строк.</span>
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
import { decodeUrl, encodeUrl, UrlDecodeError, type UrlEncodingMode } from '@/utils/url/urlCodec'
import {
  buildUrlFromParams,
  parseQueryUrl,
  QueryParseError,
  type QueryParamItem
} from '@/utils/url/queryHelper'

type Mode = 'encode' | 'decode'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'URL Encode Decode' }
]

const mode = ref<Mode>('encode')
const inputText = ref('')
const resultText = ref('')
const errorMessage = ref('')
const copyLabel = ref('Копировать')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const isComponent = ref(true)
const isFullUrl = ref(false)
const formUrlEncoded = ref(false)
const decodePlusAsSpace = ref(false)

const inputCount = computed(() => inputText.value.length)
const resultCount = computed(() => resultText.value.length)
const modeActionLabel = computed(() => (mode.value === 'encode' ? 'Encode' : 'Decode'))
const encodingMode = computed<UrlEncodingMode>(() => (isFullUrl.value ? 'full' : 'component'))

const sampleEncode = 'utm_source=telegram&utm_medium=social media&campaign=осень'
const sampleDecode =
  'utm_source=telegram&utm_medium=social%20media&campaign=%D0%BE%D1%81%D0%B5%D0%BD%D1%8C'

function setMode(nextMode: Mode) {
  mode.value = nextMode
  errorMessage.value = ''
}

function setComponentMode() {
  isComponent.value = true
  isFullUrl.value = false
}

function setFullUrlMode() {
  isFullUrl.value = true
  isComponent.value = false
}

function insertSample() {
  inputText.value = mode.value === 'encode' ? sampleEncode : sampleDecode
  errorMessage.value = ''
}

function process() {
  errorMessage.value = ''
  if (!inputText.value) {
    resultText.value = ''
    return
  }

  if (mode.value === 'encode') {
    resultText.value = encodeUrl(inputText.value, {
      mode: encodingMode.value,
      formUrlEncoded: formUrlEncoded.value
    })
    return
  }

  try {
    resultText.value = decodeUrl(inputText.value, {
      formUrlEncoded: formUrlEncoded.value,
      decodePlusAsSpace: decodePlusAsSpace.value
    })
  } catch (error) {
    resultText.value = ''
    if (error instanceof UrlDecodeError) {
      errorMessage.value = error.message
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Не удалось декодировать строку. Проверь входные данные и режим.'
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
    copyLabel.value = 'Не удалось'
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
  link.download = 'url-encode.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

watch(formUrlEncoded, (value) => {
  decodePlusAsSpace.value = value
})

watch([inputText, mode], () => {
  if (errorMessage.value) errorMessage.value = ''
})

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
  if (queryCopyTimer.value) clearTimeout(queryCopyTimer.value)
})

const queryUrlInput = ref('')
const queryBaseUrl = ref('')
const queryParams = ref<QueryParamItem[]>([{ key: '', value: '' }])
const queryError = ref('')
const builtQueryUrl = ref('')
const queryCopyLabel = ref('Скопировать URL')
const queryCopyTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function parseUrl() {
  queryError.value = ''
  builtQueryUrl.value = ''
  if (!queryUrlInput.value) return

  try {
    const parsed = parseQueryUrl(queryUrlInput.value.trim())
    queryBaseUrl.value = parsed.baseUrl
    queryParams.value = parsed.params.length ? parsed.params : [{ key: '', value: '' }]
  } catch (error) {
    queryBaseUrl.value = ''
    queryParams.value = [{ key: '', value: '' }]
    if (error instanceof QueryParseError) {
      queryError.value = error.message
    } else if (error instanceof Error) {
      queryError.value = error.message
    } else {
      queryError.value = 'Не удалось разобрать URL.'
    }
  }
}

function addParam() {
  queryParams.value.push({ key: '', value: '' })
}

function removeParam(index: number) {
  queryParams.value.splice(index, 1)
  if (queryParams.value.length === 0) {
    queryParams.value.push({ key: '', value: '' })
  }
}

function buildQueryUrl() {
  if (!queryBaseUrl.value) {
    queryError.value = 'Сначала разберите ссылку, чтобы получить базовый URL.'
    return
  }
  queryError.value = ''
  builtQueryUrl.value = buildUrlFromParams(queryBaseUrl.value, queryParams.value, {
    formUrlEncoded: formUrlEncoded.value
  })
}

async function copyQueryUrl() {
  if (!builtQueryUrl.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(builtQueryUrl.value)
    queryCopyLabel.value = 'Скопировано'
    if (queryCopyTimer.value) clearTimeout(queryCopyTimer.value)
    queryCopyTimer.value = setTimeout(() => {
      queryCopyLabel.value = 'Скопировать URL'
    }, 2000)
  } catch (error) {
    queryCopyLabel.value = 'Не удалось'
    if (queryCopyTimer.value) clearTimeout(queryCopyTimer.value)
    queryCopyTimer.value = setTimeout(() => {
      queryCopyLabel.value = 'Скопировать URL'
    }, 2000)
  }
}

watch(
  [queryParams, queryBaseUrl, formUrlEncoded],
  () => {
    builtQueryUrl.value = ''
  },
  { deep: true }
)

const openFaq = ref<number | null>(null)

const faqItems = [
  {
    q: 'Чем отличается encodeURIComponent?',
    a: 'encodeURIComponent кодирует почти все спецсимволы и подходит для параметров. encodeURI используют для всей ссылки и он оставляет разделители ? и &.'
  },
  {
    q: 'Можно ли кодировать кириллицу в ссылке?',
    a: 'Да. Кириллица превращается в безопасные последовательности %D0.. и корректно читается браузером после декодирования.'
  },
  {
    q: 'Почему ломаются пробелы?',
    a: 'Пробелы могут стать %20 или +. Если сервис ожидает form urlencoded, используйте режим с плюсами.'
  },
  {
    q: 'Что делать если decode ругается?',
    a: 'Проверьте, что строка полностью закодирована и не содержит обрезанных процентов. Если сомневаетесь, переключитесь на режим компонента.'
  },
  {
    q: 'Как собрать ссылку с UTM?',
    a: 'Соберите пары key=value и кодируйте значения отдельно. Query helper делает это автоматически.'
  },
  {
    q: 'Это шифрование или нет?',
    a: 'Нет. URL encoding — это преобразование для совместимости, а не способ скрыть данные.'
  }
]

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/url-encode`)
const metaDescription =
  'Кодируй и декодируй URL и параметры. encodeURIComponent, encodeURI, form urlencoded, разбор query string.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'URL encode decode онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'URL Encode Decode', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'URL encode decode онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'URL encode decode онлайн | Neural Wise Wolf',
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
.url-encode-page {
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
.query-card,
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
  background: radial-gradient(circle, rgba(251, 191, 36, 0.18), transparent 60%);
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
  background: linear-gradient(130deg, rgba(251, 191, 36, 0.9), rgba(34, 197, 94, 0.75));
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.toggle.disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  background: rgba(251, 191, 36, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.settings-hint {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

.error {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.error p {
  margin: 0;
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
  background: linear-gradient(130deg, rgba(251, 191, 36, 0.9), rgba(34, 197, 94, 0.8));
  border: none;
  color: #0f172a;
}

.btn.small {
  padding: 8px 10px;
  font-size: 13px;
}

.query-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.query-head h2 {
  margin: 0 0 6px;
}

.query-head p {
  margin: 0;
  color: #94a3b8;
}

.query-input {
  display: grid;
  gap: 8px;
}

.query-input label {
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.query-row {
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto;
}

.query-row input {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.6);
  padding: 12px 14px;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.query-row input::placeholder {
  color: #94a3b8;
}

.query-error {
  margin: 0;
  color: #fecaca;
  font-size: 13px;
}

.query-table {
  display: grid;
  gap: 10px;
}

.query-table-head,
.query-table-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.query-table-head {
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.query-table-row input {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  padding: 10px 12px;
  color: #e2e8f0;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.query-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.query-result {
  display: grid;
  gap: 8px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 14px;
}

.query-result h3 {
  margin: 0;
}

.query-result code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #e2e8f0;
  word-break: break-all;
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
  border-color: rgba(251, 191, 36, 0.45);
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

@media (max-width: 900px) {
  .query-row {
    grid-template-columns: minmax(0, 1fr);
  }
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

  .query-table-head,
  .query-table-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .query-table-head span:last-child {
    display: none;
  }
}
</style>
