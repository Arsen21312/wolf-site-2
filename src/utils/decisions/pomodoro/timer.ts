export const getRemainingMs = (endAt: number | null) => {
  if (!endAt) return 0
  return Math.max(0, endAt - Date.now())
}

export const formatTime = (ms: number) => {
  const safeMs = Math.max(0, Math.round(ms))
  const totalSeconds = Math.floor(safeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const formatMinutes = (minutes: number) => `${Math.round(minutes)} мин`
