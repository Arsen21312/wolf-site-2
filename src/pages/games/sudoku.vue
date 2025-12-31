<template>
  <main class="sudoku-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Судоку</h1>
      <p class="lead">
        Генерируй новые судоку, играй прямо на странице, включай подсказки, сохраняй прогресс и печатай задачи, когда удобно.
      </p>
    </header>

    <section class="game-shell">
      <div class="top-bar">
        <div class="difficulty-tabs">
          <button
            v-for="item in difficulties"
            :key="item.value"
            type="button"
            class="tab"
            :class="{ active: difficulty === item.value }"
            :disabled="isGenerating"
            @click="selectDifficulty(item.value)"
          >
            <span class="tab-title">{{ item.label }}</span>
            <span class="tab-sub">{{ item.clues }}</span>
          </button>
        </div>
        <div class="stats-row">
          <div class="stat">
            <span class="stat-label">Время</span>
            <span class="stat-value">{{ formattedElapsed }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Лучшее</span>
            <span class="stat-value">{{ bestTimeLabel }}</span>
          </div>
        </div>
      </div>

      <div class="board-area">
        <div class="board-card">
          <SudokuGrid
            :grid="current"
            :puzzle="puzzle"
            :selected-index="selectedIndex"
            :highlight-digit="highlightDigit"
            :conflicts="conflicts"
            :checked-errors="checkedErrors"
            :paused="isPaused || isGenerating"
            @select="selectCell"
          />
          <div v-if="isGenerating" class="board-overlay">
            <div class="overlay-card">Генерирую...</div>
          </div>
          <div v-else-if="isPaused" class="board-overlay">
            <div class="overlay-card">
              Пауза
              <button class="btn primary" type="button" @click="togglePause">Продолжить</button>
            </div>
          </div>
          <div v-else-if="gameCompleted" class="board-overlay">
            <div class="overlay-card">
              Отлично! Судоку решено.
              <span class="overlay-sub">Время: {{ formattedElapsed }}</span>
            </div>
          </div>
        </div>

        <div class="side-panel">
          <div class="panel-card">
            <h3>Управление</h3>
            <div class="button-grid">
              <button class="btn" type="button" :disabled="isGenerating" @click="newGame">Новая игра</button>
              <button class="btn" type="button" :disabled="isGenerating" @click="resetToStart">Сбросить к началу</button>
              <button class="btn" type="button" :disabled="!canUndo || isGenerating" @click="undo">Отменить</button>
              <button class="btn" type="button" :disabled="!canClear || isGenerating" @click="clearSelected">
                Очистить клетку
              </button>
              <button class="btn" type="button" :disabled="!canHint || isGenerating" @click="useHint">
                Подсказка ({{ hintsUsed }}/{{ maxHints }})
              </button>
              <button class="btn" type="button" :disabled="isGenerating" @click="checkSolution">Проверить</button>
              <button class="btn" type="button" :disabled="isGenerating" @click="togglePause">
                {{ isPaused ? 'Продолжить' : 'Пауза' }}
              </button>
              <button class="btn ghost" type="button" :disabled="isGenerating" @click="downloadPng">
                Скачать PNG
              </button>
            </div>
          </div>

          <div class="panel-card">
            <h3>Подсветка</h3>
            <label class="toggle">
              <input type="checkbox" v-model="showErrors" />
              <span>Показывать ошибки</span>
            </label>
            <div class="hint-text">
              Стрелки, Tab и цифры работают на десктопе. На мобильном доступна цифровая клавиатура снизу.
            </div>
            <div v-if="checkMessage" class="check-message">{{ checkMessage }}</div>
          </div>

          <div class="panel-card">
            <h3>Быстрый старт</h3>
            <ol>
              <li>Выбери сложность и нажми «Новая игра».</li>
              <li>Кликни по клетке и вводи цифры 1–9.</li>
              <li>Следи за подсветками и не забывай про подсказки.</li>
            </ol>
          </div>
        </div>
      </div>

      <SudokuKeypad @input="handleDigitInput" @erase="clearSelected" />
    </section>

    <section class="resume-overlay" v-if="resumeCandidate">
      <div class="resume-card">
        <p class="resume-title">Найдена сохранённая игра</p>
        <p class="resume-sub">
          Сложность: {{ difficultyLabel(resumeCandidate.difficulty) }} ·
          Время: {{ formatTime(resumeCandidate.elapsed) }}
        </p>
        <div class="resume-actions">
          <button class="btn primary" type="button" @click="resumeGame">Продолжить</button>
          <button class="btn ghost" type="button" @click="discardSaved">Новая игра</button>
        </div>
      </div>
    </section>

    <section class="seo-article">
      <div class="seo-card">
        <h2>Судоку онлайн, играть и печатать</h2>
        <p>
          Генератор судоку на этой странице выдаёт новые поля 9x9 по кнопке и позволяет решать задачи сразу в браузере.
          Хочешь распечатать - сохраняй PNG с исходными подсказками и решай на бумаге.
        </p>

        <h2>Сложности судоку и как выбирать</h2>
        <p>
          Лёгкая подойдёт для разминки и быстрой победы. Средняя - золотая середина, когда хочется думать дольше. Сложная
          добавит больше пустых клеток и заставит опираться на комбинации и цепочки.
        </p>

        <h2>Как решать быстрее</h2>
        <p>
          Сканируй строки и квадраты, отмечай единственные варианты и не забывай про подсветку одинаковых цифр. Если
          застрял, включай режим ошибок или используй подсказку, чтобы увидеть ход дальше.
        </p>
      </div>
    </section>

    <section class="faq-card">
      <p class="seo-kicker">FAQ</p>
      <h2>Частые вопросы про судоку</h2>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import SudokuGrid from '@/components/sudoku/SudokuGrid.vue'
import SudokuKeypad from '@/components/sudoku/SudokuKeypad.vue'
import { generateSudoku, type SudokuDifficulty } from '@/utils/sudoku/generator'
import { exportSudokuPng } from '@/utils/sudoku/export'
import { isSolvedGrid, type SudokuGrid as Grid } from '@/utils/sudoku/solver'
import {
  clearSudokuSave,
  loadBestTimes,
  loadSudokuSave,
  saveBestTimes,
  saveSudokuSave,
  type SudokuMove,
  type SudokuSave
} from '@/utils/sudoku/storage'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Судоку' }
]

const difficulties: Array<{ value: SudokuDifficulty; label: string; clues: string }> = [
  { value: 'easy', label: 'Лёгкая', clues: '40–45 подсказок' },
  { value: 'medium', label: 'Средняя', clues: '32–39 подсказок' },
  { value: 'hard', label: 'Сложная', clues: '24–31 подсказка' }
]

const puzzle = ref<Grid>(new Array(81).fill(0))
const solution = ref<Grid>(new Array(81).fill(0))
const current = ref<Grid>(new Array(81).fill(0))
const difficulty = ref<SudokuDifficulty>('easy')
const selectedIndex = ref<number | null>(null)
const undoStack = ref<SudokuMove[]>([])
const hintsUsed = ref(0)
const maxHints = 4
const showErrors = ref(false)
const checkedErrors = ref<Set<number>>(new Set())
const checkMessage = ref('')
const isGenerating = ref(false)
const isPaused = ref(false)
const hasStarted = ref(false)
const elapsed = ref(0)
const timerRunning = ref(false)
const gameCompleted = ref(false)
const resumeCandidate = ref<SudokuSave | null>(null)
const openFaq = ref<number | null>(null)
const bestTimes = ref<Record<SudokuDifficulty, number>>(loadBestTimes())

let timerId: ReturnType<typeof setInterval> | null = null
let lastTick = 0
let checkTimer: ReturnType<typeof setTimeout> | null = null

const highlightDigit = computed(() => {
  if (selectedIndex.value === null) return null
  const value = current.value[selectedIndex.value]
  return value === 0 ? null : value
})

const conflicts = computed(() => {
  if (!showErrors.value) return new Set<number>()
  const set = new Set<number>()
  const grid = current.value
  const recordConflicts = (indices: number[]) => {
    const seen = new Map<number, number[]>()
    indices.forEach((idx) => {
      const value = grid[idx]
      if (!value) return
      const list = seen.get(value) ?? []
      list.push(idx)
      seen.set(value, list)
    })
    seen.forEach((list) => {
      if (list.length > 1) list.forEach((idx) => set.add(idx))
    })
  }

  for (let r = 0; r < 9; r++) {
    recordConflicts(Array.from({ length: 9 }, (_, c) => r * 9 + c))
  }
  for (let c = 0; c < 9; c++) {
    recordConflicts(Array.from({ length: 9 }, (_, r) => r * 9 + c))
  }
  for (let box = 0; box < 9; box++) {
    const startRow = Math.floor(box / 3) * 3
    const startCol = (box % 3) * 3
    const indices = []
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        indices.push((startRow + r) * 9 + startCol + c)
      }
    }
    recordConflicts(indices)
  }
  return set
})

const canUndo = computed(() => undoStack.value.length > 0)
const canClear = computed(() => {
  if (selectedIndex.value === null) return false
  return puzzle.value[selectedIndex.value] === 0 && current.value[selectedIndex.value] !== 0
})

const canHint = computed(() => {
  if (hintsUsed.value >= maxHints) return false
  return current.value.some((value, idx) => value === 0 && puzzle.value[idx] === 0)
})

const formattedElapsed = computed(() => formatTime(elapsed.value))
const bestTimeLabel = computed(() => {
  const best = bestTimes.value[difficulty.value]
  return best ? formatTime(best) : '—'
})

const difficultyLabel = (value: SudokuDifficulty) =>
  difficulties.find((item) => item.value === value)?.label ?? value

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const startTimer = () => {
  if (timerRunning.value) return
  timerRunning.value = true
  lastTick = Date.now()
  timerId = setInterval(() => {
    const now = Date.now()
    elapsed.value += now - lastTick
    lastTick = now
  }, 400)
}

const stopTimer = () => {
  timerRunning.value = false
  if (timerId) clearInterval(timerId)
  timerId = null
}

const resetTimer = () => {
  stopTimer()
  elapsed.value = 0
  hasStarted.value = false
}

const ensureStarted = () => {
  if (!hasStarted.value) {
    hasStarted.value = true
    if (!isPaused.value) startTimer()
  }
}

const applyMove = (index: number, value: number, record = true) => {
  if (puzzle.value[index] !== 0 || isPaused.value || isGenerating.value || gameCompleted.value) return
  const prev = current.value[index]
  if (prev === value) return
  current.value[index] = value
  if (record) {
    undoStack.value.push({ index, prev, next: value })
    if (undoStack.value.length > 80) undoStack.value.shift()
  }
  checkedErrors.value = new Set()
  checkMessage.value = ''
  ensureStarted()
  if (isSolvedGrid(current.value, solution.value)) {
    gameCompleted.value = true
    stopTimer()
    if (!bestTimes.value[difficulty.value] || elapsed.value < bestTimes.value[difficulty.value]) {
      bestTimes.value = { ...bestTimes.value, [difficulty.value]: elapsed.value }
      saveBestTimes(bestTimes.value)
    }
  }
}

const selectCell = (index: number) => {
  selectedIndex.value = index
}

const selectFirstEditable = () => {
  const idx = puzzle.value.findIndex((value) => value === 0)
  selectedIndex.value = idx === -1 ? null : idx
}

const handleDigitInput = (digit: number) => {
  if (selectedIndex.value === null) selectFirstEditable()
  if (selectedIndex.value === null) return
  applyMove(selectedIndex.value, digit, true)
}

const clearSelected = () => {
  if (selectedIndex.value === null) return
  applyMove(selectedIndex.value, 0, true)
}

const undo = () => {
  const move = undoStack.value.pop()
  if (!move) return
  current.value[move.index] = move.prev
  checkedErrors.value = new Set()
  checkMessage.value = ''
}

const useHint = () => {
  if (!canHint.value) return
  const emptyIndices = current.value
    .map((value, idx) => (value === 0 && puzzle.value[idx] === 0 ? idx : -1))
    .filter((idx) => idx !== -1)
  if (!emptyIndices.length) return
  const index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
  selectedIndex.value = index
  applyMove(index, solution.value[index], true)
  hintsUsed.value += 1
}

const checkSolution = () => {
  const wrong = new Set<number>()
  current.value.forEach((value, idx) => {
    if (value !== 0 && value !== solution.value[idx]) wrong.add(idx)
  })
  checkedErrors.value = wrong
  const count = wrong.size
  checkMessage.value = count ? `Ошибок найдено: ${count}` : 'Ошибок не найдено'
  if (checkTimer) clearTimeout(checkTimer)
  checkTimer = setTimeout(() => {
    checkMessage.value = ''
  }, 2000)
}

const resetToStart = () => {
  current.value = puzzle.value.slice()
  undoStack.value = []
  hintsUsed.value = 0
  gameCompleted.value = false
  checkedErrors.value = new Set()
  checkMessage.value = ''
  resetTimer()
}

const togglePause = () => {
  if (gameCompleted.value || isGenerating.value) return
  isPaused.value = !isPaused.value
  if (isPaused.value) stopTimer()
  if (!isPaused.value && hasStarted.value) startTimer()
}

const newGame = async () => {
  resumeCandidate.value = null
  clearSudokuSave()
  await generateNewGame(difficulty.value)
}

const selectDifficulty = async (value: SudokuDifficulty) => {
  if (difficulty.value === value) return
  difficulty.value = value
  await generateNewGame(value)
}

const generateNewGame = async (value: SudokuDifficulty) => {
  isGenerating.value = true
  await new Promise((resolve) => setTimeout(resolve, 0))
  const result = generateSudoku(value, { ensureUnique: true })
  puzzle.value = result.puzzle
  solution.value = result.solution
  current.value = result.puzzle.slice()
  difficulty.value = value
  selectedIndex.value = null
  undoStack.value = []
  hintsUsed.value = 0
  gameCompleted.value = false
  showErrors.value = false
  checkedErrors.value = new Set()
  checkMessage.value = ''
  isPaused.value = false
  resetTimer()
  isGenerating.value = false
}

const resumeGame = () => {
  if (!resumeCandidate.value) return
  const saved = resumeCandidate.value
  puzzle.value = saved.puzzle
  solution.value = saved.solution
  current.value = saved.current
  difficulty.value = saved.difficulty
  undoStack.value = saved.undoStack ?? []
  hintsUsed.value = saved.hintsUsed ?? 0
  elapsed.value = saved.elapsed ?? 0
  hasStarted.value = saved.hasStarted ?? false
  isPaused.value = false
  resumeCandidate.value = null
  gameCompleted.value = isSolvedGrid(current.value, solution.value)
  if (hasStarted.value && !gameCompleted.value) startTimer()
}

const discardSaved = async () => {
  resumeCandidate.value = null
  clearSudokuSave()
  await generateNewGame(difficulty.value)
}

const downloadPng = () => {
  const result = exportSudokuPng(puzzle.value, { title: 'sudoku.png' })
  if (!result) return
  const link = document.createElement('a')
  link.href = result.dataUrl
  link.download = result.filename
  link.click()
}

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const handleKeydown = (event: KeyboardEvent) => {
  if (isGenerating.value || resumeCandidate.value) return
  const target = event.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return

  if (event.key >= '1' && event.key <= '9') {
    event.preventDefault()
    handleDigitInput(Number(event.key))
    return
  }
  if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
    event.preventDefault()
    clearSelected()
    return
  }
  if (event.key === 'Tab') {
    event.preventDefault()
    const direction = event.shiftKey ? -1 : 1
    moveSelection(direction)
    return
  }
  if (event.key.startsWith('Arrow')) {
    event.preventDefault()
    moveSelectionByArrow(event.key)
  }
}

const moveSelectionByArrow = (key: string) => {
  if (selectedIndex.value === null) {
    selectFirstEditable()
    return
  }
  const row = Math.floor(selectedIndex.value / 9)
  const col = selectedIndex.value % 9
  const delta = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  }[key]
  if (!delta) return
  const nextRow = Math.max(0, Math.min(8, row + delta[0]))
  const nextCol = Math.max(0, Math.min(8, col + delta[1]))
  selectedIndex.value = nextRow * 9 + nextCol
}

const moveSelection = (direction: number) => {
  if (selectedIndex.value === null) {
    selectFirstEditable()
    return
  }
  let next = selectedIndex.value + direction
  if (next < 0) next = 80
  if (next > 80) next = 0
  selectedIndex.value = next
}

const saveSnapshot = () => {
  if (typeof window === 'undefined') return
  saveSudokuSave({
    puzzle: puzzle.value,
    solution: solution.value,
    current: current.value,
    difficulty: difficulty.value,
    elapsed: elapsed.value,
    undoStack: undoStack.value,
    hintsUsed: hintsUsed.value,
    hasStarted: hasStarted.value,
    updatedAt: Date.now()
  })
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
const scheduleSave = () => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(saveSnapshot, 400)
}

watch(
  [puzzle, solution, current, difficulty, elapsed, undoStack, hintsUsed, hasStarted],
  scheduleSave,
  { deep: true }
)

onMounted(async () => {
  const saved = loadSudokuSave()
  if (saved) {
    resumeCandidate.value = saved
  } else {
    await generateNewGame(difficulty.value)
  }
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
  if (checkTimer) clearTimeout(checkTimer)
  if (saveTimer) clearTimeout(saveTimer)
  window.removeEventListener('keydown', handleKeydown)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games/sudoku`)
const metaDescription =
  'Генератор судоку 9x9. Играй на сайте, сохраняй прогресс, подсказки, таймер и скачивание для печати.'

useSeoMeta(() => ({
  title: 'Судоку онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Судоку онлайн | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

const faqItems = [
  {
    q: 'Судоку всегда имеет одно решение?',
    a: 'Хорошие головоломки строятся так, чтобы решение было единственным. Генератор проверяет уникальность и старается сохранить одно решение.'
  },
  {
    q: 'Как включить подсветку ошибок?',
    a: 'В правой панели включи переключатель «Показывать ошибки». Конфликтные клетки подсветятся автоматически.'
  },
  {
    q: 'Как сохранить прогресс?',
    a: 'Прогресс сохраняется автоматически в localStorage браузера. После обновления страницы появится кнопка «Продолжить».'
  },
  {
    q: 'Можно ли играть с телефона?',
    a: 'Да, поле масштабируется под экран, а снизу появляется цифровая клавиатура с цифрами и кнопкой «Стереть».'
  },
  {
    q: 'Как скачать судоку?',
    a: 'Нажми «Скачать PNG». Файл сохранится с исходными подсказками, чтобы распечатать и решать на бумаге.'
  },
  {
    q: 'Что делать если застрял?',
    a: 'Используй подсказку или проверку, чтобы увидеть ошибку и продолжить решение.'
  }
]

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'VideoGame',
      name: 'Судоку',
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
        { '@type': 'ListItem', position: 3, name: 'Судоку', item: canonicalUrl.value }
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
.sudoku-page {
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
  background: radial-gradient(circle at top, rgba(34, 197, 94, 0.12), transparent 55%),
    linear-gradient(155deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.92));
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
  background: linear-gradient(130deg, rgba(34, 197, 94, 0.85), rgba(56, 189, 248, 0.85));
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

.board-area {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 18px;
}

.board-card {
  position: relative;
  display: grid;
  justify-items: center;
  padding: clamp(16px, 3vw, 24px);
  border-radius: 20px;
  background: rgba(2, 6, 23, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.board-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.72);
  border-radius: 20px;
}

.overlay-card {
  display: grid;
  gap: 10px;
  padding: 16px 22px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  text-align: center;
  font-weight: 700;
}

.overlay-sub {
  font-size: 13px;
  color: #94a3b8;
}

.side-panel {
  display: grid;
  gap: 14px;
}

.panel-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 12px;
  color: #e2e8f0;
}

.panel-card h3 {
  margin: 0;
  font-size: 18px;
}

.panel-card ol {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #cbd5e1;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn.primary {
  background: linear-gradient(130deg, rgba(34, 197, 94, 0.9), rgba(56, 189, 248, 0.9));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.85);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.toggle input {
  accent-color: #38bdf8;
}

.hint-text {
  font-size: 13px;
  color: #94a3b8;
}

.check-message {
  font-size: 14px;
  color: #e2e8f0;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 8px 10px;
  border-radius: 10px;
}

.resume-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  display: grid;
  place-items: center;
  z-index: 20;
}

.resume-card {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 22px 24px;
  display: grid;
  gap: 10px;
  color: #e2e8f0;
  text-align: center;
  min-width: min(360px, 90vw);
}

.resume-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.resume-sub {
  margin: 0;
  color: #94a3b8;
}

.resume-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
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
  .board-area {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
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
