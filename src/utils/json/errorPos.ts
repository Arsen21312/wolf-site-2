export type JsonErrorLocation = {
  message: string
  position?: number
  line?: number
  column?: number
}

export function getJsonErrorLocation(input: string, error: unknown): JsonErrorLocation {
  const message = error instanceof Error ? error.message : String(error)
  const position = extractErrorPosition(message)

  if (position === null || position < 0) {
    return { message }
  }

  const { line, column } = positionToLineColumn(input, position)
  return { message, position, line, column }
}

export function extractErrorPosition(message: string): number | null {
  const match = message.match(/position\s+(\d+)/i)
  if (!match) return null
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

function positionToLineColumn(input: string, position: number): { line: number; column: number } {
  let line = 1
  let column = 1

  for (let idx = 0; idx < input.length && idx < position; idx += 1) {
    if (input[idx] === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
  }

  return { line, column }
}
