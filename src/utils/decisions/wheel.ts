export interface WheelSpinResult {
  index: number
  nextRotation: number
  spins: number
}

const getCrypto = (): Crypto | null => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) return crypto
  return null
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

export const shuffleList = <T>(items: T[]): T[] => {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export const calculateSpin = (
  currentRotation: number,
  count: number,
  spins: number,
  targetIndex: number
): WheelSpinResult => {
  const sectorAngle = 360 / count
  const rotationOffset = 360 - (targetIndex + 0.5) * sectorAngle
  const normalized = ((currentRotation % 360) + 360) % 360
  const delta = spins * 360 + ((rotationOffset - normalized + 360) % 360)
  return {
    index: targetIndex,
    nextRotation: currentRotation + delta,
    spins
  }
}
