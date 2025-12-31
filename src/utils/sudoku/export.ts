import type { SudokuGrid } from './solver'

type ExportOptions = {
  size?: number
  title?: string
}

export const exportSudokuPng = (grid: SudokuGrid, options?: ExportOptions) => {
  if (typeof document === 'undefined') return null
  const size = options?.size ?? 900
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  const cell = size / 9
  ctx.strokeStyle = '#111827'

  for (let i = 0; i <= 9; i++) {
    ctx.lineWidth = i % 3 === 0 ? 4 : 1.2
    ctx.beginPath()
    ctx.moveTo(0, i * cell)
    ctx.lineTo(size, i * cell)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(i * cell, 0)
    ctx.lineTo(i * cell, size)
    ctx.stroke()
  }

  ctx.fillStyle = '#0f172a'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${Math.floor(cell * 0.55)}px "Manrope", "Space Grotesk", sans-serif`

  for (let i = 0; i < grid.length; i++) {
    const value = grid[i]
    if (!value) continue
    const row = Math.floor(i / 9)
    const col = i % 9
    const x = col * cell + cell / 2
    const y = row * cell + cell / 2
    ctx.fillText(String(value), x, y)
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    filename: options?.title ?? 'sudoku.png'
  }
}
