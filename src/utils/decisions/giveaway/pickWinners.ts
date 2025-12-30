export type PickWinnersOptions = {
  winnersCount: number
  backupsCount: number
  removeWinnerFromPool: boolean
}

export type PickWinnersResult = {
  winners: string[]
  backups: string[]
  remainingPool: string[]
}

const randomIndex = (max: number) => {
  if (max <= 0) return 0
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0] % max
  }
  return Math.floor(Math.random() * max)
}

const pickFromPool = (pool: string[], count: number, removeWinnerFromPool: boolean) => {
  const picked: string[] = []
  if (count <= 0 || pool.length === 0) return picked

  while (picked.length < count && pool.length > 0) {
    const idx = randomIndex(pool.length)
    const value = pool[idx]
    picked.push(value)
    if (removeWinnerFromPool) {
      pool.splice(idx, 1)
    }
  }
  return picked
}

export const pickWinners = (entries: string[], options: PickWinnersOptions): PickWinnersResult => {
  const pool = [...entries]
  const winners = pickFromPool(pool, options.winnersCount, options.removeWinnerFromPool)
  const backups = pickFromPool(pool, options.backupsCount, options.removeWinnerFromPool)
  return { winners, backups, remainingPool: pool }
}
