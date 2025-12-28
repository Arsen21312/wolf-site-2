<template>
  <section class="tod-page">
    <div class="tod-container">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <div v-if="!gameStarted" class="tod-intro">
        <h1 class="tod-title">Вопросы для компании</h1>
        <p class="tod-subtitle">Короткие вопросы, чтобы разогреть разговор: вдвоём или всей стаей.</p>
        <button class="tod-btn tod-btn-primary" @click="startGame">Дать вопрос</button>
        <p class="tod-hint">Сразу выдадим первый вопрос после старта.</p>
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
            <span class="tod-chip-label">{{ cat.label }}</span>
            <span class="tod-chip-desc">{{ cat.description }}</span>
          </button>
        </div>

        <div class="tod-card">
          <div class="tod-label">
            <span>вопрос</span>,
            <span>{{ currentCategoryLabel }}</span>
          </div>
          <div class="tod-question-text" :class="{ 'tod-question-animate': isAnimating }">
            {{ currentQuestion }}
          </div>
        </div>

        <div class="tod-actions">
          <div class="tod-buttons">
            <button class="tod-btn tod-btn-ghost" @click="nextQuestion">Другое</button>
            <button class="tod-btn tod-btn-primary" @click="takeQuestion">Спросить</button>
          </div>
        </div>
      </div>
    </div>
    <SocialPopup :visible="showPopup" :payload="popupPayload" @close="showPopup = false" />
  </section>

  <!-- SEO SECTION -->
  <section class="seo-section" aria-label="SEO текст">
    <div class="seo-container">
      <h2 class="seo-title">Вопросы для компании, чтобы разговор пошёл</h2>
      <p class="seo-lead">
        Когда в комнате повисла пауза, нужен один точный вопрос, и всё снова живое
        Этот генератор выдаёт вопросы для компании, вдвоём или в большой тусовке, без неловких лекций и душных анкет
      </p>

      <div class="seo-grid">
        <article class="seo-card">
          <h3>Что это за игра</h3>
          <p>
            Жмёшь «Дать вопрос», выбираешь режим и получаешь короткий вопрос, который запускает диалог
            Вопросы подходят для друзей, пары, новых знакомых, вечеринок, созвонов и дороги
          </p>
        </article>

        <article class="seo-card">
          <h3>Категории вопросов</h3>
          <p>
            Тут есть вопросы для двоих, чтобы стало ближе, и вопросы для компании, чтобы поднять общий вайб
            Можно листать бесконечно и не ловить повторов подряд
          </p>
        </article>

        <article class="seo-card">
          <h3>Как играть</h3>
          <ul>
            <li>Нажми «Дать вопрос»</li>
            <li>Выбери режим</li>
            <li>Жми «Другое», если хочется новый</li>
            <li>Жми «Спросить», когда готов к движу</li>
          </ul>
        </article>
      </div>

      <div class="seo-faq">
        <h3 class="seo-faq-title">Мини FAQ</h3>

        <details class="seo-faq-item">
          <summary>Подойдёт для двоих или только для толпы</summary>
          <p>Подойдёт и для пары, и для компании, просто выбери нужную категорию</p>
        </details>

        <details class="seo-faq-item">
          <summary>Вопросы повторяются</summary>
          <p>Подряд повторы режем, а если хочешь вообще без повторов, можно позже добавить историю уже показанных</p>
        </details>

        <details class="seo-faq-item">
          <summary>Можно играть без регистрации</summary>
          <p>Да, открыл страницу и поехали</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, ref } from 'vue'
import SocialPopup from '@/components/ui/SocialPopup.vue'
import { companyCategories } from '@/data/companyQuestions'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Вопросы для компании' }
]

useHead({
  title: 'Вопросы для компании, генератор вопросов онлайн',
  meta: [
    {
      name: 'description',
      content:
        'Генератор вопросов для компании и для двоих. Жми, получай вопросы без повторов подряд, разогревай разговор на вечеринке, в дороге или на созвоне'
    }
  ]
})

const categories = companyCategories
const gameStarted = ref(false)
const activeCategory = ref(categories[0].id)
const currentQuestion = ref('')
const lastIndex = ref({ pair: -1, group: -1 })
const isAnimating = ref(false)
const pulls = ref(0)
const showPopup = ref(false)
const popupIndex = ref(0)

const currentCategoryLabel = computed(() => {
  const item = categories.find((c) => c.id === activeCategory.value)
  return item ? item.label : activeCategory.value
})

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

function resetAnimation() {
  isAnimating.value = false
  requestAnimationFrame(() => {
    isAnimating.value = true
  })
}

// Пытаемся не повторять подряд в пределах категории
function pickQuestion(catId) {
  const cat = categories.find((c) => c.id === catId)
  if (!cat || !cat.questions.length) return ''
  const last = lastIndex.value[catId]
  let idx = Math.floor(Math.random() * cat.questions.length)
  if (cat.questions.length > 1 && idx === last) {
    idx = (idx + 1) % cat.questions.length
  }
  lastIndex.value[catId] = idx
  return cat.questions[idx]
}

function showQuestion(catId) {
  currentQuestion.value = pickQuestion(catId)
  resetAnimation()
  pulls.value += 1
  if (pulls.value % 5 === 0) {
    popupIndex.value += 1
    showPopup.value = true
  }
}

function startGame() {
  gameStarted.value = true
  showQuestion(activeCategory.value)
}

function changeCategory(catId) {
  activeCategory.value = catId
  showQuestion(catId)
}

function nextQuestion() {
  showQuestion(activeCategory.value)
}

function takeQuestion() {
  nextQuestion()
}
</script>

<style scoped>
.tod-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: clamp(14px, 3vw, 28px);
  background: transparent;
  color: #e5e7eb;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.tod-container {
  width: min(1100px, 100%);
  background: transparent;
  border: none;
  border-radius: 0;
  padding: clamp(16px, 3vw, 32px) clamp(12px, 3vw, 26px);
  box-shadow: none;
  display: grid;
  justify-items: center;
  gap: clamp(16px, 3vw, 28px);
  margin: 0 auto;
}

.tod-intro {
  text-align: center;
  display: grid;
  gap: clamp(12px, 3vw, 18px);
  justify-items: center;
  align-items: center;
  padding: clamp(14px, 4vw, 36px) 0 clamp(10px, 3vw, 20px);
  max-width: 900px;
  margin: 0 auto;
}

.tod-title {
  margin: 0 0 2px;
  font-size: clamp(32px, 7vw, 64px);
  letter-spacing: 0;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
  line-height: 1.05;
}

.tod-subtitle {
  margin: 0 0 6px;
  color: #cbd5e1;
  max-width: min(680px, 100%);
  line-height: 1.6;
  font-size: clamp(15px, 2vw, 18px);
  text-align: center;
}

.tod-hint {
  margin: 2px 0 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.tod-btn {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #e5e7eb;
  border-radius: 999px;
  padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 28px);
  font-weight: 800;
  font-size: clamp(15px, 2vw, 18px);
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
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  border: none;
  color: #0b1220;
  box-shadow: 0 15px 30px rgba(56, 189, 248, 0.25);
  padding: clamp(14px, 2.6vw, 18px) clamp(22px, 3vw, 30px);
  font-size: clamp(16px, 2vw, 18px);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  margin: 4px auto 8px;
  display: inline-flex;
}

.tod-game {
  display: grid;
  gap: clamp(18px, 3vw, 32px);
  justify-items: center;
  align-items: center;
  min-height: 80vh;
  padding: clamp(12px, 2vw, 24px) 0 clamp(18px, 3vw, 32px);
  width: 100%;
}

.tod-modes {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(10px, 2vw, 16px);
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
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 800;
  display: grid;
  gap: 4px;
  flex: 1 1 clamp(140px, 30%, 220px);
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

.tod-chip-label {
  font-weight: 800;
}

.tod-chip-desc {
  font-weight: 500;
  font-size: 13px;
  color: #94a3b8;
}

.tod-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: clamp(12px, 2vw, 20px);
  position: relative;
  overflow: hidden;
  max-width: min(900px, 100%);
  margin: 0 auto;
  min-height: clamp(200px, 40vh, 320px);
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
  font-size: clamp(22px, 4vw, 34px);
  font-weight: 700;
  line-height: 1.35;
  transition: opacity 0.18s ease, transform 0.18s ease;
  opacity: 0.3;
  transform: translateY(4px);
  text-align: center;
  margin: 6px 0 4px;
  min-height: clamp(120px, 28vh, 200px);
  display: grid;
  align-items: center;
}

.tod-question-animate {
  opacity: 1;
  transform: translateY(0);
}

.tod-actions {
  display: grid;
  gap: clamp(10px, 2vw, 14px);
  justify-items: center;
  margin-top: 8px;
}

.tod-buttons {
  display: flex;
  gap: clamp(8px, 1.6vw, 14px);
  flex-wrap: wrap;
  justify-content: center;
}

.tod-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 768px) {
  .tod-page {
    align-items: flex-start;
    min-height: 100vh;
    padding: 10px 14px 18px;
  }

  .tod-container {
    padding: 6px 12px 12px;
  }

  .tod-intro {
    gap: 12px;
    padding: 10px 0 12px;
    min-height: 64vh;
    margin-top: 0;
  }

  .tod-title {
    font-size: clamp(32px, 9vw, 46px);
    line-height: 1.08;
  }

  .tod-subtitle {
    max-width: 92%;
    font-size: 15px;
  }

  .tod-btn-primary {
    padding: 12px 22px;
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

  .tod-btn-ghost {
    order: 1;
  }

  .tod-btn-primary {
    order: 2;
  }

  .tod-game {
    margin-top: 0;
  }

  .tod-card {
    margin-top: 0;
  }
}

.seo-section {
  width: 100%;
  margin-top: 28px;
  padding: clamp(54px, 6vw, 90px) clamp(16px, 4vw, 28px) clamp(70px, 7vw, 110px);
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.seo-container {
  max-width: 1100px;
  margin: 0 auto;
  text-align: left;
  color: #cbd5e1;
  width: 100%;
  box-sizing: border-box;
}

.seo-title {
  margin: 0 0 12px;
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #e5e7eb;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
}

.seo-lead {
  margin: 0 0 26px;
  max-width: min(880px, 100%);
  line-height: 1.75;
  color: #94a3b8;
  font-size: clamp(15px, 2vw, 16px);
}

.seo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.seo-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 16px 16px 14px;
}

.seo-card h3 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
  color: #e5e7eb;
}

.seo-card p {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 14px;
}

.seo-card ul {
  margin: 0;
  padding-left: 18px;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 14px;
}

.seo-faq {
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 18px;
  padding: 14px;
}

.seo-faq-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 900;
  color: #e5e7eb;
}

.seo-faq-item {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 4px;
}

.seo-faq-item:first-of-type {
  border-top: none;
}

.seo-faq-item summary {
  cursor: pointer;
  color: #e5e7eb;
  font-weight: 800;
  font-size: 14px;
}

.seo-faq-item p {
  margin: 10px 0 0;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 14px;
}

@media (max-width: 900px) {
  .seo-grid {
    grid-template-columns: 1fr;
  }

  .seo-section {
    padding: 54px 16px 72px;
  }

  .seo-title {
    font-size: 26px;
  }
}
</style>
