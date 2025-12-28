<template>
  <main class="counter-page">
    <header class="counter-hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Счетчик символов онлайн</h1>
      <p class="lead">Считает символы, слова, строки, абзацы и пробелы. Без регистрации</p>
    </header>

    <section class="counter-card">
      <div class="input-block">
        <label for="counter-text">Вставь текст</label>
        <textarea
          id="counter-text"
          v-model="sourceText"
          rows="8"
          placeholder="Напиши или вставь текст — статистика появится сразу"
        />
      </div>

      <div class="action-row">
        <button class="btn ghost" type="button" :disabled="!sourceText.length" @click="clearText">
          Очистить
        </button>
        <button class="btn primary" type="button" :disabled="!sourceText.length" @click="copyStats">
          {{ copyLabel }}
        </button>
      </div>

      <div class="settings-card">
        <div class="settings-title">Настройки подсчета</div>
        <label class="toggle">
          <input v-model="ignoreMultipleSpaces" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Игнорировать множественные пробелы</span>
        </label>
        <label class="toggle">
          <input v-model="countEmojiAsOne" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Считать эмодзи как 1 символ</span>
        </label>
        <label class="toggle">
          <input v-model="hyphenAsOne" type="checkbox" />
          <span class="toggle-ui" aria-hidden="true"></span>
          <span>Считать дефисные слова как одно</span>
        </label>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-label">Символы, всего</span>
          <span class="stat-value">{{ stats.characters }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Символы без пробелов</span>
          <span class="stat-value">{{ stats.charactersWithoutSpaces }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Пробелы</span>
          <span class="stat-value">{{ stats.spaces }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Слова</span>
          <span class="stat-value">{{ stats.words }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Строки</span>
          <span class="stat-value">{{ stats.lines }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Абзацы</span>
          <span class="stat-value">{{ stats.paragraphs }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Предложения</span>
          <span class="stat-value">{{ stats.sentences }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Уникальные слова</span>
          <span class="stat-value">{{ stats.uniqueWords }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Самое частое слово</span>
          <span class="stat-value">{{ mostFrequentLabel }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Время чтения, мин</span>
          <span class="stat-value">{{ stats.readingTime }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Время произнесения, мин</span>
          <span class="stat-value">{{ stats.speakingTime }}</span>
        </article>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Онлайн счетчик текста для учебы, работы и контента</h2>
        <p>
          Когда текст должен уложиться в лимит, проще всего не гадать, а сразу видеть точные цифры.
          Этот счетчик помогает быстро оценить объем: сколько символов и пробелов в письме, сколько
          слов в посте, сколько строк в заявлении и сколько абзацев в статье. Все считается мгновенно
          на вашем устройстве, без регистрации и передачи данных на сервер.
        </p>
        <p>
          Инструмент полезен копирайтерам, редакторам и SMM-специалистам, которым важны ограничения
          платформ. Студентам он помогает проверить объем эссе и реферата. Тем, кто пишет резюме или
          коммерческие предложения, счетчик дает уверенность, что текст не «раздувается». Даже для
          обычных заметок это удобно: вы сразу понимаете, сколько места занимает мысль.
        </p>
        <p>
          Помимо базовой статистики, сервис показывает уникальные слова, самое частое слово и оценку
          времени чтения. Это полезно, когда нужно убрать повторы, упростить стиль или оценить длину
          выступления. Добавьте настройки подсчета: игнорирование множественных пробелов, учет эмодзи
          как одного символа и объединение дефисных слов делают результат точным под ваш кейс.
        </p>
        <p>
          Форматируете текст под соцсети, где важен каждый символ? Пишете сценарий, где важна
          продолжительность речи? Нужно проверить абзацность в инструкции или договоре? Просто вставьте
          текст и копируйте статистику — она уже подготовлена в удобном виде.
        </p>
      </div>

      <div class="usage">
        <h3>Где помогает счетчик</h3>
        <ul class="usage-list">
          <li>Посты, описания и объявления с лимитом символов</li>
          <li>Эссе, дипломы и рефераты с требованиями к объему</li>
          <li>Письма, заявки, резюме и сопроводительные</li>
          <li>Скрипты для роликов, подкастов и выступлений</li>
          <li>Редактура текста: повторы, абзацы и ритм</li>
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import { getTextStats } from '@/utils/text/stats'

definePageMeta({
  alias: ['/generators/text-counter', '/generators/text-counter/']
})

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Инструменты', to: '/decisions' },
  { label: 'Счетчик текста' }
]

const sourceText = ref('')
const debouncedText = ref('')
const debounceTimer = ref(null)

const ignoreMultipleSpaces = ref(false)
const countEmojiAsOne = ref(true)
const hyphenAsOne = ref(true)

const copyLabel = ref('Скопировать статистику')
const copyTimer = ref(null)
const openFaq = ref(null)

watch(
  sourceText,
  (value) => {
    if (debounceTimer.value) clearTimeout(debounceTimer.value)
    debounceTimer.value = setTimeout(() => {
      debouncedText.value = value
    }, 160)
  },
  { immediate: true }
)

const stats = computed(() =>
  getTextStats(debouncedText.value, {
    ignoreMultipleSpaces: ignoreMultipleSpaces.value,
    countEmojiAsOne: countEmojiAsOne.value,
    hyphenAsOne: hyphenAsOne.value
  })
)

const mostFrequentLabel = computed(() => stats.value.mostFrequentWord || '—')

const formattedStats = computed(() => {
  const value = stats.value
  return [
    'Счетчик текста',
    '',
    `Символы, всего: ${value.characters}`,
    `Символы без пробелов: ${value.charactersWithoutSpaces}`,
    `Пробелы: ${value.spaces}`,
    `Слова: ${value.words}`,
    `Строки: ${value.lines}`,
    `Абзацы: ${value.paragraphs}`,
    `Предложения: ${value.sentences}`,
    `Уникальные слова: ${value.uniqueWords}`,
    `Самое частое слово: ${mostFrequentLabel.value}`,
    `Время чтения, мин: ${value.readingTime}`,
    `Время произнесения, мин: ${value.speakingTime}`
  ].join('\n')
})

const faqItems = [
  {
    q: 'Счетчик работает без регистрации?',
    a: 'Да, все расчеты выполняются прямо в браузере. Данные не отправляются на сервер.'
  },
  {
    q: 'Почему количество символов может отличаться?',
    a: 'Можно включить учет эмодзи как одного символа и игнорирование множественных пробелов — это влияет на итог.'
  },
  {
    q: 'Как считаются слова с дефисом?',
    a: 'По умолчанию дефисные слова считаются как одно, но вы можете отключить эту настройку.'
  },
  {
    q: 'Как считаются абзацы?',
    a: 'Абзацы определяются по пустым строкам между блоками текста.'
  },
  {
    q: 'Можно ли быстро скопировать статистику?',
    a: 'Да, кнопка копирования подготовит красивый текст со всеми метриками.'
  }
]

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
}

function clearText() {
  sourceText.value = ''
  debouncedText.value = ''
  copyLabel.value = 'Скопировать статистику'
}

async function copyStats() {
  if (!sourceText.value.trim()) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(formattedStats.value)
    copyLabel.value = 'Статистика скопирована'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Скопировать статистику'
    }, 2000)
  } catch (err) {
    copyLabel.value = 'Не удалось скопировать'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Скопировать статистику'
    }, 2000)
  }
}

onBeforeUnmount(() => {
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/tools/text-counter`)
const metaDescription =
  'Посчитай символы, слова, строки, абзацы, предложения и время чтения. Бесплатно и мгновенно'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Счетчик символов онлайн',
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
        { '@type': 'ListItem', position: 3, name: 'Счетчик текста', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Счетчик символов и слов онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Счетчик символов и слов онлайн | Neural Wise Wolf',
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
.counter-page {
  display: grid;
  gap: clamp(20px, 3vw, 36px);
  width: min(1120px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 32px) 0 clamp(32px, 4vw, 60px);
}

.counter-hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.counter-hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 48px);
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.counter-hero .lead {
  margin: 0;
  max-width: 760px;
  color: #cbd5e1;
}

.counter-card,
.seo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.counter-card::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.14), transparent 60%);
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
  min-height: 220px;
  outline: none;
}

.input-block textarea::placeholder {
  color: #94a3b8;
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

.settings-card {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
}

.settings-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: #e2e8f0;
  cursor: pointer;
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
  background: rgba(34, 197, 94, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 8px;
}

.stat-label {
  color: #94a3b8;
  font-size: 13px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #e5e7eb;
  word-break: break-word;
}

.seo-card {
  gap: 20px;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  border-color: rgba(34, 197, 94, 0.45);
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
  .counter-card::after {
    width: 160px;
    height: 160px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
