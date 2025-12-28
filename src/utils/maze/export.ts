import type { MazeGrid } from './types'

export function mazeToAscii(grid: MazeGrid): string {
  const width = grid.width * 2 + 1
  const height = grid.height * 2 + 1
  const rows: string[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => '#'))

  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const index = y * grid.width + x
      const cell = grid.cells[index]
      const cx = x * 2 + 1
      const cy = y * 2 + 1
      rows[cy][cx] = ' '

      if (!cell.right) rows[cy][cx + 1] = ' '
      if (!cell.bottom) rows[cy + 1][cx] = ' '
    }
  }

  const startX = (grid.start % grid.width) * 2 + 1
  const startY = Math.floor(grid.start / grid.width) * 2 + 1
  const endX = (grid.end % grid.width) * 2 + 1
  const endY = Math.floor(grid.end / grid.width) * 2 + 1
  rows[startY][startX] = 'S'
  rows[endY][endX] = 'E'

  return rows.map((row) => row.join('')).join('\n')
}

export function mazeToJson(grid: MazeGrid): string {
  const payload = {
    width: grid.width,
    height: grid.height,
    start: grid.start,
    end: grid.end,
    cells: grid.cells
  }
  return JSON.stringify(payload, null, 2)
}

