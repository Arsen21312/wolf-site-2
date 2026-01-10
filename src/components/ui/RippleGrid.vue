<template>
  <div ref="container" class="ripple-grid" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Camera, Mesh, Plane, Program, Renderer, Transform, Vec2 } from 'ogl'

const props = defineProps({
  enableRainbow: { type: Boolean, default: false },
  rippleIntensity: { type: Number, default: 0.05 },
  gridSize: { type: Number, default: 10 },
  gridThickness: { type: Number, default: 15 },
  mouseInteraction: { type: Boolean, default: true },
  mouseInteractionRadius: { type: Number, default: 1.2 },
  opacity: { type: Number, default: 0.8 },
  gridColor: { type: String, default: '#ffffff' }
})

const container = ref<HTMLDivElement | null>(null)

let renderer: Renderer | null = null
let program: Program | null = null
let mesh: Mesh | null = null
let animationFrame = 0
let resizeObserver: ResizeObserver | null = null

const mouse = new Vec2(-10, -10)

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const intVal = parseInt(full, 16)
  return {
    r: ((intVal >> 16) & 255) / 255,
    g: ((intVal >> 8) & 255) / 255,
    b: (intVal & 255) / 255
  }
}

const vertexShader = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uRippleIntensity;
  uniform float uGridSize;
  uniform float uGridThickness;
  uniform float uOpacity;
  uniform float uEnableRainbow;
  uniform float uMouseInteraction;
  uniform float uMouseRadius;
  uniform vec3 uGridColor;

  float gridLine(vec2 uv, float size, float thickness) {
    vec2 g = abs(fract(uv * size) - 0.5);
    float line = max(g.x, g.y);
    return smoothstep(0.5 - thickness, 0.5, line);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (vUv - 0.5) * aspect;
    vec2 m = (uMouse - 0.5) * aspect;

    float drift = sin(uTime * 0.4 + p.x * 1.6 + p.y * 1.4) * 0.002;
    vec2 uv = vUv + drift;

    float autoWave = sin(p.x * 6.0 + uTime * 0.9) * sin(p.y * 6.0 + uTime * 0.8);
    vec2 autoDir = normalize(p + 0.0001);
    uv += autoDir * autoWave * uRippleIntensity * 1.6;

    float ripple = 0.0;
    if (uMouseInteraction > 0.5) {
      float dist = length(p - m);
      ripple = sin(dist * 18.0 - uTime * 2.4) * exp(-dist * 3.2);
      vec2 dir = normalize(p - m + 0.0001);
      uv += dir * ripple * uRippleIntensity * uMouseRadius * 3.0;
    }

    float t = uGridThickness / 100.0;
    float line = gridLine(uv, uGridSize, t);

    vec3 color = uGridColor;
    if (uEnableRainbow > 0.5) {
      color = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + uTime + line * 6.0);
    }

    float base = 0.06;
    float alpha = max(line, base) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`

const start = () => {
  if (!container.value) return
  const gl = container.value

  renderer = new Renderer({
    dpr: Math.min(2, window.devicePixelRatio),
    alpha: true,
    premultipliedAlpha: false
  })
  const ctx = renderer.gl
  ctx.clearColor(0, 0, 0, 0)
  ctx.enable(ctx.BLEND)
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA)
  gl.appendChild(ctx.canvas)
  gl.classList.add('ripple-grid--ready')

  const camera = new Camera(ctx, { left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1 })
  camera.position.z = 1

  const geometry = new Plane(ctx)
  const rgb = hexToRgb(props.gridColor)

  program = new Program(ctx, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uResolution: { value: new Vec2() },
      uMouse: { value: mouse },
      uTime: { value: 0 },
      uRippleIntensity: { value: props.rippleIntensity },
      uGridSize: { value: props.gridSize },
      uGridThickness: { value: props.gridThickness },
      uOpacity: { value: props.opacity },
      uEnableRainbow: { value: props.enableRainbow ? 1 : 0 },
      uMouseInteraction: { value: props.mouseInteraction ? 1 : 0 },
      uMouseRadius: { value: props.mouseInteractionRadius },
      uGridColor: { value: [rgb.r, rgb.g, rgb.b] }
    },
    transparent: true
  })

  mesh = new Mesh(ctx, { geometry, program })

  const scene = new Transform()
  mesh.setParent(scene)

  const resize = () => {
    if (!renderer || !container.value || !program) return
    const rect = container.value.getBoundingClientRect()
    renderer.setSize(rect.width, rect.height)
    program.uniforms.uResolution.value.set(rect.width, rect.height)
  }

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container.value)

  const update = (t: number) => {
    if (!renderer || !program || !mesh) return
    program.uniforms.uTime.value = t * 0.001
    renderer.render({ scene, camera })
    animationFrame = requestAnimationFrame(update)
  }

  animationFrame = requestAnimationFrame(update)

  const onMove = (event: PointerEvent) => {
    if (!container.value) return
    const rect = container.value.getBoundingClientRect()
    mouse.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height)
  }

  const onLeave = () => {
    mouse.set(-10, -10)
  }

  const onTouch = (event: TouchEvent) => {
    if (!container.value || event.touches.length === 0) return
    const rect = container.value.getBoundingClientRect()
    const touch = event.touches[0]
    mouse.set((touch.clientX - rect.left) / rect.width, 1 - (touch.clientY - rect.top) / rect.height)
  }

  if (props.mouseInteraction) {
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', onLeave)
  }

  onBeforeUnmount(() => {
    if (props.mouseInteraction) {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onLeave)
    }
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return
  start()
})

onBeforeUnmount(() => {
  if (resizeObserver && container.value) {
    resizeObserver.unobserve(container.value)
  }
  resizeObserver = null
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = 0
  if (renderer) {
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
  renderer = null
  program = null
  mesh = null
})
</script>

<style scoped>
.ripple-grid {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  background-image:
    linear-gradient(rgba(160, 200, 255, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(160, 200, 255, 0.2) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: 0 0;
}

.ripple-grid.ripple-grid--ready {
  background-image: none;
}

.ripple-grid canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
