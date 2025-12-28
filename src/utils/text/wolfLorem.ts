export type WolfLoremMode = 'paragraphs' | 'sentences' | 'words'
export type WolfLoremParagraphLength = 'short' | 'medium' | 'long'
export type WolfLoremStyle = 'neutral' | 'meme' | 'motivation' | 'dark'
export type WolfLoremTone = 'friendly' | 'bold' | 'calm'

export type WolfLoremOptions = {
  mode: WolfLoremMode
  count: number
  paragraphLength: WolfLoremParagraphLength
  style: WolfLoremStyle
  tone: WolfLoremTone
  ensureWolf: boolean
  addEmoji: boolean
  addAuf: boolean
  allow18Plus: boolean
  repeatable: boolean
  seed?: number
  seedSalt?: number
}

export type WolfLoremResult = {
  text: string
  paragraphs: string[]
  sentences: string[]
}

const intros = [
  'На рассвете',
  'В сумерках',
  'На границе леса',
  'В тишине хвои',
  'В ясной ночи',
  'Перед первым шагом',
  'Вдали от шума',
  'На знакомой тропе'
]

const wolfNouns = [
  'волк',
  'серый волк',
  'молодой волк',
  'волк-одиночка',
  'вожак',
  'волчий разведчик'
]

const verbs = [
  'держит курс',
  'замечает ритм',
  'выбирает линию',
  'считает шаги',
  'слушает ветер',
  'бережет границы',
  'идет без спешки',
  'подстраивает темп',
  'проверяет след',
  'ловит тишину'
]

const detailPhrases = [
  'по холодной тропе',
  'по мягкому мху',
  'вдоль кромки леса',
  'между старыми соснами',
  'через серые поля',
  'по линии тумана',
  'по насту и следам',
  'в ритме стаи',
  'по запаху ветра',
  'по знакомому маршруту'
]

const connectors = ['и', 'а', 'поэтому', 'так что', 'пока', 'когда']

const stylePhrases: Record<WolfLoremStyle, string[]> = {
  neutral: [
    'без лишнего шума и позы',
    'по делу и по ситуации',
    'собранно и ровно',
    'в своем спокойном темпе'
  ],
  meme: [
    'ну ты понял',
    'без лишних драм',
    'как в мемах про стаю',
    'в режиме легенды'
  ],
  motivation: [
    'это про силу и движение',
    'так рождается уверенность',
    'это про шаг вперед',
    'с таким темпом легче идти'
  ],
  dark: [
    'с оттенком черного юмора',
    'мрачно, но без жести',
    'с тихой иронией',
    'такой уж ночной вайб'
  ]
}

const tonePhrases: Record<WolfLoremTone, string[]> = {
  friendly: ['по-доброму', 'мягко, но уверенно', 'с теплым тоном', 'спокойно и дружелюбно'],
  bold: ['по-волчьи дерзко', 'смело и прямолинейно', 'с напором', 'на уверенном рыке'],
  calm: ['ровно и тихо', 'без суеты', 'медленно и точно', 'с холодной ясностью']
}

const memeInserts = [
  'и это чистый вайб',
  'как будто в сторис',
  'меньше слов — больше волка',
  'стая одобрит'
]

const adultPhrases = [
  'без розовых соплей',
  'чуть жестче обычного',
  'без реверансов',
  'взрослый режим включен'
]

const emojis = ['🐺', '🌲', '🌙', '🔥', '✨', '🖤', '⚡', '🌕']

const wordBank = [
  'волк',
  'стая',
  'лес',
  'ночь',
  'след',
  'ритм',
  'тишина',
  'ветер',
  'тропа',
  'сила',
  'холод',
  'север',
  'шаг',
  'мох',
  'луна',
  'граница',
  'свобода',
  'взгляд',
  'темп',
  'выбор',
  'спокойствие',
  'дерзость',
  'ясность',
  'память',
  'движение',
  'сталь',
  'уют',
  'голос',
  'маршрут',
  'молчание'
]

const WOLF_REGEX = /\bволк\b/i

const hashString = (input: string) => {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const mulberry32 = (seed: number) => {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const clampCount = (value: number) => Math.max(1, Math.min(50, Math.round(value)))

const pick = <T>(items: T[], rng: () => number) => items[Math.floor(rng() * items.length)]

const randomInt = (min: number, max: number, rng: () => number) =>
  Math.floor(rng() * (max - min + 1)) + min

const resolveSeed = (options: WolfLoremOptions) => {
  if (!options.repeatable) return null
  if (typeof options.seed === 'number') return options.seed >>> 0
  const payload = JSON.stringify({
    mode: options.mode,
    count: options.count,
    paragraphLength: options.paragraphLength,
    style: options.style,
    tone: options.tone,
    ensureWolf: options.ensureWolf,
    addEmoji: options.addEmoji,
    addAuf: options.addAuf,
    allow18Plus: options.allow18Plus,
    seedSalt: options.seedSalt ?? 0
  })
  const base = hashString(payload)
  return (base + (options.seedSalt ?? 0)) >>> 0
}

const createRng = (options: WolfLoremOptions) => {
  const seed = resolveSeed(options)
  if (seed !== null) return mulberry32(seed)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return mulberry32(buf[0])
  }
  return Math.random
}

const finalizeSentence = (sentence: string, options: WolfLoremOptions, rng: () => number) => {
  let text = sentence.replace(/\s+/g, ' ').trim()
  if (options.addAuf && rng() < 0.18) {
    text = text.replace(/[.!?]$/, '')
    text = `${text} — ауф.`
  }
  if (options.addEmoji && rng() < 0.22) {
    text = `${text} ${pick(emojis, rng)}`
  }
  return text
}

const buildTail = (options: WolfLoremOptions, rng: () => number) => {
  const parts = [pick(stylePhrases[options.style], rng), pick(tonePhrases[options.tone], rng)]
  if (options.style === 'meme' && rng() < 0.5) {
    parts.push(pick(memeInserts, rng))
  }
  if (options.allow18Plus && rng() < 0.4) {
    parts.push(pick(adultPhrases, rng))
  }
  return parts.join(', ')
}

const sentenceTemplates = [
  '{intro} {wolf} {verb} {detail}, {tail}.',
  '{wolf} {verb} {detail} — {tail}.',
  'Когда {wolf} {verb} {detail}, {tail}.',
  '{intro} {detail}, и {wolf} {verb} {detail2}, {tail}.'
]

const buildSentence = (options: WolfLoremOptions, rng: () => number) => {
  const template = pick(sentenceTemplates, rng)
  const data = {
    intro: pick(intros, rng),
    wolf: pick(wolfNouns, rng),
    verb: pick(verbs, rng),
    detail: pick(detailPhrases, rng),
    detail2: pick(detailPhrases, rng),
    tail: buildTail(options, rng)
  }
  let sentence = template
  Object.entries(data).forEach(([key, value]) => {
    sentence = sentence.replaceAll(`{${key}}`, value)
  })
  if (rng() < 0.22) {
    const connector = pick(connectors, rng)
    sentence = sentence.replace(/,\s*$/, '')
    sentence = sentence.replace(/\.$/, '')
    sentence = `${sentence}, ${connector} ${buildTail(options, rng)}.`
  }
  return finalizeSentence(sentence, options, rng)
}

const sentencesForLength = (length: WolfLoremParagraphLength, rng: () => number) => {
  if (length === 'short') return randomInt(2, 3, rng)
  if (length === 'long') return randomInt(5, 7, rng)
  return randomInt(3, 5, rng)
}

const ensureWolfInText = (text: string) => (WOLF_REGEX.test(text) ? text : `${text} Волк держит темп.`)

const buildParagraph = (options: WolfLoremOptions, rng: () => number) => {
  const count = sentencesForLength(options.paragraphLength, rng)
  const sentences = Array.from({ length: count }, () => buildSentence(options, rng))
  let paragraph = sentences.join(' ')
  if (options.ensureWolf) paragraph = ensureWolfInText(paragraph)
  return paragraph
}

const buildSentences = (options: WolfLoremOptions, rng: () => number) => {
  const count = clampCount(options.count)
  const sentences = Array.from({ length: count }, () => buildSentence(options, rng))
  if (options.ensureWolf && sentences.every((sentence) => !WOLF_REGEX.test(sentence))) {
    sentences[0] = ensureWolfInText(sentences[0])
  }
  return sentences
}

const buildWords = (options: WolfLoremOptions, rng: () => number) => {
  const count = clampCount(options.count)
  const words = Array.from({ length: count }, () => pick(wordBank, rng))
  if (options.ensureWolf) {
    const index = count === 1 ? 0 : randomInt(0, count - 1, rng)
    words[index] = 'волк'
  }
  return words
}

export const generateWolfLorem = (options: WolfLoremOptions): WolfLoremResult => {
  const normalized: WolfLoremOptions = {
    ...options,
    count: clampCount(options.count)
  }
  const rng = createRng(normalized)

  if (normalized.mode === 'words') {
    const words = buildWords(normalized, rng)
    return { text: words.join(' '), paragraphs: [], sentences: [] }
  }

  if (normalized.mode === 'sentences') {
    const sentences = buildSentences(normalized, rng)
    const text = sentences.join(' ')
    return { text: normalized.ensureWolf ? ensureWolfInText(text) : text, paragraphs: [], sentences }
  }

  const paragraphs = Array.from({ length: normalized.count }, () => buildParagraph(normalized, rng))
  const text = paragraphs.join('\n\n')
  return { text, paragraphs, sentences: [] }
}

export const buildWolfParagraph = (options: WolfLoremOptions) => {
  const rng = createRng(options)
  return buildParagraph(options, rng)
}
