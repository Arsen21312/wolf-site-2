const STORAGE_KEY = 'wolfJumpBest'

export const loadBestScore = () => {
  if (typeof window === 'undefined') return 0
  const value = window.localStorage.getItem(STORAGE_KEY)
  const parsed = value ? Number.parseInt(value, 10) : 0
  return Number.isFinite(parsed) ? parsed : 0
}

export const saveBestScore = (score: number) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(score))))
}
