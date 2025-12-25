import { defineEventHandler, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  setResponseStatus(event, 410)
  return { ok: false, message: 'deprecated, moved to local ambient' }
})
