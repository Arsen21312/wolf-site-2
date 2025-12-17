<template>
  <main class="micro-page">
    <section id="top" class="micro-stage">
      <div class="tod-container">
        <div v-if="!gameStarted" class="tod-intro">
          <div class="pill-hero">Инструмент · Микро действие</div>
          <h1 class="tod-title">Микро действие, чтобы сдвинуться с места</h1>
          <p class="tod-subtitle">
            1–5 минут на лёгкое действие. Без мотивационной воды: выбери категорию, получи задачу и сделай маленький шаг.
          </p>
          <button class="tod-btn tod-btn-primary" @click="startGame">Дать действие</button>
          <p class="tod-hint">Не грейся ожиданием — сразу кидаем задачу в лицо.</p>
          <button class="tod-link" type="button" @click="scrollToSeo">Почитать описание</button>
        </div>

        <div v-else class="tod-game">
          <div class="tod-modes">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="tod-chip"
              :class="{ 'tod-chip-active': activeCategory === cat.id }"
              @click="() => changeCategory(cat.id)"
            >
              <span class="tod-chip-label">
                <span class="tod-chip-icon">{{ cat.icon }}</span>
                {{ cat.label }}
              </span>
              <span class="tod-chip-desc">{{ cat.description }}</span>
            </button>
          </div>

          <div class="tod-card">
            <div class="tod-label">
              <span>микро действие</span>,
              <span>{{ currentCategoryLabel }}</span>
            </div>
            <div class="tod-question-text" :class="{ 'tod-question-animate': isAnimating }" role="status" aria-live="polite">
              {{ currentAction }}
            </div>
            <p class="tod-wolf-hint" v-if="feedback">
              <span class="tod-wolf-hint-strong">{{ feedback }}</span>
            </p>
          </div>

          <div class="tod-actions">
            <div class="tod-buttons">
              <button class="tod-btn tod-btn-ghost" aria-label="Получить другое действие" @click="nextAction">Другое</button>
              <button class="tod-btn tod-btn-primary" aria-label="Отметить действие выполненным" @click="completeAction">
                Сделал
              </button>
            </div>
          </div>
          <p class="tod-hint">Новое действие не повторяется подряд в категории.</p>
          <button class="tod-link" type="button" @click="scrollToSeo">Почитать описание</button>
        </div>
      </div>
      <SocialPopup :visible="showPopup" :payload="popupPayload" @close="showPopup = false" />
    </section>

    <section id="seo" class="micro-seo">
      <div class="seo-card">
        <p class="seo-kicker">Генератор действий</p>
        <h2>Микро действия, коротко и по делу</h2>
        <p class="seo-sub">Микро действия на 1–5 минут: выбрал категорию, получил задачу, сделал и жмёшь «сделал».</p>
        <p class="seo-sub">Каждое действие помогает сломать ступор — без мотивационной воды, просто маленький шаг.</p>

        <div class="seo-zone">
          <div class="zone-header">
            <h3>Быстрый старт</h3>
          </div>
          <div class="apply-grid">
            <div class="apply-card">
              <h4>Как это работает</h4>
              <div class="apply-chips">
                <span v-for="chip in steps" :key="chip.label" class="apply-chip">
                  <span class="chip-icon">{{ chip.icon }}</span>
                  <span>{{ chip.label }}</span>
                </span>
              </div>
            </div>
            <div class="apply-card">
              <h4>Когда выручает</h4>
              <div class="apply-chips">
                <span v-for="chip in moods" :key="chip" class="apply-chip ghost">{{ chip }}</span>
              </div>
              <p class="tiny-cta">Маленький шаг ломает ступор</p>
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
                    <span>{{ cat.description }}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          <div class="seo-section">
            <div class="zone-header">
              <h3>Правила волка</h3>
            </div>
            <div class="rules-card">
              <div class="rules-list">
                <div v-for="rule in rules" :key="rule" class="rule-row">
                  <span class="rule-icon">✔</span>
                  <span>{{ rule }}</span>
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
          <p>Хочешь движение, жми «Дать действие» наверху</p>
          <button class="tod-btn tod-btn-ghost" type="button" @click="scrollToStage">Наверх</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import SocialPopup from '@/components/ui/SocialPopup.vue'
import { microCategories } from '@/data/microActions'

const categories = microCategories
const gameStarted = ref(false)
const activeCategory = ref(categories[0].id)
const currentAction = ref('')
const lastIndex = ref({ impulse: -1, switch: -1, wolfstep: -1 })
const isAnimating = ref(false)
const feedback = ref('')
const pulls = ref(0)
const showPopup = ref(false)
const popupIndex = ref(0)
const openFaq = ref(0)

const currentCategoryLabel = computed(() => {
  const item = categories.find((c) => c.id === activeCategory.value)
  return item ? item.label : activeCategory.value
})

const socials = [
  { title: 'Подпишись на Telegram', text: 'Куча мемов, всё самое свежее тут', cta: 'Перейти в логово', link: 'https://t.me/neural_wise_wolf', emoji: '🐺' },
  { title: 'Залетай в Instagram', text: 'Самое первое и большое сообщество, много мемов с волками', cta: 'Открыть Instagram', link: 'https://instagram.com/neural_wise_wolf/', emoji: '📸' },
  { title: 'TikTok Волка', text: 'Мемы, стримы и много волков', cta: 'Смотреть TikTok', link: 'https://www.tiktok.com/@neural_wolf', emoji: '🎥' },
  { title: 'YouTube канал', text: 'Шортсы и длинные видосы с волками', cta: 'Открыть YouTube', link: 'https://www.youtube.com/@neural_wolf', emoji: '▶️' }
]

const popupPayload = computed(() => socials[popupIndex.value % socials.length])
const steps = [
  { label: 'выбираешь категорию', icon: '🗂' },
  { label: 'получаешь действие', icon: '⚡' },
  { label: 'делаешь 1–5 минут', icon: '⏱' },
  { label: 'жмёшь «сделал»', icon: '✅' },
  { label: 'берёшь следующее', icon: '➡️' }
]
const moods = ['затягивание', 'скука', 'тревога', 'залип', 'нет сил', 'нужен старт']
const rules = ['делай мягко, без рывков', 'без самонаказания, ты не на работе', 'лучше 1 минута чем ноль', 'начал, уже победил', 'не зашло, жми «другое» и иди дальше','внимание на процесс, не на результат','остановился вовремя, значит сохранил силы' ]
const faqItems = [
  { q: 'Что такое микро действия?', a: 'Это короткие задания на 1–5 минут, чтобы разогнаться и выйти из ступора.' },
  { q: 'Сколько времени занимает?', a: 'От минуты до пяти, чтобы успеть сделать даже в плотный день.' },
  { q: 'Какие категории есть?', a: 'Разные: импульс, переключение и волчий шаг — выбирай то, что ближе.' },
  { q: 'Что делать, если не хочется?', a: 'Выбери более лёгкое или нажми «другое» — цель в движении, а не в давлении.' },
  { q: 'Повторяются ли задания?', a: 'Не подряд в категории. Если нужно больше — крути дальше или сменяй категорию.' },
  { q: 'Храните ли вы данные?', a: 'Нет, всё происходит на устройстве, ничего не отправляем.' },
  { q: 'Можно ли как челлендж на неделю?', a: 'Да, крути каждый день и отмечай «сделал», чтобы держать темп.' }
]

const raf =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame
    : (fn) => setTimeout(fn, 16)

function randomIndex(max) {
  if (max <= 0) return 0
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) return Math.floor(Math.random() * max)
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

function resetAnimation() {
  isAnimating.value = false
  raf(() => {
    isAnimating.value = true
  })
}

function pickAction(catId) {
  const cat = categories.find((c) => c.id === catId)
  if (!cat || !cat.actions.length) return ''
  const last = lastIndex.value[catId]
  let idx = randomIndex(cat.actions.length)
  if (cat.actions.length > 1 && idx === last) {
    idx = (idx + 1) % cat.actions.length
  }
  lastIndex.value[catId] = idx
  return cat.actions[idx]
}

function showAction(catId) {
  const action = pickAction(catId)
  currentAction.value = action
  feedback.value = ''
  resetAnimation()
  pulls.value += 1
  if (pulls.value % 5 === 0) {
    popupIndex.value += 1
    showPopup.value = true
  }
}

function startGame() {
  gameStarted.value = true
  showAction(activeCategory.value)
}

function changeCategory(catId) {
  activeCategory.value = catId
  showAction(catId)
}

function nextAction() {
  showAction(activeCategory.value)
}

function completeAction() {
  feedback.value = 'Готово, можно брать следующее'
  setTimeout(() => {
    feedback.value = ''
  }, 1000)
  showAction(activeCategory.value)
}

function scrollToSeo() {
  if (typeof document === 'undefined') return
  const el = document.getElementById('seo')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
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
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/micro-actions`)
const metaDescription =
  'Микро действия на 1–5 минут, чтобы сдвинуться с места. Выбирай категорию, получай задание, отмечай “сделал” и лови движение без мотивационной воды.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Микро действие',
      applicationCategory: 'ProductivityApplication',
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
        { '@type': 'ListItem', position: 3, name: 'Микро действие', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Микро действие, случайные действия на 1–5 минут онлайн | Нейронный Волк',
  description: metaDescription,
  ogTitle: 'Микро действие, случайные действия на 1–5 минут онлайн | Нейронный Волк',
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
.micro-page {
  color: #e5e7eb;
}

.micro-stage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 28px;
}

.micro-seo {
  padding: 48px 18px 60px;
  display: grid;
  justify-items: center;
  position: relative;
  overflow: hidden;
}

.micro-seo::before {
  display: none;
}

.tod-container {
  width: 100%;
  max-width: 1080px;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 24px 16px 20px;
  box-shadow: none;
  display: grid;
  justify-items: center;
  margin-top: -100px;
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

.tod-intro {
  text-align: center;
  display: grid;
  gap: 20px;
  justify-items: center;
  align-items: center;
  padding: 40px 0 24px;
  max-width: 900px;
  margin: 0 auto;
}

.tod-title {
  margin: 0 0 6px;
  font-size: clamp(36px, 6vw, 70px);
  letter-spacing: 0;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.tod-subtitle {
  margin: 0 0 12px;
  color: #cbd5e1;
  max-width: 620px;
  line-height: 1.6;
  font-size: 18px;
  text-align: center;
}

.tod-hint {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.tod-link {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 10px 14px;
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s ease;
}

.tod-link:hover {
  border-color: rgba(56, 189, 248, 0.35);
  transform: translateY(-1px);
}

.tod-btn {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #e5e7eb;
  border-radius: 999px;
  padding: 16px 26px;
  font-weight: 800;
  font-size: 17px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
}

.tod-btn:hover {
  transform: translateY(-1px);
}

.tod-btn:active {
  transform: translateY(0);
}

.tod-btn-primary {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  border: none;
  color: #0b1220;
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.25);
  padding: 16px 30px;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  margin: 8px auto 10px;
  display: inline-flex;
}

.tod-game {
  display: grid;
  gap: 28px;
  justify-items: center;
  align-items: center;
  min-height: 80vh;
  padding: 24px 0 32px;
  width: 100%;
}

.tod-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
  max-width: 960px;
}

.tod-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.12s ease, box-shadow 0.2s ease;
  font-size: 16px;
  font-weight: 800;
  display: grid;
  gap: 4px;
  min-width: 190px;
  justify-items: center;
  text-align: center;
}

.tod-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(168, 85, 247, 0.35);
  box-shadow: 0 12px 28px rgba(168, 85, 247, 0.12);
}

.tod-chip-active {
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(168, 85, 247, 0.5);
  color: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(56, 189, 248, 0.18);
}

.tod-chip-icon {
  font-size: 18px;
  display: inline-block;
  animation: floaty 2.6s ease-in-out infinite;
}

.tod-chip-label {
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tod-chip-desc {
  font-weight: 500;
  font-size: 13px;
  color: #94a3b8;
}

@keyframes floaty {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}

.tod-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  min-height: 260px;
}

.tod-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.tod-label {
  font-size: 15px;
  text-transform: lowercase;
  color: #94a3b8;
  letter-spacing: 0.08em;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.tod-question-text {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.4;
  transition: opacity 0.18s ease, transform 0.18s ease;
  opacity: 0.3;
  transform: translateY(4px);
  text-align: center;
  margin: 6px 0 4px;
  min-height: 120px;
  display: grid;
  align-items: center;
}

.tod-question-animate {
  opacity: 1;
  transform: translateY(0);
}

.tod-wolf-hint {
  margin: 0;
  color: #9ca3af;
  font-size: 15px;
  text-align: center;
}

.tod-wolf-hint-strong {
  color: #e5e7eb;
}

.tod-actions {
  display: grid;
  gap: 12px;
  justify-items: center;
  margin-top: 8px;
}

.tod-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tod-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
}

.seo-card {
  width: min(980px, 100%);
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: grid;
  gap: 18px;
  box-shadow: none;
}

.seo-kicker {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #93c5fd;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.seo-card h2 {
  margin: 0;
  text-align: center;
}

.seo-card p {
  margin: 0;
  color: #cbd5e1;
}

.seo-sub {
  color: #cbd5e1;
  text-align: center;
}

.seo-zone {
  display: grid;
  gap: 12px;
}

.zone-header h3 {
  margin: 0;
}

.apply-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.dual-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.seo-section {
  display: grid;
  gap: 10px;
  align-self: stretch;
}

.apply-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
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

.apply-chip.ghost {
  background: rgba(255, 255, 255, 0.03);
  border-style: dashed;
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

.categories-block {
  text-align: left;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.categories-block .tiny-cta {
  width: 100%;
}

.seo-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 8px;
  height: 100%;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.rules-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 8px;
  height: 100%;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
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
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.faq-compact h4 {
  margin: 0;
}

.faq-columns {
  display: grid;
  grid-template-columns: 1fr;
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

@media (max-width: 768px) {
  .micro-stage {
    padding: 12px 14px 20px;
    align-items: flex-start;
  }

  .tod-container {
    padding: 4px 12px 10px;
    margin-top: -30px;
  }

  .tod-intro {
    gap: 16px;
    padding: 4px 0 8px;
    min-height: 70vh;
  }

  .tod-title {
    font-size: 52px;
    line-height: 1.05;
  }

  .tod-subtitle {
    max-width: 90%;
    font-size: 16px;
  }

  .tod-btn-primary {
    padding: 14px 24px;
  }

  .tod-hint {
    font-size: 12px;
  }

  .tod-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    justify-items: center;
    gap: 10px;
  }

  .apply-grid,
  .dual-grid {
    grid-template-columns: 1fr;
  }

  .faq-columns {
    grid-template-columns: 1fr;
  }
}
</style>
