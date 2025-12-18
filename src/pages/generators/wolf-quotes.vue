<template>
  <main class="wolf-page">
    <section id="top" class="wolf-stage">
      <div class="wolf-container">
        <div v-if="showIntro" class="wolf-intro">
          <div class="pill">
            <span>Мотиватор</span>
            <strong>Цитаты волка</strong>
          </div>
          <h1 class="wolf-title">Короткие строки про смелость, риск и движение</h1>
          <p class="wolf-subtitle">
            Без мотивационной воды. Жми — и получай дерзкий один-лайнер, который напоминает: движение важнее сомнений.
          </p>
          <div class="wolf-actions wolf-actions-inline">
            <button class="wolf-btn wolf-btn-primary" @click="start">Запустить</button>
            <button class="wolf-btn wolf-btn-ghost" @click="() => start(true)">Сразу цитату</button>
          </div>
          <p class="wolf-hint">Не греем ожиданием — сразу кидаем фразу в лицо.</p>
          <button class="wolf-link" type="button" @click="scrollToSeo">Почитать описание</button>
        </div>

        <div v-else class="wolf-game">
          <div class="wolf-categories">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="wolf-chip"
              :class="{ active: category === cat.id }"
              @click="setCategory(cat.id)"
            >
              <span class="wolf-chip-label">{{ cat.label }}</span>
              <span class="wolf-chip-hint">{{ cat.hint }}</span>
            </button>
          </div>

          <div class="wolf-card">
            <div class="wolf-label">волчья цитата • {{ currentCategoryLabel }}</div>
            <div class="wolf-quote-shell">
              <div class="wolf-quote" :class="{ 'wolf-quote-animate': isAnimating }" role="status" aria-live="polite">
                {{ currentQuote }}
              </div>
            </div>
            <div class="wolf-meta">
              <span>смелость</span>
              <span>риск</span>
              <span>движение</span>
            </div>
          </div>

          <div class="wolf-actions">
            <button class="wolf-btn wolf-btn-primary" @click="nextQuote">Ещё цитату</button>
            <button class="wolf-btn wolf-btn-ghost" aria-label="Скопировать цитату" @click="copyQuote">
              {{ copied ? 'Скопировано' : 'Скопировать' }}
            </button>
          </div>
          <p class="wolf-hint">Новую фразу даём каждый раз, не повторяем подряд.</p>
          <button class="wolf-link" type="button" @click="scrollToSeo">Почитать описание</button>
        </div>
      </div>
      <SocialPopup :visible="showPopup" :payload="popupPayload" @close="showPopup = false" />
    </section>

    <section id="seo" class="wolf-seo">
      <div class="seo-card">

        <h2>Цитаты волка, коротко и по делу</h2>
        <p class="seo-sub">
          Короткие волчьи цитаты про смелость, риск и движение. Жми «ещё цитату», копируй и кидай в сторис или чат.
        </p>
        <p class="seo-sub">
          Цитаты не повторяются подряд, категории переключаются мгновенно — всё, чтобы дерзкий один-лайнер был под рукой.
        </p>

        <div class="seo-zone">
          <div class="zone-header">
            <h3>Куда вставлять</h3>
          </div>
          <div class="apply-grid">
            <div class="apply-card">
              
              <div class="apply-chips">
                <span v-for="chip in applyChips" :key="chip.label" class="apply-chip">
                  <span class="chip-icon">{{ chip.icon }}</span>
                  <span>{{ chip.label }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="dual-grid">
          <div class="seo-section">
            <div class="zone-header">
              <h3>Категории</h3>
            </div>
            <div class="seo-block categories-block">
              <div class="category-grid">
                <div class="category-card" v-for="cat in categories" :key="cat.id">
                  <div class="accent-dot" />
                  <div class="category-text">
                    <strong>{{ cat.label }}</strong>
                    <span>{{ cat.hint }}</span>
                  </div>
                </div>
              </div>
              <p class="tiny-cta">Переключай наверху — цитата меняется сразу</p>
            </div>
          </div>

          <div class="seo-section">
            <div class="zone-header">
              <h3>Разобраться глубже</h3>
            </div>
            <div class="deep-grid">
              <div class="rules-card">
                <h4>Правила стаи</h4>
                <div class="rules-list">
                  <div v-for="rule in rules" :key="rule" class="rule-row">
                    <span class="rule-icon">✔</span>
                    <span>{{ rule }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="faq-compact">
          <h4>FAQ</h4>
          <div class="faq-columns">
            <div
              v-for="(item, idx) in faqItems"
              :key="item.q"
              class="faq-item"
              :class="{ open: openFaq === idx }"
            >
              <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
                <span>{{ item.q }}</span>
                <span class="icon">{{ openFaq === idx ? '−' : '+' }}</span>
              </button>
              <div class="faq-body">
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mini-cta">
          <p>Хочешь ещё, жми «Ещё цитату» наверху</p>
          <button class="wolf-btn wolf-btn-ghost" type="button" @click="scrollToStage">К цитате</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import SocialPopup from '@/components/ui/SocialPopup.vue'
import { wolfCategories, wolfQuotes } from '@/data/wolfQuotes'

definePageMeta({
  alias: ['/generators/wolf-quotes/']
})

const showIntro = ref(true)
const category = ref(wolfCategories[0].id)
const currentQuote = ref('')
const lastIndex = ref({ auf: -1, motivation: -1, cringe: -1 })
const isAnimating = ref(false)
const copied = ref(false)
const pulls = ref(0)
const showPopup = ref(false)
const popupIndex = ref(0)
const openFaq = ref(0)

const categories = wolfCategories
const filteredQuotes = computed(() => wolfQuotes.filter((q) => q.category === category.value))
const currentCategoryLabel = computed(() => {
  const item = categories.find((c) => c.id === category.value)
  return item?.label || ''
})
const applyChips = [
  { label: 'Сторис', icon: '📸' },
  { label: 'Статус', icon: '💬' },
  { label: 'Тост', icon: '🥂' },
  { label: 'Пинок', icon: '⚡' },
  { label: 'Мем', icon: '🧊' },
  { label: 'Подпись', icon: '✍️' }
]
const rules = ['бери то, что подходит', 'не дави на людей','помни что это ауф', 'юмор ок, токсичность жок', 'волк всегда прав', 'если не зашло — жми ещё']

const socials = [
  {
    title: 'Подпишись на Telegram',
    text: 'Куча мемов, всё самое свежее тут',
    cta: 'Перейти в логово',
    link: 'https://t.me/neural_wise_wolf',
    emoji: '🐺'
  },
  {
    title: 'Залетай в Instagram',
    text: 'Самое первое и большое сообщество, много мемов с волками',
    cta: 'Открыть Instagram',
    link: 'https://instagram.com/neural_wise_wolf/',
    emoji: '📸'
  },
  {
    title: 'TikTok Волка',
    text: 'Мемы, стримы и много волков',
    cta: 'Смотреть TikTok',
    link: 'https://www.tiktok.com/@neural_wolf',
    emoji: '🎥'
  },
  {
    title: 'YouTube канал',
    text: 'Шортсы и длинные видосы с волками',
    cta: 'Открыть YouTube',
    link: 'https://www.youtube.com/@neural_wolf',
    emoji: '▶️'
  }
]

const popupPayload = computed(() => socials[popupIndex.value % socials.length])
const faqItems = [
  { q: 'Что такое «цитаты волка»?', a: 'Это короткие фразы про смелость, риск и движение, собранные в один клик.' },
  { q: 'Как выбрать категорию?', a: 'Жми на нужную «чипу» сверху: мотивация, дерзость или кринж — и крути цитаты в ней.' },
  { q: 'Повторяются ли цитаты?', a: 'Не повторяем подряд в одной категории. Если надо больше — переключайся или жми дальше.' },
  { q: 'Можно копировать и делиться?', a: 'Да, кнопка «Скопировать» сразу кладёт текст в буфер, можно кидать в чат или сторис.' },
  { q: 'Храните ли вы данные?', a: 'Нет, всё на устройстве. Копируешь и уходишь — никакой передачи данных.' },
  { q: 'Работает ли на телефоне?', a: 'Да, открывается в мобильном браузере без установки.' },
  { q: 'Почему иногда «кринж», это норм?', a: 'Это часть коллекции: иногда нужен смелый или странный тон. Не зашло — жми дальше.' }
]

const raf =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame
    : (fn) => setTimeout(fn, 16)

function randomIndex(max) {
  if (max <= 0) return 0
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    return Math.floor(Math.random() * max)
  }
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

function getRandomQuote() {
  const pool = filteredQuotes.value
  if (!pool.length) return ''
  const last = lastIndex.value[category.value]
  let idx = randomIndex(pool.length)
  if (pool.length > 1 && idx === last) {
    idx = (idx + 1) % pool.length
  }
  lastIndex.value[category.value] = idx
  return pool[idx].text
}

function animateQuote(text) {
  currentQuote.value = text
  isAnimating.value = false
  raf(() => {
    isAnimating.value = true
  })
}

function nextQuote() {
  const quote = getRandomQuote()
  animateQuote(quote)
  copied.value = false
  pulls.value += 1
  if (pulls.value % 5 === 0) {
    popupIndex.value += 1
    showPopup.value = true
  }
}

function start(force = false) {
  showIntro.value = false
  if (force || !currentQuote.value) {
    nextQuote()
  }
}

async function copyQuote() {
  if (!currentQuote.value || typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(currentQuote.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    copied.value = false
  }
}

function setCategory(cat) {
  if (cat === category.value) return
  category.value = cat
  if (!showIntro.value) {
    nextQuote()
  }
}

function scrollToSeo() {
  if (typeof document === 'undefined') return
  const el = document.getElementById('seo')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToStage() {
  if (typeof document === 'undefined') return
  const el = document.getElementById('top')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/wolf-quotes`)
const metaDescription =
  'Короткие волчьи цитаты про смелость, риск и движение. Выбирай категорию, жми “ещё цитату”, копируй строку и кидай в сторис или чат.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Цитаты волка',
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
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: `${requestUrl.origin}/generators` },
        { '@type': 'ListItem', position: 3, name: 'Цитаты волка', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Цитаты волка, мотивационные фразы и короткие цитаты онлайн | Нейронный Волк',
  description: metaDescription,
  ogTitle: 'Цитаты волка, мотивационные фразы и короткие цитаты онлайн | Нейронный Волк',
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
.wolf-page {
  background: transparent;
  color: #e5e7eb;
  overflow-x: hidden;
}

.wolf-stage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 18px 36px;
}

.wolf-container {
  width: 100%;
  max-width: 1080px;
  display: grid;
  justify-items: center;
  gap: 20px;
  margin-top: -100px;
}

.wolf-intro {
  text-align: center;
  display: grid;
  gap: 18px;
  justify-items: center;
  align-items: center;
  padding: 20px 0 14px;
  max-width: 900px;
}

.wolf-title {
  margin: 0;
  font-size: clamp(32px, 6vw, 64px);
  line-height: 1.05;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.wolf-subtitle {
  margin: 0;
  color: #cbd5e1;
  max-width: 680px;
  line-height: 1.6;
  font-size: 18px;
}

.wolf-hint {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.wolf-link {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 10px 14px;
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s ease;
}

.wolf-link:hover {
  border-color: rgba(56, 189, 248, 0.35);
  transform: translateY(-1px);
}

.wolf-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.wolf-actions-inline {
  margin-top: 4px;
}

.wolf-btn {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.02);
  color: #e5e7eb;
  border-radius: 999px;
  padding: 14px 22px;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.wolf-btn:hover {
  transform: translateY(-1px);
}

.wolf-btn:active {
  transform: translateY(0);
}

.wolf-btn-primary {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  border: none;
  color: #0b1220;
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.25);
}

.wolf-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
}

.wolf-game {
  display: grid;
  gap: 18px;
  justify-items: center;
  align-items: center;
  min-height: 70vh;
  width: 100%;
}

.wolf-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: -6px 0 14px;
}

.wolf-chip {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #e5e7eb;
  border-radius: 16px;
  padding: 12px 16px;
  display: grid;
  gap: 4px;
  cursor: pointer;
  min-width: 140px;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.12s ease, box-shadow 0.2s ease;
}

.wolf-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 10px 24px rgba(56, 189, 248, 0.12);
}

.wolf-chip.active {
  background: linear-gradient(120deg, rgba(34, 197, 94, 0.3), rgba(56, 189, 248, 0.22));
  border-color: rgba(34, 197, 94, 0.55);
  box-shadow: 0 16px 36px rgba(34, 197, 94, 0.2);
  transform: translateY(-1px);
}

.wolf-chip-label {
  font-weight: 800;
  font-size: 15px;
}

.wolf-chip-hint {
  font-size: 12px;
  color: #94a3b8;
}

.wolf-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 26px;
  display: grid;
  gap: 14px;
  position: relative;
  overflow: hidden;
  width: min(900px, 100%);
  margin-top: 8px;
  text-align: center;
  min-height: 320px;
}

.wolf-card::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -70px;
  bottom: -90px;
  pointer-events: none;
}

.wolf-label {
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  color: #94a3b8;
}

.wolf-quote-shell {
  min-height: 180px;
  display: grid;
  align-items: center;
  justify-items: center;
}

.wolf-quote {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  line-height: 1.35;
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: 0.3;
  transform: translateY(6px);
  max-width: 100%;
  word-break: break-word;
}

.wolf-quote-animate {
  opacity: 1;
  transform: translateY(0);
}

.wolf-meta {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  color: #cbd5e1;
  font-size: 13px;
  text-transform: lowercase;
  opacity: 0.85;
}

.wolf-seo {
  padding: 32px 18px 48px;
  display: grid;
  justify-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.seo-card {
  width: min(1080px, 100%);
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0 16px;
  box-sizing: border-box;
  display: grid;
  gap: 14px;
}

.seo-card h2 {
  margin: 0;
  text-align: center;
}

.seo-card p {
  margin: 0;
  color: #cbd5e1;
  text-align: center;
}

.seo-sub {
  color: #cbd5e1;
}

.seo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.seo-zone {
  display: grid;
  gap: 10px;
}

.zone-header h3 {
  margin: 0;
}

.apply-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.dual-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.seo-section {
  display: grid;
  gap: 10px;
  align-self: stretch;
}

.apply-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 10px;
}

.apply-card h4 {
  margin: 0;
}

.apply-chips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.apply-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.chip-icon {
  font-size: 16px;
}

.categories-card .tiny-cta {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
  text-align: left;
}

.categories-block .tiny-cta {
  width: 100%;
  text-align: left;
}

.categories-block {
  text-align: left;
}

.seo-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 14px;
  display: grid;
  gap: 8px;
}

.deep-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.rules-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 8px;
}

.rules-card h4 {
  margin: 0;
}

.rules-list {
  display: grid;
  gap: 6px;
}

.rule-row {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #cbd5e1;
}

.rule-icon {
  color: #22c55e;
  font-weight: 800;
}

.faq-compact {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
}

.faq-compact h4 {
  margin: 0;
}

.faq-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.seo-block h3 {
  margin: 0;
  color: #fff;
}

.seo-list {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  display: grid;
  gap: 6px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.category-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
}

.category-card strong {
  color: #fff;
  display: block;
  margin-bottom: 2px;
}

.category-card span {
  color: #cbd5e1;
  font-size: 13px;
}

.accent-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(120deg, #22c55e, #38bdf8);
}

.mini-cta {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.mini-cta p {
  margin: 0;
  color: #cbd5e1;
}

.faq-list {
  display: grid;
  gap: 8px;
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
  max-height: 220px;
  opacity: 1;
  padding-bottom: 10px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
  text-align: left;
}

.seo-block.faq-block {
  padding: 0;
}

.seo-block.faq-block h3 {
  padding: 14px 14px 0;
}

.seo-block.faq-block .faq-list {
  padding: 0 14px 14px;
}

@media (max-width: 768px) {
  .wolf-page {
    align-items: flex-start;
    padding: 12px 14px 24px;
  }

  .wolf-stage {
    padding: 22px 16px 26px;
    align-items: flex-start;
  }

  .wolf-intro {
    gap: 14px;
    padding: 4px 0 6px;
  }

  .wolf-container {
    margin-top: 0;
    gap: 16px;
  }

  .wolf-subtitle {
    font-size: 16px;
  }

  .wolf-card {
    padding: 22px;
  }

  .wolf-actions {
    width: 100%;
    justify-content: center;
  }

  .seo-card {
    padding: 20px 18px 22px;
    width: 100%;
    box-sizing: border-box;
  }
}
.wolf-seo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08), transparent 45%);
  pointer-events: none;
}
</style>
