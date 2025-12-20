export default defineEventHandler(() => {
  const hasKey = !!process.env.OPENAI_API_KEY
  console.log('OPENAI_API_KEY from server', hasKey)
  return { ok: hasKey }
})
