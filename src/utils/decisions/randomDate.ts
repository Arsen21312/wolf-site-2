const MS_PER_DAY = 24 * 60 * 60 * 1000

const getCrypto = (): Crypto | null => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) return crypto
  return null
}

const fixedHolidays = new Set([
  '01-01',
  '01-02',
  '01-03',
  '01-04',
  '01-05',
  '01-06',
  '01-07',
  '02-23',
  '03-08',
  '05-01',
  '05-09',
  '06-12',
  '11-04'
])

const pad = (value: number) => String(value).padStart(2, '0')

const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const toHolidayKey = (date: Date): string => `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const toUtcMidnight = (date: Date): number =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

const normalizeIsoList = (values: string[]): Set<string> => {
  const result = new Set<string>()
  values.forEach((item) => {
    const trimmed = item.trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return
    result.add(trimmed)
  })
  return result
}

const isDateAllowed = (
  date: Date,
  options: DateFilterOptions,
  excludedDates: Set<string>
): boolean => {
  if (options.weekdaysOnly && isWeekend(date)) return false
  if (options.weekendsOnly && !isWeekend(date)) return false
  if (options.excludeHolidays && fixedHolidays.has(toHolidayKey(date))) return false
  if (excludedDates.has(toIsoDate(date))) return false
  return true
}

export interface DateFilterOptions {
  weekdaysOnly?: boolean
  weekendsOnly?: boolean
  excludeToday?: boolean
  excludeDates?: string[]
  excludeHolidays?: boolean
}

export const getRandomInt = (max: number): number => {
  if (max <= 0) return 0
  const cryptoApi = getCrypto()
  if (!cryptoApi) {
    throw new Error('crypto_unavailable')
  }
  const buffer = new Uint32Array(1)
  cryptoApi.getRandomValues(buffer)
  return buffer[0] % max
}

export const buildAllowedDates = (
  start: Date,
  end: Date,
  options: DateFilterOptions = {}
): Date[] => {
  if (end < start) return []
  const excludedDates = normalizeIsoList(options.excludeDates ?? [])
  if (options.excludeToday) {
    excludedDates.add(toIsoDate(new Date()))
  }

  const result: Date[] = []
  let cursor = new Date(start)
  while (cursor <= end) {
    if (isDateAllowed(cursor, options, excludedDates)) {
      result.push(new Date(cursor))
    }
    cursor = addDays(cursor, 1)
  }
  return result
}

export const pickRandomDate = (params: {
  start: Date
  end: Date
  options?: DateFilterOptions
  allowedDates?: Date[]
  maxAttempts?: number
}): Date | null => {
  const { start, end, allowedDates, options = {}, maxAttempts = 500 } = params
  if (allowedDates && allowedDates.length) {
    return allowedDates[getRandomInt(allowedDates.length)]
  }

  const excludedDates = normalizeIsoList(options.excludeDates ?? [])
  if (options.excludeToday) {
    excludedDates.add(toIsoDate(new Date()))
  }

  const utcStart = toUtcMidnight(start)
  const utcEnd = toUtcMidnight(end)
  const rangeDays = Math.floor((utcEnd - utcStart) / MS_PER_DAY) + 1
  if (rangeDays <= 0) return null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const offset = getRandomInt(rangeDays)
    const candidate = addDays(start, offset)
    if (isDateAllowed(candidate, options, excludedDates)) {
      return candidate
    }
  }

  return null
}

export const pickRandomDates = (allowedDates: Date[], count: number): Date[] => {
  const result = allowedDates.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result.slice(0, count)
}

export const formatHumanDate = (date: Date, includeTime = false): string => {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ]
  const base = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  if (!includeTime) return base
  return `${base}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
