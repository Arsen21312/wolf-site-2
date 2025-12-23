import { defineEventHandler, getHeader, readBody, setResponseStatus } from 'h3'
import { applyAdminRules, applyStatsBonus, mergeEdgeData } from '~/server/utils/contextEdges'
import { getAutoNeighbors } from '~/server/utils/contextNeighbors'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

type PreviewBody = {
  target?: string
  gameId?: number | string
  useStats?: boolean
}

const NEIGHBOR_LIMIT = 300

function normalizeLemma(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, 'е')
}

export default defineEventHandler(async (event) => {
  const expectedToken = process.env.ADMIN_TOKEN
  const token = getHeader(event, 'x-admin-token')

  if (!expectedToken) {
    setResponseStatus(event, 500)
    return { ok: false, error: 'ADMIN_TOKEN is not configured in env' }
  }

  if (!token || token !== expectedToken) {
    setResponseStatus(event, 401)
    return { ok: false, error: 'Unauthorized' }
  }

  const body = (await readBody(event)) as PreviewBody
  const targetRaw = typeof body?.target === 'string' ? body.target : ''
  const target = normalizeLemma(targetRaw)
  const gameId = typeof body?.gameId === 'number' ? body.gameId : Number(body?.gameId ?? 1)
  const useStats = Boolean(body?.useStats)

  if (!target) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'target is required' }
  }

  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing' }
  }

  const { data: targetRow, error: targetError } = await supabase
    .from('context_words')
    .select('id, "Lemma", "R", is_active')
    .eq('game_id', gameId)
    .ilike('Lemma', target)
    .limit(1)
    .maybeSingle()

  if (targetError) {
    console.error(targetError)
    setResponseStatus(event, 500)
    return { ok: false, error: 'Failed to load context_words' }
  }

  if (!targetRow?.id) {
    setResponseStatus(event, 404)
    return { ok: false, error: 'target_not_found' }
  }

  const targetId = Number(targetRow.id)
  const auto = await getAutoNeighbors(gameId, targetId, NEIGHBOR_LIMIT)
  if (!auto.ok) {
    setResponseStatus(event, 500)
    return { ok: false, error: auto.message }
  }

  let edges = []
  const { data: edgeRows, error: edgeError } = await supabase
    .from('context_edges')
    .select('to_word_id, admin_action, admin_rank, plays_count, avg_sim')
    .eq('target_word_id', targetId)
    .eq('kind', 'target_guess')
    .is('from_word_id', null)

  if (edgeError) {
    console.error(edgeError)
  } else {
    edges = edgeRows || []
  }

  let neighbors = mergeEdgeData(auto.neighbors, edges)
  neighbors = applyAdminRules(neighbors, NEIGHBOR_LIMIT)
  if (useStats) {
    neighbors = applyStatsBonus(neighbors, NEIGHBOR_LIMIT)
  }

  return {
    ok: true,
    target: {
      id: targetId,
      lemma: targetRow.Lemma,
      rank: targetRow.R
    },
    neighbors,
    source: auto.source
  }
})
