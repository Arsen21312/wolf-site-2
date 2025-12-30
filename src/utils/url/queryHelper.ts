export interface QueryParamItem {
  key: string
  value: string
}

export interface ParsedQueryUrl {
  baseUrl: string
  params: QueryParamItem[]
}

export class QueryParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QueryParseError'
  }
}

export const parseQueryUrl = (urlString: string): ParsedQueryUrl => {
  try {
    const url = new URL(urlString)
    const params = Array.from(url.searchParams.entries()).map(([key, value]) => ({ key, value }))
    const baseUrl = `${url.origin}${url.pathname}${url.hash}`
    return { baseUrl, params }
  } catch (error) {
    throw new QueryParseError('Введите полный URL со схемой https:// и проверьте корректность ссылки.')
  }
}

const filterParams = (params: QueryParamItem[]): QueryParamItem[] =>
  params.filter((item) => item.key.trim() !== '' || item.value.trim() !== '')

const encodeParams = (params: QueryParamItem[], formUrlEncoded: boolean): string => {
  if (formUrlEncoded) {
    const search = new URLSearchParams()
    params.forEach(({ key, value }) => {
      search.append(key, value)
    })
    return search.toString()
  }

  return params
    .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export const buildUrlFromParams = (
  baseUrl: string,
  params: QueryParamItem[],
  options: { formUrlEncoded?: boolean } = {}
): string => {
  const url = new URL(baseUrl)
  const filtered = filterParams(params)
  if (filtered.length === 0) {
    url.search = ''
    return url.toString()
  }

  const encoded = encodeParams(filtered, Boolean(options.formUrlEncoded))
  url.search = encoded
  return url.toString()
}
