<template>
  <main class="games-page">
    <div class="ambient">
      <span class="orb orb-one" aria-hidden="true"></span>
      <span class="orb orb-two" aria-hidden="true"></span>
      <span class="orb orb-three" aria-hidden="true"></span>
    </div>

    <section class="hero">
      <Breadcrumbs :items="breadcrumbs" />
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">Игры онлайн для стаи</p>
          <h1>Игры: вечеринки, аркады, квизы и быстрые челленджи</h1>
          <TextType
            class="hero-lead"
            :text="[
              'Выбирай игру по настроению: правда или действие, я никогда не, волчьи аркады и логика.',
              'Каждая карточка ведет в отдельную игру - без регистрации и лишних шагов.'
            ]"
            :typing-speed="70"
            :pause-duration="1400"
            :show-cursor="true"
            cursor-character="|"
          />
          <div class="hero-actions">
            <NuxtLink class="btn" to="/games/truth-or-dare">Правда или действие</NuxtLink>
            <NuxtLink class="btn secondary" to="/games/wolf-runner">Запустить раннер</NuxtLink>
          </div>
          <div class="hero-tags">
            <span class="tag">для компании</span>
            <span class="tag">быстрый старт</span>
            <span class="tag">для телефона и ПК</span>
          </div>
        </div>

        <div class="hero-panel">
          <div class="panel-card">
            <p class="panel-title">Что внутри прямо сейчас</p>
            <div class="panel-stats">
              <div class="panel-stat">
                <div class="panel-value">{{ totalGames }}</div>
                <div class="panel-label">игр</div>
              </div>
              <div class="panel-stat">
                <div class="panel-value">{{ categories.length }}</div>
                <div class="panel-label">жанров</div>
              </div>
              <div class="panel-stat">
                <div class="panel-value">0 ₽</div>
                <div class="panel-label">за вход</div>
              </div>
            </div>
            <p class="panel-note">
              Добавляем новые игры по запросам. Напиши, если нужен формат под твою компанию.
            </p>
          </div>
          <div class="panel-card secondary">
            <p class="panel-title">Сюда приходят за</p>
            <ul class="panel-list">
              <li>играми на компанию и вечеринки</li>
              <li>быстрыми аркадами на реакцию</li>
              <li>квизами и угадайками</li>
              <li>логическими задачами на фокус</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-head">
        <h2 class="section-title">Популярные игры</h2>
        <p class="section-lead">С них чаще всего начинают: вечеринки, квизы и волчьи аркады.</p>
      </div>
      <div class="grid three">
        <component
          v-for="game in featuredGames"
          :key="game.title"
          :is="game.external ? 'a' : 'NuxtLink'"
          class="card game-card game-card-link"
          v-bind="game.external ? { href: game.link } : { to: game.link }"
        >
          <div class="tag">{{ game.tag }}</div>
          <h3>{{ game.title }}</h3>
          <p>{{ game.description }}</p>
          <div class="chip-row">
            <div class="chip">{{ game.mood }}</div>
            <div class="chip">{{ game.duration }}</div>
          </div>
        </component>
      </div>
    </section>

    <section class="category-section">
      <div class="section-head">
        <h2 class="section-title">Категории игр</h2>
        <p class="section-lead">Выбери жанр: вечеринка, аркада, квиз или логика.</p>
      </div>
      <div class="category-chips">
        <a v-for="category in categories" :key="category.id" class="category-chip" :href="`#${category.id}`">
          {{ category.label }}
        </a>
      </div>
      <div class="category-grid">
        <section v-for="category in groupedGames" :key="category.id" class="category-block" :id="category.id">
          <div class="category-head">
            <h3>{{ category.label }}</h3>
            <p>{{ category.description }}</p>
          </div>
          <div class="grid two">
            <component
              v-for="game in category.items"
              :key="game.title"
              :is="game.external ? 'a' : 'NuxtLink'"
              class="card game-card game-card-link"
              v-bind="game.external ? { href: game.link } : { to: game.link }"
            >
              <div class="tag">{{ game.tag }}</div>
              <h4>{{ game.title }}</h4>
              <p>{{ game.description }}</p>
              <div class="chip-row">
                <div class="chip">{{ game.mood }}</div>
                <div class="chip">{{ game.duration }}</div>
              </div>
            </component>
          </div>
        </section>
      </div>
    </section>

    <section class="seo-section" aria-label="SEO текст">
      <div class="seo-card">
        <div class="seo-copy">
          <h2>Игры онлайн для компании и соло режима</h2>
          <p>
            Волий собрал быстрые онлайн-игры для вечеринок, компании и личного вызова. Тут есть правда или действие,
            я никогда не, крокодил, волчьи аркады, логические головоломки и квизы. Все работает прямо в браузере, без
            регистрации и загрузок. Выбирай формат под настроение и начинай играть сразу.
          </p>

          <h3>Как выбрать игру</h3>
          <ol>
            <li>Определи формат: вечеринка, аркада, квиз или логика.</li>
            <li>Открой популярные карточки сверху или перейди к нужной категории.</li>
            <li>Запусти игру и играй в браузере - без установки и логинов.</li>
          </ol>

          <h3>Почему это удобно</h3>
          <ul>
            <li>Быстрый старт за пару кликов.</li>
            <li>Подходит для телефона и десктопа.</li>
            <li>Можно играть одному или с компанией.</li>
          </ul>
        </div>
        <div class="seo-aside">
          <div class="seo-panel">
            <p class="seo-kicker">Лучше всего подходят для</p>
            <ul>
              <li>вечеринок и сборов с друзьями</li>
              <li>коротких перерывов и фокуса</li>
              <li>челленджей на реакцию</li>
              <li>умных квизов и логики</li>
            </ul>
          </div>
          <div class="seo-panel accent">
            <p class="seo-kicker">Мини-гид</p>
            <p>
              Для компании - правда или действие, я никогда не и крокодил. Для реакции - раннер и волчьи аркады. Для
              ума - судоку и сапер.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="related-section">
      <RelatedTools />
    </section>

    <section class="faq-section">
      <div class="section-head">
        <h2 class="section-title">FAQ про игры Волий</h2>
        <p class="section-lead">Коротко о доступе, формате и устройстве.</p>
      </div>
      <div class="faq-grid">
        <details v-for="item in faqItems" :key="item.q" class="faq-item">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import TextType from '@/components/ui/TextType.vue'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры' }
]

const categories = [
  {
    id: 'party',
    label: 'Вечеринка и компания',
    description: 'Игры на общение, смех и быстрые решения.'
  },
  {
    id: 'quiz',
    label: 'Квизы и угадайки',
    description: 'Вопросы, факты, угадайка и контекст.'
  },
  {
    id: 'arcade',
    label: 'Аркады и реакция',
    description: 'Быстрые игры на скорость, прыжки и клики.'
  },
  {
    id: 'logic',
    label: 'Логика и внимание',
    description: 'Головоломки и классика для концентрации.'
  },
  {
    id: 'story',
    label: 'Истории и тесты',
    description: 'Интерактивные истории и игровые тесты.'
  }
]

const games = [
  {
    title: 'Волчья версия доверия',
    tag: 'стратегия / сторителлинг',
    description: 'Интерактивная история и матчи по мотивам The Evolution of Trust, теперь в волчьей атмосфере.',
    mood: 'иронично',
    duration: '25-35 минут',
    category: 'story',
    featured: true,
    link: '/games/trust-wolf'
  },
  {
    title: 'Кто ты в стае?',
    tag: 'тест / стая',
    description: 'Вирусный неоновый тест про архетип волка: пройди путь и получи трофей для скрина.',
    mood: 'мистично',
    duration: '2-4 минуты',
    category: 'story',
    featured: true,
    link: '/games/wolftest'
  },
  {
    title: 'Психологический тест: твое волчье Я',
    tag: 'психология / тест',
    description: 'Интерактивный психологический тест в стиле Figma-концепта: вопросы, анимации и персональный результат.',
    mood: 'интроспективно',
    duration: '3-6 минут',
    category: 'story',
    featured: true,
    link: '/testnw',
    external: true
  },
  {
    title: 'Правда или действие',
    tag: 'классика / вечеринка',
    description: 'Вопросы и задания без подготовки: выбирай режим, нажимай и играй онлайн.',
    mood: 'честно и весело',
    duration: '10-20 минут',
    category: 'party',
    featured: true,
    link: '/games/truth-or-dare'
  },
  {
    title: 'Волчий Контекст',
    tag: 'контекст / угадайка',
    description: 'Угадай секрет по смысловой близости: ранги, подсказки, слово дня и свои загадки без аккаунта.',
    mood: 'азартно',
    duration: '5-15 минут',
    category: 'quiz',
    link: '/games/wolf-context'
  },
  {
    title: 'Я никогда не',
    tag: 'вечеринка / знакомства',
    description: 'Сотни утверждений для признаний и смеха. Подходит для компании и пары.',
    mood: 'откровенно',
    duration: '5-15 минут',
    category: 'party',
    link: '/games/never-have-i-ever'
  },
  {
    title: 'Правда или ложь',
    tag: 'квиз / факты',
    description: 'Факты и мифы в одном потоке: угадай что правда, а что нет.',
    mood: 'интрига',
    duration: '5-15 минут',
    category: 'quiz',
    link: '/games/true-or-false'
  },
  {
    title: 'Крокодил',
    tag: 'слова / объясняй',
    description: 'Генератор слов и фраз с фильтрами сложности и живой статистикой.',
    mood: 'командно',
    duration: '10-20 минут',
    category: 'party',
    link: '/games/crocodile'
  },
  {
    title: 'Волчий раннер',
    tag: 'раннер / реакция',
    description: 'Бесконечный раннер в духе динозаврика: прыжки, приседания, рост скорости и рекорды.',
    mood: 'на адреналине',
    duration: '1-3 минуты',
    category: 'arcade',
    featured: true,
    link: '/games/wolf-runner'
  },
  {
    title: 'Волчий кликер',
    tag: 'кликер / стая',
    description: 'Кликаешь по волку, собираешь очки, качаешь стаю и запускаешь режим АУФ.',
    mood: 'затягивает',
    duration: '1-10 минут',
    category: 'arcade',
    link: '/games/wolf-clicker'
  },
  {
    title: 'Wolf Jump',
    tag: 'прыжки / аркада',
    description: 'Прыгай по платформам вверх: камера скроллится, рекорд растет, падение - финал.',
    mood: 'вверх и выше',
    duration: '1-3 минуты',
    category: 'arcade',
    link: '/games/wolf-jump'
  },
  {
    title: 'Судоку',
    tag: 'логика / головоломка',
    description: 'Генератор судоку 9x9: уровни сложности, подсказки, таймер и сохранение прогресса.',
    mood: 'вдумчиво',
    duration: '5-30 минут',
    category: 'logic',
    link: '/games/sudoku'
  },
  {
    title: 'Сапер',
    tag: 'логика / осторожность',
    description: 'Классическая мини-игра: безопасный первый клик, флажки, таймер и три уровня сложности.',
    mood: 'концентрация',
    duration: '2-15 минут',
    category: 'logic',
    link: '/games/minesweeper'
  },
  {
    title: 'Ответь за 5 секунд',
    tag: 'таймер / хаос',
    description: 'Дай три ответа за 5 секунд - таймер поджимает, смех гарантирован.',
    mood: 'динамично',
    duration: '1-5 минут',
    category: 'party',
    link: '/games/5-seconds'
  }
]

const totalGames = games.length
const featuredGames = games.filter((game) => game.featured)

const groupedGames = computed(() =>
  categories
    .map((category) => ({
      ...category,
      items: games.filter((game) => game.category === category.id)
    }))
    .filter((category) => category.items.length > 0)
)

const faqItems = [
  {
    q: 'Нужна ли регистрация для игр?',
    a: 'Нет. Все игры запускаются сразу в браузере и доступны бесплатно.'
  },
  {
    q: 'Можно ли играть с телефона?',
    a: 'Да, все игры адаптированы под мобильные устройства.'
  },
  {
    q: 'Как выбрать игру для компании?',
    a: 'Ориентируйся на раздел "вечеринка": правда или действие, я никогда не и крокодил.'
  },
  {
    q: 'Есть ли игры для одного?',
    a: 'Да, попробуй раннер, кликер, судоку или сапер.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games`)
const metaDescription =
  'Игры Волий: вечеринки, аркады, квизы, психологические тесты и логика. Правда или действие, я никогда не, раннер, кликер, судоку и сапер. Все работает в браузере, бесплатно и без регистрации.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Игры Волий',
      description: metaDescription,
      url: canonicalUrl.value
    },
    {
      '@type': 'ItemList',
      itemListElement: games.map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: game.title,
        url: `${requestUrl.origin}${game.link}`
      }))
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Игры', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Игры онлайн: вечеринки, аркады и логика | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Игры онлайн: вечеринки, аркады и логика | Neural Wise Wolf',
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
.games-page {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: clamp(32px, 4vw, 56px);
  padding-bottom: clamp(32px, 5vw, 72px);
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  filter: blur(0px);
  opacity: 0.55;
  animation: float 10s ease-in-out infinite;
}

.orb-one {
  top: 24px;
  left: 24px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0.05));
}

.orb-two {
  right: 24px;
  top: 220px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.05));
  animation-delay: 1.1s;
}

.orb-three {
  left: 18%;
  bottom: 24px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.25), rgba(52, 211, 153, 0.05));
  animation-delay: 2.3s;
}

.hero,
.featured-section,
.category-section,
.seo-section,
.related-section,
.faq-section {
  position: relative;
  z-index: 1;
  width: min(1200px, 100% - 48px);
  margin: 0 auto;
}

.hero {
  padding-top: clamp(32px, 5vw, 64px);
}

.hero-grid {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: start;
}

.hero-copy h1 {
  margin: 0 0 12px;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(34px, 4.2vw, 52px);
  letter-spacing: -0.6px;
}

.hero-kicker {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--muted);
}

.hero-lead {
  margin: 0 0 18px;
  color: var(--muted);
  line-height: 1.6;
  min-height: calc(1.6em * 3);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-panel {
  display: grid;
  gap: 16px;
}

.panel-card {
  border-radius: 20px;
  border: 1px solid var(--border);
  background: linear-gradient(160deg, rgba(251, 191, 36, 0.08), rgba(56, 189, 248, 0.08)),
    rgba(15, 23, 42, 0.75);
  padding: 20px;
  display: grid;
  gap: 14px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
}

.panel-card.secondary {
  background: rgba(15, 23, 42, 0.55);
}

.panel-title {
  margin: 0;
  font-weight: 700;
}

.panel-stats {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.panel-stat {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
}

.panel-value {
  font-size: 28px;
  font-weight: 700;
}

.panel-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.panel-note {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.panel-list {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}

.section-head {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.featured-section .section-title,
.category-section .section-title,
.faq-section .section-title {
  margin: 0;
}

.game-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.game-card-link:hover {
  transform: translateY(-4px);
  border-color: rgba(251, 191, 36, 0.35);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.category-chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  font-weight: 600;
  transition: transform 0.15s ease, border-color 0.2s ease;
}

.category-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(52, 211, 153, 0.5);
}

.category-grid {
  display: grid;
  gap: 28px;
}

.category-block {
  display: grid;
  gap: 16px;
}

.category-head h3 {
  margin: 0 0 6px;
  font-size: 22px;
}

.category-head p {
  margin: 0;
  color: var(--muted);
}

.seo-section {
  padding-top: 8px;
}

.seo-card {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  border-radius: 22px;
  border: 1px solid var(--border);
  background: linear-gradient(150deg, rgba(251, 191, 36, 0.1), rgba(15, 23, 42, 0.6));
  padding: clamp(18px, 3vw, 28px);
}

.seo-copy h2,
.seo-copy h3 {
  margin: 0 0 10px;
}

.seo-copy p {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.7;
}

.seo-copy ul,
.seo-copy ol {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}

.seo-aside {
  display: grid;
  gap: 16px;
}

.seo-panel {
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  color: var(--muted);
  line-height: 1.6;
}

.seo-panel.accent {
  background: linear-gradient(130deg, rgba(52, 211, 153, 0.14), rgba(15, 23, 42, 0.5));
  color: var(--text);
}

.seo-kicker {
  margin: 0 0 10px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted);
}

.seo-panel ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.faq-section {
  display: grid;
  gap: 18px;
}

.faq-grid {
  display: grid;
  gap: 12px;
}

.faq-item {
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.55);
  padding: 12px 16px;
  transition: border-color 0.2s ease;
}

.faq-item[open] {
  border-color: rgba(251, 191, 36, 0.35);
}

.faq-item summary {
  cursor: pointer;
  font-weight: 700;
}

.faq-item p {
  margin: 10px 0 0;
  color: var(--muted);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-16px);
  }
}

@media (max-width: 820px) {
  .hero {
    padding-top: 28px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions .btn,
  .hero-actions .btn.secondary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 620px) {
  .games-page {
    gap: 28px;
  }

  .hero,
  .featured-section,
  .category-section,
  .seo-section,
  .related-section,
  .faq-section {
    width: min(1200px, 100% - 32px);
  }
}
</style>
