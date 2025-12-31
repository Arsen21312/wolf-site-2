import { countSolutionsUpTo2, solveSudoku, type SudokuGrid } from './solver'

export type SudokuDifficulty = 'easy' | 'medium' | 'hard'

const SIZE = 9
const BOX = 3
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const DIFFICULTY_CLUES: Record<SudokuDifficulty, { min: number; max: number; target: number }> = {
  easy: { min: 40, max: 45, target: 43 },
  medium: { min: 32, max: 39, target: 35 },
  hard: { min: 24, max: 31, target: 27 }
}

const shuffle = <T,>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const getCandidates = (grid: SudokuGrid, index: number) => {
  const row = Math.floor(index / SIZE)
  const col = index % SIZE
  const used = new Array(10).fill(false)

  const rowStart = row * SIZE
  for (let c = 0; c < SIZE; c++) {
    const value = grid[rowStart + c]
    if (value) used[value] = true
  }

  for (let r = 0; r < SIZE; r++) {
    const value = grid[r * SIZE + col]
    if (value) used[value] = true
  }

  const boxStart = Math.floor(row / BOX) * BOX * SIZE + Math.floor(col / BOX) * BOX
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      const value = grid[boxStart + r * SIZE + c]
      if (value) used[value] = true
    }
  }

  return DIGITS.filter((digit) => !used[digit])
}

const findBestEmptyCell = (grid: SudokuGrid) => {
  let bestIndex = -1
  let bestCandidates: number[] | null = null

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== 0) continue
    const candidates = getCandidates(grid, i)
    if (candidates.length === 0) return { index: i, candidates }
    if (!bestCandidates || candidates.length < bestCandidates.length) {
      bestCandidates = candidates
      bestIndex = i
      if (candidates.length === 1) break
    }
  }

  return { index: bestIndex, candidates: bestCandidates ?? [] }
}

const fillGridRandom = (grid: SudokuGrid) => {
  const { index, candidates } = findBestEmptyCell(grid)
  if (index === -1) return true
  if (candidates.length === 0) return false

  for (const value of shuffle([...candidates])) {
    grid[index] = value
    if (fillGridRandom(grid)) return true
  }
  grid[index] = 0
  return false
}

const countClues = (grid: SudokuGrid) => grid.reduce((sum, value) => sum + (value ? 1 : 0), 0)

const digPuzzle = (solution: SudokuGrid, config: { min: number; max: number; target: number }, ensureUnique: boolean) => {
  const puzzle = solution.slice()
  const indices = shuffle(Array.from({ length: 81 }, (_, i) => i))
  let clues = 81

  for (const index of indices) {
    if (clues <= config.target) break
    const backup = puzzle[index]
    puzzle[index] = 0
    clues -= 1

    if (!solveSudoku(puzzle)) {
      puzzle[index] = backup
      clues += 1
      continue
    }

    if (ensureUnique && countSolutionsUpTo2(puzzle) !== 1) {
      puzzle[index] = backup
      clues += 1
    }
  }

  if (clues < config.min || clues > config.max) return null
  return puzzle
}

export const generateSudoku = (
  difficulty: SudokuDifficulty,
  options?: { ensureUnique?: boolean; maxAttempts?: number }
) => {
  const ensureUnique = options?.ensureUnique ?? true
  const maxAttempts = options?.maxAttempts ?? 18
  const config = DIFFICULTY_CLUES[difficulty]

  const tryGenerate = (unique: boolean) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const solution = new Array(81).fill(0)
      if (!fillGridRandom(solution)) continue
      const puzzle = digPuzzle(solution, config, unique)
      if (puzzle) return { puzzle, solution }
    }
    return null
  }

  const resultUnique = ensureUnique ? tryGenerate(true) : null
  if (resultUnique) return resultUnique

  // TODO: Add strict uniqueness guarantees for all difficulties.
  const resultRelaxed = tryGenerate(false)
  if (resultRelaxed) return resultRelaxed

  throw new Error('Failed to generate Sudoku puzzle')
}
