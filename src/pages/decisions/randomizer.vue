<template>
  <div class="rand-page">
    <section class="rand-hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Рандомайзер</h1>
      <p class="lead">
        Когда идей много, а выбрать сложно. Колесо решений сделает это за вас: случайное число, слово из списка или простой
        ответ «да / нет».
      </p>
    </section>

    <section class="mode-bar">
      <div class="mode-switch">
        <button
          v-for="m in modes"
          :key="m.id"
          class="mode-btn"
          :class="{ active: mode === m.id }"
          @click="mode = m.id"
        >
          {{ m.label }}
        </button>
      </div>
    </section>

    <section class="rand-card">
      <div class="mode-body">
        <template v-if="mode === 'number'">
          <div class="field-row">
            <label>
              От
              <input v-model.number="range.min" type="number" />
            </label>
            <label>
              До
              <input v-model.number="range.max" type="number" />
            </label>
          </div>
          <p class="hint">Укажи границы, и мы выберем любое число внутри диапазона.</p>
        </template>

        <template v-else-if="mode === 'list'">
          <label class="full">
            Вставь варианты через запятую или с новой строки, мы выберем один из них
            <textarea v-model="listInput" rows="4" placeholder="пицца&#10;бургер&#10;роллы"></textarea>
          </label>
        </template>

        <template v-else>
          <p class="hint">Простой рандом: «да» или «нет» — решает за пару секунд.</p>
        </template>

        <div v-if="error" class="alert">{{ error }}</div>

        <div v-if="result" class="result" role="status" aria-live="polite">
          <span class="result-label">Результат:</span>
          <span class="result-value">{{ result }}</span>
        </div>
      </div>
    </section>

    <div class="action-bar">
      <button class="btn primary" :aria-label="generateLabel" @click="generate">Сгенерировать</button>
    </div>

    <section class="benefits">
      <h2>Зачем этот рандомайзер</h2>
      <div class="grid three">
        <article class="card">
          <h3>Универсально</h3>
          <p>Числа, список слов или простой «да / нет» — под любую задачу, от выбора фильма до жеребьёвки.</p>
        </article>
        <article class="card">
          <h3>Честно</h3>
          <p>crypto.getRandomValues вместо подбрасываний монет и споров. Результат максимально случайный.</p>
        </article>
        <article class="card">
          <h3>Быстро</h3>
          <p>Пара кликов — и готово. Можно крутить бесконечно, пока не найдёте идеальный вариант.</p>
        </article>
      </div>
    </section>

    <section class="seo-info">
      <div class="seo-info-card">
        <h2>Как выбрать случайно и без споров</h2>
        <p>
          Рандомайзер онлайн выдаёт случайное число, выбирает вариант из списка или отвечает «да или нет». Всё работает в
          браузере, без регистрации, на телефоне и ноутбуке.
        </p>
        <p>
          Колесо решений помогает договориться: задайте диапазон, вставьте варианты или спросите коротко — ответ появится за
          секунду и избавит от лишних обсуждений.
        </p>
        <div class="seo-info-grid">
          <div class="seo-info-block">
            <h3>Где помогает</h3>
            <ul class="seo-list">
              <li>выбрать фильм</li>
              <li>решить, кто первый</li>
              <li>выбрать ресторан</li>
              <li>раздать роли</li>
              <li>выбрать победителя</li>
              <li>принять быстрый «да/нет» выбор</li>
            </ul>
          </div>
          <div class="seo-info-block">
            <h3>Режимы</h3>
            <div class="mode-chips">
              <div class="chip">
                <strong>Случайное число</strong>
                <span>диапазон под задачу</span>
              </div>
              <div class="chip">
                <strong>Выбор из списка</strong>
                <span>слово из любых вариантов</span>
              </div>
              <div class="chip">
                <strong>Да или нет</strong>
                <span>когда нужен быстрый ответ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-block">
      <div class="faq-card">
        <p class="seo-kicker">Вопросы</p>
        <h2>Как работает колесо решений</h2>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.q"
            class="faq-item"
            :class="{ 'faq-open': openFaq === idx }"
          >
            <button class="faq-toggle" type="button" @click="openFaq = openFaq === idx ? null : idx">
              <span>{{ item.q }}</span>
              <span class="faq-icon" aria-hidden="true">{{ openFaq === idx ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, reactive, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Инструменты', to: '/decisions' },
  { label: 'Рандомайзер' }
]

const modes = [
  { id: 'number', label: 'Число' },
  { id: 'list', label: 'Список' },
  { id: 'yesno', label: 'Да / нет' }
]

const mode = ref('number')
const range = reactive({ min: 1, max: 100 })
const listInput = ref('')
const result = ref('')
const error = ref('')
const openFaq = ref(null)

const cleanedList = computed(() =>
  listInput.value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
)

const generateLabel = computed(() => {
  if (mode.value === 'number') return 'Сгенерировать случайное число'
  if (mode.value === 'list') return 'Выбрать вариант из списка'
  return 'Сгенерировать да или нет'
})

const faqItems = [
  { q: 'Как работает рандомайзер?', a: 'Выбираем случайное число, вариант из списка или отвечаем да/нет с помощью криптографического генератора.' },
  { q: 'Почему результат честный?', a: 'Используем crypto.getRandomValues в браузере, без серверных заготовок.' },
  { q: 'Как выбрать из списка?', a: 'Вставьте варианты через запятую или с новой строки, нажмите «Сгенерировать» — выпадет один.' },
  { q: 'Что делать, если диапазон перепутан?', a: 'Мы сами определим меньшую и большую границы и выберем число внутри.' },
  { q: 'Хранится ли результат?', a: 'Нет, каждый клик — новый случайный выбор, ничего не сохраняется.' },
  { q: 'Подходит ли для жеребьёвки?', a: 'Да, можно выбирать победителя или порядок хода.' }
]

function randomIndex(max) {
  if (max <= 0) return 0
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    return Math.floor(Math.random() * max)
  }
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

function generate() {
  error.value = ''
  if (mode.value === 'number') {
    const min = Number.isFinite(range.min) ? range.min : 1
    const max = Number.isFinite(range.max) ? range.max : 100
    const low = Math.min(min, max)
    const high = Math.max(min, max)
    const span = high - low + 1
    const idx = randomIndex(span)
    result.value = String(low + idx)
    return
  }

  if (mode.value === 'list') {
    if (!cleanedList.value.length) {
      result.value = ''
      error.value = 'Добавьте варианты через запятую или с новой строки, мы выберем один.'
      return
    }
    const choice = cleanedList.value[randomIndex(cleanedList.value.length)]
    result.value = choice
    return
  }

  const yesNo = ['Да', 'Нет']
  result.value = yesNo[randomIndex(yesNo.length)]
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/randomizer`)
const metaDescription =
  'Рандомайзер онлайн: случайное число в диапазоне, выбор слова из списка или быстрый ответ да или нет. Работает в браузере, без регистрации.'

useSeoMeta(() => ({
  title: 'Рандомайзер онлайн, случайное число, выбор из списка, да или нет | Нейронный Волк',
  description: metaDescription,
  ogTitle: 'Рандомайзер онлайн, случайное число, выбор из списка, да или нет | Нейронный Волк',
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
      name: 'Рандомайзер, колесо решений',
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
        { '@type': 'ListItem', position: 3, name: 'Рандомайзер', item: canonicalUrl.value }
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
.rand-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0 48px;
  align-items: center;
}

.rand-hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.rand-hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 48px);
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.rand-hero .lead {
  max-width: 720px;
  margin: 0;
  color: #cbd5e1;
}

.mode-bar {
  width: 100%;
  display: grid;
  justify-items: center;
}

.mode-switch {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  width: min(760px, 100%);
}

.mode-btn {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 12px 14px;
  color: #e5e7eb;
  cursor: pointer;
  transition: 0.2s ease;
}

.mode-btn.active {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
}

.mode-btn:hover {
  transform: translateY(-1px);
}

.rand-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
  width: min(820px, 100%);
  justify-items: center;
}

.rand-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.mode-body {
  display: grid;
  gap: 12px;
  width: 100%;
  max-width: 640px;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

label {
  display: grid;
  gap: 6px;
  color: #cbd5e1;
  font-size: 14px;
}

input,
textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 12px;
  color: #e5e7eb;
  outline: none;
}

textarea {
  resize: vertical;
}

.full {
  width: 100%;
}

.hint {
  margin: 0;
  color: #94a3b8;
}

.alert {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #fecdd3;
  border-radius: 10px;
  padding: 10px 12px;
  margin: 0;
}

.result {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e5e7eb;
}

.result-label {
  opacity: 0.8;
}

.result-value {
  font-weight: 800;
  font-size: 18px;
}

.action-bar {
  display: grid;
  justify-items: center;
  width: 100%;
}

.benefits {
  display: grid;
  gap: 16px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.benefits .seo-kicker {
  margin: 0;
}

.benefits h2 {
  margin: 0;
  text-align: center;
}

.grid.three {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.seo-info {
  width: 100%;
  display: grid;
  justify-items: center;
}

.seo-info-card {
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px 18px;
  display: grid;
  gap: 14px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.24);
}

.seo-info-card h2 {
  margin: 0;
  text-align: center;
}

.seo-info-card p {
  margin: 0;
  color: #cbd5e1;
}

.seo-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.seo-info-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 10px;
}

.seo-info-block h3 {
  margin: 0;
}

.seo-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #cbd5e1;
}

.mode-chips {
  display: grid;
  gap: 8px;
}

.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  gap: 2px;
}

.chip strong {
  color: #fff;
}

.chip span {
  color: #cbd5e1;
  font-size: 13px;
}

.faq-block {
  width: 100%;
  display: grid;
  justify-items: center;
  padding: 16px 0 0;
}

.faq-card {
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 18px 16px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.24);
  display: grid;
  gap: 12px;
}

.faq-card h2 {
  margin: 0;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 6px 8px;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
}

.faq-item.faq-open {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
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
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
  transform: translateY(-4px);
  color: #cbd5e1;
  padding: 0 2px;
}

.faq-item.faq-open .faq-answer {
  max-height: 180px;
  opacity: 1;
  transform: translateY(0);
  margin-top: 6px;
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .rand-card {
    padding: 22px;
  }

  .mode-switch {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style>
