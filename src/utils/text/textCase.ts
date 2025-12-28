export type TextCaseMode =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'invert'
  | 'meme'
  | 'snake'
  | 'kebab'
  | 'camel'
  | 'pascal'

export type TextCaseOptions = {
  preserveDoubleSpaces: boolean
  removeExtraSpaces: boolean
  preserveLineBreaks: boolean
}

const CyrillicRange = '\u0400-\u04FF'
const WordRegex = new RegExp(`[0-9A-Za-z${CyrillicRange}]+`, 'g')
const LetterRegex = new RegExp(`[A-Za-z${CyrillicRange}]`)
const NonWordCleanup = new RegExp(`[^0-9A-Za-z${CyrillicRange} _-]+`, 'g')

function toLower(text: string): string {
  return text.toLocaleLowerCase('ru-RU')
}

function toUpper(text: string): string {
  return text.toLocaleUpperCase('ru-RU')
}

function normalizeLine(line: string, preserveDoubleSpaces: boolean): string {
  const trimmed = line.trim()
  if (preserveDoubleSpaces) {
    return trimmed.replace(/ {3,}/g, '  ')
  }
  return trimmed.replace(/ {2,}/g, ' ')
}

function normalizeInput(input: string, options: TextCaseOptions): string {
  if (!input) return ''

  let text = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, ' ')

  if (!options.preserveLineBreaks) {
    text = text.replace(/\n+/g, ' ')
  }

  if (!options.removeExtraSpaces) {
    return text
  }

  if (options.preserveLineBreaks) {
    return text
      .split('\n')
      .map((line) => normalizeLine(line, options.preserveDoubleSpaces))
      .join('\n')
  }

  return normalizeLine(text, options.preserveDoubleSpaces)
}

function capitalizeWord(word: string): string {
  if (!word) return ''
  const lower = toLower(word)
  return toUpper(lower[0]) + lower.slice(1)
}

function toTitleCase(text: string): string {
  return toLower(text).replace(WordRegex, (word) => capitalizeWord(word))
}

function toSentenceCase(text: string): string {
  const lower = toLower(text)
  let result = ''
  let shouldCapitalize = true

  for (let i = 0; i < lower.length; i += 1) {
    const char = lower[i]

    if (LetterRegex.test(char)) {
      if (shouldCapitalize) {
        result += toUpper(char)
        shouldCapitalize = false
      } else {
        result += char
      }
      continue
    }

    result += char

    if (char === '.' || char === '!' || char === '?' || char === '\n') {
      shouldCapitalize = true
    }
  }

  return result
}

function invertCase(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (LetterRegex.test(char)) {
      result += char === toLower(char) ? toUpper(char) : toLower(char)
    } else {
      result += char
    }
  }
  return result
}

function memeCase(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (LetterRegex.test(char)) {
      result += Math.random() > 0.5 ? toUpper(char) : toLower(char)
    } else {
      result += char
    }
  }
  return result
}

function toDelimited(text: string, delimiter: string): string {
  const cleaned = toLower(text).replace(NonWordCleanup, ' ').replace(/[_-]+/g, ' ')
  const normalized = cleaned.trim().replace(/\s+/g, ' ')
  if (!normalized) return ''
  return normalized.replace(/ /g, delimiter).replace(new RegExp(`^${delimiter}+|${delimiter}+$`, 'g'), '')
}

function extractWords(text: string): string[] {
  const matches = toLower(text).match(WordRegex)
  return matches ? matches.filter(Boolean) : []
}

function toCamelCase(text: string, isPascal: boolean): string {
  const words = extractWords(text)
  if (!words.length) return ''
  return words
    .map((word, index) => {
      if (index === 0 && !isPascal) return word
      return capitalizeWord(word)
    })
    .join('')
}

export function convertTextCase(input: string, mode: TextCaseMode, options: TextCaseOptions): string {
  const normalized = normalizeInput(input, options)

  if (!normalized) return ''

  const applyPerLine = (worker: (line: string) => string): string =>
    normalized
      .split('\n')
      .map((line) => worker(line))
      .join('\n')

  switch (mode) {
    case 'upper':
      return toUpper(normalized)
    case 'lower':
      return toLower(normalized)
    case 'title':
      return toTitleCase(normalized)
    case 'sentence':
      return toSentenceCase(normalized)
    case 'invert':
      return invertCase(normalized)
    case 'meme':
      return memeCase(normalized)
    case 'snake':
      return options.preserveLineBreaks ? applyPerLine((line) => toDelimited(line, '_')) : toDelimited(normalized, '_')
    case 'kebab':
      return options.preserveLineBreaks ? applyPerLine((line) => toDelimited(line, '-')) : toDelimited(normalized, '-')
    case 'camel':
      return options.preserveLineBreaks
        ? applyPerLine((line) => toCamelCase(line, false))
        : toCamelCase(normalized, false)
    case 'pascal':
      return options.preserveLineBreaks
        ? applyPerLine((line) => toCamelCase(line, true))
        : toCamelCase(normalized, true)
    default:
      return normalized
  }
}
