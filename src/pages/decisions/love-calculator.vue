<template>
  <div class="decisions-page flex flex-col gap-10 pb-16">
    <NavBar />

    <div class="calc-hero">
      <section class="page-center gap-4">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <h1 class="hero-title">Калькулятор любви</h1>
        <p class="hero-sub">
          Узнайте, насколько вы подходите друг другу. Введите два имени и получите волчий вердикт в процентах.
        </p>
      </section>

      <section class="page-center">
        <div class="calc-card">
          <div class="inputs">
            <div class="field">
              <label>Имя 1</label>
              <input v-model="name1" type="text" placeholder="Введите имя" />
            </div>
            <div class="field">
              <label>Имя 2</label>
              <input v-model="name2" type="text" placeholder="Введите имя" />
            </div>
          </div>

          <div class="cta-center">
            <button class="btn primary calc-btn" :disabled="generateDisabled" @click="calculate">❤️ Рассчитать</button>
          </div>

          <p v-if="error" class="error-text">{{ error }}</p>

          <div v-if="hasResult" class="result-box" role="status" aria-live="polite">
            <p class="result-title">Ваш процент совместимости</p>
            <div class="result-score" :key="score">{{ score }}%</div>
            <p class="result-message">{{ message }}</p>
          </div>
        </div>
        <p class="trust-note">Расчёт на устройстве, имена никуда не отправляем.</p>
      </section>
    </div>

    <div ref="seoTrigger" class="seo-trigger" aria-hidden="true" />

    <div class="seo-lazy" :class="{ 'seo-visible': seoVisible }">
      <section class="max-w-6xl mx-auto w-full flex flex-col gap-4">
        <h2 class="text-2xl font-bold text-white text-center section-title">Почему это удобно</h2>
        <div class="feature-grid">
          <article class="feature-card">
            <h3>Быстрый результат</h3>
            <p>Пара кликов и вы уже видите процент совместимости.</p>
          </article>
          <article class="feature-card">
            <h3>Просто и весело</h3>
            <p>Подходит для мемов, вечеринок и лёгких шуток с друзьями.</p>
          </article>
          <article class="feature-card">
            <h3>Неожиданные комбинации</h3>
            <p>Детерминированный расчёт даёт одинаковый результат для одинаковых имён.</p>
          </article>
          <article class="feature-card">
            <h3>Всегда под рукой</h3>
            <p>Работает в браузере, без регистрации и лишних действий.</p>
          </article>
        </div>
      </section>

      <section class="info-panel max-w-6xl mx-auto w-full">
        <h2 class="text-2xl font-bold text-white text-center section-title">Как работает калькулятор любви по именам</h2>
        <div class="info-grid">
          <article class="info-card" v-for="card in infoCards" :key="card.title">
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </article>
        </div>
        <p class="trust-note">Расчёт на устройстве, имена никуда не отправляем.</p>

        <h3 class="ideas-title">Идеи для игры</h3>
        <div class="ideas-card">
          <div class="ideas-grid">
            <div class="idea-chip" v-for="idea in ideas" :key="idea">
              {{ idea }}
            </div>
          </div>
        </div>

        <div class="faq-accordion">
          <h3>FAQ</h3>
          <div class="faq-list">
            <div
              v-for="(item, idx) in faqItems"
              :key="item.q"
              class="faq-item"
              :class="{ open: openFaq === idx }"
            >
              <button class="faq-toggle" type="button" @click="openFaq = openFaq === idx ? null : idx">
                <span>{{ item.q }}</span>
                <span class="icon">{{ openFaq === idx ? '?' : '+' }}</span>
              </button>
              <div class="faq-body">
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Инструменты', to: '/decisions' },
  { label: 'Калькулятор любви' }
]

const name1 = ref('')
const name2 = ref('')
const score = ref(null)
const message = ref('')
const hasResult = ref(false)
const error = ref('')
const openFaq = ref(null)
const seoVisible = ref(false)
const seoTrigger = ref(null)
let seoObserver = null
const handleUserIntent = () => {
  revealSeo()
}

const generateDisabled = computed(() => !name1.value.trim() || !name2.value.trim())

const infoCards = [
  {
    title: 'Что это',
    text: 'Калькулятор любви по именам считает процент совместимости и показывает короткий “волчий” вердикт. Работает сразу в браузере.'
  },
  {
    title: 'Как считаем',
    text: 'Соединяем два имени, считаем сумму кодов символов и превращаем её в процент. Одинаковые пары дают одинаковый результат — удобно сравнивать.'
  },
  {
    title: 'Как относиться',
    text: 'Это лёгкая игра: не заменяет психологию и здравый смысл. Используйте для мемов, тостов и знакомства, а решения принимайте сердцем.'
  }
]

const faqItems = [
  { q: 'Что показывает процент совместимости?', a: 'Это игровой индикатор “подходите/не подходите” для весёлых сценариев — мемы, тосты, знакомства.' },
  { q: 'Как считается результат?', a: 'По сумме кодов символов двух имён, превращённой в процент. Совместимость фиксируется для одинаковых пар.' },
  { q: 'Почему одинаковые имена дают одинаковый процент?', a: 'Алгоритм детерминирован: одинаковый ввод — одинаковый итог.' },
  { q: 'Храните ли вы имена?', a: 'Нет, расчёт полностью на устройстве, данные никуда не отправляются.' },
  { q: 'Можно вводить на кириллице и латинице?', a: 'Да, учитываются любые символы. Процент считает всё, что введёте.' },
  { q: 'Работает ли на телефоне?', a: 'Да, калькулятор любви открывается в мобильном браузере без установки.' },
  { q: 'Можно ли фамилии и никнеймы?', a: 'Да, но помните, что это игра — процент меняется вместе с текстом.' },
  { q: 'Это серьёзный тест или шутка?', a: 'Шутка. Используйте для лёгких моментов, а серьёзные решения оставьте сердцу и голове.' }
]

const ideas = [
  'проверить пару',
  'сравнить друзей',
  'сделать мем в чате',
  'выбрать тост',
  'игра на вечеринке',
  'для знакомства'
]


const normalizeName = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z\u0430-\u044f\u0451]+/g, '')

const specialNames = new Set([
  '\u0430\u043b\u0441\u0443',
  '\u0430\u0440\u0441\u0435\u043d\u0442\u0438\u0439',
  'alsu',
  'arsentiy',
  'arsenty',
  'arsentii'
])

function calculate() {
  const a = normalizeName(name1.value || '')
  const b = normalizeName(name2.value || '')
  if (!a || !b) {
    error.value = 'Введи оба имени, волк без этого не считает'
    hasResult.value = false
    return
  }
  error.value = ''


  const isSpecialPair = specialNames.has(a) && specialNames.has(b) && a !== b
  if (isSpecialPair) {
    score.value = 100
    message.value = '\u0418\u0434\u0435\u0430\u043b\u044c\u043d\u043e\u0435 \u0441\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u0410\u043b\u0441\u0443 \u0438 \u0410\u0440\u0441\u0435\u043d\u0442\u0438\u044f.'
    hasResult.value = true
    return
  }

  const combined = a + b
  let total = 0
  for (let i = 0; i < combined.length; i += 1) {
    total += combined.charCodeAt(i)
  }
  const seed = combined.length * 13 + total
  const percent = (seed % 100) + 1
  score.value = percent
  message.value = getMessage(percent)
  hasResult.value = true
}

function getMessage(pct) {
  if (pct >= 90) return 'Идеальная пара'
  if (pct >= 70) return 'Отличный результат, у вас большое будущее'
  if (pct >= 50) return 'Неплохо, но придётся поработать над отношениями'
  if (pct >= 30) return 'Интересная комбинация, возможно это испытание судьбы'
  return 'Пока не идеально, но всё можно изменить'
}

const revealSeo = () => {
  if (seoVisible.value) return
  seoVisible.value = true
  if (seoObserver) {
    seoObserver.disconnect()
    seoObserver = null
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleUserIntent)
  window.removeEventListener('touchstart', handleUserIntent)
}

const handleScroll = () => {
  if (window.scrollY > 20) {
    revealSeo()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('wheel', handleUserIntent, { passive: true })
  window.addEventListener('touchstart', handleUserIntent, { passive: true })

  if (seoTrigger.value && 'IntersectionObserver' in window) {
    seoObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealSeo()
        }
      },
      { rootMargin: '0px 0px -40% 0px' }
    )
    seoObserver.observe(seoTrigger.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleUserIntent)
  window.removeEventListener('touchstart', handleUserIntent)
  if (seoObserver) {
    seoObserver.disconnect()
  }
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/love-calculator`)
const metaDescription =
  'Калькулятор любви по именам. Введите два имени и получите процент совместимости и короткий "волчий" вердикт. Всё работает в браузере, без регистрации.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Калькулятор любви',
      applicationCategory: 'EntertainmentApplication',
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
        { '@type': 'ListItem', position: 3, name: 'Калькулятор любви', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Калькулятор любви онлайн по именам, процент совместимости | Нейронный Волк',
  description: metaDescription,
  ogTitle: 'Калькулятор любви онлайн по именам, процент совместимости | Нейронный Волк',
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
.page-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.calc-hero {
  min-height: calc(100vh + 200px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  transform: translateY(-200px);
}

.pill-hero {
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.hero-title {
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 800;
  color: #fff;
}

.hero-sub {
  max-width: 720px;
  color: #cbd5e1;
  font-size: 18px;
}

.calc-card {
  width: min(780px, 100%);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 26px;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.field label {
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field input {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 14px;
  color: #fff;
  font-size: 16px;
  outline: none;
}

.field input::placeholder {
  color: #94a3b8;
}

.cta-center {
  display: flex;
  justify-content: center;
}

.calc-btn {
  min-width: 240px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.calc-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-box {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 8px;
  text-align: center;
}

.result-title {
  color: #cbd5e1;
  font-size: 14px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.result-score {
  font-size: clamp(42px, 10vw, 64px);
  font-weight: 800;
  color: #fff;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.result-message {
  color: #e2e8f0;
  font-size: 16px;
}

.error-text {
  margin: 0;
  color: #fecdd3;
  text-align: center;
  font-size: 14px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
}

.feature-card h3 {
  color: #fff;
  font-weight: 700;
  margin-bottom: 6px;
}

.feature-card p {
  color: #cbd5e1;
  font-size: 14px;
}

.section-title {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.info-panel {
  display: grid;
  gap: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px 16px;
  display: grid;
  gap: 8px;
}

.info-card h3 {
  margin: 0;
  color: #fff;
}

.info-card p {
  margin: 0;
  color: #cbd5e1;
}

.trust-note {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.faq-accordion {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px 16px;
  display: grid;
  gap: 10px;
}

.faq-accordion h3 {
  margin: 0;
  text-align: center;
}

.faq-list {
  display: grid;
  gap: 8px;
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease;
  background: rgba(255, 255, 255, 0.02);
}

.faq-item.open {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 700;
}

.faq-toggle .icon {
  font-size: 18px;
}

.faq-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 12px;
}

.faq-item.open .faq-body {
  max-height: 200px;
  opacity: 1;
  padding-bottom: 10px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
}

.ideas-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px 16px;
  display: grid;
  gap: 8px;
}

.ideas-title {
  text-align: center;
  margin: 0;
}

.ideas-card h3 {
  margin: 0;
  text-align: center;
}

.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.idea-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  color: #e2e8f0;
  font-weight: 600;
  text-align: center;
}

.seo-trigger {
  width: 100%;
  height: 1px;
}

.seo-lazy {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 0.25s ease, max-height 0.25s ease;
}

.seo-visible {
  opacity: 1;
  max-height: 9999px;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .calc-hero {
    min-height: auto;
    transform: none;
    padding-top: 24px;
  }
}
</style>
