export type PlatformType = 'normal' | 'breakable' | 'moving' | 'spring'

export interface Platform {
  id: number
  x: number
  y: number
  width: number
  height: number
  type: PlatformType
  vx: number
  minX: number
  maxX: number
  breaking?: boolean
  breakTime?: number
  breakOffset?: number
  breakVy?: number
  broken?: boolean
}

export const PLATFORM_HEIGHT = 14

const NORMAL_WIDTH = 140
const BREAKABLE_WIDTH = 120
const MOVING_WIDTH = 150
const SPRING_WIDTH = 130

let nextId = 1

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const pickType = (difficulty: number, height: number): PlatformType => {
  const roll = Math.random()
  const breakableChance = 0.3 + difficulty * 0.32
  const movingChance = 0.3 + difficulty * 0.34
  const springChance = height > 800 ? 0.035 + difficulty * 0.06 : 0
  if (roll < breakableChance) return 'breakable'
  if (roll < breakableChance + movingChance) return 'moving'
  if (roll < breakableChance + movingChance + springChance) return 'spring'
  return 'normal'
}

export const getGapForDifficulty = (difficulty: number, maxJumpHeight: number) => {
  const minGap = 96 + difficulty * 24
  const maxGap = 180 + difficulty * 58
  const safeMax = Math.max(minGap + 12, maxJumpHeight * 0.94)
  const clampedMax = Math.min(maxGap, safeMax)
  const clampedMin = Math.min(minGap, clampedMax - 6)
  return randomRange(clampedMin, clampedMax)
}

export const createPlatform = ({
  y,
  canvasWidth,
  difficulty = 0,
  height = 0,
  previousX,
  maxDeltaX,
  minDeltaX,
  type
}: {
  y: number
  canvasWidth: number
  difficulty?: number
  height?: number
  previousX?: number
  maxDeltaX?: number
  minDeltaX?: number
  type?: PlatformType
}): Platform => {
  const resolvedType = type ?? pickType(difficulty, height)
  const width =
    resolvedType === 'moving'
      ? MOVING_WIDTH
      : resolvedType === 'breakable'
        ? BREAKABLE_WIDTH
        : resolvedType === 'spring'
          ? SPRING_WIDTH
          : NORMAL_WIDTH
  const minX = 12
  const maxX = Math.max(12, canvasWidth - width - 12)
  let x = randomRange(minX, maxX)
  if (typeof previousX === 'number' && typeof maxDeltaX === 'number') {
    const targetMin = Math.max(minX, previousX - maxDeltaX)
    const targetMax = Math.min(maxX, previousX + maxDeltaX)
    if (typeof minDeltaX === 'number' && targetMax - targetMin > minDeltaX * 2) {
      const leftRange = [targetMin, previousX - minDeltaX]
      const rightRange = [previousX + minDeltaX, targetMax]
      const pickLeft = Math.random() < 0.5
      const range = pickLeft ? leftRange : rightRange
      const rangeMin = Math.max(targetMin, range[0])
      const rangeMax = Math.min(targetMax, range[1])
      x = randomRange(rangeMin, Math.max(rangeMin + 1, rangeMax))
    } else {
      x = randomRange(targetMin, Math.max(targetMin + 1, targetMax))
    }
  }
  const base: Platform = {
    id: nextId++,
    x,
    y,
    width,
    height: PLATFORM_HEIGHT,
    type: resolvedType,
    vx: 0,
    minX: 0,
    maxX: canvasWidth - width
  }

  if (resolvedType === 'moving') {
    const range = randomRange(100, 200)
    base.minX = clamp(x - range * 0.5, 4, canvasWidth - width - 4)
    base.maxX = clamp(x + range * 0.5, 4, canvasWidth - width - 4)
    base.vx = randomRange(1.2, 2.2) * (1 + difficulty * 0.35) * (Math.random() < 0.5 ? -1 : 1)
  }

  return base
}

export const updatePlatform = (platform: Platform, dtMs: number) => {
  const step = dtMs / 16.6
  if (platform.breaking) {
    platform.breakTime = (platform.breakTime ?? 0) + dtMs
    platform.breakVy = (platform.breakVy ?? 0) + 0.45 * step
    platform.breakOffset = (platform.breakOffset ?? 0) + (platform.breakVy ?? 0) * step
    if ((platform.breakTime ?? 0) > 650 || (platform.breakOffset ?? 0) > 120) {
      platform.broken = true
    }
  }
  if (platform.type !== 'moving') return
  const moveStep = step * platform.vx
  platform.x += moveStep
  if (platform.x <= platform.minX) {
    platform.x = platform.minX
    platform.vx = Math.abs(platform.vx)
  } else if (platform.x >= platform.maxX) {
    platform.x = platform.maxX
    platform.vx = -Math.abs(platform.vx)
  }
}
