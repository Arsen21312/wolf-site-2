export const sha256 = async (input: string) => {
  if (typeof TextEncoder === 'undefined') return ''
  if (!globalThis.crypto || !globalThis.crypto.subtle) return ''

  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
