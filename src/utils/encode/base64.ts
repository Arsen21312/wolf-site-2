export type Base64DecodeErrorCode = 'INVALID_CHAR' | 'INVALID_LENGTH' | 'DECODE_ERROR'

export interface Base64EncodeOptions {
  urlSafe?: boolean
  addLineBreaks?: boolean
  lineLength?: number
}

export interface Base64DecodeOptions {
  urlSafe?: boolean
  stripWhitespace?: boolean
}

export class Base64DecodeError extends Error {
  code: Base64DecodeErrorCode

  constructor(code: Base64DecodeErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export function encodeBase64(text: string, options: Base64EncodeOptions = {}): string {
  if (!text) return ''
  const bytes = new TextEncoder().encode(text)
  let base64 = bytesToBase64(bytes)

  if (options.urlSafe) {
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_')
  }

  if (options.addLineBreaks) {
    const lineLength = options.lineLength ?? 76
    base64 = insertLineBreaks(base64, lineLength)
  }

  return base64
}

export function decodeBase64(text: string, options: Base64DecodeOptions = {}): string {
  if (!text) return ''
  let normalized = text

  if (options.stripWhitespace) {
    normalized = normalized.replace(/[\s\r\n]+/g, '')
  }

  if (!normalized) return ''

  const allowedPattern = options.urlSafe
    ? /^[A-Za-z0-9\-_]*={0,2}$/
    : /^[A-Za-z0-9+/]*={0,2}$/

  if (!allowedPattern.test(normalized)) {
    throw new Base64DecodeError(
      'INVALID_CHAR',
      'В строке есть символы, которые не относятся к Base64.'
    )
  }

  if (options.urlSafe) {
    normalized = normalized.replace(/-/g, '+').replace(/_/g, '/')
  }

  const remainder = normalized.length % 4
  if (remainder === 1) {
    throw new Base64DecodeError('INVALID_LENGTH', 'Длина Base64 некорректна и не кратна 4.')
  }

  if (remainder > 0) {
    normalized += '='.repeat(4 - remainder)
  }

  try {
    const bytes = base64ToBytes(normalized)
    return new TextDecoder().decode(bytes)
  } catch (error) {
    throw new Base64DecodeError(
      'DECODE_ERROR',
      'Не удалось декодировать строку. Проверьте корректность Base64.'
    )
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function insertLineBreaks(value: string, lineLength: number): string {
  if (lineLength <= 0) return value
  let output = ''
  for (let i = 0; i < value.length; i += lineLength) {
    output += value.slice(i, i + lineLength)
    if (i + lineLength < value.length) output += '\n'
  }
  return output
}
