import { sortJsonKeys } from './sortKeys'

export type JsonIndent = 2 | 4 | '\t'

export type JsonFormatOptions = {
  indent: JsonIndent
  sortKeys: boolean
  trimTrailingWhitespace: boolean
}

export type JsonFormatResult = {
  text: string
  value: unknown
}

export function formatJson(input: string, options: JsonFormatOptions): JsonFormatResult {
  const parsed = JSON.parse(input)
  const value = options.sortKeys ? sortJsonKeys(parsed) : parsed
  const spacing = options.indent === '\t' ? '\t' : options.indent
  let text = JSON.stringify(value, null, spacing)

  if (options.trimTrailingWhitespace) {
    text = trimLineEnds(text)
  }

  return { text, value }
}

export function minifyJson(input: string, options: Pick<JsonFormatOptions, 'sortKeys'>): JsonFormatResult {
  const parsed = JSON.parse(input)
  const value = options.sortKeys ? sortJsonKeys(parsed) : parsed
  const text = JSON.stringify(value)
  return { text, value }
}

function trimLineEnds(value: string): string {
  return value
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
}
