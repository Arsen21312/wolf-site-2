import badwords from '@/data/badwords'
import { nickMorphemesCyrillic, nickMorphemesLatin, nickPhraseParts } from '@/data/nicknames'

export type NicknameAlphabet = 'latin' | 'cyrillic'
export type NicknameFormat = 'one-word' | 'phrase'

export interface NicknameOptions {
  base: string
  format: NicknameFormat
  alphabet: NicknameAlphabet
  length: number
  addNumbers: boolean
  addUnderscore: boolean
  wolfy: boolean
  pascalCase: boolean
}

const latinVowels = new Set(['a', 'e', 'i', 'o', 'u', 'y'])
const cyrillicVowels = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'])
const cyrillicLetters = /[а-яё]/i

const wolfyLatinTokens = ['wolf', 'lycan', 'lup', 'varg', 'howl', 'volk', 'zver']
const wolfyCyrillicTokens = ['волк', 'клык', 'вой', 'звер']

const translitMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya'
}

function randomItem(list: string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function hasCyrillic(value: string) {
  return cyrillicLetters.test(value)
}

export function translitRuToEn(value: string) {
  return value
    .toLowerCase()
    .split('')
    .map((char) => translitMap[char] ?? char)
    .join('')
}

export function normalizeBase(raw: string, alphabet: NicknameAlphabet) {
  const trimmed = raw.trim().replace(/\s+/g, '')
  const cleaned = trimmed.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '')
  if (!cleaned) return ''

  if (alphabet === 'latin' && hasCyrillic(cleaned)) {
    return translitRuToEn(cleaned).replace(/[^a-z0-9]/g, '')
  }

  if (alphabet === 'latin') {
    return cleaned.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  return cleaned.toLowerCase().replace(/[^a-z0-9а-яё]/g, '')
}

function pickMorphemes(alphabet: NicknameAlphabet, wolfy: boolean) {
  const morphemes = alphabet === 'latin' ? nickMorphemesLatin : nickMorphemesCyrillic
  if (wolfy) return morphemes

  const tokens = alphabet === 'latin' ? wolfyLatinTokens : wolfyCyrillicTokens
  const filterOut = (value: string) => !tokens.some((token) => value.includes(token))

  return {
    prefixes: morphemes.prefixes.filter(filterOut),
    cores: morphemes.cores.filter(filterOut),
    suffixes: morphemes.suffixes.filter(filterOut)
  }
}

function buildParts(
  base: string,
  alphabet: NicknameAlphabet,
  wolfy: boolean
): { parts: string[]; rawParts: string[] } {
  const morphemes = pickMorphemes(alphabet, wolfy)
  const prefix = randomItem(morphemes.prefixes)
  const core = randomItem(morphemes.cores)
  const suffix = randomItem(morphemes.suffixes)
  const shortSuffix = morphemes.suffixes.filter((item) => item.length <= 3)
  const shortPick = shortSuffix.length ? randomItem(shortSuffix) : suffix

  const recipes: Array<() => string[]> = [
    () => [prefix, core, suffix],
    () => [core, suffix],
    () => [prefix, core],
    () => [base, suffix],
    () => [prefix, base],
    () => [base, core],
    () => [base, shortPick]
  ]

  const available = base ? recipes : recipes.slice(0, 3)
  const rawParts = randomItem(available)()
  const parts = rawParts.filter(Boolean)
  return { parts, rawParts: parts }
}

function formatNickname(parts: string[], options: NicknameOptions) {
  const separator = options.addUnderscore ? '_' : ''
  const raw = parts.join(separator)
  if (options.addUnderscore) return raw.toLowerCase()
  if (options.pascalCase) {
    return raw ? `${raw[0].toUpperCase()}${raw.slice(1)}` : raw
  }
  return raw.toLowerCase()
}

function applyNumbers(nick: string, options: NicknameOptions, lengthRange: { min: number; max: number }) {
  if (!options.addNumbers) return nick
  const maxExtra = Math.max(0, lengthRange.max - nick.length)
  if (maxExtra <= 0) return nick
  const digitsCount = Math.min(2, maxExtra)
  let digits = ''
  for (let i = 0; i < digitsCount; i += 1) {
    digits += Math.floor(Math.random() * 10).toString()
  }
  return `${nick}${digits}`
}

function lengthRange(target: number, base: string) {
  const min = Math.max(4, target - 3)
  const max = Math.min(20, target + 3)
  if (base.length > max) {
    return { min: base.length, max: base.length }
  }
  return { min, max }
}

function vowelSet(alphabet: NicknameAlphabet) {
  return alphabet === 'latin' ? latinVowels : cyrillicVowels
}

function isVowel(char: string, alphabet: NicknameAlphabet) {
  return vowelSet(alphabet).has(char)
}

function isConsonant(char: string, alphabet: NicknameAlphabet) {
  if (/[0-9_-]/.test(char)) return false
  if (alphabet === 'latin') {
    return /[a-z]/i.test(char) && !isVowel(char.toLowerCase(), alphabet)
  }
  return /[а-яё]/i.test(char) && !isVowel(char.toLowerCase(), alphabet)
}

export function passesFilters(value: string, alphabet: NicknameAlphabet, relaxed: boolean) {
  if (!value) return false
  if (/__|--/.test(value)) return false
  if (/^[_-]|[_-]$/.test(value)) return false
  if (/(.)\1\1/.test(value.toLowerCase())) return false

  const maxConsonants = relaxed ? 4 : 3
  const maxVowels = relaxed ? 3 : 2
  let consonantRun = 0
  let vowelRun = 0

  for (const char of value.toLowerCase()) {
    if (isConsonant(char, alphabet)) {
      consonantRun += 1
      vowelRun = 0
    } else if (isVowel(char, alphabet)) {
      vowelRun += 1
      consonantRun = 0
    } else {
      consonantRun = 0
      vowelRun = 0
    }

    if (consonantRun > maxConsonants || vowelRun > maxVowels) {
      return false
    }
  }

  return true
}

function containsBadWord(value: string) {
  const lowered = value.toLowerCase()
  return badwords.some((word) => lowered.includes(word))
}

export function scoreNickname(value: string, alphabet: NicknameAlphabet, targetLength: number) {
  let score = 0
  const length = value.length

  if (length >= 8 && length <= 12) score += 4
  if (length >= 6 && length <= 14) score += 2
  if (length > 14) score -= length - 14
  if (length < 6) score -= 6 - length
  score -= Math.abs(length - targetLength) * 0.4

  const chars = value.toLowerCase().split('')
  const hasVowel = chars.some((char) => isVowel(char, alphabet))
  const hasConsonant = chars.some((char) => isConsonant(char, alphabet))
  if (hasVowel && hasConsonant) score += 3

  for (let i = 1; i < chars.length; i += 1) {
    if (chars[i] === chars[i - 1]) score -= 1
  }

  return score
}

function buildNickPhrase(raw: string) {
  const adj = randomItem(nickPhraseParts.adjectives)
  const animal = randomItem(nickPhraseParts.animals)
  const suffix = randomItem(nickPhraseParts.suffixes)
  const trimmedBase = raw.trim()
  const core = trimmedBase ? `${adj} ${animal} ${trimmedBase}` : `${adj} ${animal}`
  return suffix ? `${core} ${suffix}` : core
}

function buildOneWord(options: NicknameOptions, base: string) {
  const { parts } = buildParts(base, options.alphabet, options.wolfy)
  return formatNickname(parts, options)
}

export function generateNicknames(options: NicknameOptions, count = 6) {
  if (options.format === 'phrase') {
    const base = options.base.trim()
    const set = new Set<string>()
    let attempts = 0
    while (set.size < count && attempts < 40) {
      set.add(buildNickPhrase(base))
      attempts += 1
    }
    return Array.from(set).slice(0, count)
  }

  const base = normalizeBase(options.base, options.alphabet)
  const range = lengthRange(options.length, base)
  const unique = new Set<string>()
  const candidates: Array<{ name: string; score: number }> = []

  const runPass = (relaxed: boolean) => {
    let attempts = 0
    while (attempts < 120 && candidates.length < 30) {
      attempts += 1
      let candidate = buildOneWord(options, base)
      candidate = applyNumbers(candidate, options, range)

      if (unique.has(candidate)) continue
      if (containsBadWord(candidate)) continue
      if (candidate.length < range.min || candidate.length > range.max) continue
      if (!passesFilters(candidate, options.alphabet, relaxed)) continue

      unique.add(candidate)
      candidates.push({
        name: candidate,
        score: scoreNickname(candidate, options.alphabet, options.length)
      })
    }
  }

  runPass(false)
  if (candidates.length < count) {
    runPass(true)
  }

  candidates.sort((a, b) => b.score - a.score)
  return candidates.slice(0, count).map((item) => item.name)
}
