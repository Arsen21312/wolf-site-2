export type Participant = {
  name: string
  weight: number
  raw: string
}

export type ParseOptions = {
  trimEdges: boolean
  ignoreEmpty: boolean
}

export type ParseResult = {
  totalLines: number
  participants: Participant[]
  uniqueParticipants: Participant[]
  duplicateCount: number
}

const splitLines = (input: string) => input.split(/\r?\n/)

const parseWeight = (value?: string): number => {
  if (!value) return 1
  const normalized = value.replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed) || parsed <= 0) return 1
  return parsed
}

const parseLine = (line: string): Participant | null => {
  const match = line.match(/^(.*?)(?:\s*-\s*([0-9]+(?:[.,][0-9]+)?))?\s*$/)
  const name = (match?.[1] ?? line).trim()
  if (!name) return null
  const weight = parseWeight(match?.[2])
  return { name, weight, raw: line }
}

export const parseParticipants = (input: string, options: ParseOptions): ParseResult => {
  if (!input.trim()) {
    return { totalLines: 0, participants: [], uniqueParticipants: [], duplicateCount: 0 }
  }

  const rawLines = splitLines(input)
  const totalLines = rawLines.length

  const participants = rawLines
    .map((line) => {
      let value = line
      if (options.trimEdges) value = value.trim()
      if (options.ignoreEmpty && !value) return null
      return parseLine(value)
    })
    .filter((item): item is Participant => Boolean(item))

  const seen = new Set<string>()
  const uniqueParticipants: Participant[] = []
  let duplicateCount = 0

  participants.forEach((participant) => {
    if (seen.has(participant.name)) {
      duplicateCount += 1
      return
    }
    seen.add(participant.name)
    uniqueParticipants.push(participant)
  })

  return { totalLines, participants, uniqueParticipants, duplicateCount }
}
