export type RemoveSpacesOptions = {
  replaceTabs: boolean
  trimLines: boolean
  collapseMultipleSpaces: boolean
  removeEmptyLines: boolean
  normalizeLineBreaks: boolean
  replaceLineBreaksWithSpace: boolean
}

export const defaultRemoveSpacesOptions: RemoveSpacesOptions = {
  replaceTabs: true,
  trimLines: true,
  collapseMultipleSpaces: true,
  removeEmptyLines: true,
  normalizeLineBreaks: false,
  replaceLineBreaksWithSpace: false
}

export function removeSpaces(input: string, options: RemoveSpacesOptions): string {
  if (!input) return ''

  let text = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  if (options.replaceTabs) {
    text = text.replace(/\t/g, ' ')
  }

  if (options.trimLines) {
    text = text
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
  }

  if (options.collapseMultipleSpaces) {
    text = text.replace(/ {2,}/g, ' ')
  }

  if (options.removeEmptyLines) {
    text = text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n')
  }

  if (options.normalizeLineBreaks) {
    text = text.replace(/\n[ \t]*\n+/g, '\n')
  }

  if (options.replaceLineBreaksWithSpace) {
    text = text.replace(/\n+/g, ' ')
  }

  return text
}
