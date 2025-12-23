import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'
import { applyAdminRules, applyStatsBonus, mergeEdgeData } from '~/server/utils/contextEdges'
import { getAutoNeighbors } from '~/server/utils/contextNeighbors'

type DefineBody = {
  lemma?: string
  useStats?: boolean
}

const NEIGHBOR_LIMIT = 300

function normalizeLemma(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, 'е')
}


export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as DefineBody
  const lemmaRaw = typeof body?.lemma === 'string' ? body.lemma : ''
  const lemma = normalizeLemma(lemmaRaw)
  const useStats = Boolean(body?.useStats)

  if (!lemma) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'lemma is required' }
  }

  const supabase = getSupabaseAdminClient()
  const { data: existing, error: existingError } = await supabase
    .from('context_words')
    .select('id, "Lemma", "R", is_core, is_active')
    .eq('game_id', 1)
    .ilike('Lemma', lemma)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error(existingError)
    setResponseStatus(event, 500)
    return { ok: false, message: 'Failed to read context_words' }
  }

  let targetId: number
  let targetLemma: string

  if (existing && existing.is_active) {
    targetId = Number(existing.id)
    targetLemma = existing.Lemma
  } else if (existing && !existing.is_active) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'word_inactive' }
  } else {
    const { data: maxRow } = await supabase
      .from('context_words')
      .select('"R"')
      .eq('game_id', 1)
      .order('R', { ascending: false })
      .limit(1)
      .maybeSingle()

    const maxRank = maxRow?.R ? Number(maxRow.R) : 0
    const { data: inserted, error: insertError } = await supabase
      .from('context_words')
      .insert({
        game_id: 1,
        Lemma: lemma,
        is_core: false,
        is_active: true,
        R: maxRank + 1
      })
      .select('id, "Lemma"')
      .single()

    if (insertError || !inserted) {
      console.error(insertError)
      setResponseStatus(event, 500)
      return { ok: false, message: 'Failed to insert word' }
    }

    targetId = Number(inserted.id)
    targetLemma = inserted.Lemma
  }

  const auto = await getAutoNeighbors(1, targetId, NEIGHBOR_LIMIT)
  if (!auto.ok) {
    setResponseStatus(event, 500)
    return { ok: false, message: auto.message }
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
    target: { id: targetId, lemma: targetLemma },
    neighbors,
    source: auto.source
  }
})
