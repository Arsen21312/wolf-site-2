import { computed } from 'vue'
import tarotDictionary from '@/data/tarot/ru'

export type TarotSuit = 'major' | 'cups' | 'wands' | 'swords' | 'pentacles'
export type TarotSection = 'majorArcana' | `suits.${Exclude<TarotSuit, 'major'>}`

export interface DeckMeta {
  deckId: string
  titleKey: string
  descriptionKey: string
  tagsKey: string[]
  counts: {
    major: number
    minor: number
  }
}

export interface SpreadMeta {
  id: string
  titleKey: string
  descriptionKey: string
  cardCount: number
  layoutId: string
}

export interface SpreadLayout {
  id: string
  positions: { x: number; y: number }[]
}

export interface CardPoolItem {
  cardId: string
  suit: TarotSuit
  section: TarotSection
  rank: string
  number: number
}

const deckList: DeckMeta[] = [
  {
    deckId: 'wolf_neon',
    titleKey: 'decks.wolf_neon.title',
    descriptionKey: 'decks.wolf_neon.tagline',
    tagsKey: [],
    counts: { major: 22, minor: 56 }
  }
]

const spreadLayouts: Record<string, SpreadLayout> = {
  one: {
    id: 'one',
    positions: [{ x: 0.5, y: 0.5 }]
  },
  three: {
    id: 'three',
    positions: [
      { x: 0.25, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.75, y: 0.5 }
    ]
  },
  five: {
    id: 'five',
    positions: [
      { x: 0.3, y: 0.35 },
      { x: 0.7, y: 0.35 },
      { x: 0.5, y: 0.55 },
      { x: 0.3, y: 0.75 },
      { x: 0.7, y: 0.75 }
    ]
  },
  pack7: {
    id: 'pack7',
    positions: [
      { x: 0.5, y: 0.18 },
      { x: 0.32, y: 0.35 },
      { x: 0.68, y: 0.35 },
      { x: 0.5, y: 0.52 },
      { x: 0.32, y: 0.72 },
      { x: 0.68, y: 0.72 },
      { x: 0.5, y: 0.88 }
    ]
  }
}

const spreadList: SpreadMeta[] = [
  {
    id: 'one',
    layoutId: 'one',
    titleKey: 'tarot.spreads.one.name',
    descriptionKey: 'tarot.spreads.one.desc',
    cardCount: 1
  },
  {
    id: 'three',
    layoutId: 'three',
    titleKey: 'tarot.spreads.three.name',
    descriptionKey: 'tarot.spreads.three.desc',
    cardCount: 3
  },
  {
    id: 'five',
    layoutId: 'five',
    titleKey: 'tarot.spreads.five.name',
    descriptionKey: 'tarot.spreads.five.desc',
    cardCount: 5
  },
  {
    id: 'pack7',
    layoutId: 'pack7',
    titleKey: 'tarot.spreads.pack7.name',
    descriptionKey: 'tarot.spreads.pack7.desc',
    cardCount: 7
  }
]

const buildCardPool = (): CardPoolItem[] => {
  const pool: CardPoolItem[] = []
  const majorCount = 22
  for (let index = 0; index < majorCount; index += 1) {
    const cardId = String(index).padStart(2, '0')
    pool.push({
      cardId,
      suit: 'major',
      section: 'majorArcana',
      rank: cardId,
      number: index
    })
  }

  const suits: Exclude<TarotSuit, 'major'>[] = ['cups', 'wands', 'swords', 'pentacles']
  const suitRanks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King']
  const rankNumbers: Record<string, number> = {
    Ace: 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    Page: 11,
    Knight: 12,
    Queen: 13,
    King: 14
  }
  suits.forEach((suit) => {
    suitRanks.forEach((rank) => {
      const cardId = rank
      pool.push({
        cardId,
        suit,
        section: `suits.${suit}`,
        rank,
        number: rankNumbers[rank] ?? 0
      })
    })
  })

  return pool
}

const cardPool = buildCardPool()

export const useTarotData = () => {
  const t = (key: string) => {
    const parts = key.split('.')
    let current: unknown = tarotDictionary
    for (const part of parts) {
      if (!current || typeof current !== 'object' || !(part in current)) {
        return key
      }
      current = (current as Record<string, unknown>)[part]
    }
    if (typeof current === 'string' || typeof current === 'number') {
      return String(current)
    }
    return key
  }

  const getDeckList = () => deckList
  const getDeckById = (deckId: string) => deckList.find((deck) => deck.deckId === deckId)

  const getSpreadList = () => spreadList
  const getSpreadById = (spreadId: string) => spreadList.find((spread) => spread.id === spreadId)

  const getSpreadLayout = (spreadId: string) => spreadLayouts[spreadId] ?? spreadLayouts.one

  const getCardKey = (
    deckId: string,
    section: TarotSection,
    cardId: string,
    field: string
  ) => `decks.${deckId}.${section}.${cardId}.${field}`

  const getCardPool = () => cardPool

  const deckCount = computed(() => deckList.length)

  return {
    t,
    getDeckList,
    getDeckById,
    getSpreadList,
    getSpreadById,
    getSpreadLayout,
    getCardKey,
    getCardPool,
    deckCount
  }
}
