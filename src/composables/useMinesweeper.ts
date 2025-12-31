import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type MinesweeperDifficulty = 'easy' | 'medium' | 'hard'

export type MinesweeperCell = {
  id: number
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacent: number
}

type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

type DifficultyConfig = {
  rows: number
  cols: number
  mines: number
}

const CONFIG: Record<MinesweeperDifficulty, DifficultyConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
}

const BEST_TIMES_KEY = 'minesweeper-best-times'

const createEmptyBoard = (rows: number, cols: number) => {
  const cells: MinesweeperCell[] = []
  let id = 0
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      cells.push({
        id,
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacent: 0
      })
      id += 1
    }
  }
  return cells
}

const getNeighborIndices = (index: number, rows: number, cols: number) => {
  const row = Math.floor(index / cols)
  const col = index % cols
  const indices: number[] = []
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      indices.push(nr * cols + nc)
    }
  }
  return indices
}

const loadBestTimes = (): Record<MinesweeperDifficulty, number | null> => {
  if (typeof window === 'undefined') {
    return { easy: null, medium: null, hard: null }
  }
  try {
    const raw = window.localStorage.getItem(BEST_TIMES_KEY)
    if (!raw) return { easy: null, medium: null, hard: null }
    const parsed = JSON.parse(raw) as Record<MinesweeperDifficulty, number>
    return {
      easy: Number.isFinite(parsed.easy) ? parsed.easy : null,
      medium: Number.isFinite(parsed.medium) ? parsed.medium : null,
      hard: Number.isFinite(parsed.hard) ? parsed.hard : null
    }
  } catch {
    return { easy: null, medium: null, hard: null }
  }
}

const saveBestTimes = (value: Record<MinesweeperDifficulty, number | null>) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(value))
  } catch {
    // ignore storage errors
  }
}

export const useMinesweeper = () => {
  const difficulty = ref<MinesweeperDifficulty>('easy')
  const status = ref<GameStatus>('ready')
  const board = ref<MinesweeperCell[]>([])
  const hasPlacedMines = ref(false)

  const elapsed = ref(0)
  const timerRunning = ref(false)
  let timerId: ReturnType<typeof setInterval> | null = null
  let lastTick = 0

  const bestTimes = ref<Record<MinesweeperDifficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null
  })

  const rows = computed(() => CONFIG[difficulty.value].rows)
  const cols = computed(() => CONFIG[difficulty.value].cols)
  const mines = computed(() => CONFIG[difficulty.value].mines)

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const flagsPlaced = computed(() => board.value.filter((cell) => cell.isFlagged).length)
  const minesLeft = computed(() => mines.value - flagsPlaced.value)
  const revealedSafe = computed(() => board.value.filter((cell) => cell.isRevealed && !cell.isMine).length)
  const totalSafe = computed(() => rows.value * cols.value - mines.value)
  const bestTime = computed(() => bestTimes.value[difficulty.value])

  const formattedElapsed = computed(() => formatTime(elapsed.value))
  const formattedBest = computed(() => (bestTime.value ? formatTime(bestTime.value) : 'нет'))

  const startTimer = () => {
    if (timerRunning.value) return
    timerRunning.value = true
    lastTick = Date.now()
    timerId = setInterval(() => {
      const now = Date.now()
      elapsed.value += now - lastTick
      lastTick = now
    }, 300)
  }

  const stopTimer = () => {
    timerRunning.value = false
    if (timerId) clearInterval(timerId)
    timerId = null
  }

  const resetTimer = () => {
    stopTimer()
    elapsed.value = 0
  }

  const initBoard = (targetDifficulty: MinesweeperDifficulty) => {
    const config = CONFIG[targetDifficulty]
    board.value = createEmptyBoard(config.rows, config.cols)
    hasPlacedMines.value = false
    status.value = 'ready'
    resetTimer()
  }

  const calculateAdjacents = () => {
    const currentRows = rows.value
    const currentCols = cols.value
    board.value.forEach((cell, index) => {
      if (cell.isMine) {
        cell.adjacent = 0
        return
      }
      const neighbors = getNeighborIndices(index, currentRows, currentCols)
      let count = 0
      neighbors.forEach((neighborIndex) => {
        if (board.value[neighborIndex].isMine) count += 1
      })
      cell.adjacent = count
    })
  }

  const placeMines = (safeIndex: number) => {
    const currentRows = rows.value
    const currentCols = cols.value
    const mineCount = mines.value
    const forbidden = new Set<number>([safeIndex])
    getNeighborIndices(safeIndex, currentRows, currentCols).forEach((idx) => forbidden.add(idx))

    const candidates: number[] = []
    for (let i = 0; i < board.value.length; i += 1) {
      if (!forbidden.has(i)) candidates.push(i)
    }

    for (let i = candidates.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = candidates[i]
      candidates[i] = candidates[j]
      candidates[j] = temp
    }

    for (let i = 0; i < mineCount && i < candidates.length; i += 1) {
      board.value[candidates[i]].isMine = true
    }

    calculateAdjacents()
    hasPlacedMines.value = true
  }

  const revealAllMines = () => {
    board.value.forEach((cell) => {
      if (cell.isMine) cell.isRevealed = true
    })
  }

  const floodFill = (startIndex: number) => {
    const currentRows = rows.value
    const currentCols = cols.value
    const stack = [startIndex]
    const visited = new Set<number>([startIndex])

    while (stack.length) {
      const index = stack.pop()
      if (index === undefined) continue
      const cell = board.value[index]
      if (cell.isFlagged || cell.isMine) continue
      cell.isRevealed = true
      if (cell.adjacent !== 0) continue

      const neighbors = getNeighborIndices(index, currentRows, currentCols)
      neighbors.forEach((neighborIndex) => {
        if (visited.has(neighborIndex)) return
        const neighbor = board.value[neighborIndex]
        if (neighbor.isFlagged || neighbor.isMine) return
        visited.add(neighborIndex)
        stack.push(neighborIndex)
      })
    }
  }

  const checkWin = () => {
    if (revealedSafe.value >= totalSafe.value) {
      status.value = 'won'
      stopTimer()
      const currentBest = bestTimes.value[difficulty.value]
      if (!currentBest || elapsed.value < currentBest) {
        bestTimes.value = { ...bestTimes.value, [difficulty.value]: elapsed.value }
        saveBestTimes(bestTimes.value)
      }
    }
  }

  const revealCell = (index: number) => {
    if (status.value === 'won' || status.value === 'lost') return
    const cell = board.value[index]
    if (!cell || cell.isRevealed || cell.isFlagged) return

    if (!hasPlacedMines.value) {
      placeMines(index)
      status.value = 'playing'
      startTimer()
    }

    if (cell.isMine) {
      cell.isRevealed = true
      revealAllMines()
      status.value = 'lost'
      stopTimer()
      return
    }

    if (cell.adjacent === 0) {
      floodFill(index)
    } else {
      cell.isRevealed = true
    }

    checkWin()
  }

  const toggleFlag = (index: number) => {
    if (status.value === 'won' || status.value === 'lost') return
    const cell = board.value[index]
    if (!cell || cell.isRevealed) return
    cell.isFlagged = !cell.isFlagged
  }

  const restart = () => {
    initBoard(difficulty.value)
  }

  const setDifficulty = (value: MinesweeperDifficulty) => {
    if (difficulty.value === value) return
    difficulty.value = value
    initBoard(value)
  }

  onMounted(() => {
    bestTimes.value = loadBestTimes()
    initBoard(difficulty.value)
  })

  onBeforeUnmount(() => {
    if (timerId) clearInterval(timerId)
  })

  return {
    board,
    difficulty,
    status,
    rows,
    cols,
    mines,
    minesLeft,
    formattedElapsed,
    formattedBest,
    bestTime,
    elapsed,
    setDifficulty,
    restart,
    revealCell,
    toggleFlag
  }
}

