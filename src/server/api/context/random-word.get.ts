import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { getSupabaseClient } from '~/server/utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = getSupabaseClient()

  const query = getQuery(event)
  const rawGameId = query.gameId
  const rawLemma = typeof query.lemma === 'string' ? query.lemma.trim() : ''
  const parsedGameId = rawGameId ? Number(rawGameId) : 1
  const gameId = Number.isInteger(parsedGameId) && parsedGameId > 0 ? parsedGameId : null

  if (!gameId) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'gameId must be a positive integer' }
  }

  if (rawLemma) {
    const { data, error } = await supabase
      .from('context_words')
      .select('id, game_id, "Lemma", "R"')
      .eq('is_core', true)
      .eq('is_active', true)
      .eq('game_id', gameId)
      .ilike('Lemma', rawLemma)
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      console.error('Supabase lemma word error', error?.message || error)
      setResponseStatus(event, 404)
      return { ok: false, error: 'Не удалось получить слово из Supabase' }
    }

    const id = typeof data.id === 'string' ? Number(data.id) : data.id
    const resolvedGameId = typeof data.game_id === 'string' ? Number(data.game_id) : gameId
    const rank = typeof data.R === 'string' ? Number(data.R) : data.R

    return {
      ok: true,
      word: {
        id,
        gameId: resolvedGameId,
        lemma: data.Lemma,
        rank
      }
    }
  }

  const { count: neighborCount, error: neighborCountError } = await supabase
    .from('context_neighbors')
    .select('target_word_id', { count: 'exact', head: true })

  if (neighborCountError) {
    console.error('Supabase neighbors count error', neighborCountError?.message || neighborCountError)
  }

  let targetWordId: number | null = null

  if (neighborCount && neighborCount > 0) {
    const offset = Math.floor(Math.random() * neighborCount)
    const { data: neighborRow, error: neighborError } = await supabase
      .from('context_neighbors')
      .select('target_word_id')
      .order('target_word_id', { ascending: true })
      .range(offset, offset)

    if (neighborError) {
      console.error('Supabase neighbors random error', neighborError?.message || neighborError)
    } else {
      const rawTargetId = neighborRow?.[0]?.target_word_id
      const resolvedTargetId = typeof rawTargetId === 'string' ? Number(rawTargetId) : rawTargetId
      if (Number.isFinite(resolvedTargetId)) {
        targetWordId = resolvedTargetId as number
      }
    }
  }

  if (!targetWordId) {
    const { count, error: countError } = await supabase
      .from('context_words')
      .select('id', { count: 'exact', head: true })
      .eq('is_core', true)
      .eq('is_active', true)
      .eq('game_id', gameId)

    if (countError) {
      console.error('Supabase count error', countError?.message || countError)
      setResponseStatus(event, 500)
      return { ok: false, error: 'Не удалось получить слово из Supabase' }
    }

    if (!count || count < 1) {
      setResponseStatus(event, 404)
      return { ok: false, error: 'No core words found' }
    }

    const offset = Math.floor(Math.random() * count)
    const { data, error } = await supabase
      .from('context_words')
      .select('id, game_id, "Lemma", "R"')
      .eq('is_core', true)
      .eq('is_active', true)
      .eq('game_id', gameId)
      .range(offset, offset)

    if (error) {
      console.error('Supabase random word error', error?.message || error)
      setResponseStatus(event, 500)
      return { ok: false, error: 'Не удалось получить слово из Supabase' }
    }

    const word = data?.[0]
    if (!word) {
      setResponseStatus(event, 404)
      return { ok: false, error: 'No word found at random offset' }
    }

    const id = typeof word.id === 'string' ? Number(word.id) : word.id
    const resolvedGameId = typeof word.game_id === 'string' ? Number(word.game_id) : gameId
    const rank = typeof word.R === 'string' ? Number(word.R) : word.R

    return {
      ok: true,
      word: {
        id,
        gameId: resolvedGameId,
        lemma: word.Lemma,
        rank
      }
    }
  }

  const { data, error } = await supabase
    .from('context_words')
    .select('id, game_id, "Lemma", "R"')
    .eq('id', targetWordId)
    .eq('is_core', true)
    .eq('is_active', true)
    .eq('game_id', gameId)
    .limit(1)

  if (error) {
    console.error('Supabase random word error', error?.message || error)
    setResponseStatus(event, 500)
    return { ok: false, error: 'Не удалось получить слово из Supabase' }
  }

  const word = data?.[0]
  if (!word) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'No word found at random offset' }
  }

  const id = typeof word.id === 'string' ? Number(word.id) : word.id
  const resolvedGameId = typeof word.game_id === 'string' ? Number(word.game_id) : gameId
  const rank = typeof word.R === 'string' ? Number(word.R) : word.R

  return {
    ok: true,
    word: {
      id,
      gameId: resolvedGameId,
      lemma: word.Lemma,
      rank
    }
  }
})
