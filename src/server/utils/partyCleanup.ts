import { getSupabaseAdminClient } from '~/server/utils/supabaseAdmin'

const CLEANUP_DAYS = 7
const CLEANUP_LIMIT = 500
const CLEANUP_INTERVAL_MS = 12 * 60 * 60 * 1000

let lastCleanupAt = 0

type CleanupOptions = {
  force?: boolean
}

type CleanupResult = {
  skipped: boolean
  removedRooms: number
}

export async function cleanupOldRooms(options: CleanupOptions = {}): Promise<CleanupResult> {
  const now = Date.now()
  if (!options.force && now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return { skipped: true, removedRooms: 0 }
  }
  lastCleanupAt = now

  const supabase = getSupabaseAdminClient()
  const cutoff = new Date(Date.now() - CLEANUP_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('context_rooms')
    .select('id')
    .lt('last_active_at', cutoff)
    .limit(CLEANUP_LIMIT)

  if (error || !data || data.length === 0) {
    return { skipped: false, removedRooms: 0 }
  }

  const ids = data.map((row) => row.id).filter(Boolean)
  if (!ids.length) {
    return { skipped: false, removedRooms: 0 }
  }

  await supabase.from('context_room_guesses').delete().in('room_id', ids)
  await supabase.from('context_rooms').delete().in('id', ids)
  return { skipped: false, removedRooms: ids.length }
}
