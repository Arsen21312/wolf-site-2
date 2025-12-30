export type UrlEncodingMode = 'component' | 'full'

export interface UrlCodecOptions {
  mode?: UrlEncodingMode
  formUrlEncoded?: boolean
  decodePlusAsSpace?: boolean
}

export class UrlDecodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UrlDecodeError'
  }
}

export const encodeUrl = (value: string, options: UrlCodecOptions = {}): string => {
  const mode = options.mode ?? 'component'
  const encoded = mode === 'full' ? encodeURI(value) : encodeURIComponent(value)
  return options.formUrlEncoded ? encoded.replace(/%20/g, '+') : encoded
}

export const decodeUrl = (value: string, options: UrlCodecOptions = {}): string => {
  const shouldDecodePlus = Boolean(options.formUrlEncoded && options.decodePlusAsSpace)
  const prepared = shouldDecodePlus ? value.replace(/\+/g, ' ') : value

  try {
    return decodeURIComponent(prepared)
  } catch (error) {
    throw new UrlDecodeError(
      'Не удалось декодировать строку. Проверьте, что она полностью закодирована и без обрезанных символов.'
    )
  }
}
