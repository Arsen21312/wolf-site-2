import type { MazeGrid, MazeSolution } from './types'
import { directionBetween, getNeighbors, isWallBetween } from './generate'

export function solveMaze(grid: MazeGrid): MazeSolution {
  const { start, end } = grid
  const visited = Array(grid.cells.length).fill(false)
  const parent = Array(grid.cells.length).fill(-1)
  const queue: number[] = []
  const visitedOrder: number[] = []

  visited[start] = true
  queue.push(start)

  while (queue.length) {
    const current = queue.shift() as number
    visitedOrder.push(current)

    if (current === end) break

    const neighbors = getNeighbors(grid, current)
    for (const neighbor of neighbors) {
      if (visited[neighbor.index]) continue
      const dir = directionBetween(grid, current, neighbor.index)
      if (!dir) continue
      if (isWallBetween(grid, current, neighbor.index, dir)) continue

      visited[neighbor.index] = true
      parent[neighbor.index] = current
      queue.push(neighbor.index)
    }
  }

  const path: number[] = []
  if (visited[end]) {
    let current = end
    while (current !== -1) {
      path.push(current)
      if (current === start) break
      current = parent[current]
    }
    path.reverse()
  }

  return { visitedOrder, path }
}

