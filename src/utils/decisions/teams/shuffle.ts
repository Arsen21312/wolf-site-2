import type { Participant } from './parseParticipants'

const getCrypto = (): Crypto | null => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) return crypto
  return null
}

const getRandomInt = (max: number): number => {
  if (max <= 0) return 0
  const cryptoApi = getCrypto()
  if (cryptoApi) {
    const buffer = new Uint32Array(1)
    cryptoApi.getRandomValues(buffer)
    return buffer[0] % max
  }
  return Math.floor(Math.random() * max)
}

export const shuffleParticipants = (items: Participant[]): Participant[] => {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}
