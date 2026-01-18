import { onMounted, watch } from 'vue'
import type { TarotSuit } from '@/composables/useTarotData'

export interface StoredCard {
  cardId: string
  suit: TarotSuit
  rank?: string
  number?: number
  isRevealed: boolean
  isReversed: boolean
}

export interface ReadingHistoryItem {
  id: string
  createdAt: string
  deckId: string
  spreadId: string
  cards: StoredCard[]
  memeMode: boolean
  showShadow: boolean
}

const STORAGE_KEY = 'tarot-reading-history'

export const useReadingHistory = () => {
  const history = useState<ReadingHistoryItem[]>('tarot-reading-history', () => [])
  const isReady = useState('tarot-reading-history-ready', () => false)

  const loadHistory = () => {
    if (typeof window === 'undefined') return
    if (isReady.value) return
    if (history.value.length) {
      isReady.value = true
      return
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ReadingHistoryItem[]
        history.value = Array.isArray(parsed) ? parsed : []
      }
    } catch {
      history.value = []
    }

    isReady.value = true
  }

  const persistHistory = () => {
    if (typeof window === 'undefined') return
    if (!isReady.value) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  }

  const addReading = (entry: ReadingHistoryItem) => {
    history.value = [entry, ...history.value]
    persistHistory()
  }

  const clearHistory = () => {
    history.value = []
    persistHistory()
  }

  onMounted(loadHistory)

  if (typeof window !== 'undefined') {
    watch(
      history,
      () => {
        persistHistory()
      },
      { deep: true }
    )
  }

  return {
    history,
    addReading,
    clearHistory
  }
}
