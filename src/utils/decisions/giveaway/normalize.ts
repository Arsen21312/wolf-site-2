export type NormalizeOptions = {
  trimEdges: boolean
  ignoreEmpty: boolean
  normalizeCase: boolean
}

export type NormalizedList = {
  totalLines: number
  normalized: string[]
  unique: string[]
  duplicateCount: number
}

const splitLines = (input: string) => input.split(/\r?\n/)

export const normalizeParticipants = (input: string, options: NormalizeOptions): NormalizedList => {
  if (!input.trim()) {
    return { totalLines: 0, normalized: [], unique: [], duplicateCount: 0 }
  }

  const rawLines = splitLines(input)
  const totalLines = rawLines.length
  const normalized = rawLines
    .map((line) => {
      let value = line
      if (options.trimEdges) value = value.trim()
      if (options.normalizeCase) value = value.toLowerCase()
      return value
    })
    .filter((value) => (options.ignoreEmpty ? value.length > 0 : true))

  const seen = new Set<string>()
  const unique: string[] = []
  let duplicateCount = 0

  normalized.forEach((value) => {
    if (seen.has(value)) {
      duplicateCount += 1
      return
    }
    seen.add(value)
    unique.push(value)
  })

  return { totalLines, normalized, unique, duplicateCount }
}
