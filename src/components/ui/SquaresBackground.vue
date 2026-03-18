<template>
  <canvas ref="canvasRef" class="squares-canvas" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Direction = 'diagonal' | 'up' | 'right' | 'down' | 'left'
type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
  x: number
  y: number
}

interface HoveredSquare {
  x: number
  y: number
}

interface Props {
  direction?: Direction
  speed?: number
  borderColor?: CanvasStrokeStyle
  squareSize?: number
  hoverFillColor?: CanvasStrokeStyle
  fadeColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'diagonal',
  speed: 1,
  borderColor: 'rgba(159, 178, 216, 0.22)',
  squareSize: 48,
  hoverFillColor: 'rgba(106, 215, 255, 0.14)',
  fadeColor: '#090d1a'
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const frameId = ref<number | null>(null)
const gridOffset = ref<GridOffset>({ x: 0, y: 0 })
const hoveredSquare = ref<HoveredSquare | null>(null)
const reducedMotion = ref(false)

let ctx: CanvasRenderingContext2D | null = null

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const drawGrid = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const { squareSize } = props

  ctx.clearRect(0, 0, width, height)

  const startX = -squareSize + (gridOffset.value.x % squareSize)
  const startY = -squareSize + (gridOffset.value.y % squareSize)

  for (let x = startX; x < width + squareSize; x += squareSize) {
    for (let y = startY; y < height + squareSize; y += squareSize) {
      const cellX = Math.round((x - startX) / squareSize)
      const cellY = Math.round((y - startY) / squareSize)

      if (hoveredSquare.value?.x === cellX && hoveredSquare.value?.y === cellY) {
        ctx.fillStyle = props.hoverFillColor
        ctx.fillRect(x, y, squareSize, squareSize)
      }

      ctx.strokeStyle = props.borderColor
      ctx.strokeRect(x, y, squareSize, squareSize)
    }
  }

  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.sqrt(width * width + height * height) / 2
  )

  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, props.fadeColor)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

const step = () => {
  if (!reducedMotion.value) {
    const effectiveSpeed = Math.max(props.speed, 0.1)

    switch (props.direction) {
      case 'right':
        gridOffset.value.x -= effectiveSpeed
        break
      case 'left':
        gridOffset.value.x += effectiveSpeed
        break
      case 'up':
        gridOffset.value.y += effectiveSpeed
        break
      case 'down':
        gridOffset.value.y -= effectiveSpeed
        break
      case 'diagonal':
        gridOffset.value.x -= effectiveSpeed
        gridOffset.value.y -= effectiveSpeed
        break
    }

    const wrap = props.squareSize
    gridOffset.value.x = ((gridOffset.value.x % wrap) + wrap) % wrap
    gridOffset.value.y = ((gridOffset.value.y % wrap) + wrap) % wrap
  }

  drawGrid()
  frameId.value = window.requestAnimationFrame(step)
}

const updateHoveredSquare = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const localX = event.clientX - rect.left
  const localY = event.clientY - rect.top
  const startX = -props.squareSize + (gridOffset.value.x % props.squareSize)
  const startY = -props.squareSize + (gridOffset.value.y % props.squareSize)

  hoveredSquare.value = {
    x: Math.floor((localX - startX) / props.squareSize),
    y: Math.floor((localY - startY) / props.squareSize)
  }
}

const clearHoveredSquare = () => {
  hoveredSquare.value = null
}

const stopAnimation = () => {
  if (frameId.value !== null) {
    window.cancelAnimationFrame(frameId.value)
    frameId.value = null
  }
}

const startAnimation = () => {
  stopAnimation()
  resizeCanvas()
  drawGrid()
  frameId.value = window.requestAnimationFrame(step)
}

const handleResize = () => {
  resizeCanvas()
  drawGrid()
}

onMounted(() => {
  if (!process.client) return

  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const canvas = canvasRef.value
  if (!canvas) return

  canvas.addEventListener('mousemove', updateHoveredSquare)
  canvas.addEventListener('mouseleave', clearHoveredSquare)
  window.addEventListener('resize', handleResize)

  startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()

  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('mousemove', updateHoveredSquare)
    canvas.removeEventListener('mouseleave', clearHoveredSquare)
  }

  window.removeEventListener('resize', handleResize)
})

watch(
  () => [props.direction, props.speed, props.borderColor, props.squareSize, props.hoverFillColor, props.fadeColor],
  () => {
    if (!process.client) return
    startAnimation()
  }
)
</script>

<style scoped>
.squares-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
