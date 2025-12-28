export type ReverseMode = 'full' | 'words' | 'lines'

export function reverseText(text: string, mode: ReverseMode): string {
  if (!text) return ''

  if (mode === 'words') {
    const words = text.split(/[ \t]+/).filter(Boolean)
    return words.reverse().join(' ')
  }

  if (mode === 'lines') {
    return text.split('\n').reverse().join('\n')
  }

  return Array.from(text).reverse().join('')
}
