export type TextStatsOptions = {
  ignoreMultipleSpaces: boolean
  countEmojiAsOne: boolean
  hyphenAsOne: boolean
}

export type TextStats = {
  characters: number
  charactersWithoutSpaces: number
  spaces: number
  words: number
  lines: number
  paragraphs: number
  sentences: number
  uniqueWords: number
  mostFrequentWord: string
  readingTime: number
  speakingTime: number
}

const CyrillicRange = '\u0400-\u04FF'

const wordEdgeTrim = new RegExp(`^[^0-9A-Za-z${CyrillicRange}]+|[^0-9A-Za-z${CyrillicRange}]+$`, 'g')

const defaultOptions: TextStatsOptions = {
  ignoreMultipleSpaces: false,
  countEmojiAsOne: false,
  hyphenAsOne: false
}

function countGraphemes(text: string): number {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter !== 'undefined') {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text)).length
  }
  return Array.from(text).length
}

function normalizeSpaces(text: string): string {
  return text.replace(/[ \t]+/g, ' ')
}

function splitWords(text: string, options: TextStatsOptions): string[] {
  if (!text.trim()) return []
  const baseTokens = text.split(/\s+/).filter(Boolean)
  if (options.hyphenAsOne) return baseTokens

  const words: string[] = []
  baseTokens.forEach((token) => {
    token
      .split(/[-\u2013\u2014]/)
      .filter(Boolean)
      .forEach((part) => words.push(part))
  })
  return words
}

function cleanWord(word: string): string {
  return word.toLowerCase().replace(wordEdgeTrim, '')
}

export function getTextStats(text: string, options?: Partial<TextStatsOptions>): TextStats {
  const resolved = { ...defaultOptions, ...options }
  const source = text || ''
  const textForWords = resolved.ignoreMultipleSpaces ? normalizeSpaces(source) : source

  const characters = resolved.countEmojiAsOne ? countGraphemes(source) : source.length
  const noSpaceText = source.replace(/[ \t]/g, '')
  const charactersWithoutSpaces = resolved.countEmojiAsOne ? countGraphemes(noSpaceText) : noSpaceText.length

  const spacesSource = resolved.ignoreMultipleSpaces ? normalizeSpaces(source.replace(/\t/g, ' ')) : source
  const spaces = (spacesSource.match(/[ \t]/g) || []).length

  const wordsRaw = splitWords(textForWords, resolved)
  const words = wordsRaw.length

  const lines = source.length ? source.split('\n').length : 0

  const paragraphs = source.trim()
    ? source
        .split(/\n\s*\n/)
        .map((chunk) => chunk.trim())
        .filter(Boolean).length
    : 0

  const sentences = (source.match(/[.!?]+/g) || []).length

  const cleanedWords = wordsRaw.map(cleanWord).filter(Boolean)
  const uniqueWords = new Set(cleanedWords).size

  let mostFrequentWord = ''
  if (cleanedWords.length) {
    const freq = new Map<string, number>()
    cleanedWords.forEach((word) => {
      freq.set(word, (freq.get(word) || 0) + 1)
    })
    let topWord = ''
    let topCount = 0
    freq.forEach((count, word) => {
      if (count > topCount) {
        topCount = count
        topWord = word
      }
    })
    mostFrequentWord = topWord
  }

  const readingTime = words ? Number((words / 200).toFixed(1)) : 0
  const speakingTime = words ? Number((words / 130).toFixed(1)) : 0

  return {
    characters,
    charactersWithoutSpaces,
    spaces,
    words,
    lines,
    paragraphs,
    sentences,
    uniqueWords,
    mostFrequentWord,
    readingTime,
    speakingTime
  }
}
