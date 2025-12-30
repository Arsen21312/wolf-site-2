export type RunnerPhase = 'idle' | 'running' | 'paused' | 'over'
export type PlayerState = 'run' | 'jump' | 'duck'

export interface RunnerStats {
  phase: RunnerPhase
  score: number
  speed: number
}

interface Player {
  x: number
  y: number
  vy: number
  state: PlayerState
  isGrounded: boolean
  isDucking: boolean
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'stump' | 'rock' | 'bird'
}

const FRAME_MS = 1000 / 60
const BASE_SPEED = 6
const MAX_SPEED = 18
const SPEED_INCREASE = 0.008
const SCORE_RATE = 0.055

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)

const intersects = (a: DOMRect, b: DOMRect) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

const SPRITE_W = 24
const SPRITE_H = 32
const DUCK_H = 24
const SPRITE_SCALE = 4

const palette: Record<string, string> = {
  o: '#0f172a',
  b: '#9ca3af',
  h: '#e5e7eb',
  s: '#6b7280',
  a: '#111827'
}

const createGrid = (height = SPRITE_H) =>
  Array.from({ length: height }, () => Array.from({ length: SPRITE_W }, () => '.'))

const fillRect = (grid: string[][], x: number, y: number, w: number, h: number, ch: string) => {
  const height = grid.length
  for (let yy = y; yy < y + h; yy += 1) {
    if (yy < 0 || yy >= height) continue
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx < 0 || xx >= SPRITE_W) continue
      grid[yy][xx] = ch
    }
  }
}

const setPixel = (grid: string[][], x: number, y: number, ch: string) => {
  const height = grid.length
  if (x < 0 || x >= SPRITE_W || y < 0 || y >= height) return
  grid[y][x] = ch
}

const applyOutline = (grid: string[][]) => {
  const result = grid.map((row) => row.slice())
  const height = grid.length
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < SPRITE_W; x += 1) {
      if (grid[y][x] === '.') continue
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= SPRITE_W || ny < 0 || ny >= height) continue
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
  // Body + chest
  fillRect(grid, 7, 12, 9, 12, 'b')
  fillRect(grid, 8, 10, 7, 3, 'b')
  // Head
  fillRect(grid, 9, 6, 6, 6, 'b')
  // Snout (slightly forward)
  fillRect(grid, 5, 8, 4, 3, 'b')
  // Ears (asymmetric)
  fillRect(grid, 9, 4, 2, 2, 'b')
  fillRect(grid, 12, 3, 2, 3, 'b')
  // Tail (angled up)
  fillRect(grid, 16, 14, 3, 3, 'b')
  fillRect(grid, 18, 13, 2, 2, 'b')

  // Highlight belly + chest
  fillRect(grid, 9, 14, 4, 7, 'h')
  fillRect(grid, 9, 12, 3, 2, 'h')
  // Shadow under head + legs
  fillRect(grid, 8, 11, 6, 2, 's')

  // Face details
  setPixel(grid, 11, 9, 'a') // eye
  setPixel(grid, 5, 9, 'a') // nose
  setPixel(grid, 6, 10, 's') // mouth
  setPixel(grid, 9, 9, 'h') // cheek highlight

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

const createDuckFrame = () => {
  const grid = createGrid(DUCK_H)
  fillRect(grid, 7, 16, 9, 8, 'b')
  fillRect(grid, 8, 14, 7, 3, 'b')
  fillRect(grid, 9, 11, 6, 5, 'b')
  fillRect(grid, 5, 13, 4, 3, 'b')
  fillRect(grid, 9, 9, 2, 2, 'b')
  fillRect(grid, 12, 8, 2, 3, 'b')
  fillRect(grid, 16, 18, 3, 3, 'b')
  fillRect(grid, 18, 17, 2, 2, 'b')

  fillRect(grid, 9, 17, 4, 5, 'h')
  fillRect(grid, 8, 16, 6, 2, 's')

  setPixel(grid, 11, 13, 'a')
  setPixel(grid, 5, 14, 'a')
  setPixel(grid, 6, 15, 's')
  setPixel(grid, 9, 13, 'h')

  withLegs(grid, 0)
  return applyOutline(grid)
}

const RUN_FRAMES = [
  createRunFrame(0, false),
  createRunFrame(1, false),
  createRunFrame(0, true),
  createRunFrame(1, true)
]
const DUCK_FRAME = createDuckFrame()

export const createWolfRunnerEngine = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  let canvasWidth = width
  let canvasHeight = height
  let groundY = canvasHeight - 60
  let phase: RunnerPhase = 'idle'
  let speed = BASE_SPEED
  let scoreFloat = 0
  let spawnTimer = 800
  let obstacles: Obstacle[] = []
  let time = 0

  const player: Player = {
    x: 90,
    y: groundY,
    vy: 0,
    state: 'run',
    isGrounded: true,
    isDucking: false
  }

  const getPlayerSize = () => {
    if (player.state === 'duck') return { width: SPRITE_W * SPRITE_SCALE, height: DUCK_H * SPRITE_SCALE }
    return { width: SPRITE_W * SPRITE_SCALE, height: SPRITE_H * SPRITE_SCALE }
  }

  const setSize = (nextWidth: number, nextHeight: number) => {
    canvasWidth = nextWidth
    canvasHeight = nextHeight
    groundY = canvasHeight - 60
    player.y = groundY
  }

  const reset = () => {
    phase = 'idle'
    speed = BASE_SPEED
    scoreFloat = 0
    obstacles = []
    spawnTimer = 500
    player.y = groundY
    player.vy = 0
    player.isGrounded = true
    player.isDucking = false
    player.state = 'run'
  }

  const start = () => {
    phase = 'running'
  }

  const pause = () => {
    if (phase === 'running') phase = 'paused'
  }

  const resume = () => {
    if (phase === 'paused') phase = 'running'
  }

  const spawnObstacle = () => {
    const chance = Math.random()
    if (chance < 0.28) {
      obstacles.push({
        x: canvasWidth + 30,
        y: groundY - 120,
        width: 40,
        height: 20,
        type: 'bird'
      })
      return
    }

    if (chance > 0.85) {
      const firstX = canvasWidth + 20
      obstacles.push({
        x: firstX,
        y: groundY - 44,
        width: 32,
        height: 44,
        type: 'stump'
      })
      obstacles.push({
        x: firstX + 50,
        y: groundY - 44,
        width: 32,
        height: 44,
        type: 'stump'
      })
      return
    }

    if (chance > 0.55) {
      obstacles.push({
        x: canvasWidth + 40,
        y: groundY - 60,
        width: 46,
        height: 60,
        type: 'rock'
      })
      return
    }

    obstacles.push({
      x: canvasWidth + 30,
      y: groundY - 44,
      width: 32,
      height: 44,
      type: 'stump'
    })
  }

  const handleJump = () => {
    if (phase === 'idle' || phase === 'over') {
      reset()
      start()
      return
    }
    if (phase !== 'running') return
    if (!player.isGrounded) return
    player.vy = -14
    player.isGrounded = false
    player.state = 'jump'
  }

  const handleDuck = (isDown: boolean) => {
    if (phase !== 'running') return
    if (!player.isGrounded) {
      if (isDown && player.vy < 12) player.vy = 12
      return
    }
    player.isDucking = isDown
    player.state = isDown ? 'duck' : 'run'
  }

  const update = (dtMs: number) => {
    if (phase !== 'running') return
    const frameFactor = Math.max(0.5, Math.min(2.4, dtMs / FRAME_MS))
    time += dtMs
    speed = Math.min(MAX_SPEED, speed + SPEED_INCREASE * frameFactor)
    scoreFloat += dtMs * SCORE_RATE

    spawnTimer -= dtMs
    if (spawnTimer <= 0) {
      spawnObstacle()
      const speedFactor = Math.max(1, speed / BASE_SPEED)
      spawnTimer = randomRange(900, 1900) / Math.sqrt(speedFactor)
    }

    player.vy += 0.8 * frameFactor
    player.y += player.vy * frameFactor

    if (player.y >= groundY) {
      player.y = groundY
      player.vy = 0
      player.isGrounded = true
      if (player.state === 'jump') {
        player.state = player.isDucking ? 'duck' : 'run'
      }
    } else {
      player.isGrounded = false
    }

    const moveX = speed * frameFactor
    obstacles.forEach((obstacle) => {
      obstacle.x -= moveX
    })
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -20)

    const playerSize = getPlayerSize()
    const playerRect = new DOMRect(player.x, player.y - playerSize.height, playerSize.width, playerSize.height)
    for (const obstacle of obstacles) {
      const obstacleRect = new DOMRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      if (intersects(playerRect, obstacleRect)) {
        phase = 'over'
        break
      }
    }
  }

  const drawBackground = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    gradient.addColorStop(0, '#0b1020')
    gradient.addColorStop(1, '#1a2238')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    ctx.fillStyle = 'rgba(248, 250, 252, 0.16)'
    ctx.beginPath()
    ctx.arc(canvasWidth - 80, 80, 34, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fillRect(0, groundY, canvasWidth, 2)
  }

  const drawPlayer = () => {
    const size = getPlayerSize()
    const x = Math.round(player.x)
    const y = Math.round(player.y - size.height)

    let frame = RUN_FRAMES[0]
    if (player.state === 'duck') {
      frame = DUCK_FRAME
    } else if (player.state === 'run') {
      const frameIndex = Math.floor(time / 120) % RUN_FRAMES.length
      frame = RUN_FRAMES[frameIndex]
    }

    ctx.imageSmoothingEnabled = false
    ctx.save()
    ctx.translate(x + size.width, 0)
    ctx.scale(-1, 1)
    for (let yy = 0; yy < frame.length; yy += 1) {
      const row = frame[yy]
      for (let xx = 0; xx < row.length; xx += 1) {
        const key = row[xx]
        if (key === '.' || !palette[key]) continue
        ctx.fillStyle = palette[key]
        ctx.fillRect(
          0 + xx * SPRITE_SCALE,
          y + yy * SPRITE_SCALE,
          SPRITE_SCALE,
          SPRITE_SCALE
        )
      }
    }
    ctx.restore()
  }

  const drawBird = (obstacle: Obstacle) => {
    const x = Math.round(obstacle.x)
    const y = Math.round(obstacle.y)
    const scale = 2
    const fill = '#e2e8f0'
    const shadow = '#94a3b8'
    const wingLift = Math.round(Math.sin(time * 0.06 + obstacle.x * 0.08) * scale)

    ctx.fillStyle = fill
    // Left wing (pixel steps)
    ctx.fillRect(x + 0 * scale, y + 4 * scale + wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 2 * scale, y + 2 * scale + wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 4 * scale, y + 0 * scale + wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 6 * scale, y + 2 * scale + wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 8 * scale, y + 4 * scale + wingLift, 4 * scale, 2 * scale)

    // Right wing (mirror)
    ctx.fillRect(x + 20 * scale, y + 4 * scale - wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 18 * scale, y + 2 * scale - wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 16 * scale, y + 0 * scale - wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 14 * scale, y + 2 * scale - wingLift, 4 * scale, 2 * scale)
    ctx.fillRect(x + 12 * scale, y + 4 * scale - wingLift, 4 * scale, 2 * scale)

    // Body
    ctx.fillRect(x + 9 * scale, y + 6 * scale, 6 * scale, 4 * scale)
    ctx.fillRect(x + 10 * scale, y + 10 * scale, 4 * scale, 3 * scale)

    // Shadow notch for depth
    ctx.fillStyle = shadow
    ctx.fillRect(x + 11 * scale, y + 7 * scale, 2 * scale, 2 * scale)
  }

  const drawObstacles = () => {
    obstacles.forEach((obstacle) => {
      if (obstacle.type === 'bird') {
        drawBird(obstacle)
        return
      }
      if (obstacle.type === 'rock') {
        ctx.fillStyle = '#64748b'
      } else {
        ctx.fillStyle = '#94a3b8'
      }
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    })
  }

  const render = () => {
    ctx.imageSmoothingEnabled = false
    drawBackground()
    drawObstacles()
    drawPlayer()
  }

  const getStats = (): RunnerStats => ({
    phase,
    score: Math.floor(scoreFloat),
    speed
  })

  reset()

  return {
    getStats,
    setSize,
    reset,
    start,
    pause,
    resume,
    update,
    render,
    handleJump,
    handleDuck
  }
}

export const getBaseSpeed = () => BASE_SPEED
