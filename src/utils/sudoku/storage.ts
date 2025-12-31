import type { SudokuDifficulty } from './generator'

export type SudokuMove = {
  index: number
  prev: number
  next: number
}

export type SudokuSave = {
  puzzle: number[]
  solution: number[]
  current: number[]
  difficulty: SudokuDifficulty
  elapsed: number
  undoStack: SudokuMove[]
  hintsUsed: number
  hasStarted: boolean
  updatedAt: number
}

const STORAGE_KEY = 'sudoku-progress-v1'
const BEST_KEY = 'sudoku-best-v1'

export const loadSudokuSave = () => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SudokuSave
    if (!parsed || !Array.isArray(parsed.current) || parsed.current.length !== 81) return null
    return parsed
  } catch (error) {
    return null
  }
}

export const saveSudokuSave = (state: SudokuSave) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const clearSudokuSave = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export const loadBestTimes = () => {
  if (typeof window === 'undefined') return {} as Record<SudokuDifficulty, number>
  const raw = window.localStorage.getItem(BEST_KEY)
  if (!raw) return {} as Record<SudokuDifficulty, number>
  try {
    return JSON.parse(raw) as Record<SudokuDifficulty, number>
  } catch (error) {
    return {} as Record<SudokuDifficulty, number>
  }
}

export const saveBestTimes = (times: Record<SudokuDifficulty, number>) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(BEST_KEY, JSON.stringify(times))
}
