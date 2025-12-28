export type PasswordOptions = {
  length: number
  useLowercase: boolean
  useUppercase: boolean
  useNumbers: boolean
  useSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
  requireEachSelected: boolean
  wolfMode: boolean
}

export type PasswordStrengthLabel = 'слабый' | 'норм' | 'сильный' | 'зверь'

export type PasswordStrength = {
  entropy: number
  label: PasswordStrengthLabel
  crackTimeLabel: string
  poolSize: number
}

export type PasswordGenerationResult = {
  password: string
  strength: PasswordStrength
}

export type PasswordGenerationErrorCode =
  | 'NO_GROUPS'
  | 'LENGTH_TOO_SHORT'
  | 'EMPTY_POOL'
  | 'CRYPTO_UNAVAILABLE'

export type PasswordGenerationError = {
  code: PasswordGenerationErrorCode
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = `!@#$%^&*()_+-=[]{};:,.<>?/|~"' \``

const SIMILAR = new Set(['0', 'O', 'o', 'l', '1', 'I'])
const AMBIGUOUS = new Set(['"', "'", '`', ' '])

type PasswordGroup = {
  id: 'lowercase' | 'uppercase' | 'numbers' | 'symbols'
  chars: string
}

function getCrypto(): Crypto | null {
  if (typeof globalThis === 'undefined') return null
  const cryptoObj = globalThis.crypto
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') return null
  return cryptoObj
}

function filterChars(chars: string, excludeSimilar: boolean, excludeAmbiguous: boolean): string {
  if (!excludeSimilar && !excludeAmbiguous) return chars
  const filtered = []
  for (const char of chars) {
    if (excludeSimilar && SIMILAR.has(char)) continue
    if (excludeAmbiguous && AMBIGUOUS.has(char)) continue
    filtered.push(char)
  }
  return filtered.join('')
}

function buildGroups(options: PasswordOptions): PasswordGroup[] {
  const groups: PasswordGroup[] = []
  if (options.useLowercase) {
    groups.push({
      id: 'lowercase',
      chars: filterChars(LOWERCASE, options.excludeSimilar, options.excludeAmbiguous)
    })
  }
  if (options.useUppercase) {
    groups.push({
      id: 'uppercase',
      chars: filterChars(UPPERCASE, options.excludeSimilar, options.excludeAmbiguous)
    })
  }
  if (options.useNumbers) {
    groups.push({
      id: 'numbers',
      chars: filterChars(NUMBERS, options.excludeSimilar, options.excludeAmbiguous)
    })
  }
  if (options.useSymbols) {
    groups.push({
      id: 'symbols',
      chars: filterChars(SYMBOLS, options.excludeSimilar, options.excludeAmbiguous)
    })
  }
  return groups.filter((group) => group.chars.length > 0)
}

function buildPool(groups: PasswordGroup[]): string {
  const pool = groups.map((group) => group.chars).join('')
  return Array.from(new Set(pool.split(''))).join('')
}

function cryptoRandomInt(cryptoObj: Crypto, max: number): number {
  if (max <= 0) return 0
  const range = 0x100000000
  const limit = Math.floor(range / max) * max
  const buffer = new Uint32Array(1)
  while (true) {
    cryptoObj.getRandomValues(buffer)
    const value = buffer[0]
    if (value < limit) return value % max
  }
}

function pickRandomChar(cryptoObj: Crypto, chars: string): string {
  return chars[cryptoRandomInt(cryptoObj, chars.length)]
}

function shuffleChars(cryptoObj: Crypto, chars: string[]): string[] {
  const array = [...chars]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = cryptoRandomInt(cryptoObj, i + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function meetsGroupMinimum(password: string, groups: PasswordGroup[]): boolean {
  const passwordSet = new Set(password.split(''))
  return groups.every((group) => group.chars.split('').some((char) => passwordSet.has(char)))
}

function applyWolfMode(
  cryptoObj: Crypto,
  password: string,
  groups: PasswordGroup[],
  options: PasswordOptions
): string {
  if (!options.wolfMode) return password
  if (password.length < 3) return password

  const chance = cryptoRandomInt(cryptoObj, 100)
  if (chance > 34) return password

  const tokens = ['wolf', 'AUF']
  const available = tokens.filter((token) => token.length <= password.length)
  if (available.length === 0) return password

  const token = available[cryptoRandomInt(cryptoObj, available.length)]
  const start = cryptoRandomInt(cryptoObj, password.length - token.length + 1)
  const updated = `${password.slice(0, start)}${token}${password.slice(start + token.length)}`

  if (options.requireEachSelected && !meetsGroupMinimum(updated, groups)) {
    return password
  }

  return updated
}

export function evaluateStrength(length: number, poolSize: number): PasswordStrength {
  const safePoolSize = poolSize > 0 ? poolSize : 1
  const entropy = length * Math.log2(safePoolSize)
  let label: PasswordStrengthLabel = 'слабый'

  if (entropy >= 80) label = 'зверь'
  else if (entropy >= 60) label = 'сильный'
  else if (entropy >= 40) label = 'норм'

  return {
    entropy,
    label,
    crackTimeLabel: estimateCrackTime(poolSize, length),
    poolSize
  }
}

export function estimateCrackTime(poolSize: number, length: number): string {
  if (poolSize <= 0 || length <= 0) return 'секунды'
  const log10Attempts = length * Math.log10(poolSize)
  const log10Seconds = log10Attempts - 9

  if (log10Seconds < 0) return 'секунды'
  if (log10Seconds < 2.5) return 'минуты'
  if (log10Seconds < 4.1) return 'часы'
  if (log10Seconds < 5.5) return 'дни'
  if (log10Seconds < 7.5) return 'месяцы'
  if (log10Seconds < 9.5) return 'годы'
  return 'века'
}

export function generatePasswordSet(
  options: PasswordOptions,
  count: number
): { results?: PasswordGenerationResult[]; error?: PasswordGenerationError; poolSize?: number } {
  const cryptoObj = getCrypto()
  if (!cryptoObj) {
    return { error: { code: 'CRYPTO_UNAVAILABLE' } }
  }

  const groups = buildGroups(options)
  if (groups.length === 0) {
    return { error: { code: 'NO_GROUPS' } }
  }

  if (options.requireEachSelected && options.length < groups.length) {
    return { error: { code: 'LENGTH_TOO_SHORT' } }
  }

  const pool = buildPool(groups)
  if (!pool) {
    return { error: { code: 'EMPTY_POOL' } }
  }

  const strength = evaluateStrength(options.length, pool.length)
  const results: PasswordGenerationResult[] = []

  const safeCount = Math.max(1, Math.floor(count))
  for (let i = 0; i < safeCount; i += 1) {
    const chars: string[] = []
    if (options.requireEachSelected) {
      for (const group of groups) {
        chars.push(pickRandomChar(cryptoObj, group.chars))
      }
    }

    const remaining = options.length - chars.length
    for (let j = 0; j < remaining; j += 1) {
      chars.push(pickRandomChar(cryptoObj, pool))
    }

    let password = shuffleChars(cryptoObj, chars).join('')
    password = applyWolfMode(cryptoObj, password, groups, options)

    results.push({ password, strength })
  }

  return { results, poolSize: pool.length }
}
