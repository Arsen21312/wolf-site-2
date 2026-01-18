import { computed } from 'vue'
import { useTarotData, type TarotSuit } from '@/composables/useTarotData'
import { useReadingHistory } from '@/composables/useReadingHistory'

export type TarotView =
  | 'home'
  | 'decks'
  | 'spread'
  | 'reading'
  | 'card'
  | 'history'
  | 'settings'

export interface ReadingCard {
  cardId: string
  suit: TarotSuit
  rank?: string
  number?: number
  isRevealed: boolean
  isReversed: boolean
}

export const useTarotAppState = () => {
  const { getDeckList, getSpreadList, getSpreadLayout, getCardPool } = useTarotData()
  const { addReading } = useReadingHistory()

  const defaultDeckId = getDeckList()[0]?.deckId ?? 'wolf_neon'
  const defaultSpreadId =
    getSpreadList().find((spread) => spread.id === 'three')?.id ?? getSpreadList()[0]?.id ?? 'three'

  const activeView = useState<TarotView>('tarot-active-view', () => 'home')
  const selectedDeckId = useState('tarot-selected-deck', () => defaultDeckId)
  const selectedSpreadId = useState('tarot-selected-spread', () => defaultSpreadId)
  const memeMode = useState('tarot-meme-mode', () => false)
  const showShadow = useState('tarot-show-shadow', () => true)
  const readingCards = useState<ReadingCard[]>('tarot-reading-cards', () => [])
  const selectedCardIndex = useState<number | null>('tarot-selected-card', () => null)
  const isShuffling = useState('tarot-is-shuffling', () => false)

  const activeSpreadLayout = computed(() => getSpreadLayout(selectedSpreadId.value))

  const go = (view: TarotView) => {
    activeView.value = view
  }

  const selectDeck = (deckId: string) => {
    selectedDeckId.value = deckId
    go('spread')
  }

  const selectSpread = (spreadId: string) => {
    selectedSpreadId.value = spreadId
  }

  const startShuffle = () => {
    isShuffling.value = true
    selectedCardIndex.value = null
  }

  const dealCards = () => {
    const layout = getSpreadLayout(selectedSpreadId.value)
    const pool = [...getCardPool()]
    const count = layout.positions.length
    const newCards: ReadingCard[] = []

    for (let index = 0; index < count; index += 1) {
      const pickIndex = Math.floor(Math.random() * pool.length)
      const picked = pool.splice(pickIndex, 1)[0] ?? pool[0]
      newCards.push({
        cardId: picked?.cardId ?? String(index).padStart(2, '0'),
        suit: picked?.suit ?? 'major',
        rank: picked?.rank ?? String(index),
        number: picked?.number ?? index,
        isRevealed: false,
        isReversed: Math.random() > 0.6
      })
    }

    readingCards.value = newCards
    isShuffling.value = false
    activeView.value = 'reading'
  }

  const revealCard = (index: number) => {
    const target = readingCards.value[index]
    if (!target) return
    if (!target.isRevealed) {
      target.isRevealed = true
    }
    selectedCardIndex.value = index
  }

  const openCardDetails = (index: number) => {
    if (!readingCards.value[index]) return
    selectedCardIndex.value = index
    activeView.value = 'card'
  }

  const saveReadingToHistory = () => {
    if (!readingCards.value.length) return

    const entry = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      deckId: selectedDeckId.value,
      spreadId: selectedSpreadId.value,
      cards: readingCards.value.map((card) => ({ ...card })),
      memeMode: memeMode.value,
      showShadow: showShadow.value
    }

    addReading(entry)
  }

  const repeatReading = (entry: {
    deckId: string
    spreadId: string
    cards: ReadingCard[]
  }) => {
    selectedDeckId.value = entry.deckId
    selectedSpreadId.value = entry.spreadId
    readingCards.value = entry.cards.map((card) => ({ ...card }))
    isShuffling.value = false
    activeView.value = 'reading'
  }

  return {
    activeView,
    selectedDeckId,
    selectedSpreadId,
    memeMode,
    showShadow,
    readingCards,
    selectedCardIndex,
    isShuffling,
    activeSpreadLayout,
    go,
    selectDeck,
    selectSpread,
    startShuffle,
    dealCards,
    revealCard,
    openCardDetails,
    saveReadingToHistory,
    repeatReading
  }
}
