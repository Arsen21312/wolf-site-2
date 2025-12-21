import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { getContextEmbeddingsCache } from '~/server/utils/contextEmbeddings'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawGameId = query.gameId
  const rawLemma = typeof query.lemma === 'string' ? query.lemma.trim() : ''
  const parsedGameId = rawGameId ? Number(rawGameId) : 1
  const gameId = Number.isInteger(parsedGameId) && parsedGameId > 0 ? parsedGameId : null

  if (!gameId) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'gameId must be a positive integer' }
  }

  const cache = await getContextEmbeddingsCache(gameId)
  const words = cache.words

  if (!words.length) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'No core words found' }
  }

  if (rawLemma) {
    const lemmaLower = rawLemma.toLowerCase()
    const found = words.find((word) => word.Lemma.toLowerCase() === lemmaLower)
    if (!found) {
      setResponseStatus(event, 404)
      return { ok: false, error: 'Слова нет в волчьем словаре' }
    }
    return {
      ok: true,
      word: {
        id: found.id,
        gameId: found.game_id,
        lemma: found.Lemma,
        rank: found.R
      }
    }
  }

  const offset = Math.floor(Math.random() * words.length)
  const word = words[offset]

  return {
    ok: true,
    word: {
      id: word.id,
      gameId: word.game_id,
      lemma: word.Lemma,
      rank: word.R
    }
  }
})
