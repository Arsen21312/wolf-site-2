<template>
  <div class="maze-page">
    <section class="hero">
      <Breadcrumbs :items="breadcrumbs" class="center" />
      <h1>Генератор лабиринтов</h1>
      <p class="hero-sub">
        Создавай лабиринты разных размеров и сложности. Генерация и решение прямо на странице.
      </p>
    </section>

    <section class="control-grid">
      <div class="panel">
        <div class="panel-header">
          <h2>Панель настроек</h2>
          <p>Настрой размеры, сложность, алгоритм и сид генерации.</p>
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Ширина</span>
            <input v-model.number="width" type="number" min="5" max="100" />
          </label>
          <label class="field">
            <span>Высота</span>
            <input v-model.number="height" type="number" min="5" max="100" />
          </label>
          <label class="field">
            <span>Размер клетки</span>
            <input v-model.number="cellSize" type="number" min="10" max="50" />
          </label>
          <label class="field">
            <span>Сложность</span>
            <select v-model="complexity">
              <option v-for="option in difficultyOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label class="field">
            <span>Алгоритм генерации</span>
            <select v-model="algorithm">
              <option v-for="option in algorithmOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label class="field">
            <span>Сид генерации</span>
            <input v-model="seed" type="text" placeholder="например, wolf-42" />
          </label>
        </div>

        <div class="preset-row">
          <button class="chip-button" type="button" @click="applyPreset(15)">Пресет 15x15</button>
          <button class="chip-button" type="button" @click="applyPreset(25)">Пресет 25x25</button>
          <button class="chip-button" type="button" @click="applyPreset(40)">Пресет 40x40</button>
          <button class="chip-button secondary" type="button" @click="randomizeSeed">Новый сид</button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Действия</h2>
          <p>Сгенерируй, реши, очисти и скачай результат.</p>
        </div>

        <div class="action-grid">
          <button class="btn primary" type="button" @click="generate">Сгенерировать лабиринт</button>
          <button class="btn secondary" type="button" :disabled="!hasMaze" @click="solve">Решить лабиринт</button>
          <button class="btn ghost" type="button" :disabled="!hasSolution" @click="clearSolution">
            Очистить решение
          </button>
          <button class="btn ghost" type="button" :disabled="!hasMaze" @click="downloadPng">Скачать PNG</button>
          <button class="btn ghost" type="button" :disabled="!hasMaze" @click="exportJson">Экспорт JSON</button>
          <button class="btn ghost" type="button" :disabled="!hasMaze" @click="exportAscii">Экспорт ASCII</button>
        </div>

        <div class="animation-panel">
          <div class="animation-row">
            <span>Скорость анимации</span>
            <input v-model.number="animationSpeed" type="range" min="10" max="200" step="5" />
            <span class="value">{{ animationIntervalMs }} мс</span>
          </div>
          <div class="animation-actions">
            <button class="btn secondary" type="button" :disabled="!isAnimating" @click="togglePause">
              {{ isPaused ? 'Продолжить' : 'Пауза' }}
            </button>
            <button class="btn ghost" type="button" :disabled="!canStep" @click="stepOnce">Шаг</button>
          </div>
        </div>
      </div>
    </section>

    <section class="visual-panel">
      <div class="canvas-shell">
        <ClientOnly>
          <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" />
        </ClientOnly>
      </div>
    </section>

    <section class="info-grid">
      <div class="panel">
        <h3>Легенда</h3>
        <div class="legend">
          <div class="legend-item">
            <span class="swatch" :style="{ background: colors.walls }"></span>
            <span>Стены</span>
          </div>
          <div class="legend-item">
            <span class="swatch" :style="{ background: colors.passage }"></span>
            <span>Проходы</span>
          </div>
          <div class="legend-item">
            <span class="swatch" :style="{ background: colors.start }"></span>
            <span>Старт</span>
          </div>
          <div class="legend-item">
            <span class="swatch" :style="{ background: colors.end }"></span>
            <span>Финиш</span>
          </div>
          <div class="legend-item">
            <span class="swatch" :style="{ background: colors.path }"></span>
            <span>Путь</span>
          </div>
          <div class="legend-item">
            <span class="swatch" :style="{ background: colors.visited }"></span>
            <span>Посещенные</span>
          </div>
        </div>
      </div>

      <div class="panel">
        <h3>Статистика</h3>
        <div class="stats">
          <div>
            <span>Размер</span>
            <strong>{{ width }} x {{ height }}</strong>
          </div>
          <div>
            <span>Длина пути</span>
            <strong>{{ pathLength || '-' }}</strong>
          </div>
          <div>
            <span>Время генерации</span>
            <strong>{{ generationMs ? `${generationMs} мс` : '-' }}</strong>
          </div>
          <div>
            <span>Алгоритм</span>
            <strong>{{ algorithmLabel }}</strong>
          </div>
          <div>
            <span>Сид</span>
            <strong>{{ seedUsed || '-' }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="seo-block">
      <h2>Что такое лабиринты и зачем нужен этот генератор</h2>
      <p>
        Лабиринт — это структура из проходов и стен, которая проверяет внимание, память и стратегию. В генераторе
        можно быстро получить новую карту для игры, упражнений или визуализации алгоритмов. Меняйте размер и
        сложность, чтобы увидеть, как меняется характер путей.
      </p>
      <p>
        DFS строит длинные коридоры и ощущение «тоннеля». Алгоритм Прима создаёт более равномерную сетку с плавными
        ответвлениями. Краскал даёт плотный рисунок с большим числом пересечений, а Recursive Division делает
        геометрию более архитектурной — как в классических головоломках.
      </p>
      <p>
        Разная сложность влияет на количество развилок и длину прямых участков. Чем выше уровень, тем больше «шума»,
        развилок и обходных маршрутов. Это удобно для тренировок, прототипирования уровней и объяснения алгоритмов на
        живом примере.
      </p>

      <div class="seo-grid">
        <div class="seo-card">
          <h3>Где пригодится</h3>
          <p>Игры, квесты, упражнения на внимание, обучение алгоритмам, генерация контента для стримов и видео.</p>
        </div>
        <div class="seo-card">
          <h3>Как читать лабиринт</h3>
          <p>Следи за посещенными клетками, сравнивай кратчайший путь и проверяй, как изменяется структура.</p>
        </div>
        <div class="seo-card">
          <h3>Сид для повторения</h3>
          <p>Один и тот же сид генерирует одинаковый лабиринт — удобно делиться задачами и сохранять сценарии.</p>
        </div>
      </div>

      <div class="faq">
        <h3>FAQ</h3>
        <div class="faq-list">
          <details>
            <summary>Можно ли использовать лабиринт в своих играх?</summary>
            <p>Да. Скачай PNG или экспортируй JSON/ASCII и используй как основу для уровней.</p>
          </details>
          <details>
            <summary>Почему разные алгоритмы дают разную структуру?</summary>
            <p>Каждый алгоритм строит связи по своим правилам: одни тянут длинные коридоры, другие равномерно заполняют сетку.</p>
          </details>
          <details>
            <summary>Что делает сложность?</summary>
            <p>Она регулирует длину прямых участков и количество развилок, добавляя петли и «шум» на высоких уровнях.</p>
          </details>
          <details>
            <summary>Как работает решение?</summary>
            <p>Используется BFS, который находит кратчайший путь и визуализирует процесс поиска шаг за шагом.</p>
          </details>
          <details>
            <summary>Что делать, если лабиринт не помещается на экране?</summary>
            <p>Контейнер поддерживает горизонтальный скролл, поэтому просто прокрути канвас.</p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useMazeGenerator } from '@/composables/useMazeGenerator'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Генератор лабиринтов' }
]

const difficultyOptions = [
  { value: 'easy', label: 'Easy — больше прямых' },
  { value: 'medium', label: 'Medium — баланс' },
  { value: 'hard', label: 'Hard — больше развилок' },
  { value: 'expert', label: 'Expert — максимум шума' }
]

const algorithmOptions = [
  { value: 'dfs', label: 'DFS' },
  { value: 'prim', label: 'Prim' },
  { value: 'kruskal', label: 'Kruskal' },
  { value: 'division', label: 'Recursive Division' }
]

const {
  width,
  height,
  cellSize,
  complexity,
  algorithm,
  seed,
  seedUsed,
  generationMs,
  pathLength,
  hasMaze,
  hasSolution,
  animationSpeed,
  animationIntervalMs,
  isPaused,
  isAnimating,
  canvasRef,
  canvasWidth,
  canvasHeight,
  colors,
  generate,
  solve,
  clearSolution,
  togglePause,
  stepOnce,
  downloadPng,
  exportJson,
  exportAscii
} = useMazeGenerator()

const applyPreset = (size: number) => {
  width.value = size
  height.value = size
}

const randomizeSeed = () => {
  seed.value = `${Date.now()}`
}

const algorithmLabel = computed(() => {
  const found = algorithmOptions.find((item) => item.value === algorithm.value)
  return found ? found.label : algorithm.value
})

const canStep = computed(() => hasSolution.value && isPaused.value)

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/maze-generator`)

const metaDescription =
  'Генератор лабиринтов разных размеров и сложности. Визуализация алгоритмов и решение с анимацией.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Генератор лабиринтов',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Можно ли использовать лабиринт в своих играх?',
          acceptedAnswer: { '@type': 'Answer', text: 'Да. Скачай PNG или экспортируй JSON/ASCII и используй как основу.' }
        },
        {
          '@type': 'Question',
          name: 'Почему разные алгоритмы дают разную структуру?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Каждый алгоритм строит связи по своим правилам: одни тянут длинные коридоры, другие равномерно заполняют сетку.'
          }
        },
        {
          '@type': 'Question',
          name: 'Что делает сложность?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Она регулирует длину прямых участков и количество развилок, добавляя петли и шум на высоких уровнях.'
          }
        },
        {
          '@type': 'Question',
          name: 'Как работает решение?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Используется BFS, который находит кратчайший путь и визуализирует процесс поиска шаг за шагом.'
          }
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: `${requestUrl.origin}/generators` },
        { '@type': 'ListItem', position: 3, name: 'Генератор лабиринтов', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Генератор лабиринтов | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Генератор лабиринтов | Neural Wise Wolf',
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
.maze-page {
  padding: 12px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  
}

.hero h1 {
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 800;
  color: #fff;
}

.hero-sub {
  max-width: 720px;
  margin: 0 auto;
  color: #cbd5f5;
  font-size: 18px;
}

.control-grid,
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.panel {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
}

.panel-header h2 {
  margin: 0;
  color: #fff;
  font-size: 20px;
}

.panel-header p {
  margin: 6px 0 0;
  color: #cbd5e1;
  font-size: 14px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #e2e8f0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field input,
.field select {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.field select option {
  background: #0f172a;
  color: #fff;
}

.field input::placeholder {
  color: #94a3b8;
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-button {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(15, 23, 42, 0.65);
  color: #e2e8f0;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.chip-button.secondary {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.45);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 10px;
}

.btn {
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn.primary {
  background: linear-gradient(120deg, #f97316, #facc15);
  color: #0f172a;
}

.btn.secondary {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #e2e8f0;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.animation-panel {
  display: grid;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 10px;
}

.animation-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 13px;
}

.animation-row input[type='range'] {
  width: 100%;
}

.animation-row .value {
  color: #e2e8f0;
  font-weight: 600;
}

.animation-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.visual-panel {
  display: flex;
}

.canvas-shell {
  width: 100%;
  overflow-x: auto;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.06), rgba(15, 23, 42, 0.8));
}

.canvas-shell canvas {
  display: block;
  margin: 0 auto;
}

.legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  color: #cbd5e1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  color: #cbd5e1;
}

.stats div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats strong {
  color: #fff;
  font-size: 16px;
}

.seo-block {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  display: grid;
  gap: 16px;
}

.seo-block h2,
.seo-block h3 {
  color: #fff;
  margin: 0;
}

.seo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.seo-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 14px;
}

.faq {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq summary {
  cursor: pointer;
  font-weight: 600;
  color: #e2e8f0;
}

.faq p {
  margin: 8px 0 0;
  color: #cbd5e1;
}

@media (max-width: 720px) {
  .maze-page {
    padding-top: 18px;
  }

  .hero-sub {
    font-size: 16px;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .animation-row {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .animation-row .value {
    justify-self: flex-start;
  }
}
</style>
