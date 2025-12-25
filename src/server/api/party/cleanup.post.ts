import { defineEventHandler, readBody } from 'h3'
import { cleanupOldRooms } from '~/server/utils/partyCleanup'

type CleanupBody = {
  force?: boolean
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CleanupBody | null
  const force = Boolean(body?.force)
  const result = await cleanupOldRooms({ force })
  return { ok: true, ...result }
})
