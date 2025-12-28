<template>
  <main class="text-case-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Изменение регистра текста онлайн</h1>
      <p class="lead">Преобразуй текст в нужный формат за секунду, копирование в один клик</p>
    </header>

    <section class="case-card">
      <div class="input-block">
        <label for="source-text">Исходный текст</label>
        <textarea
          id="source-text"
          v-model="sourceText"
          rows="9"
          placeholder="Вставь текст сюда"
        />
      </div>

      <div id="result" ref="resultRef" class="result-block">
        <div class="result-head">
          <h2>Результат</h2>
          <div class="result-actions">
            <button class="btn ghost" type="button" :disabled="!resultText" @click="copyResult">
              {{ copyLabel }}
            </button>
            <button class="btn ghost" type="button" :disabled="!resultText" @click="swapTexts">
              Поменять местами
            </button>
          </div>
        </div>
        <div class="result-output" role="status" aria-live="polite">
          {{ resultText || 'Здесь появится преобразованный текст.' }}
        </div>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-label">Символов</span>
          <span class="stat-value">{{ stats.characters }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Слов</span>
          <span class="stat-value">{{ stats.words }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Строк</span>
          <span class="stat-value">{{ stats.lines }}</span>
        </article>
      </div>

      <div class="modes-block">
        <p class="block-title">Режим преобразования</p>
        <div class="modes-grid">
          <button
            v-for="mode in modes"
            :key="mode.value"
            type="button"
            class="mode-tile"
            :class="{ active: activeMode === mode.value }"
            :aria-pressed="activeMode === mode.value"
            @click="activeMode = mode.value"
          >
            <span class="mode-title">{{ mode.title }}</span>
            <span class="mode-caption">{{ mode.caption }}</span>
          </button>
        </div>
      </div>

      <div class="options-block">
        <p class="block-title">Настройки</p>
        <div class="options-grid">
          <label class="toggle">
            <input v-model="preserveDoubleSpaces" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Сохранять двойные пробелы как есть</span>
          </label>
          <label class="toggle">
            <input v-model="removeExtraSpaces" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять лишние пробелы перед преобразованием</span>
          </label>
          <label class="toggle">
            <input v-model="preserveLineBreaks" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Сохранять переносы строк</span>
          </label>
        </div>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Зачем нужен конвертер регистра для текста и заголовков</h2>
        <p>
          Регистр влияет на восприятие текста: заголовки в CAPS добавляют жесткости, Title Case помогает
          выделить важные слова, а Sentence case делает копирайт дружелюбным и читаемым. Этот инструмент
          помогает быстро привести текст к нужному виду для сайтов, карточек товаров, никнеймов и списков
          — без ручной правки.
        </p>
        <p>
          Конвертер работает локально в браузере, поддерживает русский и английский языки, умеет
          сохранять переносы строк и нормализует пробелы при необходимости. Выбирай режим, копируй
          результат и продолжай работу без лишних кликов.
        </p>
      </div>

      <div class="usage">
        <h3>Где пригодится изменение регистра</h3>
        <ul class="usage-list">
          <li>Заголовки для лендингов и статей, чтобы быстро примерить разные варианты</li>
          <li>Никнеймы и логины: camelCase, PascalCase, snake_case и kebab-case</li>
          <li>Чистые списки и подписи в таблицах или карточках товаров</li>
          <li>Подготовка текста для SEO, карточек и презентаций</li>
        </ul>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/remove-spaces">
            <span class="other-title">Удаление лишних пробелов</span>
            <span class="other-desc">Почистить табы, пробелы и пустые строки в тексте.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-counter">
            <span class="other-title">Счетчик текста</span>
            <span class="other-desc">Символы, слова, строки и базовая статистика текста.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-reverser">
            <span class="other-title">Переворот текста</span>
            <span class="other-desc">Развернуть текст, строки или порядок слов.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/wolf-lorem">
            <span class="other-title">Волчий рыбий текст</span>
            <span class="other-desc">Абзацы и предложения про волков для макетов.</span>
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
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import { convertTextCase, type TextCaseMode } from '@/utils/text/textCase'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Изменение регистра' }
]

const sourceText = ref('')
const activeMode = ref<TextCaseMode>('upper')

const preserveDoubleSpaces = ref(false)
const removeExtraSpaces = ref(true)
const preserveLineBreaks = ref(true)

const copyLabel = ref('Копировать')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const resultRef = ref<HTMLElement | null>(null)
const openFaq = ref<number | null>(null)

const modes = [
  { value: 'upper', title: 'В ВЕРХНИЙ РЕГИСТР', caption: 'UPPERCASE' },
  { value: 'lower', title: 'в нижний регистр', caption: 'lowercase' },
  { value: 'title', title: 'Каждое Слово С Заглавной', caption: 'Title Case' },
  { value: 'sentence', title: 'Как в предложении', caption: 'Sentence case' },
  { value: 'invert', title: 'iNvErT cAsE', caption: 'Инверсия регистра' },
  { value: 'meme', title: 'sPoNgEbOb cAsE', caption: 'Мемный рандом' },
  { value: 'snake', title: 'snake_case', caption: 'нижний + подчеркивания' },
  { value: 'kebab', title: 'kebab-case', caption: 'нижний + дефисы' },
  { value: 'camel', title: 'camelCase', caption: 'первое слово с маленькой' },
  { value: 'pascal', title: 'PascalCase', caption: 'каждое слово с заглавной' }
]

const resultText = computed(() =>
  convertTextCase(sourceText.value, activeMode.value, {
    preserveDoubleSpaces: preserveDoubleSpaces.value,
    removeExtraSpaces: removeExtraSpaces.value,
    preserveLineBreaks: preserveLineBreaks.value
  })
)

const stats = computed(() => {
  const text = resultText.value
  if (!text) {
    return { characters: 0, words: 0, lines: 0 }
  }
  const characters = text.length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text.split('\n').length
  return { characters, words, lines }
})

const faqItems = [
  {
    q: 'Конвертер поддерживает русский язык?',
    a: 'Да, регистр корректно меняется для русского и английского текста.'
  },
  {
    q: 'Сохраняются ли переносы строк в snake_case и camelCase?',
    a: 'Да, если включен тумблер сохранения переносов строк - обработка идет построчно.'
  },
  {
    q: 'Можно сохранить двойные пробелы?',
    a: 'Да, включите настройку сохранения двойных пробелов перед преобразованием.'
  },
  {
    q: 'Почему результат пустой в camelCase или PascalCase?',
    a: 'Режимы собираются только из букв и цифр. Если в строке только знаки, она станет пустой.'
  },
  {
    q: 'Данные куда-то отправляются?',
    a: 'Нет, все преобразования происходят локально в браузере.'
  }
]

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
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
  } catch (err) {
    copyLabel.value = 'Ошибка копирования'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Копировать'
    }, 2000)
  }
}

function swapTexts() {
  if (!resultText.value) return
  sourceText.value = resultText.value
  if (resultText.value.length > 400 && resultRef.value) {
    resultRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/text-case`)
const metaDescription =
  'Переведи текст в верхний, нижний, Title Case, camelCase, snake_case и другие форматы. Быстро и бесплатно'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Изменение регистра текста онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'Изменение регистра', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Изменение регистра текста онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Изменение регистра текста онлайн | Neural Wise Wolf',
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
.text-case-page {
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

.case-card,
.seo-card,
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

.case-card::after {
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

.modes-grid {
  margin-top: 8px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.mode-tile {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.65);
  color: #e2e8f0;
  border-radius: 16px;
  padding: 12px 14px;
  display: grid;
  gap: 6px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.mode-tile:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.5);
}

.mode-tile.active {
  border-color: rgba(56, 189, 248, 0.7);
  background: rgba(56, 189, 248, 0.12);
  color: #f8fafc;
}

.mode-title {
  font-weight: 800;
}

.mode-caption {
  font-size: 13px;
  color: #94a3b8;
}

.mode-tile.active .mode-caption {
  color: rgba(226, 232, 240, 0.85);
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

.result-block {
  display: grid;
  gap: 12px;
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

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e5e7eb;
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

  .result-actions {
    width: 100%;
  }
}
</style>
