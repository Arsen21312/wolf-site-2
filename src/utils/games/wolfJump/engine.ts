import { createPlatform, getGapForDifficulty, PLATFORM_HEIGHT, updatePlatform, type Platform } from './platforms'

export type JumpPhase = 'idle' | 'running' | 'over'

export interface JumpStats {
  phase: JumpPhase
  score: number
  height: number
}

interface Player {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
}

const FRAME_MS = 1000 / 60
const SPRITE_W = 24
const SPRITE_H = 32
const SPRITE_SCALE = 4
const GRAVITY = 0.38
const MOVE_SPEED = 5
const JUMP_VELOCITY = -11.8
const SPRING_VELOCITY = -17.5
const JETPACK_VELOCITY = -16.5
const JETPACK_DURATION = 900
const MAX_FALL_SPEED = 13

const palette: Record<string, string> = {
  o: '#0f172a',
  b: '#9ca3af',
  h: '#e5e7eb',
  s: '#6b7280',
  a: '#111827'
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)

const intersects = (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) =>
  ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by

const createGrid = (height = SPRITE_H, width = SPRITE_W) =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => '.'))

const fillRect = (grid: string[][], x: number, y: number, w: number, h: number, ch: string) => {
  const height = grid.length
  const width = grid[0]?.length ?? 0
  for (let yy = y; yy < y + h; yy += 1) {
    if (yy < 0 || yy >= height) continue
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx < 0 || xx >= width) continue
      grid[yy][xx] = ch
    }
  }
}

const setPixel = (grid: string[][], x: number, y: number, ch: string) => {
  const height = grid.length
  const width = grid[0]?.length ?? 0
  if (x < 0 || x >= width || y < 0 || y >= height) return
  grid[y][x] = ch
}

const applyOutline = (grid: string[][]) => {
  const result = grid.map((row) => row.slice())
  const height = grid.length
  const width = grid[0]?.length ?? 0
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] === '.') continue
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
          if (grid[ny][nx] === '.') {
            result[ny][nx] = 'o'
          }
        }
      }
    }
  }
  return result
}

const createBaseFill = () => {
  const grid = createGrid()
  fillRect(grid, 7, 12, 9, 12, 'b')
  fillRect(grid, 8, 10, 7, 3, 'b')
  fillRect(grid, 9, 6, 6, 6, 'b')
  fillRect(grid, 5, 8, 4, 3, 'b')
  fillRect(grid, 9, 4, 2, 2, 'b')
  fillRect(grid, 12, 3, 2, 3, 'b')
  fillRect(grid, 16, 14, 3, 3, 'b')
  fillRect(grid, 18, 13, 2, 2, 'b')

  fillRect(grid, 9, 14, 4, 7, 'h')
  fillRect(grid, 9, 12, 3, 2, 'h')
  fillRect(grid, 8, 11, 6, 2, 's')

  setPixel(grid, 11, 9, 'a')
  setPixel(grid, 5, 9, 'a')
  setPixel(grid, 6, 10, 's')
  setPixel(grid, 9, 9, 'h')

  return grid
}

const withLegs = (grid: string[][], variant: 0 | 1) => {
  const bottom = grid.length - 1
  const legAHeight = 4
  const legBHeight = 3
  const leftX = 9
  const rightX = 13
  const leftHeight = variant === 0 ? legAHeight : legBHeight
  const rightHeight = variant === 0 ? legBHeight : legAHeight
  fillRect(grid, leftX, bottom - leftHeight + 1, 2, leftHeight, 's')
  fillRect(grid, rightX, bottom - rightHeight + 1, 2, rightHeight, 's')
}

const withTailLift = (grid: string[][]) => {
  fillRect(grid, 16, 12, 4, 5, '.')
  fillRect(grid, 17, 12, 3, 3, 'b')
  fillRect(grid, 19, 11, 2, 2, 'b')
  fillRect(grid, 18, 13, 2, 2, 's')
}

const createRunFrame = (variant: 0 | 1, tailLift: boolean) => {
  const grid = createBaseFill()
  withLegs(grid, variant)
  if (tailLift) withTailLift(grid)
  return applyOutline(grid)
}

const WOLF_FRAMES = [
  createRunFrame(0, false),
  createRunFrame(1, false),
  createRunFrame(0, true),
  createRunFrame(1, true)
]

export const createWolfJumpEngine = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  let canvasWidth = width
  let canvasHeight = height
  let phase: JumpPhase = 'idle'
  let platforms: Platform[] = []
  let mines: Array<{ x: number; y: number; size: number }> = []
  let jetpacks: Array<{ x: number; y: number; size: number }> = []
  let sinceMine = 0
  let sinceJetpack = 0
  let windTime = 0
  let windStrength = 0
  let cameraY = 0
  let maxHeight = 0
  let highestPlatformY = 0
  let baseStartY = 0
  let time = 0
  let jetpackTime = 0
  let stars: Array<{ x: number; y: number; size: number; alpha: number }> = []

  const inputState = { left: false, right: false }

  const player: Player = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: SPRITE_W * SPRITE_SCALE,
    height: SPRITE_H * SPRITE_SCALE
  }

  const setSize = (nextWidth: number, nextHeight: number) => {
    canvasWidth = nextWidth
    canvasHeight = nextHeight
    generateStars()
    if (phase === 'idle') {
      reset()
    }
  }

  const generateStars = () => {
    const total = Math.floor(canvasWidth / 20)
    stars = Array.from({ length: total }, () => ({
      x: randomRange(10, canvasWidth - 10),
      y: randomRange(10, canvasHeight * 0.6),
      size: randomRange(1, 2.2),
      alpha: randomRange(0.15, 0.45)
    }))
  }

  const reset = () => {
    phase = 'idle'
    time = 0
    cameraY = 0
    maxHeight = 0
    jetpackTime = 0
    baseStartY = canvasHeight - 90
    player.x = canvasWidth * 0.5 - player.width * 0.5
    player.y = baseStartY - player.height
    player.vx = 0
    player.vy = 0

    platforms = []
    mines = []
    jetpacks = []
    sinceMine = 0
    sinceJetpack = 0
    windTime = 0
    windStrength = 0

    const basePlatform = createPlatform({
      y: baseStartY,
      canvasWidth,
      height: 0,
      difficulty: 0,
      type: 'normal'
    })
    basePlatform.x = canvasWidth * 0.5 - basePlatform.width * 0.5
    platforms.push(basePlatform)

    let currentY = baseStartY
    highestPlatformY = currentY
    let lastX = basePlatform.x
    const maxJumpHeight = (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY)
    for (let i = 0; i < 10; i += 1) {
      const gap = getGapForDifficulty(0, maxJumpHeight)
      currentY -= gap
      const timeToRise = Math.max(
        0,
        (-JUMP_VELOCITY - Math.sqrt(Math.max(0, JUMP_VELOCITY * JUMP_VELOCITY - 2 * GRAVITY * gap))) / GRAVITY
      )
      const maxDeltaX = MOVE_SPEED * timeToRise * 1.05
      const forceShift = Math.random() < 0.7
      const minDeltaX = forceShift ? Math.min(170, maxDeltaX * 0.62) : undefined
      const nextPlatform = createPlatform({
        y: currentY,
        canvasWidth,
        height: 0,
        difficulty: 0,
        previousX: lastX,
        maxDeltaX,
        minDeltaX
      })
      platforms.push(nextPlatform)
      highestPlatformY = currentY
      lastX = nextPlatform.x
    }
  }

  const start = () => {
    if (phase === 'idle' || phase === 'over') {
      reset()
      phase = 'running'
    }
  }

  const setInput = (left: boolean, right: boolean) => {
    inputState.left = left
    inputState.right = right
  }

  const update = (dtMs: number) => {
    if (phase !== 'running') return
    const frameFactor = Math.max(0.5, Math.min(2.4, dtMs / FRAME_MS))
    time += dtMs

    const axis = (inputState.right ? 1 : 0) - (inputState.left ? 1 : 0)
    player.vx = axis * MOVE_SPEED

    const prevY = player.y
    if (jetpackTime > 0) {
      jetpackTime = Math.max(0, jetpackTime - dtMs)
      player.vy = JETPACK_VELOCITY
    } else {
      player.vy = Math.min(MAX_FALL_SPEED, player.vy + GRAVITY * frameFactor)
    }

    if (maxHeight > 1200) {
      windTime = Math.max(0, windTime - dtMs)
      if (windTime === 0 && Math.random() < 0.01) {
        windTime = randomRange(900, 1600)
        windStrength = randomRange(0.55, 1.1) * (Math.random() < 0.5 ? -1 : 1)
      }
      if (windTime > 0) {
        player.x += windStrength * frameFactor
      }
    }
    player.x += player.vx * frameFactor
    player.y += player.vy * frameFactor

    if (player.x + player.width < -10) {
      player.x = canvasWidth + 10
    } else if (player.x > canvasWidth + 10) {
      player.x = -player.width - 10
    }

    platforms.forEach((platform) => updatePlatform(platform, dtMs))

    if (player.vy > 0 && jetpackTime <= 0) {
      const prevBottom = prevY + player.height
      for (const platform of platforms) {
        if (platform.type === 'breakable' && platform.breaking) continue
        const platformScreenY = platform.y - cameraY
        if (platformScreenY > canvasHeight || platformScreenY + platform.height < -8) continue
        if (
          intersects(
            player.x,
            player.y,
            player.width,
            player.height,
            platform.x,
            platform.y,
            platform.width,
            platform.height
          )
        ) {
          const platformTop = platform.y
          if (prevBottom <= platformTop + 6) {
            player.y = platformTop - player.height
            player.vy = platform.type === 'spring' ? SPRING_VELOCITY : JUMP_VELOCITY
            if (platform.type === 'breakable' && !platform.breaking) {
              platform.breaking = true
              platform.breakTime = 0
              platform.breakOffset = 0
              platform.breakVy = 0.8
            }
            break
          }
        }
      }
    }

    if (platforms.some((platform) => platform.broken)) {
      platforms = platforms.filter((platform) => !platform.broken)
    }

    cameraY = player.y - canvasHeight * 0.6

    const currentHeight = Math.max(0, baseStartY - player.y)
    if (currentHeight > maxHeight) {
      maxHeight = currentHeight
    }

    const difficulty = Math.min(1, maxHeight / 3200)
    const spawnBuffer = 620
    const maxJumpHeight = (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY)
    let lastPlatformX = platforms.length ? platforms[platforms.length - 1].x : canvasWidth * 0.5
    while (highestPlatformY > cameraY - spawnBuffer) {
      const gap = getGapForDifficulty(difficulty, maxJumpHeight)
      highestPlatformY -= gap
      const timeToRise = Math.max(
        0,
        (-JUMP_VELOCITY - Math.sqrt(Math.max(0, JUMP_VELOCITY * JUMP_VELOCITY - 2 * GRAVITY * gap))) / GRAVITY
      )
      const maxDeltaX = MOVE_SPEED * timeToRise * 1.05
      const forceShift = Math.random() < 0.7
      const minDeltaX = forceShift ? Math.min(170, maxDeltaX * 0.62) : undefined
      const nextPlatform = createPlatform({
        y: highestPlatformY,
        canvasWidth,
        difficulty,
        height: maxHeight,
        previousX: lastPlatformX,
        maxDeltaX,
        minDeltaX
      })
      platforms.push(nextPlatform)
      lastPlatformX = nextPlatform.x

      if (maxHeight > 600 && Math.random() < 0.55) {
        const extraY = highestPlatformY + randomRange(18, 52)
        const extraMinDeltaX = Math.min(220, maxDeltaX * 0.7)
        const extraPlatform = createPlatform({
          y: extraY,
          canvasWidth,
          difficulty,
          height: maxHeight,
          previousX: nextPlatform.x,
          maxDeltaX: maxDeltaX * 1.15,
          minDeltaX: extraMinDeltaX
        })
        const tooClose = platforms.some(
          (platform) =>
            Math.abs(platform.y - extraPlatform.y) < 16 &&
            Math.abs(platform.x - extraPlatform.x) < platform.width * 0.75
        )
        if (!tooClose) {
          platforms.push(extraPlatform)
        }
      }

      sinceMine += 1
      sinceJetpack += 1
      const mineReady = maxHeight > 350 && (sinceMine > 3 || Math.random() < 0.4)
      if (mineReady) {
        mines.push({
          x: nextPlatform.x + nextPlatform.width * 0.5 - 8,
          y: nextPlatform.y - 14,
          size: 16
        })
        sinceMine = 0
      }
      const jetpackReady = maxHeight > 650 && (sinceJetpack > 7 || Math.random() < 0.28)
      if (jetpackReady) {
        jetpacks.push({
          x: nextPlatform.x + nextPlatform.width * 0.5 - 10,
          y: nextPlatform.y - 40,
          size: 20
        })
        sinceJetpack = 0
      }
    }

    platforms = platforms.filter((platform) => platform.y < cameraY + canvasHeight + 240)

    const fallLimit = baseStartY - maxHeight + canvasHeight * 1.2
    if (player.y > fallLimit) {
      phase = 'over'
    }

    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    }

    mines = mines.filter((mine) => {
      if (
        intersects(
          playerRect.x,
          playerRect.y,
          playerRect.width,
          playerRect.height,
          mine.x,
          mine.y,
          mine.size,
          mine.size
        )
      ) {
        phase = 'over'
        return false
      }
      return mine.y > cameraY - 120 && mine.y < cameraY + canvasHeight + 200
    })

    jetpacks = jetpacks.filter((pack) => {
      if (
        intersects(
          playerRect.x,
          playerRect.y,
          playerRect.width,
          playerRect.height,
          pack.x,
          pack.y,
          pack.size,
          pack.size
        )
      ) {
        jetpackTime = JETPACK_DURATION
        return false
      }
      return pack.y > cameraY - 120 && pack.y < cameraY + canvasHeight + 200
    })
  }

  const drawBackground = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    gradient.addColorStop(0, '#0b1020')
    gradient.addColorStop(1, '#131b2f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    ctx.fillStyle = 'rgba(248, 250, 252, 0.16)'
    ctx.beginPath()
    ctx.arc(canvasWidth - 90, 80, 34, 0, Math.PI * 2)
    ctx.fill()

    stars.forEach((star) => {
      ctx.fillStyle = `rgba(226, 232, 240, ${star.alpha})`
      ctx.fillRect(star.x, star.y, star.size, star.size)
    })

    if (windTime > 0) {
      const gustAlpha = Math.min(0.55, 0.25 + (windTime / 1600) * 0.4)
      const gustCount = 8
      const tilt = windStrength < 0 ? -1 : 1
      ctx.strokeStyle = `rgba(148, 163, 184, ${gustAlpha})`
      ctx.lineWidth = 2
      for (let i = 0; i < gustCount; i += 1) {
        const baseX = (canvasWidth / gustCount) * i + 20 + (time * 0.08 * tilt) % canvasWidth
        const baseY = 50 + (i * 42) % (canvasHeight * 0.7)
        const length = 22 + (i % 3) * 10
        ctx.beginPath()
        ctx.moveTo(baseX, baseY)
        ctx.lineTo(baseX + length * tilt, baseY + 6 * tilt)
        ctx.stroke()
      }
    }
  }

  const drawPlatform = (platform: Platform) => {
    const screenY = platform.y - cameraY
    const x = Math.round(platform.x)
    const breakOffset = platform.breakOffset ?? 0
    const y = Math.round(screenY + breakOffset)
    if (y < -40 || y > canvasHeight + 40) return

    if (platform.type === 'moving') {
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(x, y, platform.width, platform.height)
      ctx.fillStyle = '#93c5fd'
      ctx.fillRect(x + 4, y + 2, platform.width - 8, 3)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(x + 8, y + platform.height - 4, platform.width - 16, 2)
      ctx.fillStyle = '#1e40af'
      for (let i = 0; i < 4; i += 1) {
        ctx.fillRect(x + 10 + i * 18, y + 5, 10, 2)
      }
      return
    }

    const breakFade = platform.breaking ? Math.max(0.2, 1 - (platform.breakTime ?? 0) / 700) : 1
    const split = platform.breaking ? Math.min(10, breakOffset * 0.1) : 0
    ctx.save()
    ctx.globalAlpha = breakFade

    if (platform.type === 'breakable') {
      ctx.fillStyle = '#c96b2c'
    } else {
      ctx.fillStyle = '#8b5a2b'
    }

    if (platform.breaking) {
      const half = platform.width * 0.5 - 2
      ctx.fillRect(x - split, y, half, platform.height)
      ctx.fillRect(x + platform.width * 0.5 + split, y, half, platform.height)
    } else {
      ctx.fillRect(x, y, platform.width, platform.height)
    }

    ctx.fillStyle = platform.type === 'breakable' ? '#f4e2c2' : '#c0844d'
    if (platform.breaking) {
      const half = platform.width * 0.5 - 2
      ctx.fillRect(x - split + 4, y + 2, half - 8, 3)
      ctx.fillRect(x + platform.width * 0.5 + split + 4, y + 2, half - 8, 3)
    } else {
      ctx.fillRect(x + 4, y + 2, platform.width - 8, 3)
    }

    ctx.fillStyle = '#3f2a1a'
    if (platform.breaking) {
      const half = platform.width * 0.5 - 2
      ctx.fillRect(x - split + 6, y + platform.height - 3, half - 12, 2)
      ctx.fillRect(x + platform.width * 0.5 + split + 6, y + platform.height - 3, half - 12, 2)
    } else {
      ctx.fillRect(x + 6, y + platform.height - 3, platform.width - 12, 2)
    }

    if (platform.type === 'breakable') {
      ctx.fillStyle = '#4b3420'
      if (platform.breaking) {
        ctx.fillRect(x + platform.width * 0.25 - split, y + 5, 16, 2)
        ctx.fillRect(x + platform.width * 0.65 + split, y + 6, 14, 2)
      } else {
        ctx.fillRect(x + 10, y + 5, 18, 2)
        ctx.fillRect(x + platform.width * 0.35, y + 7, 14, 2)
        ctx.fillRect(x + platform.width * 0.6, y + 5, 12, 2)
        ctx.fillRect(x + platform.width * 0.7, y + 8, 10, 2)
      }
    }
    ctx.restore()

    if (platform.type === 'spring') {
      ctx.fillStyle = '#e5e7eb'
      ctx.fillRect(x + platform.width * 0.5 - 12, y - 6, 24, 6)
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(x + platform.width * 0.5 - 10, y - 4, 20, 2)
      ctx.fillStyle = '#facc15'
      ctx.fillRect(x + platform.width * 0.5 - 6, y - 12, 12, 6)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(x + platform.width * 0.5 - 4, y - 10, 8, 2)
    }
  }

  const drawMines = () => {
    mines.forEach((mine) => {
      const y = mine.y - cameraY
      if (y < -40 || y > canvasHeight + 40) return
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(mine.x, y, mine.size, mine.size)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(mine.x + 3, y + 3, mine.size - 6, mine.size - 6)
      ctx.fillStyle = '#fde047'
      ctx.fillRect(mine.x + mine.size * 0.5 - 2, y - 4, 4, 4)
    })
  }

  const drawJetpacks = () => {
    jetpacks.forEach((pack) => {
      const y = pack.y - cameraY
      if (y < -60 || y > canvasHeight + 60) return
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(pack.x, y, pack.size, pack.size)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(pack.x + 3, y + 3, pack.size - 6, pack.size - 6)
      ctx.fillStyle = '#f97316'
      ctx.fillRect(pack.x + 4, y + pack.size, pack.size - 8, 6)
      ctx.fillStyle = '#fde68a'
      ctx.fillRect(pack.x + 6, y + pack.size + 2, pack.size - 12, 3)
    })
  }

  const drawPlayer = () => {
    const frameIndex = Math.floor(time / 160) % WOLF_FRAMES.length
    const frame = WOLF_FRAMES[frameIndex]
    const x = Math.round(player.x)
    const y = Math.round(player.y - cameraY)

    ctx.imageSmoothingEnabled = false
    ctx.save()
    ctx.translate(x + player.width, 0)
    ctx.scale(-1, 1)
    for (let yy = 0; yy < frame.length; yy += 1) {
      const row = frame[yy]
      for (let xx = 0; xx < row.length; xx += 1) {
        const key = row[xx]
        if (key === '.' || !palette[key]) continue
        ctx.fillStyle = palette[key]
        ctx.fillRect(xx * SPRITE_SCALE, y + yy * SPRITE_SCALE, SPRITE_SCALE, SPRITE_SCALE)
      }
    }
    ctx.restore()
  }

  const render = () => {
    ctx.imageSmoothingEnabled = false
    drawBackground()
    platforms.forEach((platform) => drawPlatform(platform))
    drawMines()
    drawJetpacks()
    drawPlayer()
  }

  const getStats = (): JumpStats => ({
    phase,
    score: Math.floor(maxHeight),
    height: maxHeight
  })

  generateStars()
  reset()

  return {
    setSize,
    reset,
    start,
    update,
    render,
    setInput,
    getStats
  }
}
