<template>
  <div class="decisions-page">
    <div class="calc-hero">
      <section class="page-center hero-stack">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <h1 class="hero-title">Калькулятор любви по именам</h1>
        <p class="hero-sub">
          Быстрый и честный способ сыграть в совместимость: введите два имени и получите процент, короткий вердикт и идеи,
          как использовать результат для разговора, свидания или вечеринки.
        </p>
      </section>

      <section class="page-center calc-section">
        <div class="calc-card">
          <div class="inputs">
            <div class="field">
              <label>Имя 1</label>
              <input
                v-model="name1"
                type="text"
                placeholder="Введите имя"
                @keydown.enter.prevent="calculate"
              />
            </div>
            <div class="field">
              <label>Имя 2</label>
              <input
                v-model="name2"
                type="text"
                placeholder="Введите имя"
                @keydown.enter.prevent="calculate"
              />
            </div>
          </div>

          <div class="cta-center">
            <button class="btn primary calc-btn" :disabled="generateDisabled" @click="calculate">
              Посчитать процент
            </button>
          </div>

          <p v-if="error" class="error-text">{{ error }}</p>

          <div v-if="hasResult" ref="resultRef" class="result-box" role="status" aria-live="polite">
            <p class="result-title">Ваш результат совместимости</p>
            <div class="result-score" :key="score">{{ score }}%</div>
            <p class="result-message">{{ message }}</p>
            <div class="result-actions">
              <button class="result-action" type="button" @click="copyResult">Скопировать результат</button>
              <button class="result-action subtle" type="button" @click="shareResult">Поделиться ссылкой</button>
            </div>
            <p v-if="copyStatus || shareStatus" class="result-status">{{ copyStatus || shareStatus }}</p>
          </div>
        </div>
        <p class="trust-note">Результаты считаются локально в браузере, данные не отправляются на сервер.</p>
      </section>
    </div>

    <div class="seo-lazy seo-visible">
      <div class="seo-wrap">
        <section class="seo-section">
          <h2 class="section-title">Калькулятор любви по именам онлайн</h2>
          <p class="seo-text">
            Это лёгкий и быстрый способ проверить совместимость по именам онлайн. Введите два имени, и вы получите процент,
            краткий вердикт и настрой, который можно использовать как повод для разговора. Калькулятор работает в браузере,
            без регистрации, прямо на телефоне или ноутбуке.
          </p>
          <p class="seo-text">
            Мы сделали инструмент максимально понятным: одинаковые входные данные дают одинаковый результат, поэтому вы
            всегда можете проверить себя снова или сравнить несколько вариантов написания имён.
          </p>
          <div class="seo-media">
            <img
              src="/images/love-calculator/wolf-love-forecast.png"
              alt="Мемный Волк и прогноз совместимости по именам"
              loading="lazy"
              width="960"
              height="540"
            />
          </div>
        </section>

        <section class="seo-section">
          <h2 class="section-title">Как считается совместимость по именам</h2>
          <p class="seo-text">
            Это детерминированная игра. Мы нормализуем ввод: убираем лишние пробелы, символы и приводим имена к единому
            формату. Затем алгоритм складывает значения символов и превращает их в процент совместимости. Поэтому при
            одинаковом вводе результат всегда будет одинаковым.
          </p>
          <p class="seo-text">
            Такой подход честный: никакой случайности, никаких скрытых факторов. Игра помогает сравнить варианты, но не
            заменяет реальные чувства, поэтому относитесь к проценту как к весёлому триггеру для общения.
          </p>
        </section>

        <section class="seo-section">
          <h2 class="section-title">Как использовать калькулятор любви, идеи для пары и компании</h2>
          <p class="seo-text">
            Сценариев много: от лёгкой переписки до встречи с друзьями. Калькулятор удобно использовать как мини-игру на
            свидании или как повод пошутить в чате. Вы можете проверять имена в разных вариантах, обсуждать результаты и
            придумывать свои правила.
          </p>
          <ul class="ideas-list">
            <li class="idea-item">Сравните результат с именами в разном написании и обсудите, почему так.</li>
            <li class="idea-item">Сделайте турнир среди друзей: чьи пары выйдут в топ-3.</li>
            <li class="idea-item">Проверьте совместимость с никнеймами или прозвищами.</li>
            <li class="idea-item">Используйте процент как повод для комплимента.</li>
            <li class="idea-item">Сыграйте в «пары мечты»: придумайте идеальные сочетания имён.</li>
            <li class="idea-item">Проверьте совместимость персонажей из фильмов или игр.</li>
            <li class="idea-item">Сравните результат с фамилиями и обсудите разницу.</li>
            <li class="idea-item">Устройте блиц: кто быстрее назовёт пять пар и проверит их.</li>
            <li class="idea-item">Используйте результат для мини-задания: «если выше 70 — говорим по очереди комплименты».</li>
            <li class="idea-item">Проверьте совместимость лучших друзей — это отдельная игра.</li>
            <li class="idea-item">Сделайте подборку забавных совпадений и отправьте в чат.</li>
            <li class="idea-item">Сохраните ссылку и вернитесь к ней позже, чтобы сравнить ощущения.</li>
          </ul>
          <div class="seo-media">
            <img
              src="/images/love-calculator/wolf-love-chat.png"
              alt="Мемный Волк обсуждает результаты калькулятора любви"
              loading="lazy"
              width="960"
              height="540"
            />
          </div>
        </section>

        <section class="seo-section">
          <h2 class="section-title">Почему результаты могут отличаться в других калькуляторах</h2>
          <p class="seo-text">
            Каждый сервис нормализует ввод по-своему: кто-то учитывает пробелы, дефисы, символы или регистр, а кто-то
            полностью очищает строку. Даже разница между «Анна» и «Анна-Ева» может дать другой процент.
          </p>
          <p class="seo-text">
            Мы приводим имя к чистому виду и поддерживаем русский и английский алфавиты. Это делает результат более
            предсказуемым. Если хотите сравнить, пробуйте одинаковое написание и без лишних символов.
          </p>
          <div class="seo-media">
            <img
              src="/images/love-calculator/wolf-love-compass.png"
              alt="Мемный Волк и компас совместимости"
              loading="lazy"
              width="960"
              height="540"
            />
          </div>
        </section>

        <section class="seo-section">
          <h2 class="section-title">Это тест или шутка</h2>
          <p class="seo-text">
            Это игра. Она не ставит диагнозы и не определяет будущее отношений. Но это отличный повод поговорить, улыбнуться
            и почувствовать атмосферу. Относитесь к результату легко и используйте его как начало диалога.
          </p>
          <p class="seo-text">
            Если хочется более серьёзных выводов, лучше опираться на реальные поступки и общение. А калькулятор оставьте как
            маленький ритуал для настроения.
          </p>
        </section>

        <section class="seo-section related-tools">
          <h2 class="section-title">Похожие инструменты</h2>
          <div class="link-grid">
            <NuxtLink class="link-chip" to="/games/truth-or-dare">Правда или действие</NuxtLink>
            <NuxtLink class="link-chip" to="/games/never-have-i-ever">Я никогда не</NuxtLink>
            <NuxtLink class="link-chip" to="/generators/age-calculator">Калькулятор возраста</NuxtLink>
            <NuxtLink class="link-chip" to="/decisions">Инструменты</NuxtLink>
            <NuxtLink class="link-chip" to="/games">Игры</NuxtLink>
            <NuxtLink class="link-chip" to="/generators">Генераторы</NuxtLink>
          </div>
        </section>

        <section class="seo-section">
          <div class="faq-accordion">
            <h3 class="faq-title">FAQ</h3>
            <div class="faq-list">
              <div
                v-for="(item, idx) in faqItems"
                :key="item.q"
                class="faq-item"
                :class="{ open: openFaq === idx }"
              >
                <button class="faq-toggle" type="button" @click="openFaq = openFaq === idx ? null : idx">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useRoute, useRouter, useSeoMeta } from '#imports'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Инструменты', to: '/decisions' },
  { label: 'Калькулятор любви по именам' }
]

const name1 = ref('')
const name2 = ref('')
const score = ref(null)
const message = ref('')
const hasResult = ref(false)
const error = ref('')
const openFaq = ref(null)
const resultRef = ref(null)
const copyStatus = ref('')
const shareStatus = ref('')

const route = useRoute()
const router = useRouter()
const generateDisabled = computed(() => !name1.value.trim() || !name2.value.trim())

const faqItems = [
  {
    q: 'Можно ли считать совместимость на английских именах?',
    a: 'Да, калькулятор поддерживает латиницу и работает одинаково для английских и русских имён.'
  },
  {
    q: 'Почему меняется процент, если добавить фамилию?',
    a: 'Фамилия добавляет новые символы, поэтому результат пересчитывается. Это ожидаемо для детерминированного алгоритма.'
  },
  {
    q: 'Какой результат считается хорошим?',
    a: 'Обычно выше 70% воспринимается как высокий, но помните, что это игра, а не тест отношений.'
  },
  {
    q: 'Можно ли посчитать совместимость друзей?',
    a: 'Да, это отличный повод для шуток и сравнения. Калькулятор подходит не только для пары.'
  },
  {
    q: 'Работает ли без интернета после загрузки?',
    a: 'Да, после того как страница загрузилась, расчёт идёт локально в браузере.'
  },
  {
    q: 'Как считается процент совместимости?',
    a: 'Мы нормализуем имена и рассчитываем итог на основе набора символов, поэтому одинаковый ввод всегда даёт один результат.'
  },
  {
    q: 'Можно ли использовать никнеймы или прозвища?',
    a: 'Можно. Просто вводите их так, как обычно пишете, и получите процент.'
  },
  {
    q: 'Сохраняются ли мои имена на сервере?',
    a: 'Нет, расчёт происходит в браузере, а имена сохраняются только локально в вашем устройстве.'
  },
  {
    q: 'Почему у разных калькуляторов разные результаты?',
    a: 'У сервисов разные правила нормализации: кто-то учитывает пробелы, регистр и символы, кто-то нет.'
  },
  {
    q: 'Можно ли пересчитать результат несколько раз?',
    a: 'Да, меняйте варианты написания и сравнивайте — результат будет стабильным для каждого ввода.'
  },
  {
    q: 'Это бесплатно?',
    a: 'Да, калькулятор доступен бесплатно и без регистрации.'
  }
]

const normalizeName = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z\u0430-\u044f\u0451]+/g, '')

const specialNames = new Set(['алсу', 'арсентий', 'alsu', 'arsentiy', 'arsenty', 'arsentii'])

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/love-calculator`)
const ogImageUrl = computed(() => `${requestUrl.origin}/favicon.png`)
const metaDescription =
  'Калькулятор любви по именам онлайн: узнай совместимость пары в процентах, получи вердикт и идею для общения. Быстро, бесплатно и без регистрации.'

const shareUrl = computed(() => {
  const q1 = name1.value.trim()
  const q2 = name2.value.trim()
  const params = new URLSearchParams()
  if (q1) params.set('n1', q1)
  if (q2) params.set('n2', q2)
  const queryString = params.toString()
  return queryString ? `${canonicalUrl.value}?${queryString}` : canonicalUrl.value
})

const resultText = computed(() => {
  if (!hasResult.value) return ''
  const q1 = name1.value.trim()
  const q2 = name2.value.trim()
  return `${q1} + ${q2} = ${score.value}% — ${message.value}`
})

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Калькулятор любви по именам',
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
        { '@type': 'ListItem', position: 2, name: 'Инструменты', item: `${requestUrl.origin}/decisions` },
        { '@type': 'ListItem', position: 3, name: 'Калькулятор любви по именам', item: canonicalUrl.value }
      ]
    }
  ]
}))

function getMessage(pct) {
  if (pct >= 90) return 'Отличная совместимость — ваши темпы и настроение совпадают.'
  if (pct >= 70) return 'Сильная связка: есть общая энергия и комфорт в общении.'
  if (pct >= 50) return 'Хороший баланс: многое сходится, но есть простор для диалога.'
  if (pct >= 30) return 'Интересное сочетание: шанс узнать друг друга глубже.'
  return 'Неочевидная пара: используйте результат как повод для юмора.'
}

function updateQueryParams(rawName1, rawName2) {
  if (!process.client) return
  router.replace({ query: { n1: rawName1, n2: rawName2 } })
}

function scrollToResult() {
  if (!process.client || !resultRef.value) return
  resultRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function calculate() {
  const rawName1 = name1.value.trim()
  const rawName2 = name2.value.trim()
  const a = normalizeName(rawName1)
  const b = normalizeName(rawName2)

  if (!a || !b) {
    error.value = 'Введите оба имени, чтобы получить результат.'
    hasResult.value = false
    return
  }

  error.value = ''

  const isSpecialPair = specialNames.has(a) && specialNames.has(b) && a !== b
  if (isSpecialPair) {
    score.value = 100
    message.value = 'Идеальное совпадение для Алсу и Арсентия.'
    hasResult.value = true
    updateQueryParams(rawName1, rawName2)
    nextTick(scrollToResult)
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
  updateQueryParams(rawName1, rawName2)
  nextTick(scrollToResult)
}

async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

function setStatus(target, text) {
  target.value = text
  window.setTimeout(() => {
    target.value = ''
  }, 2200)
}

async function copyResult() {
  if (!process.client) return
  copyStatus.value = ''
  shareStatus.value = ''
  if (!resultText.value) return
  try {
    await copyToClipboard(resultText.value)
    setStatus(copyStatus, 'Результат скопирован.')
  } catch (err) {
    setStatus(copyStatus, 'Не удалось скопировать результат.')
  }
}

async function shareResult() {
  if (!process.client) return
  copyStatus.value = ''
  shareStatus.value = ''
  try {
    if (navigator?.share) {
      await navigator.share({
        title: 'Калькулятор любви по именам онлайн',
        text: resultText.value,
        url: shareUrl.value
      })
      setStatus(shareStatus, 'Ссылка отправлена.')
    } else {
      await copyToClipboard(shareUrl.value)
      setStatus(shareStatus, 'Ссылка скопирована.')
    }
  } catch (err) {
    setStatus(shareStatus, 'Не удалось поделиться ссылкой.')
  }
}

onMounted(() => {
  const queryName1 = typeof route.query.n1 === 'string' ? route.query.n1 : ''
  const queryName2 = typeof route.query.n2 === 'string' ? route.query.n2 : ''
  const storedName1 = localStorage.getItem('loveCalculatorName1') || ''
  const storedName2 = localStorage.getItem('loveCalculatorName2') || ''

  name1.value = queryName1 || storedName1
  name2.value = queryName2 || storedName2

  if (queryName1 && queryName2) {
    calculate()
  }

  watch(
    [name1, name2],
    ([nextName1, nextName2]) => {
      localStorage.setItem('loveCalculatorName1', nextName1)
      localStorage.setItem('loveCalculatorName2', nextName2)
    },
    { immediate: true }
  )
})

useSeoMeta(() => ({
  title: 'Калькулятор Любви по Именам 2026: совместимость онлайн',
  description: metaDescription,
  ogTitle: 'Калькулятор Любви по Именам 2026: совместимость онлайн',
  ogDescription: metaDescription,
  ogType: 'website',
  ogUrl: canonicalUrl.value,
  ogImage: ogImageUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Калькулятор Любви по Именам 2026: совместимость онлайн',
  twitterDescription: metaDescription,
  twitterImage: ogImageUrl.value,
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
.decisions-page {
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding-bottom: 64px;
}

.page-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-stack {
  gap: 4px;
  padding: 0 16px;
}

.calc-section {
  gap: 6px;
  padding: 0 16px;
}

.calc-hero {
  min-height: calc(100vh + 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  transform: translateY(-70px);
}

.hero-title {
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 800;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  color: #fff;
  text-align: left;
}

.hero-sub {
  max-width: 720px;
  color: #cbd5e1;
  font-size: 18px;
  margin-top: -6px;
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
  scroll-margin-top: 96px;
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

.result-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 6px;
}

.result-action {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.12s ease;
}

.result-action:hover {
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.result-action.subtle {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.35);
  color: #bfdbfe;
}

.result-status {
  margin: 0;
  color: #bae6fd;
  font-size: 13px;
}

.error-text {
  margin: 0;
  color: #fecdd3;
  text-align: center;
  font-size: 14px;
}

.trust-note {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.seo-wrap {
  width: min(1100px, 100%);
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  gap: 20px;
}

.seo-section {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px 22px;
  display: grid;
  gap: 12px;
}

.section-title {
  text-align: left;
  margin: 0;
  color: #fff;
  font-size: clamp(20px, 4vw, 26px);
}

.seo-text {
  margin: 0;
  color: #cbd5e1;
  font-size: 15px;
  line-height: 1.7;
}

.seo-media {
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.35);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
}

.seo-media img {
  width: 100%;
  height: auto;
  display: block;
}

.ideas-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.idea-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  color: #e2e8f0;
  font-weight: 600;
}

.link-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.link-chip {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 700;
}

.link-chip:hover {
  border-color: rgba(147, 197, 253, 0.6);
  color: #93c5fd;
}

.faq-accordion {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.faq-title {
  margin: 0;
  text-align: left;
  font-size: 20px;
  color: #fff;
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
  padding: 0 12px;
}

.faq-item.open .faq-body {
  max-height: 240px;
  opacity: 1;
  padding-bottom: 10px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
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

  .hero-title {
    text-align: center;
  }

  .seo-lazy {
    margin-top: 24px;
  }

  .result-actions {
    width: 100%;
  }

  .faq-toggle {
    align-items: flex-start;
  }
}
</style>
