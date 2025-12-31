export type SudokuGrid = number[]

const SIZE = 9
const BOX = 3

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const getRowStart = (row: number) => row * SIZE

const getBoxStart = (row: number, col: number) =>
  Math.floor(row / BOX) * BOX * SIZE + Math.floor(col / BOX) * BOX

const getCandidates = (grid: SudokuGrid, index: number) => {
  const row = Math.floor(index / SIZE)
  const col = index % SIZE
  const used = new Array(10).fill(false)

  const rowStart = getRowStart(row)
  for (let c = 0; c < SIZE; c++) {
    const value = grid[rowStart + c]
    if (value) used[value] = true
  }

  for (let r = 0; r < SIZE; r++) {
    const value = grid[r * SIZE + col]
    if (value) used[value] = true
  }

  const boxStart = getBoxStart(row, col)
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      const value = grid[boxStart + r * SIZE + c]
      if (value) used[value] = true
    }
  }

  const candidates: number[] = []
  for (const digit of DIGITS) {
    if (!used[digit]) candidates.push(digit)
  }

  return candidates
}

const findBestEmptyCell = (grid: SudokuGrid) => {
  let bestIndex = -1
  let bestCandidates: number[] | null = null

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== 0) continue
    const candidates = getCandidates(grid, i)
    if (candidates.length === 0) {
      return { index: i, candidates }
    }
    if (!bestCandidates || candidates.length < bestCandidates.length) {
      bestCandidates = candidates
      bestIndex = i
      if (candidates.length === 1) break
    }
  }

  return { index: bestIndex, candidates: bestCandidates ?? [] }
}

const solveInternal = (grid: SudokuGrid) => {
  const { index, candidates } = findBestEmptyCell(grid)
  if (index === -1) return true
  if (candidates.length === 0) return false

  for (const value of candidates) {
    grid[index] = value
    if (solveInternal(grid)) return true
  }
  grid[index] = 0
  return false
}

const countSolutionsInternal = (grid: SudokuGrid, limit: number, countRef: { count: number }) => {
  if (countRef.count >= limit) return
  const { index, candidates } = findBestEmptyCell(grid)
  if (index === -1) {
    countRef.count += 1
    return
  }
  if (candidates.length === 0) return

  for (const value of candidates) {
    grid[index] = value
    countSolutionsInternal(grid, limit, countRef)
    if (countRef.count >= limit) break
  }
  grid[index] = 0
}

export const solveSudoku = (grid: SudokuGrid) => {
  const working = grid.slice()
  if (!solveInternal(working)) return null
  return working
}

export const countSolutionsUpTo2 = (grid: SudokuGrid) => {
  const working = grid.slice()
  const countRef = { count: 0 }
  countSolutionsInternal(working, 2, countRef)
  return countRef.count
}

export const isSolvedGrid = (grid: SudokuGrid, solution: SudokuGrid) => {
  if (grid.length !== solution.length) return false
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== solution[i]) return false
  }
  return true
}
