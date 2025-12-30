export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortJsonKeys(item))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>
  const sorted: Record<string, unknown> = {}

  Object.keys(record)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      sorted[key] = sortJsonKeys(record[key])
    })

  return sorted
}
