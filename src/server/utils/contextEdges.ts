export type AdminAction = 'ban' | 'pin' | 'set_rank'

export type ContextEdgeRow = {
  to_word_id: number
  admin_action: AdminAction | null
  admin_rank: number | null
  plays_count: number | null
  avg_sim: number | null
}

export type NeighborItem = {
  id: number
  lemma: string
  rank: number
  similarity: number
  distance: number
  heatScore: number
  autoRank?: number
  adminAction?: AdminAction | null
  adminRank?: number | null
  playsCount?: number
  avgSim?: number
}

type SlotItem = NeighborItem | null

function getAutoRank(item: NeighborItem) {
  return Number.isFinite(item.autoRank) ? Number(item.autoRank) : item.rank
}

function placeItem(slots: SlotItem[], item: NeighborItem, startIndex: number) {
  for (let i = Math.max(0, startIndex); i < slots.length; i += 1) {
    if (!slots[i]) {
      slots[i] = item
      return true
    }
  }
  return false
}

export function mergeEdgeData(items: NeighborItem[], edges: ContextEdgeRow[]) {
  const byId = new Map<number, ContextEdgeRow>()
  for (const edge of edges) {
    if (Number.isFinite(edge.to_word_id)) {
      byId.set(Number(edge.to_word_id), edge)
    }
  }
  return items.map((item) => {
    const edge = byId.get(item.id)
    return {
      ...item,
      adminAction: edge?.admin_action ?? null,
      adminRank: edge?.admin_rank ?? null,
      playsCount: Number.isFinite(edge?.plays_count as number) ? Number(edge?.plays_count) : 0,
      avgSim: Number.isFinite(edge?.avg_sim as number) ? Number(edge?.avg_sim) : 0
    }
  })
}

export function applyAdminRules(items: NeighborItem[], limit: number) {
  const base = items.filter((item) => item.adminAction !== 'ban')
  const size = Math.min(limit, base.length)
  const slots: SlotItem[] = Array.from({ length: size }).fill(null)

  const setRankItems = base
    .filter((item) => item.adminAction === 'set_rank' && Number.isFinite(item.adminRank))
    .sort((a, b) => {
      const rankA = Number(a.adminRank ?? Number.POSITIVE_INFINITY)
      const rankB = Number(b.adminRank ?? Number.POSITIVE_INFINITY)
      if (rankA !== rankB) return rankA - rankB
      return getAutoRank(a) - getAutoRank(b)
    })

  for (const item of setRankItems) {
    const targetIndex = Math.max(0, Math.min(size - 1, Number(item.adminRank) - 1))
    placeItem(slots, item, targetIndex)
  }

  const pinned = base
    .filter((item) => item.adminAction === 'pin')
    .sort((a, b) => getAutoRank(a) - getAutoRank(b))

  for (const item of pinned) {
    placeItem(slots, item, 0)
  }

  const rest = base
    .filter((item) => item.adminAction !== 'pin' && item.adminAction !== 'set_rank')
    .sort((a, b) => getAutoRank(a) - getAutoRank(b))

  for (const item of rest) {
    placeItem(slots, item, 0)
  }

  const filled = slots.filter((item): item is NeighborItem => Boolean(item))
  return filled.map((item, index) => ({
    ...item,
    rank: index + 1
  }))
}

export function applyStatsBonus(items: NeighborItem[], limit: number) {
  const size = Math.min(limit, items.length)
  if (!size) return []

  const fixed = items.filter((item) => item.adminAction === 'pin' || item.adminAction === 'set_rank')
  const fixedIds = new Set(fixed.map((item) => item.id))
  const movable = items.filter((item) => !fixedIds.has(item.id))

  movable.sort((a, b) => {
    const aPlays = a.playsCount ?? 0
    const bPlays = b.playsCount ?? 0
    const aBonus = aPlays >= 5 ? Math.min(Math.max(Math.log(aPlays) * 0.01, 0), 0.05) : 0
    const bBonus = bPlays >= 5 ? Math.min(Math.max(Math.log(bPlays) * 0.01, 0), 0.05) : 0
    const aScore = a.similarity + aBonus
    const bScore = b.similarity + bBonus
    return bScore - aScore
  })

  const slots: SlotItem[] = Array.from({ length: size }).fill(null)
  for (let i = 0; i < Math.min(size, items.length); i += 1) {
    const item = items[i]
    if (item && fixedIds.has(item.id)) {
      slots[i] = item
    }
  }

  for (const item of movable) {
    placeItem(slots, item, 0)
  }

  const filled = slots.filter((item): item is NeighborItem => Boolean(item))
  return filled.map((item, index) => ({
    ...item,
    rank: index + 1
  }))
}
