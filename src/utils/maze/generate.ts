import type { AlgorithmKey, Difficulty, Direction, MazeCell, MazeGrid } from './types'
import { createRng, shuffle } from './random'

const directions: { dir: Direction; dx: number; dy: number; opposite: Direction }[] = [
  { dir: 'top', dx: 0, dy: -1, opposite: 'bottom' },
  { dir: 'right', dx: 1, dy: 0, opposite: 'left' },
  { dir: 'bottom', dx: 0, dy: 1, opposite: 'top' },
  { dir: 'left', dx: -1, dy: 0, opposite: 'right' }
]

const difficultySettings: Record<
  Difficulty,
  { straightBias: number; loopChance: number; divisionMinSize: number; extraDivisionGaps: number }
> = {
  easy: { straightBias: 0.8, loopChance: 0.02, divisionMinSize: 5, extraDivisionGaps: 0 },
  medium: { straightBias: 0.6, loopChance: 0.06, divisionMinSize: 4, extraDivisionGaps: 0 },
  hard: { straightBias: 0.35, loopChance: 0.12, divisionMinSize: 3, extraDivisionGaps: 1 },
  expert: { straightBias: 0.2, loopChance: 0.2, divisionMinSize: 2, extraDivisionGaps: 2 }
}

interface GenerateOptions {
  width: number
  height: number
  algorithm: AlgorithmKey
  difficulty: Difficulty
  seed: string
}

export function generateMaze(options: GenerateOptions): MazeGrid {
  const { width, height, algorithm, difficulty, seed } = options
  const rng = createRng(seed)
  const settings = difficultySettings[difficulty]

  let grid: MazeGrid
  switch (algorithm) {
    case 'prim':
      grid = generatePrim(width, height, rng, settings.straightBias)
      break
    case 'kruskal':
      grid = generateKruskal(width, height, rng)
      break
    case 'division':
      grid = generateDivision(width, height, rng, settings.divisionMinSize, settings.extraDivisionGaps)
      break
    case 'dfs':
    default:
      grid = generateDfs(width, height, rng, settings.straightBias)
      break
  }

  if (settings.loopChance > 0) {
    applyBraid(grid, rng, settings.loopChance)
  }

  return grid
}

function createGrid(width: number, height: number, fillWalls = true): MazeGrid {
  const cells: MazeCell[] = Array.from({ length: width * height }, () => ({
    top: fillWalls,
    right: fillWalls,
    bottom: fillWalls,
    left: fillWalls
  }))

  return {
    width,
    height,
    cells,
    start: 0,
    end: width * height - 1
  }
}

function indexOf(width: number, x: number, y: number): number {
  return y * width + x
}

function inBounds(width: number, height: number, x: number, y: number): boolean {
  return x >= 0 && x < width && y >= 0 && y < height
}

function carvePassage(grid: MazeGrid, fromIndex: number, toIndex: number, dir: Direction): void {
  const from = grid.cells[fromIndex]
  const to = grid.cells[toIndex]
  if (!from || !to) return

  switch (dir) {
    case 'top':
      from.top = false
      to.bottom = false
      break
    case 'right':
      from.right = false
      to.left = false
      break
    case 'bottom':
      from.bottom = false
      to.top = false
      break
    case 'left':
      from.left = false
      to.right = false
      break
  }
}

function generateDfs(width: number, height: number, rng: () => number, straightBias: number): MazeGrid {
  const grid = createGrid(width, height, true)
  const visited = Array(width * height).fill(false)
  const stack: { index: number; dir: Direction | null }[] = []

  visited[0] = true
  stack.push({ index: 0, dir: null })

  while (stack.length) {
    const current = stack[stack.length - 1]
    const x = current.index % width
    const y = Math.floor(current.index / width)

    const neighbors: { index: number; dir: Direction }[] = []
    for (const { dir, dx, dy } of directions) {
      const nx = x + dx
      const ny = y + dy
      if (!inBounds(width, height, nx, ny)) continue
      const nIndex = indexOf(width, nx, ny)
      if (!visited[nIndex]) {
        neighbors.push({ index: nIndex, dir })
      }
    }

    if (!neighbors.length) {
      stack.pop()
      continue
    }

    let next: { index: number; dir: Direction }
    const straightCandidate = current.dir
      ? neighbors.find((neighbor) => neighbor.dir === current.dir)
      : null

    if (straightCandidate && rng() < straightBias) {
      next = straightCandidate
    } else {
      next = neighbors[Math.floor(rng() * neighbors.length)]
    }

    carvePassage(grid, current.index, next.index, next.dir)
    visited[next.index] = true
    stack.push({ index: next.index, dir: next.dir })
  }

  return grid
}

function generatePrim(width: number, height: number, rng: () => number, straightBias: number): MazeGrid {
  const grid = createGrid(width, height, true)
  const visited = Array(width * height).fill(false)
  const frontier: { from: number; to: number; dir: Direction }[] = []

  const pushFrontier = (cellIndex: number) => {
    const x = cellIndex % width
    const y = Math.floor(cellIndex / width)
    for (const { dir, dx, dy } of directions) {
      const nx = x + dx
      const ny = y + dy
      if (!inBounds(width, height, nx, ny)) continue
      const nIndex = indexOf(width, nx, ny)
      if (!visited[nIndex]) {
        frontier.push({ from: cellIndex, to: nIndex, dir })
      }
    }
  }

  visited[0] = true
  pushFrontier(0)

  let lastCell = 0
  let lastDir: Direction | null = null

  while (frontier.length) {
    let candidateIndex = Math.floor(rng() * frontier.length)

    if (rng() < straightBias) {
      const sameCell = frontier.filter((edge) => edge.from === lastCell)
      if (sameCell.length) {
        const sameDir = lastDir ? sameCell.filter((edge) => edge.dir === lastDir) : []
        const pool = sameDir.length ? sameDir : sameCell
        const pick = pool[Math.floor(rng() * pool.length)]
        candidateIndex = frontier.indexOf(pick)
      }
    }

    const edge = frontier.splice(candidateIndex, 1)[0]
    if (!edge) continue
    if (visited[edge.to]) continue

    carvePassage(grid, edge.from, edge.to, edge.dir)
    visited[edge.to] = true
    lastCell = edge.to
    lastDir = edge.dir
    pushFrontier(edge.to)
  }

  return grid
}

function generateKruskal(width: number, height: number, rng: () => number): MazeGrid {
  const grid = createGrid(width, height, true)
  const parent = Array.from({ length: width * height }, (_, i) => i)

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x])
    return parent[x]
  }

  const union = (a: number, b: number) => {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA !== rootB) parent[rootB] = rootA
  }

  const edges: { from: number; to: number; dir: Direction }[] = []
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cellIndex = indexOf(width, x, y)
      if (x < width - 1) edges.push({ from: cellIndex, to: indexOf(width, x + 1, y), dir: 'right' })
      if (y < height - 1) edges.push({ from: cellIndex, to: indexOf(width, x, y + 1), dir: 'bottom' })
    }
  }

  const shuffled = shuffle(edges, rng)
  for (const edge of shuffled) {
    if (find(edge.from) !== find(edge.to)) {
      carvePassage(grid, edge.from, edge.to, edge.dir)
      union(edge.from, edge.to)
    }
  }

  return grid
}

function generateDivision(
  width: number,
  height: number,
  rng: () => number,
  minSize: number,
  extraGaps: number
): MazeGrid {
  const grid = createGrid(width, height, false)

  for (let x = 0; x < width; x += 1) {
    const topIndex = indexOf(width, x, 0)
    const bottomIndex = indexOf(width, x, height - 1)
    grid.cells[topIndex].top = true
    grid.cells[bottomIndex].bottom = true
  }
  for (let y = 0; y < height; y += 1) {
    const leftIndex = indexOf(width, 0, y)
    const rightIndex = indexOf(width, width - 1, y)
    grid.cells[leftIndex].left = true
    grid.cells[rightIndex].right = true
  }

  const divide = (x: number, y: number, w: number, h: number) => {
    if (w < minSize || h < minSize) return

    const horizontal = w < h ? true : w > h ? false : rng() < 0.5

    if (horizontal) {
      const wallY = y + 1 + Math.floor(rng() * (h - 1))
      const gapCount = Math.min(1 + extraGaps, w)
      const gaps = new Set<number>()
      while (gaps.size < gapCount) {
        gaps.add(Math.floor(rng() * w))
      }

      for (let i = 0; i < w; i += 1) {
        if (gaps.has(i)) continue
        const cellIndex = indexOf(width, x + i, wallY - 1)
        const belowIndex = indexOf(width, x + i, wallY)
        grid.cells[cellIndex].bottom = true
        grid.cells[belowIndex].top = true
      }

      divide(x, y, w, wallY - y)
      divide(x, wallY, w, y + h - wallY)
    } else {
      const wallX = x + 1 + Math.floor(rng() * (w - 1))
      const gapCount = Math.min(1 + extraGaps, h)
      const gaps = new Set<number>()
      while (gaps.size < gapCount) {
        gaps.add(Math.floor(rng() * h))
      }

      for (let i = 0; i < h; i += 1) {
        if (gaps.has(i)) continue
        const cellIndex = indexOf(width, wallX - 1, y + i)
        const rightIndex = indexOf(width, wallX, y + i)
        grid.cells[cellIndex].right = true
        grid.cells[rightIndex].left = true
      }

      divide(x, y, wallX - x, h)
      divide(wallX, y, x + w - wallX, h)
    }
  }

  divide(0, 0, width, height)
  return grid
}

function applyBraid(grid: MazeGrid, rng: () => number, loopChance: number) {
  const { width, height } = grid
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cellIndex = indexOf(width, x, y)
      const cell = grid.cells[cellIndex]
      const wallCount = Number(cell.top) + Number(cell.right) + Number(cell.bottom) + Number(cell.left)
      if (wallCount !== 3) continue
      if (rng() > loopChance) continue

      const candidates: { index: number; dir: Direction }[] = []
      for (const { dir, dx, dy } of directions) {
        const nx = x + dx
        const ny = y + dy
        if (!inBounds(width, height, nx, ny)) continue
        const nIndex = indexOf(width, nx, ny)
        if (hasWall(cell, dir)) {
          candidates.push({ index: nIndex, dir })
        }
      }

      if (!candidates.length) continue
      const pick = candidates[Math.floor(rng() * candidates.length)]
      carvePassage(grid, cellIndex, pick.index, pick.dir)
    }
  }
}

function hasWall(cell: MazeCell, dir: Direction): boolean {
  switch (dir) {
    case 'top':
      return cell.top
    case 'right':
      return cell.right
    case 'bottom':
      return cell.bottom
    case 'left':
      return cell.left
  }
}

export function getNeighbors(grid: MazeGrid, index: number): { index: number; dir: Direction }[] {
  const { width, height } = grid
  const x = index % width
  const y = Math.floor(index / width)
  const result: { index: number; dir: Direction }[] = []

  for (const { dir, dx, dy } of directions) {
    const nx = x + dx
    const ny = y + dy
    if (!inBounds(width, height, nx, ny)) continue
    result.push({ index: indexOf(width, nx, ny), dir })
  }

  return result
}

export function isWallBetween(grid: MazeGrid, from: number, to: number, dir: Direction): boolean {
  const fromCell = grid.cells[from]
  if (!fromCell) return true
  return hasWall(fromCell, dir)
}

export function directionBetween(grid: MazeGrid, from: number, to: number): Direction | null {
  const { width } = grid
  const fx = from % width
  const fy = Math.floor(from / width)
  const tx = to % width
  const ty = Math.floor(to / width)

  if (fx === tx && fy - 1 === ty) return 'top'
  if (fx === tx && fy + 1 === ty) return 'bottom'
  if (fy === ty && fx + 1 === tx) return 'right'
  if (fy === ty && fx - 1 === tx) return 'left'
  return null
}

