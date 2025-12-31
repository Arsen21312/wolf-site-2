<template>
  <main class="minesweeper-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Сапёр онлайн</h1>
      <p class="lead">
        Классический «Сапёр» в браузере: три уровня сложности, первый клик всегда безопасный и удобное управление
        на компьютере и телефоне.
      </p>
    </header>

    <section class="game-shell">
      <div class="top-bar">
        <div class="difficulty-tabs">
          <button
            v-for="item in difficultyOptions"
            :key="item.value"
            type="button"
            class="tab"
            :class="{ active: difficulty === item.value }"
            @click="setDifficulty(item.value)"
          >
            <span class="tab-title">{{ item.label }}</span>
            <span class="tab-sub">{{ item.meta }}</span>
          </button>
        </div>
        <div class="stats-row">
          <div class="stat">
            <span class="stat-label">Время</span>
            <span class="stat-value">{{ formattedElapsed }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Мины</span>
            <span class="stat-value">{{ minesLeft }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Лучшее</span>
            <span class="stat-value">{{ formattedBest }}</span>
          </div>
        </div>
        <button class="btn primary" type="button" @click="restart">Заново</button>
      </div>

      <div class="board-shell">
        <MinesBoard
          :board="board"
          :rows="rows"
          :cols="cols"
          :status="status"
          @reveal="revealCell"
          @flag="toggleFlag"
        />
        <div v-if="isFinished" class="result-overlay">
          <div class="result-card">
            <h3>{{ resultTitle }}</h3>
            <p class="result-sub">Время: {{ formattedElapsed }}</p>
            <button class="btn" type="button" @click="restart">Играть снова</button>
          </div>
        </div>
      </div>

      <div class="control-hints">
        <div class="hint">
          <span class="hint-title">Открыть</span>
          <span class="hint-text">ЛКМ / тап</span>
        </div>
        <div class="hint">
          <span class="hint-title">Флажок</span>
          <span class="hint-text">ПКМ / долгий тап</span>
        </div>
        <div class="hint">
          <span class="hint-title">Цель</span>
          <span class="hint-text">Открыть все клетки без мин</span>
        </div>
      </div>
    </section>

    <section class="seo-article">
      <div class="seo-card">
        <h2>Как играть в «Сапёр»</h2>
        <p>
          Открывайте клетки и избегайте мин. Число в клетке показывает, сколько мин находится в восьми соседних
          клетках. Если число равно нулю, откроется область пустых клеток и прилегающих чисел. Победа наступает,
          когда все безопасные клетки открыты.
        </p>
        <p>
          Первый клик всегда безопасный: мины генерируются только после первого открытия и не появляются в этой
          клетке и её соседях. На телефоне используйте долгий тап, чтобы поставить флажок.
        </p>
      </div>
    </section>

    <section class="faq-card">
      <p class="seo-kicker">FAQ</p>
      <h2>Вопросы по мини-игре «Сапёр»</h2>
      <div class="faq-list">
        <div v-for="(item, idx) in faqItems" :key="item.q" class="faq-item" :class="{ open: openFaq === idx }">
          <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
            <span>{{ item.q }}</span>
            <span class="icon">{{ openFaq === idx ? '-' : '+' }}</span>
          </button>
          <div class="faq-body">
            <p>{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import MinesBoard from '@/components/minesweeper/MinesBoard.vue'
import { useMinesweeper, type MinesweeperDifficulty } from '@/composables/useMinesweeper'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Сапёр' }
]

const difficultyOptions: Array<{ value: MinesweeperDifficulty; label: string; meta: string }> = [
  { value: 'easy', label: 'Лёгкий', meta: '9×9 · 10 мин' },
  { value: 'medium', label: 'Средний', meta: '16×16 · 40 мин' },
  { value: 'hard', label: 'Сложный', meta: '16×30 · 99 мин' }
]

const {
  board,
  difficulty,
  status,
  rows,
  cols,
  minesLeft,
  formattedElapsed,
  formattedBest,
  setDifficulty,
  restart,
  revealCell,
  toggleFlag
} = useMinesweeper()

const isFinished = computed(() => status.value === 'won' || status.value === 'lost')
const resultTitle = computed(() => (status.value === 'won' ? 'Победа!' : 'Вы подорвались'))

const openFaq = ref<number | null>(null)
const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const faqItems = [
  {
    q: 'Почему первый клик всегда безопасный?',
    a: 'Мины генерируются только после первого открытия. Первая клетка и её 8 соседей всегда свободны.'
  },
  {
    q: 'Как поставить флажок на телефоне?',
    a: 'Сделайте долгий тап по клетке. Лёгкий тап открывает клетку.'
  },
  {
    q: 'Можно ли выиграть без флажков?',
    a: 'Да. Победа засчитывается, когда открыты все клетки без мин, флажки — вспомогательный инструмент.'
  },
  {
    q: 'Как работает открытие пустых областей?',
    a: 'Если открыть клетку с нулём, автоматически раскрываются соседние пустые клетки и граница чисел.'
  },
  {
    q: 'Сохраняется ли лучший результат?',
    a: 'Лучшее время хранится в localStorage отдельно для каждого уровня сложности.'
  },
  {
    q: 'Почему счётчик мин может стать отрицательным?',
    a: 'Это значит, что флажков больше, чем мин. Используйте счётчик как подсказку, а не как точное значение.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games/minesweeper`)
const metaDescription =
  'Сапёр онлайн в Nuxt 3: три уровня сложности, безопасный первый клик, управление мышью и на телефоне, таймер и лучший результат.'

useSeoMeta(() => ({
  title: 'Сапёр онлайн — мини-игра | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Сапёр онлайн — мини-игра | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'VideoGame',
      name: 'Сапёр',
      applicationCategory: 'Game',
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
        { '@type': 'ListItem', position: 2, name: 'Игры', item: `${requestUrl.origin}/games` },
        { '@type': 'ListItem', position: 3, name: 'Сапёр', item: canonicalUrl.value }
      ]
    }
  ]
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{ type: 'application/ld+json', children: JSON.stringify(structuredData.value) }]
}))
</script>

<style scoped>
.minesweeper-page {
  display: grid;
  gap: clamp(20px, 4vw, 36px);
  width: min(1200px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(36px, 5vw, 64px);
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 56px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
  color: #f8fafc;
}

.hero .lead {
  margin: 0;
  color: #cbd5e1;
  max-width: 760px;
}

.game-shell {
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.12), transparent 55%),
    linear-gradient(150deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  padding: clamp(18px, 3vw, 28px);
  display: grid;
  gap: 18px;
}

.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.difficulty-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tab {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
  padding: 10px 14px;
  display: grid;
  gap: 4px;
  cursor: pointer;
  min-width: 140px;
  text-align: left;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.tab.active {
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.85), rgba(34, 197, 94, 0.8));
  color: #0f172a;
  border-color: transparent;
}

.tab:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.6);
}

.tab-title {
  font-weight: 800;
}

.tab-sub {
  font-size: 12px;
  color: inherit;
  opacity: 0.8;
}

.stats-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.stat {
  display: grid;
  gap: 4px;
  min-width: 120px;
  color: #e2e8f0;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.stat-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 22px;
  font-weight: 700;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn.primary {
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.9), rgba(34, 197, 94, 0.9));
  border: none;
  color: #0f172a;
}

.board-shell {
  position: relative;
  display: grid;
  justify-items: center;
}

.result-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.78);
  border-radius: 20px;
}

.result-card {
  display: grid;
  gap: 10px;
  padding: 16px 22px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  text-align: center;
  font-weight: 700;
}

.result-card h3 {
  margin: 0;
}

.result-sub {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.control-hints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.hint {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  color: #e2e8f0;
  display: grid;
  gap: 6px;
}

.hint-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.hint-text {
  font-weight: 700;
}

.seo-article {
  display: grid;
}

.seo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(18px, 3vw, 26px);
  display: grid;
  gap: 12px;
}

.seo-card h2 {
  margin: 0;
}

.seo-card p {
  margin: 0;
  color: #cbd5e1;
}

.faq-card {
  display: grid;
  gap: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(18px, 3vw, 26px);
}

.seo-kicker {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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
}

.faq-item.open {
  border-color: rgba(56, 189, 248, 0.45);
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
  max-height: 160px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
}

@media (max-width: 980px) {
  .top-bar {
    justify-content: center;
    text-align: center;
  }

  .stats-row {
    justify-content: center;
  }

  .difficulty-tabs {
    justify-content: center;
  }
}
</style>
