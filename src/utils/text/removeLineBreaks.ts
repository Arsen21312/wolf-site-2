export type RemoveLineBreaksMode =
  | 'remove-all'
  | 'collapse-multiple'
  | 'paragraphs'
  | 'pdf'

export type RemoveLineBreaksOptions = {
  mode: RemoveLineBreaksMode
  preserveDoubleSpaces: boolean
  removeExtraSpaces: boolean
  preserveEmptyLines: boolean
  normalizeLineEndings: boolean
}

export const defaultRemoveLineBreaksOptions: RemoveLineBreaksOptions = {
  mode: 'remove-all',
  preserveDoubleSpaces: false,
  removeExtraSpaces: true,
  preserveEmptyLines: true,
  normalizeLineEndings: true
}

export function removeLineBreaks(
  input: string,
  options: RemoveLineBreaksOptions
): string {
  if (!input) return ''

  let text = input

  if (options.normalizeLineEndings) {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  }

  switch (options.mode) {
    case 'remove-all':
      text = text.replace(
        options.normalizeLineEndings ? /\r\n|\r|\n/g : /\n/g,
        ' '
      )
      break
    case 'collapse-multiple':
      text = text.replace(/\n{2,}/g, '\n')
      break
    case 'paragraphs':
      text = collapseParagraphs(text, options.preserveEmptyLines)
      break
    case 'pdf':
      text = mergePdfLines(text, options.preserveEmptyLines)
      break
    default:
      break
  }

  if (options.removeExtraSpaces) {
    text = options.preserveDoubleSpaces
      ? text.replace(/ {3,}/g, '  ')
      : text.replace(/ {2,}/g, ' ')
    text = text.replace(/ *\n */g, '\n')
  }

  if (!options.preserveEmptyLines) {
    text = text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n')
  }

  return text
}

function collapseParagraphs(text: string, preserveEmptyLines: boolean): string {
  const lines = text.split('\n')
  const output: string[] = []
  let buffer: string[] = []

  for (const line of lines) {
    if (line === '') {
      if (buffer.length > 0) {
        output.push(buffer.join(' '))
        buffer = []
      }
      if (preserveEmptyLines) {
        output.push('')
      }
    } else {
      buffer.push(line)
    }
  }

  if (buffer.length > 0) {
    output.push(buffer.join(' '))
  }

  return output.join('\n')
}

function mergePdfLines(text: string, preserveEmptyLines: boolean): string {
  const lines = text.split('\n')
  const output: string[] = []
  let current = ''

  for (const line of lines) {
    if (line === '') {
      if (current) {
        output.push(current)
        current = ''
      }
      if (preserveEmptyLines) {
        output.push('')
      }
      continue
    }

    if (!current) {
      current = line
      continue
    }

    const trimmed = current.trimEnd()
    const endsSentence = /[.!?:;]$/.test(trimmed)

    if (endsSentence) {
      output.push(current)
      current = line
    } else {
      current = `${current} ${line.trimStart()}`
    }
  }

  if (current) {
    output.push(current)
  }

  return output.join('\n')
}
