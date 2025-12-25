const deprecatedError = new Error('deprecated, moved to local ambient')

export async function getAutoNeighbors() {
  throw deprecatedError
}
