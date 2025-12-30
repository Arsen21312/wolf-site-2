const HIGHSCORE_KEY = 'wolfRunnerHighscore'

const toNumber = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const loadHighscore = () => {
  if (typeof window === 'undefined') return 0
  return toNumber(localStorage.getItem(HIGHSCORE_KEY))
}

export const saveHighscore = (score: number) => {
  if (typeof window === 'undefined') return
  const best = Math.max(0, Math.floor(score))
  localStorage.setItem(HIGHSCORE_KEY, String(best))
}
