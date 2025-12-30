export type ParsedCsv = {
  headers: string[]
  rows: string[][]
  hasHeader: boolean
  delimiter: string
}

const delimiters = [',', ';', '\t']

const countDelimiter = (line: string, delimiter: string) => {
  let count = 0
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (!inQuotes && char === delimiter) {
      count += 1
    }
  }
  return count
}

const detectDelimiter = (line: string) => {
  let best = delimiters[0]
  let bestCount = 0
  delimiters.forEach((delimiter) => {
    const count = countDelimiter(line, delimiter)
    if (count > bestCount) {
      bestCount = count
      best = delimiter
    }
  })
  return best
}

const parseRows = (text: string, delimiter: string) => {
  const rows: string[][] = []
  let row: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') i += 1
      row.push(current)
      rows.push(row)
      row = []
      current = ''
      continue
    }

    if (!inQuotes && char === delimiter) {
      row.push(current)
      current = ''
      continue
    }

    current += char
  }

  row.push(current)
  rows.push(row)
  return rows
}

const guessHeader = (rows: string[][]) => {
  if (rows.length < 2) return false
  const first = rows[0].map((cell) => cell.trim())
  const second = rows[1].map((cell) => cell.trim())
  const hasText = first.some((cell) => /[A-Za-zА-Яа-я]/.test(cell))
  const allFilled = first.every((cell) => cell.length > 0)
  const differsFromSecond = first.some((cell, idx) => cell !== (second[idx] ?? ''))
  return hasText && allFilled && differsFromSecond
}

export const parseCsv = (text: string): ParsedCsv => {
  const safeText = text.replace(/\uFEFF/g, '')
  const firstLine = safeText.split(/\r?\n/).find((line) => line.trim().length > 0) ?? ''
  const delimiter = detectDelimiter(firstLine)
  const rawRows = parseRows(safeText, delimiter)
  const cleanedRows = rawRows.filter((row) => row.some((cell) => cell.trim().length > 0))

  if (!cleanedRows.length) {
    return { headers: [], rows: [], hasHeader: false, delimiter }
  }

  const hasHeader = guessHeader(cleanedRows)
  const columns = Math.max(...cleanedRows.map((row) => row.length))
  const headers = hasHeader
    ? cleanedRows[0].map((cell, index) => (cell.trim() ? cell.trim() : `Колонка ${index + 1}`))
    : Array.from({ length: columns }, (_, index) => `Колонка ${index + 1}`)
  const rows = hasHeader ? cleanedRows.slice(1) : cleanedRows

  return { headers, rows, hasHeader, delimiter }
}
