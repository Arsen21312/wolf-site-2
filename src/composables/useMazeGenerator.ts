import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { AlgorithmKey, Difficulty, MazeGrid, MazeSolution } from '@/utils/maze/types'
import { generateMaze } from '@/utils/maze/generate'
import { solveMaze } from '@/utils/maze/solve'
import { mazeToAscii, mazeToJson } from '@/utils/maze/export'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const animationMin = 10
const animationMax = 200

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

export function useMazeGenerator() {
  const width = ref(25)
  const height = ref(25)
  const cellSize = ref(18)
  const complexity = ref<Difficulty>('medium')
  const algorithm = ref<AlgorithmKey>('dfs')
  const seed = ref('')

  const maze = ref<MazeGrid | null>(null)
  const solution = ref<MazeSolution | null>(null)
  const generationMs = ref<number | null>(null)
  const seedUsed = ref('')

  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const animationSpeed = ref(40)
  const animationIntervalMs = computed(() => animationMax + animationMin - animationSpeed.value)
  const isPaused = ref(false)
  const isAnimating = ref(false)
  const visitedIndex = ref(0)
  const pathIndex = ref(0)
  const phase = ref<'idle' | 'visited' | 'path'>('idle')

  let timer: ReturnType<typeof setInterval> | null = null

  const colors = {
    walls: '#0f172a',
    passage: '#f8fafc',
    visited: '#38bdf8',
    visitedFill: 'rgba(56, 189, 248, 0.35)',
    path: '#f97316',
    start: '#22c55e',
    end: '#ef4444'
  }

  const canvasWidth = computed(() => {
    const baseWidth = maze.value?.width ?? width.value
    return baseWidth * cellSize.value + 1
  })

  const canvasHeight = computed(() => {
    const baseHeight = maze.value?.height ?? height.value
    return baseHeight * cellSize.value + 1
  })

  const pathLength = computed(() => (solution.value?.path.length ? solution.value.path.length : 0))

  const hasMaze = computed(() => !!maze.value)
  const hasSolution = computed(() => !!solution.value)

  const resetAnimation = () => {
    visitedIndex.value = 0
    pathIndex.value = 0
    phase.value = 'idle'
    isAnimating.value = false
    isPaused.value = false
    stopTimer()
  }

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const scheduleTimer = () => {
    stopTimer()
    timer = setInterval(() => stepAnimationInternal(), animationIntervalMs.value)
  }

  const stepAnimationInternal = () => {
    if (!solution.value) return

    if (phase.value === 'visited') {
      if (visitedIndex.value < solution.value.visitedOrder.length) {
        visitedIndex.value += 1
      } else {
        phase.value = 'path'
      }
    } else if (phase.value === 'path') {
      if (pathIndex.value < solution.value.path.length) {
        pathIndex.value += 1
      } else {
        isAnimating.value = false
        stopTimer()
      }
    }

    draw()
  }

  const generate = async () => {
    width.value = clamp(width.value, 5, 100)
    height.value = clamp(height.value, 5, 100)
    cellSize.value = clamp(cellSize.value, 10, 50)

    const seedValue = seed.value.trim() || `${Date.now()}`
    seed.value = seedValue
    seedUsed.value = seedValue

    const start = now()
    maze.value = generateMaze({
      width: width.value,
      height: height.value,
      algorithm: algorithm.value,
      difficulty: complexity.value,
      seed: seedValue
    })
    generationMs.value = Math.round(now() - start)
    solution.value = null
    resetAnimation()

    await nextTick()
    draw()
  }

  const solve = () => {
    if (!maze.value) return
    solution.value = solveMaze(maze.value)
    visitedIndex.value = 0
    pathIndex.value = 0
    phase.value = 'visited'
    isAnimating.value = true
    isPaused.value = false
    scheduleTimer()
    draw()
  }

  const clearSolution = () => {
    solution.value = null
    resetAnimation()
    draw()
  }

  const togglePause = () => {
    if (!solution.value || !isAnimating.value) return
    isPaused.value = !isPaused.value
    if (isPaused.value) {
      stopTimer()
    } else {
      scheduleTimer()
    }
  }

  const stepOnce = () => {
    if (!solution.value || !isPaused.value) return
    stepAnimationInternal()
  }

  const downloadPng = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `maze-${width.value}x${height.value}.png`
    link.click()
  }

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportJson = () => {
    if (!maze.value) return
    downloadText(mazeToJson(maze.value), `maze-${width.value}x${height.value}.json`)
  }

  const exportAscii = () => {
    if (!maze.value) return
    downloadText(mazeToAscii(maze.value), `maze-${width.value}x${height.value}.txt`)
  }

  const draw = () => {
    if (!maze.value) return
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (canvas.width !== canvasWidth.value) canvas.width = canvasWidth.value
    if (canvas.height !== canvasHeight.value) canvas.height = canvasHeight.value

    const { width: mazeWidth, height: mazeHeight } = maze.value
    const size = cellSize.value
    const wallWidth = Math.max(1, Math.round(size / 8))
    const offset = wallWidth % 2 === 1 ? 0.5 : 0
    const pad = wallWidth
    const fillSize = Math.max(1, size - pad)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = colors.passage
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (solution.value && visitedIndex.value > 0) {
      ctx.fillStyle = colors.visitedFill
      const limit = Math.min(visitedIndex.value, solution.value.visitedOrder.length)
      for (let i = 0; i < limit; i += 1) {
        const cellIndex = solution.value.visitedOrder[i]
        const x = cellIndex % mazeWidth
        const y = Math.floor(cellIndex / mazeWidth)
        ctx.fillRect(x * size + pad / 2, y * size + pad / 2, fillSize, fillSize)
      }
    }

    if (solution.value && pathIndex.value > 0) {
      ctx.fillStyle = colors.path
      const limit = Math.min(pathIndex.value, solution.value.path.length)
      for (let i = 0; i < limit; i += 1) {
        const cellIndex = solution.value.path[i]
        const x = cellIndex % mazeWidth
        const y = Math.floor(cellIndex / mazeWidth)
        ctx.fillRect(x * size + pad / 2, y * size + pad / 2, fillSize, fillSize)
      }
    }

    const startX = maze.value.start % mazeWidth
    const startY = Math.floor(maze.value.start / mazeWidth)
    const endX = maze.value.end % mazeWidth
    const endY = Math.floor(maze.value.end / mazeWidth)

    ctx.fillStyle = colors.start
    ctx.fillRect(startX * size + pad / 2, startY * size + pad / 2, fillSize, fillSize)

    ctx.fillStyle = colors.end
    ctx.fillRect(endX * size + pad / 2, endY * size + pad / 2, fillSize, fillSize)

    ctx.strokeStyle = colors.walls
    ctx.lineWidth = wallWidth
    ctx.lineCap = 'square'

    for (let y = 0; y < mazeHeight; y += 1) {
      for (let x = 0; x < mazeWidth; x += 1) {
        const cellIndex = y * mazeWidth + x
        const cell = maze.value.cells[cellIndex]
        const x1 = x * size + offset
        const y1 = y * size + offset
        const x2 = (x + 1) * size + offset
        const y2 = (y + 1) * size + offset

        if (cell.top) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y1)
          ctx.stroke()
        }
        if (cell.right) {
          ctx.beginPath()
          ctx.moveTo(x2, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        if (cell.bottom) {
          ctx.beginPath()
          ctx.moveTo(x1, y2)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        if (cell.left) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x1, y2)
          ctx.stroke()
        }
      }
    }
  }

  watch([animationSpeed, isPaused], ([speed, paused]) => {
    if (!isAnimating.value || paused) return
    if (timer) {
      scheduleTimer()
    }
  })

  watch([maze, cellSize, visitedIndex, pathIndex], () => {
    draw()
  })

  onMounted(() => {
    generate()
  })

  onUnmounted(() => {
    stopTimer()
  })

  return {
    width,
    height,
    cellSize,
    complexity,
    algorithm,
    seed,
    seedUsed,
    maze,
    solution,
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
  }
}


