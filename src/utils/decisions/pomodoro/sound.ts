let audioContext: AudioContext | null = null

const getContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    audioContext = AudioContextCtor ? new AudioContextCtor() : null
  }
  return audioContext
}

export const playBeep = async (options?: { durationMs?: number; frequency?: number; volume?: number }) => {
  const ctx = getContext()
  if (!ctx) return
  const durationMs = options?.durationMs ?? 180
  const frequency = options?.frequency ?? 880
  const volume = options?.volume ?? 0.12

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch (error) {
      return
    }
  }

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.value = volume

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  const now = ctx.currentTime
  oscillator.start(now)
  oscillator.stop(now + durationMs / 1000)
}
